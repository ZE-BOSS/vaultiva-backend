import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { SendMailClient } from 'zeptomail';

/**
 * Transactional email, provider-agnostic.
 *
 * Email verification was not working because `ZEPTO_API_KEY` was an empty
 * string. The old code read the key straight out of config and built a
 * ZeptoMail client with it, so every signup stored a code that was never
 * delivered anywhere. Worse, the key being *absent* and the key being *wrong*
 * failed identically and silently.
 *
 * ZeptoMail is also not free, which is the constraint that actually matters
 * here. So the transport is now chosen at runtime from whichever key is
 * present:
 *
 *   RESEND_API_KEY     3,000/month, 100/day free      (recommended)
 *   BREVO_API_KEY      300/day free, ~9,000/month
 *   ZEPTO_API_KEY      paid, already integrated
 *
 * With no key at all, `log` is used outside production: the code goes to the
 * application log so signup can be exercised end to end without an account
 * anywhere. In production that is refused — a silently undelivered OTP is how
 * this broke in the first place.
 */
export interface EmailProvider {
  readonly name: string;
  send(to: string, subject: string, html: string): Promise<void>;
}

const trim = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

export function resolveEmailProvider(
  config: ConfigService,
  logger: Logger,
): EmailProvider {
  const fromAddress = trim(config.get('MAIL_FROM')) || trim(config.get('ZEPTO_FROM'));
  const fromName = trim(config.get('MAIL_FROM_NAME')) || 'Vaultiva';

  const resend = trim(config.get('RESEND_API_KEY'));
  const brevo = trim(config.get('BREVO_API_KEY'));
  const zepto = trim(config.get('ZEPTO_API_KEY'));

  // An explicit choice wins, so a misconfigured fallback can never mask it.
  const requested = trim(config.get('EMAIL_PROVIDER')).toLowerCase();
  const chosen =
    requested ||
    (resend && 'resend') ||
    (brevo && 'brevo') ||
    (zepto && 'zeptomail') ||
    'log';

  const requireFrom = () => {
    if (!fromAddress) {
      throw new Error(
        'MAIL_FROM is not set — the sender address must be on a domain you have ' +
          'verified with your email provider.',
      );
    }
    return fromAddress;
  };

  switch (chosen) {
    case 'resend': {
      if (!resend) throw new Error('EMAIL_PROVIDER=resend but RESEND_API_KEY is empty');
      return {
        name: 'resend',
        async send(to, subject, html) {
          await axios.post(
            'https://api.resend.com/emails',
            { from: `${fromName} <${requireFrom()}>`, to: [to], subject, html },
            { headers: { Authorization: `Bearer ${resend}` }, timeout: 15_000 },
          );
        },
      };
    }

    case 'brevo': {
      if (!brevo) throw new Error('EMAIL_PROVIDER=brevo but BREVO_API_KEY is empty');
      return {
        name: 'brevo',
        async send(to, subject, html) {
          await axios.post(
            'https://api.brevo.com/v3/smtp/email',
            {
              sender: { email: requireFrom(), name: fromName },
              to: [{ email: to }],
              subject,
              htmlContent: html,
            },
            { headers: { 'api-key': brevo }, timeout: 15_000 },
          );
        },
      };
    }

    case 'zeptomail': {
      if (!zepto) throw new Error('EMAIL_PROVIDER=zeptomail but ZEPTO_API_KEY is empty');
      const url = trim(config.get('ZEPTO_URL')) || 'api.zeptomail.com/';
      return {
        name: 'zeptomail',
        async send(to, subject, html) {
          const client = new SendMailClient({ url, token: zepto });
          await client.sendMail({
            from: { address: requireFrom(), name: fromName },
            to: [{ email_address: { address: to } }],
            subject,
            htmlbody: html,
          });
        },
      };
    }

    case 'log': {
      if (config.get('NODE_ENV') === 'production') {
        throw new Error(
          'No email provider is configured. Set RESEND_API_KEY (3,000/month free), ' +
            'BREVO_API_KEY (300/day free) or ZEPTO_API_KEY, plus MAIL_FROM.',
        );
      }
      return {
        name: 'log',
        async send(to, subject, html) {
          // The OTP is the only part anyone needs while developing, and the
          // HTML body is unreadable in a log line.
          const code = /\b\d{4,8}\b/.exec(html.replace(/<[^>]+>/g, ' '))?.[0];
          logger.warn(
            `[email:log] No provider configured. To=${to} Subject="${subject}"` +
              (code ? ` Code=${code}` : ''),
          );
        },
      };
    }

    default:
      throw new Error(
        `EMAIL_PROVIDER="${chosen}" is not recognised. Use resend, brevo, zeptomail or log.`,
      );
  }
}

import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

/**
 * SMS / WhatsApp delivery through Termii.
 *
 * Three things were wrong here.
 *
 * 1. `TERMII_API_KEY` was empty, so no phone code was ever delivered — the same
 *    failure as email.
 *
 * 2. The URL was built as `https://${TERMII_BASE_URL}/api/sms/send` while
 *    `TERMII_BASE_URL` is itself `https://api.ng.termii.com`. That produces
 *    `https://https://api.ng.termii.com/api/sms/send`, which cannot resolve. So
 *    even with a valid key, SMS could not have worked. The scheme is now
 *    normalised rather than assumed.
 *
 * 3. Every phone signup sent an SMS *and* a WhatsApp message. Both are billed,
 *    so each code cost twice what it needed to. WhatsApp is now a fallback used
 *    only when SMS fails, which is also the case where it actually helps.
 *
 * There is no free SMS route to a Nigerian handset — every gateway charges per
 * message. `log` therefore exists for local development only, and phone signup
 * should not be the primary path; see docs/verification.md.
 */
export interface SmsProvider {
  readonly name: string;
  send(to: string, message: string): Promise<void>;
}

const trim = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

/** Accepts `api.ng.termii.com`, `https://api.ng.termii.com` or a trailing slash. */
function normaliseBaseUrl(raw: string): string {
  const value = trim(raw) || 'https://api.ng.termii.com';
  const withScheme = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  return withScheme.replace(/\/+$/, '');
}

export function resolveSmsProvider(
  config: ConfigService,
  logger: Logger,
): SmsProvider {
  const apiKey = trim(config.get('TERMII_API_KEY'));
  const baseUrl = normaliseBaseUrl(config.get('TERMII_BASE_URL'));
  const senderId = trim(config.get('TERMII_SENDER_ID')) || 'N-Alert';

  const requested = trim(config.get('SMS_PROVIDER')).toLowerCase();
  const chosen = requested || (apiKey && 'termii') || 'log';

  if (chosen === 'termii') {
    if (!apiKey) throw new Error('SMS_PROVIDER=termii but TERMII_API_KEY is empty');

    const post = async (to: string, message: string, channel: string) => {
      const { data } = await axios.post(
        `${baseUrl}/api/sms/send`,
        {
          to,
          from: senderId,
          sms: message,
          type: 'plain',
          api_key: apiKey,
          channel,
        },
        { timeout: 20_000 },
      );
      // Termii answers 200 with a body describing the failure, so a non-throwing
      // request is not proof of delivery.
      if (data?.code && data.code !== 'ok') {
        throw new Error(`Termii rejected the ${channel} message: ${data.message ?? data.code}`);
      }
    };

    return {
      name: 'termii',
      async send(to, message) {
        try {
          await post(to, message, 'generic');
        } catch (error) {
          logger.warn(
            `SMS to ${to} failed (${(error as Error).message}); trying WhatsApp.`,
          );
          await post(to, message, 'whatsapp');
        }
      },
    };
  }

  if (chosen !== 'log') {
    throw new Error(`SMS_PROVIDER="${chosen}" is not recognised. Use termii or log.`);
  }

  if (config.get('NODE_ENV') === 'production') {
    throw new Error(
      'No SMS provider is configured. Set TERMII_API_KEY, or disable phone signup ' +
        'with PHONE_SIGNUP_ENABLED=false and verify phones through BVN instead.',
    );
  }

  return {
    name: 'log',
    async send(to, message) {
      const code = /\b\d{4,8}\b/.exec(message)?.[0];
      logger.warn(
        `[sms:log] No provider configured. To=${to}` + (code ? ` Code=${code}` : ''),
      );
    },
  };
}

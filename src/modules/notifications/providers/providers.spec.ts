import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { resolveEmailProvider } from './email.provider';
import { resolveSmsProvider } from './sms.provider';

jest.mock('axios');
const post = axios.post as jest.MockedFunction<typeof axios.post>;

const cfg = (values: Record<string, string>) =>
  ({ get: (k: string) => values[k] }) as unknown as ConfigService;

const logger = { warn: jest.fn(), error: jest.fn(), log: jest.fn() } as unknown as Logger;

beforeEach(() => {
  post.mockReset();
  post.mockResolvedValue({ data: { code: 'ok' } } as never);
});

describe('resolveEmailProvider', () => {
  it('prefers an explicit EMAIL_PROVIDER over any key that happens to be present', () => {
    const p = resolveEmailProvider(
      cfg({ EMAIL_PROVIDER: 'brevo', BREVO_API_KEY: 'b', RESEND_API_KEY: 'r', MAIL_FROM: 'a@b.com' }),
      logger,
    );
    expect(p.name).toBe('brevo');
  });

  it('auto-selects the first configured provider', () => {
    expect(resolveEmailProvider(cfg({ RESEND_API_KEY: 'r' }), logger).name).toBe('resend');
    expect(resolveEmailProvider(cfg({ BREVO_API_KEY: 'b' }), logger).name).toBe('brevo');
    expect(resolveEmailProvider(cfg({ ZEPTO_API_KEY: 'z' }), logger).name).toBe('zeptomail');
  });

  // The original failure: the key was present but empty, and nothing complained.
  it('treats an empty or whitespace key as absent', () => {
    expect(resolveEmailProvider(cfg({ ZEPTO_API_KEY: '   ' }), logger).name).toBe('log');
  });

  it('refuses to fall back to logging in production', () => {
    expect(() => resolveEmailProvider(cfg({ NODE_ENV: 'production' }), logger)).toThrow(
      /No email provider is configured/,
    );
  });

  it('sends through Resend with a verified from-address', async () => {
    const p = resolveEmailProvider(
      cfg({ RESEND_API_KEY: 'key', MAIL_FROM: 'no-reply@vaultivahq.com' }),
      logger,
    );
    await p.send('user@example.com', 'Verification Code', '<b>123456</b>');
    const [url, body, opts] = post.mock.calls[0];
    expect(url).toBe('https://api.resend.com/emails');
    expect(body).toMatchObject({ from: 'Vaultiva <no-reply@vaultivahq.com>', to: ['user@example.com'] });
    expect((opts as any).headers.Authorization).toBe('Bearer key');
  });

  it('fails loudly when no sender address is configured', async () => {
    const p = resolveEmailProvider(cfg({ RESEND_API_KEY: 'key' }), logger);
    await expect(p.send('user@example.com', 's', 'h')).rejects.toThrow(/MAIL_FROM/);
  });
});

describe('resolveSmsProvider', () => {
  // The bug that made SMS impossible even with a valid key.
  it('does not double the scheme when TERMII_BASE_URL already has one', async () => {
    const p = resolveSmsProvider(
      cfg({ TERMII_API_KEY: 'k', TERMII_BASE_URL: 'https://api.ng.termii.com' }),
      logger,
    );
    await p.send('+2349113378646', 'Your code is 123456');
    expect(post.mock.calls[0][0]).toBe('https://api.ng.termii.com/api/sms/send');
  });

  it('adds a scheme when the base URL has none, and strips trailing slashes', async () => {
    const p = resolveSmsProvider(
      cfg({ TERMII_API_KEY: 'k', TERMII_BASE_URL: 'api.ng.termii.com/' }),
      logger,
    );
    await p.send('+2349113378646', 'code 1234');
    expect(post.mock.calls[0][0]).toBe('https://api.ng.termii.com/api/sms/send');
  });

  // Previously both were sent on every signup, billing twice per code.
  it('sends one message, not an SMS and a WhatsApp', async () => {
    const p = resolveSmsProvider(cfg({ TERMII_API_KEY: 'k' }), logger);
    await p.send('+2349113378646', 'code 1234');
    expect(post).toHaveBeenCalledTimes(1);
    expect((post.mock.calls[0][1] as any).channel).toBe('generic');
  });

  it('falls back to WhatsApp only when SMS fails', async () => {
    post.mockRejectedValueOnce(new Error('network')).mockResolvedValueOnce({ data: { code: 'ok' } } as never);
    const p = resolveSmsProvider(cfg({ TERMII_API_KEY: 'k' }), logger);
    await p.send('+2349113378646', 'code 1234');
    expect(post).toHaveBeenCalledTimes(2);
    expect((post.mock.calls[1][1] as any).channel).toBe('whatsapp');
  });

  // Termii answers 200 with an error body, so a resolved request proves nothing.
  it('treats a non-ok Termii body as a failure', async () => {
    post.mockResolvedValue({ data: { code: 'error', message: 'Insufficient balance' } } as never);
    const p = resolveSmsProvider(cfg({ TERMII_API_KEY: 'k' }), logger);
    await expect(p.send('+2349113378646', 'code 1234')).rejects.toThrow(/Insufficient balance/);
  });

  it('refuses to fall back to logging in production', () => {
    expect(() => resolveSmsProvider(cfg({ NODE_ENV: 'production' }), logger)).toThrow(
      /No SMS provider is configured/,
    );
  });
});

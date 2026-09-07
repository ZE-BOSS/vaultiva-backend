import { Logger } from '@nestjs/common';

/**
 * Boot-time environment validation.
 *
 * Every configuration defect found in this codebase failed silently: a misspelled
 * or missing variable resolved to `undefined` and surfaced much later as a
 * malformed outbound payload or an unhelpful runtime error. Core settings now stop
 * the process immediately; integration credentials only warn, so local work on
 * unrelated flows is still possible before every provider key has been obtained.
 */

/** Absent or wrong and nothing works — refuse to start. */
const REQUIRED = [
  'DB_HOST',
  'DB_PORT',
  'DB_USERNAME',
  'DB_PASSWORD',
  'DB_NAME',
  'JWT_SECRET',
  'ENCRYPTION_KEY',
] as const;

/** Absent and only the named feature is unavailable — warn and continue. */
const OPTIONAL_GROUPS: Record<string, string[]> = {
  'Flutterwave payments': [
    'FLUTTERWAVE_PUBLIC_KEY',
    'FLUTTERWAVE_SECRET_KEY',
    'FLUTTERWAVE_ACCOUNT_NUMBER',
    'FLUTTERWAVE_ACCOUNT_NAME',
    'FLUTTERWAVE_BANK_NAME',
    'FLUTTERWAVE_BANK_CODE',
  ],
  'Xpress Wallet (bank accounts, transfers)': [
    'XPRESS_BASEURL',
    'XPRESS_EMAIL',
    'XPRESS_PASSWORD',
  ],
  'ZeptoMail (transactional email)': ['ZEPTO_URL', 'ZEPTO_API_KEY', 'ZEPTO_FROM'],
  'Termii (SMS / OTP)': ['TERMII_BASE_URL', 'TERMII_API_KEY'],
  'Sumsub (KYC)': ['SUMSUB_APP_TOKEN', 'SUMSUB_SECRET_KEY'],
};

export function validateEnv(config: Record<string, unknown>) {
  const logger = new Logger('Config');

  const missing = REQUIRED.filter((key) => {
    const v = config[key];
    return v === undefined || v === null || String(v).trim() === '';
  });

  if (missing.length) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}. ` +
        `Copy .env.example to .env and fill them in.`,
    );
  }

  if (String(config.JWT_SECRET).length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters.');
  }

  for (const [feature, keys] of Object.entries(OPTIONAL_GROUPS)) {
    const absent = keys.filter((k) => {
      const v = config[k];
      return v === undefined || v === null || String(v).trim() === '';
    });
    if (absent.length) {
      logger.warn(
        `${feature} is not configured — ${absent.join(', ')} unset. ` +
          `Endpoints that depend on it will fail until these are set in .env.`,
      );
    }
  }

  return config;
}

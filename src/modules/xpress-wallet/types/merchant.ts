import { AccountMode, MerchantReview } from './common';

export interface MerchantProfile {
  id: string;
  bvn: string | null;
  slug: string;
  email: string;
  phoneNumber: string;
  callbackURL: string | null;
  businessName: string;
  businessType: string;
  merchantType: string;
  review: MerchantReview;
  walletReservationCharge: number;
  bvnChargeV1: number;
  bvnVerificationCharge: number;
  walletToWalletTransfer: number;
  airtimeCharge: number;
  transferCharges: {
    max5000: number;
    max50000: number;
    min50000: number;
  };
  contractCode: string | null;
  secretKey: string | null;
  apiKey: string | null;
  mode: AccountMode;
  fundingRate: number;
  fundingRateMax: number;
  sandboxCallbackURL: string | null;
  tier_1_daily_limit: number;
  tier_2_daily_limit: number;
  tier_3_daily_limit: number;
  tier_1_min_balance: number;
  tier_2_min_balance: number;
  tier_3_min_balance: number;
  baseCustomerWalletCredit: number;
  canLogin: boolean;
  sendEmail: boolean;
  autoCardFunding: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MerchantWallet {
  id: string;
  email: string;
  bankName: string;
  bankCode: string;
  accountName: string;
  businessName: string;
  accountNumber: string;
  bookedBalance: number;
  availableBalance: number;
  accountReference: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateMerchantProfileRequest {
  canLogin?: boolean;
  sendEmail?: boolean;
  callbackURL?: string;
  sandboxCallbackURL?: string;
}

export interface AccessKeys {
  publicKey: string;
  privateKey: string;
}

export interface SwitchAccountModeRequest {
  mode: AccountMode;
}

export interface MerchantRegistrationRequest {
  firstName: string;
  lastName: string;
  password: string;
  accountNumber?: string;
  phoneNumber: string;
  businessName: string;
  email: string;
  businessType: string;
  sendEmail?: boolean;
}

export interface MerchantRegistrationResponse {
  status: boolean;
  requireVerification: boolean;
  message: string;
}

export interface VerifyAccountRequest {
  activationCode: string;
}

export interface ResendVerificationRequest {
  email: string;
}
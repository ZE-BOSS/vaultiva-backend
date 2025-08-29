export interface ApiResponse<T = any> {
  status: boolean;
  message?: string;
  data?: T;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T> {
  metadata?: {
    page: number;
    totalRecords: number;
    totalPages: number;
  };
}

export interface ErrorResponse {
  status: false;
  message: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface XpressWalletConfig {
  baseUrl: string;
  timeout?: number;
  retries?: number;
  xpressEmail: string;
  xpressPassword: string;
}

export type TransactionType = 'CREDIT' | 'DEBIT' | 'ALL';
export type TransactionStatus = 'success' | 'failed' | 'pending';
export type TransactionCategory = 
  | 'CREDIT_CUSTOMER_WALLET' 
  | 'DEBIT_CUSTOMER_WALLET'
  | 'BANK_TRANSFER'
  | 'WALLET_TO_WALLET_TRANSFER'
  | 'BVN_VERIFICATION'
  | 'WALLET_RESERVATION'
  | 'CUSTOMER_BANK_TRANSFER'
  | 'CARD_ACTIVATION'
  | 'WALLET_FUNDED_THROUGH_BANK_TRANSFER';

export type WalletStatus = 'ACTIVE' | 'FROZEN' | 'CLOSED';
export type AccountMode = 'SANDBOX' | 'PRODUCTION';
export type MerchantReview = 'PENDING' | 'ENABLED' | 'DISABLED';
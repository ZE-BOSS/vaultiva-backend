import { TransactionType, TransactionCategory, TransactionStatus } from './common';

export interface CreditWalletRequest {
  amount: number;
  reference: string;
  customerId: string;
  metadata?: Record<string, any>;
}

export interface DebitWalletRequest {
  amount: number;
  reference: string;
  customerId: string;
  metadata?: Record<string, any>;
}

export interface WalletOperationResponse {
  status: boolean;
  message: string;
  reference: string;
  amount: number;
  data?: {
    amount: number;
    reference: string;
    customer_id: string;
    metadata?: Record<string, any>;
    transaction_fee: number;
    customer_wallet_id: string;
  };
}

export interface FreezeWalletRequest {
  customerId: string;
}

export interface BatchCreditRequest {
  batchReference: string;
  transactions: Array<{
    amount: number;
    customerId: string;
    reference?: string;
  }>;
}

export interface CustomerBatchCreditRequest {
  batchReference: string;
  customerId: string;
  recipients: Array<{
    amount: number;
    reference: string;
    customerId: string;
  }>;
}

export interface BatchOperationResponse {
  status: boolean;
  data: {
    accepted: Array<{
      amount: number;
      reference: string;
      customerId: string;
      walletId?: string;
    }>;
    rejected: Array<{
      amount: number;
      reference: string;
      customerId: string;
      reason: string;
      referenceExists: boolean;
    }>;
    batchReference: string;
  };
  message: string;
}

export interface FundMerchantWalletRequest {
  amount: number;
}
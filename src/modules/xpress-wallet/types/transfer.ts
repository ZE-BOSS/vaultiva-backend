export interface Bank {
  code: string;
  name: string;
}

export interface BankAccount {
  bankCode: string;
  accountName: string;
  accountNumber: string;
}

export interface AccountDetailsQuery {
  sortCode: string;
  accountNumber: string;
}

export interface BankTransferRequest {
  amount: number;
  sortCode: string;
  narration: string;
  accountNumber: string;
  accountName: string;
  metadata?: Record<string, any>;
}

export interface CustomerBankTransferRequest extends BankTransferRequest {
  customerId: string;
}

export interface BankTransferResponse {
  status: boolean;
  message: string;
  transfer: {
    amount: number;
    charges: number;
    vat: number;
    reference: string;
    total: number;
    metadata?: Record<string, any>;
    sessionId: string;
    destination: string;
    transactionReference: string;
    description: string;
  };
}

export interface BatchBankTransferRequest {
  amount: number;
  sortCode: string;
  narration: string;
  accountNumber: string;
  accountName: string;
  metadata?: Record<string, any>;
}

export interface BatchBankTransferResponse {
  status: boolean;
  message: string;
  data: {
    all: Array<{
      amount: number;
      vat: number;
      sortCode: string;
      reference: string;
      narration: string;
      accountName: string;
      fee: number;
      accountNumber: string;
      total: number;
    }>;
    rejected: any[];
    accepted: Array<{
      amount: number;
      vat: number;
      bankName: string;
      sortCode: string;
      metadata: Record<string, any>;
      reference: string;
      narration: string;
      accountName: string;
      fee: number;
      accountNumber: string;
      total: number;
    }>;
  };
}

export interface WalletToWalletTransferRequest {
  amount: number;
  fromCustomerId: string;
  toCustomerId: string;
}

export interface WalletTransferResponse {
  status: boolean;
  message: string;
  data: {
    amount: number;
    reference: string;
    transaction_fee: number;
    total: number;
    target_customer_id: string;
    source_customer_id: string;
    target_customer_wallet: string;
    source_customer_wallet: string;
    description: string;
  };
}
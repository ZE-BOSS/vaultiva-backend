import { TransactionType, TransactionCategory, TransactionStatus } from './common';

export interface Transaction {
  id: string;
  category: TransactionCategory;
  currency: string;
  amount: number;
  metadata: Record<string, any> | null;
  balance_after: number | null;
  balance_before: number | null;
  reference: string;
  source: string | null;
  destination: string | null;
  type: TransactionType;
  description: string;
  mode: 'SANDBOX' | 'PRODUCTION';
  completed: boolean;
  status?: TransactionStatus;
  fee?: number | null;
  vat?: number;
  total?: number;
  createdAt: string;
  updatedAt: string;
}

export interface MerchantTransactionsQuery {
  page?: number;
  type?: TransactionType;
  status?: TransactionStatus;
  category?: TransactionCategory;
  search?: string;
  perPage?: number;
}

export interface CustomerTransactionsQuery {
  customerId: string;
  page?: number;
  type?: TransactionType;
  perPage?: number;
  category?: TransactionCategory;
}

export interface BatchTransaction {
  id: string;
  type: TransactionType;
  source: {
    type: string;
    userId: string;
    walletId: string;
  };
  reference: string;
  reversed: boolean;
  all_references: string[];
  passed_references: string[];
  failed_references: string[];
  createdAt: string;
  updatedAt: string;
}

export interface BatchTransactionsQuery {
  search?: string;
  category?: TransactionCategory;
  type?: TransactionType;
  page?: number;
  perPage?: number;
}

export interface PendingTransactionsQuery {
  page?: number;
  type?: TransactionType;
  category?: TransactionCategory;
}

export interface PendingTransaction {
  id: string;
  mode: 'SANDBOX' | 'PRODUCTION';
  type: TransactionType;
  creator: string;
  status: 'PENDING';
  merchantId: string;
  category: TransactionCategory;
  approvedBy: string | null;
  metadata: Record<string, any>;
  amount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApproveTransactionRequest {
  transactionId: string;
}

export interface ReverseBatchTransactionRequest {
  batchReference: string;
}
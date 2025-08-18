export interface CardSetupRequest {
  appId: string;
  appKey: string;
  prepaidCardPrefix: string;
  loadingAccountName: string;
  loadingAccountNumber: string;
  loadingAccountSortcode: string;
}

export interface CreateCardRequest {
  address1: string;
  address2: string;
  customerId: string;
}

export interface ActivateCardRequest {
  amount?: number;
  last6: string;
  customerId: string;
}

export interface CardBalanceQuery {
  customerId?: string;
  last6?: string;
}

export interface CardBalance {
  id: string;
  ledgerBalance: string;
  availableBalance: string;
  goodsLimit: string;
  goodsNrTransLimit: string;
  cashLimit: string;
  cashNrTransLimit: string;
  paymentLimit: string;
  paymentNrTransLimit: string;
  cardNotPresentLimit: string;
  depositCreditLimit: string;
  updatedAt: string;
  createdAt: string;
  deletedAt: string | null;
}

export interface FundCardRequest {
  amount: number;
  customerId: string;
}
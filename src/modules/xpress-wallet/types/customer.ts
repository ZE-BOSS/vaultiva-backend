export interface Customer {
  id: string;
  bvn: string;
  firstName: string;
  lastName: string;
  BVNLastName: string;
  BVNFirstName: string;
  email: string;
  nameMatch: boolean;
  phoneNumber: string;
  dateOfBirth: string;
  createdAt: string;
  updatedAt: string;
  walletId: string;
  address?: string;
  metadata?: Record<string, any>;
}

export interface CreateCustomerWalletRequest {
  bvn: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phoneNumber: string;
  email?: string;
  address?: string;
  metadata?: Record<string, any>;
}

export interface UpdateCustomerRequest {
  firstName?: string;
  lastName?: string;
  address?: string;
  phoneNumber?: string;
  metadata?: Record<string, any>;
}

export interface CustomerWalletResponse {
  customer: Customer;
  wallet: Wallet;
}

export interface Wallet {
  id: string;
  mode: 'SANDBOX' | 'PRODUCTION';
  email: string;
  currency: string;
  bankName: string;
  bankCode: string;
  accountName: string;
  accountNumber: string;
  accountReference: string;
  updatedAt: string;
  createdAt: string;
  bookedBalance: number;
  availableBalance: number;
  status: 'ACTIVE' | 'FROZEN' | 'CLOSED';
  updated: boolean;
  walletType: string;
  walletId: string;
  customerId?: string;
  firstName?: string;
  lastName?: string;
}
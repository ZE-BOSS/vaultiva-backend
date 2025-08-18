import { HttpClient } from '../client/http-client';
import { 
  CreateCustomerWalletRequest,
  CustomerWalletResponse,
  Wallet
} from '../types/customer';
import {
  CreditWalletRequest,
  DebitWalletRequest,
  WalletOperationResponse,
  FreezeWalletRequest,
  BatchCreditRequest,
  CustomerBatchCreditRequest,
  BatchOperationResponse,
  FundMerchantWalletRequest
} from '../types/wallet';
import { ApiResponse } from '../types/common';

export class WalletService {
  constructor(private httpClient: HttpClient) {}

  async createCustomerWallet(request: CreateCustomerWalletRequest): Promise<CustomerWalletResponse> {
    const response = await this.httpClient.post<CustomerWalletResponse>('/wallet', request);
    return response.data;
  }

  async getAllWallets(): Promise<ApiResponse<Wallet[]>> {
    const response = await this.httpClient.get<{
      status: boolean;
      wallets: Wallet[];
    }>('/wallet');
    
    return {
      status: response.data.status,
      data: response.data.wallets
    };
  }

  async getCustomerWallet(customerId: string): Promise<ApiResponse<Wallet>> {
    const response = await this.httpClient.get<{
      status: boolean;
      wallet: Wallet;
    }>('/wallet/customer', {
      params: { customerId }
    });
    
    return {
      status: response.data.status,
      data: response.data.wallet
    };
  }

  async creditWallet(request: CreditWalletRequest): Promise<WalletOperationResponse> {
    const response = await this.httpClient.post<WalletOperationResponse>('/wallet/credit', request);
    return response.data;
  }

  async debitWallet(request: DebitWalletRequest): Promise<WalletOperationResponse> {
    const response = await this.httpClient.post<WalletOperationResponse>('/wallet/debit', request);
    return response.data;
  }

  async freezeWallet(request: FreezeWalletRequest): Promise<ApiResponse> {
    const response = await this.httpClient.post<ApiResponse>('/wallet/close', request);
    return response.data;
  }

  async unfreezeWallet(request: FreezeWalletRequest): Promise<ApiResponse> {
    const response = await this.httpClient.post<ApiResponse>('/wallet/enable', request);
    return response.data;
  }

  async batchCreditWallets(request: BatchCreditRequest): Promise<BatchOperationResponse> {
    const response = await this.httpClient.post<BatchOperationResponse>(
      '/wallet/batch-credit-customer-wallet', 
      request
    );
    return response.data;
  }

  async batchDebitWallets(request: BatchCreditRequest): Promise<BatchOperationResponse> {
    const response = await this.httpClient.post<BatchOperationResponse>(
      '/wallet/batch-debit-customer-wallet', 
      request
    );
    return response.data;
  }

  async customerBatchCreditWallets(request: CustomerBatchCreditRequest): Promise<BatchOperationResponse> {
    const response = await this.httpClient.post<BatchOperationResponse>(
      '/wallet/customer-batch-credit-customer-wallet', 
      request
    );
    return response.data;
  }

  async fundMerchantSandboxWallet(request: FundMerchantWalletRequest): Promise<ApiResponse> {
    const response = await this.httpClient.post<ApiResponse>('/merchant/fund-wallet', request);
    return response.data;
  }
}
import { HttpClient } from '../client/http-client';
import {
  Bank,
  BankAccount,
  AccountDetailsQuery,
  BankTransferRequest,
  CustomerBankTransferRequest,
  BankTransferResponse,
  BatchBankTransferRequest,
  BatchBankTransferResponse,
  WalletToWalletTransferRequest,
  WalletTransferResponse
} from '../types/transfer';
import { ApiResponse } from '../types/common';

export class TransferService {
  constructor(private httpClient: HttpClient) {}

  async getBankList(): Promise<ApiResponse<Bank[]>> {
    const response = await this.httpClient.get<{
      status: boolean;
      banks: Bank[];
    }>('/transfer/banks');
    
    return {
      status: response.data.status,
      data: response.data.banks
    };
  }

  async getBankAccountDetails(query: AccountDetailsQuery): Promise<ApiResponse<BankAccount>> {
    const response = await this.httpClient.get<{
      status: boolean;
      account: BankAccount;
    }>('/transfer/account/details', {
      params: {
        sortCode: query.sortCode,
        accountNumber: query.accountNumber
      }
    });
    
    return {
      status: response.data.status,
      data: response.data.account
    };
  }

  async merchantBankTransfer(request: BankTransferRequest): Promise<BankTransferResponse> {
    const response = await this.httpClient.post<BankTransferResponse>('/transfer/bank', request);
    return response.data;
  }

  async customerBankTransfer(request: CustomerBankTransferRequest): Promise<BankTransferResponse> {
    const response = await this.httpClient.post<BankTransferResponse>('/transfer/bank/customer', request);
    return response.data;
  }

  async merchantBatchBankTransfer(requests: BatchBankTransferRequest[]): Promise<BatchBankTransferResponse> {
    const response = await this.httpClient.post<BatchBankTransferResponse>('/transfer/bank/batch', requests);
    return response.data;
  }

  async walletToWalletTransfer(request: WalletToWalletTransferRequest): Promise<WalletTransferResponse> {
    const response = await this.httpClient.post<WalletTransferResponse>('/transfer/wallet', request);
    return response.data;
  }
}
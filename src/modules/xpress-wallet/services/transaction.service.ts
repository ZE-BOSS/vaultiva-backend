import { HttpClient } from '../client/http-client';
import {
  Transaction,
  MerchantTransactionsQuery,
  CustomerTransactionsQuery,
  BatchTransaction,
  BatchTransactionsQuery,
  PendingTransaction,
  PendingTransactionsQuery,
  ApproveTransactionRequest,
  ReverseBatchTransactionRequest
} from '../types/transaction';
import { ApiResponse, PaginatedResponse } from '../types/common';

export class TransactionService {
  constructor(private httpClient: HttpClient) {}

  async getMerchantTransactions(query: MerchantTransactionsQuery = {}): Promise<PaginatedResponse<Transaction[]>> {
    const response = await this.httpClient.get<{
      status: boolean;
      transactions: Transaction[];
      metadata: {
        page: number;
        totalRecords: number;
        totalPages: number;
      };
    }>('/merchant/transactions', {
      params: {
        page: query.page || 1,
        type: query.type || 'ALL',
        status: query.status,
        category: query.category,
        search: query.search
      }
    });
    
    return {
      status: response.data.status,
      data: response.data.transactions,
      metadata: response.data.metadata
    };
  }

  async getTransactionDetails(transactionReference: string): Promise<ApiResponse<Transaction>> {
    const response = await this.httpClient.get<{
      status: boolean;
      transaction: Transaction;
    }>(`/merchant/transaction/${transactionReference}`);
    
    return {
      status: response.data.status,
      data: response.data.transaction
    };
  }

  async getCustomerTransactions(query: CustomerTransactionsQuery): Promise<PaginatedResponse<Transaction[]>> {
    const response = await this.httpClient.get<{
      status: boolean;
      transactions: Transaction[];
      metadata: {
        page: number;
        totalRecords: number;
        totalPages: number;
      };
    }>('/transaction/customer', {
      params: {
        customerId: query.customerId,
        page: query.page || 1,
        type: query.type,
        perPage: query.perPage || 20,
        category: query.category
      }
    });
    
    return {
      status: response.data.status,
      data: response.data.transactions,
      metadata: response.data.metadata
    };
  }

  async getBatchTransactions(query: BatchTransactionsQuery = {}): Promise<PaginatedResponse<BatchTransaction[]>> {
    const response = await this.httpClient.get<{
      status: boolean;
      data: BatchTransaction[];
      metadata: {
        page: number;
        totalRecords: number;
        totalPages: number;
      };
    }>('/transaction/batch', {
      params: {
        search: query.search,
        category: query.category,
        type: query.type,
        page: query.page || 1,
        perPage: query.perPage || 20
      }
    });
    
    return {
      status: response.data.status,
      data: response.data.data,
      metadata: response.data.metadata
    };
  }

  async getBatchTransactionDetails(reference: string): Promise<ApiResponse<BatchTransaction>> {
    const response = await this.httpClient.get<{
      status: boolean;
      data: BatchTransaction;
    }>(`/transaction/batch/${reference}`);
    
    return {
      status: response.data.status,
      data: response.data.data
    };
  }

  async getPendingTransactions(query: PendingTransactionsQuery = {}): Promise<PaginatedResponse<PendingTransaction[]>> {
    const response = await this.httpClient.get<{
      status: boolean;
      data: PendingTransaction[];
      metadata: {
        page: number;
        totalRecords: number;
        totalPages: number;
      };
    }>('/transaction/pending', {
      params: {
        page: query.page || 1,
        type: query.type || 'ALL',
        category: query.category
      }
    });
    
    return {
      status: response.data.status,
      data: response.data.data,
      metadata: response.data.metadata
    };
  }

  async approveTransaction(request: ApproveTransactionRequest): Promise<ApiResponse> {
    const response = await this.httpClient.post<ApiResponse>('/transaction/approve', request);
    return response.data;
  }

  async declinePendingTransaction(transactionId: string): Promise<ApiResponse> {
    const response = await this.httpClient.delete<ApiResponse>(`/transaction/${transactionId}`);
    return response.data;
  }

  async reverseBatchTransaction(request: ReverseBatchTransactionRequest): Promise<ApiResponse> {
    const response = await this.httpClient.post<ApiResponse>('/wallet/reverse-batch-transaction', request);
    return response.data;
  }

  async downloadMerchantTransactions(): Promise<ApiResponse<Transaction[]>> {
    const response = await this.httpClient.get<{
      status: boolean;
      data: Transaction[];
    }>('/transaction/download/merchant');
    
    return {
      status: response.data.status,
      data: response.data.data
    };
  }

  async downloadCustomerTransactions(customerId: string): Promise<ApiResponse<Transaction[]>> {
    const response = await this.httpClient.get<{
      status: boolean;
      data: Transaction[];
    }>('/transaction/download/customer', {
      params: { customerId }
    });
    
    return {
      status: response.data.status,
      data: response.data.data
    };
  }
}
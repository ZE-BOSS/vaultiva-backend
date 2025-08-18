import { HttpClient } from '../client/http-client';
import { Customer, UpdateCustomerRequest } from '../types/customer';
import { ApiResponse, PaginatedResponse } from '../types/common';

export class CustomerService {
  constructor(private httpClient: HttpClient) {}

  async getAllCustomers(page: number = 1): Promise<PaginatedResponse<Customer[]>> {
    const response = await this.httpClient.get<{
      status: boolean;
      customers: Customer[];
      metadata: {
        page: number;
        totalRecords: number;
        totalPages: number;
      };
    }>('/customer', {
      params: { page }
    });
    
    return {
      status: response.data.status,
      data: response.data.customers,
      metadata: response.data.metadata
    };
  }

  async getCustomerById(customerId: string): Promise<ApiResponse<Customer>> {
    const response = await this.httpClient.get<{
      status: boolean;
      customer: Customer;
    }>(`/customer/${customerId}`);
    
    return {
      status: response.data.status,
      data: response.data.customer
    };
  }

  async findByPhoneNumber(phoneNumber: string): Promise<ApiResponse<{
    id: string;
    firstName: string;
    lastName: string;
    walletId: string;
  }>> {
    const response = await this.httpClient.get<{
      status: boolean;
      customer: {
        id: string;
        firstName: string;
        lastName: string;
        walletId: string;
      };
    }>('/customer/phone', {
      params: { phoneNumber }
    });
    
    return {
      status: response.data.status,
      data: response.data.customer
    };
  }

  async updateCustomer(
    customerId: string, 
    updates: UpdateCustomerRequest
  ): Promise<ApiResponse<Customer>> {
    const response = await this.httpClient.put<{
      status: boolean;
      customer: Customer;
    }>(`/customer/${customerId}`, updates);
    
    return {
      status: response.data.status,
      data: response.data.customer
    };
  }
}
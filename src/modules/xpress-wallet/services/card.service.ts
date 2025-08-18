import { HttpClient } from '../client/http-client';
import {
  CardSetupRequest,
  CreateCardRequest,
  ActivateCardRequest,
  CardBalanceQuery,
  CardBalance,
  FundCardRequest
} from '../types/card';
import { ApiResponse } from '../types/common';

export class CardService {
  constructor(private httpClient: HttpClient) {}

  async setupCard(request: CardSetupRequest): Promise<ApiResponse> {
    const response = await this.httpClient.put<ApiResponse>('/card/setup', request);
    return response.data;
  }

  async createCard(request: CreateCardRequest): Promise<ApiResponse> {
    const response = await this.httpClient.post<ApiResponse>('/card', request);
    return response.data;
  }

  async activateCard(request: ActivateCardRequest): Promise<ApiResponse> {
    const response = await this.httpClient.post<ApiResponse>('/card/activate', request);
    return response.data;
  }

  async getCardBalance(query: CardBalanceQuery): Promise<ApiResponse<CardBalance>> {
    const response = await this.httpClient.get<{
      status: boolean;
      data: CardBalance;
    }>('/card/balance', {
      params: query
    });
    
    return {
      status: response.data.status,
      data: response.data.data
    };
  }

  async fundCard(request: FundCardRequest): Promise<ApiResponse> {
    const response = await this.httpClient.post<ApiResponse>('/card/fund', request);
    return response.data;
  }
}
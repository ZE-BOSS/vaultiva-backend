import { HttpClient } from '../client/http-client';
import {
  MerchantProfile,
  MerchantWallet,
  UpdateMerchantProfileRequest,
  AccessKeys,
  SwitchAccountModeRequest,
  MerchantRegistrationRequest,
  MerchantRegistrationResponse,
  VerifyAccountRequest,
  ResendVerificationRequest
} from '../types/merchant';
import { ApiResponse } from '../types/common';

export class MerchantService {
  constructor(private httpClient: HttpClient) {}

  async registerMerchant(request: MerchantRegistrationRequest): Promise<MerchantRegistrationResponse> {
    const response = await this.httpClient.post<MerchantRegistrationResponse>('/merchant', request);
    return response.data;
  }

  async verifyAccount(request: VerifyAccountRequest): Promise<ApiResponse> {
    const response = await this.httpClient.put<ApiResponse>('/merchant/verify', request);
    return response.data;
  }

  async resendVerificationCode(request: ResendVerificationRequest): Promise<ApiResponse> {
    const response = await this.httpClient.post<ApiResponse>('/merchant/verify/resend', request);
    return response.data;
  }

  async getProfile(): Promise<ApiResponse<MerchantProfile>> {
    const response = await this.httpClient.get<{
      status: boolean;
      data: MerchantProfile;
    }>('/merchant/profile');
    
    return {
      status: response.data.status,
      data: response.data.data
    };
  }

  async updateProfile(request: UpdateMerchantProfileRequest): Promise<ApiResponse> {
    const response = await this.httpClient.patch<ApiResponse>('/merchant/profile', request);
    return response.data;
  }

  async getWallet(): Promise<ApiResponse<MerchantWallet>> {
    const response = await this.httpClient.get<{
      status: boolean;
      data: MerchantWallet;
    }>('/merchant/wallet');
    
    return {
      status: response.data.status,
      data: response.data.data
    };
  }

  async getAccessKeys(): Promise<ApiResponse<AccessKeys>> {
    const response = await this.httpClient.get<{
      status: boolean;
      data: AccessKeys;
    }>('/merchant/my-access-keys');
    
    return {
      status: response.data.status,
      data: response.data.data
    };
  }

  async generateAccessKeys(): Promise<ApiResponse<AccessKeys>> {
    const response = await this.httpClient.post<{
      status: boolean;
      data: AccessKeys;
    }>('/merchant/generate-access-keys');
    
    return {
      status: response.data.status,
      data: response.data.data
    };
  }

  async switchAccountMode(request: SwitchAccountModeRequest): Promise<ApiResponse> {
    const response = await this.httpClient.post<ApiResponse>('/merchant/account-mode', request);
    return response.data;
  }
}
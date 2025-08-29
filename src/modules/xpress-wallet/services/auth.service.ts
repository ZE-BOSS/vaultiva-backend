import { HttpClient } from '../client/http-client';
import {
  LoginRequest,
  LoginResponse,
  ForgetPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest
} from '../types/auth';
import { ApiResponse, AuthTokens } from '../types/common';

export class AuthService {
  constructor(private httpClient: HttpClient) {}

  async logout(): Promise<ApiResponse> {
    const response = await this.httpClient.post<ApiResponse>('/auth/logout');
    this.httpClient.clearTokens();
    return response.data;
  }

  async forgetPassword(request: ForgetPasswordRequest): Promise<ApiResponse> {
    const response = await this.httpClient.post<ApiResponse>('/auth/password/forget', request);
    return response.data;
  }

  async resetPassword(request: ResetPasswordRequest): Promise<ApiResponse> {
    const response = await this.httpClient.post<ApiResponse>('/auth/password/reset', request);
    return response.data;
  }

  async refreshToken(): Promise<{ 
    response: LoginResponse; 
    tokens: AuthTokens 
  }> {
    const response = await this.httpClient.post<LoginResponse>('/auth/refresh/token');
    
    const tokens: AuthTokens = {
      accessToken: response.headers['x-access-token'],
      refreshToken: response.headers['x-refresh-token']
    };

    this.httpClient.setTokens(tokens);
    
    return {
      response: response.data,
      tokens
    };
  }
}
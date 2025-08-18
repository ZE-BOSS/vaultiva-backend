import { HttpClient } from '../client/http-client';
import { UserProfileResponse } from '../types/user';
import { ChangePasswordRequest } from '../types/auth';
import { ApiResponse } from '../types/common';

export class UserService {
  constructor(private httpClient: HttpClient) {}

  async getProfile(): Promise<UserProfileResponse> {
    const response = await this.httpClient.get<UserProfileResponse>('/user/profile');
    return response.data;
  }

  async changePassword(request: ChangePasswordRequest): Promise<ApiResponse> {
    const response = await this.httpClient.put<ApiResponse>('/user/password', request);
    return response.data;
  }
}
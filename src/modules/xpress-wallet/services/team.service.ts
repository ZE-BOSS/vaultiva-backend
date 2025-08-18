import { HttpClient } from '../client/http-client';
import {
  TeamMember,
  Invitation,
  InviteTeamMemberRequest,
  AcceptInvitationRequest,
  ResendInvitationRequest,
  Merchant,
  SwitchMerchantRequest,
  UpdateMemberRequest,
  Permission,
  Role,
  CreateRoleRequest,
  UpdateRoleRequest
} from '../types/team';
import { ApiResponse, PaginatedResponse } from '../types/common';

export class TeamService {
  constructor(private httpClient: HttpClient) {}

  async inviteTeamMember(request: InviteTeamMemberRequest): Promise<ApiResponse> {
    const response = await this.httpClient.post<ApiResponse>('/team/invitations', request);
    return response.data;
  }

  async getTeamMembers(): Promise<ApiResponse<TeamMember[]>> {
    const response = await this.httpClient.get<{
      status: boolean;
      data: TeamMember[];
    }>('/team/members');
    
    return {
      status: response.data.status,
      data: response.data.data
    };
  }

  async getAllInvitations(page: number = 1, perPage: number = 20): Promise<PaginatedResponse<Invitation[]>> {
    const response = await this.httpClient.get<{
      status: boolean;
      data: Invitation[];
    }>('/team/invitations', {
      params: { page, perPage }
    });
    
    return {
      status: response.data.status,
      data: response.data.data
    };
  }

  async resendInvitation(request: ResendInvitationRequest): Promise<ApiResponse> {
    const response = await this.httpClient.post<ApiResponse>('/team/invitations/resend', request);
    return response.data;
  }

  async acceptInvitation(request: AcceptInvitationRequest): Promise<ApiResponse> {
    const response = await this.httpClient.post<ApiResponse>('/team/invitations/accept', request);
    return response.data;
  }

  async getMerchantList(): Promise<ApiResponse<Merchant[]>> {
    const response = await this.httpClient.get<{
      status: boolean;
      data: Merchant[];
    }>('/team/merchants');
    
    return {
      status: response.data.status,
      data: response.data.data
    };
  }

  async switchMerchant(request: SwitchMerchantRequest): Promise<ApiResponse> {
    const response = await this.httpClient.post<ApiResponse>('/team/merchants/switch', request);
    return response.data;
  }

  async updateMember(memberId: string, request: UpdateMemberRequest): Promise<ApiResponse> {
    const response = await this.httpClient.put<ApiResponse>(`/team/member/${memberId}`, request);
    return response.data;
  }

  async getAllPermissions(): Promise<ApiResponse<Permission[]>> {
    const response = await this.httpClient.get<{
      status: boolean;
      data: Permission[];
    }>('/team/permissions');
    
    return {
      status: response.data.status,
      data: response.data.data
    };
  }

  async getAllRoles(): Promise<ApiResponse<Role[]>> {
    const response = await this.httpClient.get<{
      status: boolean;
      data: Role[];
    }>('/team/roles');
    
    return {
      status: response.data.status,
      data: response.data.data
    };
  }

  async createRole(request: CreateRoleRequest): Promise<ApiResponse<Role>> {
    const response = await this.httpClient.post<{
      status: boolean;
      message: string;
      data: Role;
    }>('/team/roles', request);
    
    return {
      status: response.data.status,
      message: response.data.message,
      data: response.data.data
    };
  }

  async updateRole(roleId: string, request: UpdateRoleRequest): Promise<ApiResponse<Role>> {
    const response = await this.httpClient.patch<{
      status: boolean;
      message: string;
      data: Role;
    }>(`/team/roles/${roleId}`, request);
    
    return {
      status: response.data.status,
      message: response.data.message,
      data: response.data.data
    };
  }
}
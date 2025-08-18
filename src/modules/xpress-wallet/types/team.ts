export interface TeamMember {
  id: string;
  role: string;
  email: string;
  lastName: string;
  firstName: string;
  approvalLimit: number;
}

export interface Invitation {
  id: string;
  email: string;
  role: string;
  accepted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InviteTeamMemberRequest {
  roleId: string;
  email: string;
  approvalLimit: number;
}

export interface AcceptInvitationRequest {
  invitationCode: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  password: string;
}

export interface ResendInvitationRequest {
  email: string;
}

export interface Merchant {
  id: string;
  role: string;
  name: string;
}

export interface SwitchMerchantRequest {
  merchantId: string;
}

export interface UpdateMemberRequest {
  approvalLimit?: number;
  roleId?: string;
}

export interface Permission {
  name: string;
  description: string;
}

export interface Role {
  id: string;
  name: string;
  permissions: string[];
}

export interface CreateRoleRequest {
  name: string;
  permissions: string[];
}

export interface UpdateRoleRequest {
  name: string;
  permissions: string[];
}
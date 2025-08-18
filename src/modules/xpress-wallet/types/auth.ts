export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: boolean;
  data: {
    id: string;
    role: string;
    email: string;
    lastName: string;
    firstName: string;
    createdAt: string;
    updatedAt: string;
  };
  merchant: {
    email: string;
    id: string;
    lastName: string;
    mode: 'SANDBOX' | 'PRODUCTION';
    role: string;
    firstName: string;
    owner: boolean;
    review: string;
    callbackURL: string | null;
    businessName: string;
    businessType: string;
    parentMerchant: string | null;
    canDebitCustomer: boolean;
    sandboxCallbackURL: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

export interface ForgetPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  resetCode: string;
  password: string;
}

export interface ChangePasswordRequest {
  password: string;
}
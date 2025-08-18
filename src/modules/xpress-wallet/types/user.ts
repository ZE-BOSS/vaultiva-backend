export interface UserProfile {
  id: string;
  role: string;
  email: string;
  lastName: string;
  firstName: string;
  phoneNumber: string;
  MerchantId: string;
  createdAt: string;
  updatedAt: string;
  Merchant: {
    id: string;
    email: string;
    review: string;
    businessName: string;
    canDebitCustomer: boolean;
    parentMerchant: string | null;
    createdAt: string;
    mode: 'SANDBOX' | 'PRODUCTION';
    owner: boolean;
  };
}

export interface UserProfileResponse {
  status: boolean;
  data: UserProfile;
  permissions: string[];
}
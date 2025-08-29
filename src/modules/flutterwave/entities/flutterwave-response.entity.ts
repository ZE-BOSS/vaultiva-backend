import { TransactionData } from "./flutterwave-data.entity";

export interface ApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  data: T | null;
}

export interface TransactionVerifyResponse extends ApiResponse<TransactionData> {}

export interface TransferDataResponse {
  id: number;
  account_number: string;
  account_bank: string;
  amount: number;
  currency: string;
  status: string;
  reference: string;
  complete_message: string;
  date: string;
}

export interface TransferVerifyResponse extends ApiResponse<TransferDataResponse> {}

export interface VirtualAccountResponse {
  id: number;
  account_number: string;
  account_bank: string;
  account_name: string;
  is_permanent: boolean;
  tx_ref: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
}

export interface VirtualAccountCreateResponse extends ApiResponse<VirtualAccountResponse> {}

export interface BillPaymentResponse {
  id: number;
  amount: number;
  currency: string;
  status: string;
  flw_ref: string;
  tx_ref: string;
  charged_amount: number;
  complete_message: string;
  created_at: string;
}

export interface BillPaymentApiResponse extends ApiResponse<BillPaymentResponse> {}

export interface Bank {
  name: string;
  code: string;
}

export interface VerifyAccountResponse {
  account_number: string;
  account_name: string;
}

export interface Biller {
  id: number
  biller_code: string
  name: string
  default_commission: number
  date_added: string
  country: string
  is_airtime: boolean
  biller_name: string
  item_code: string
  short_name: string
  fee: number
  commission_on_fee: boolean
  label_name: string
  amount: number
}

export interface Transaction {
  phone_number: string
  amount: number
  network: string
  flw_ref: string
  tx_ref: string
  reference: string | null
}

export interface Verify {
  response_code: string
  address: string | null
  response_message: string
  name: string
  biller_code: string
  customer: string
  product_code: string
  email: string | null
  fee: number
  maximum: number
  minimum: number
}

export interface FlutterwaveResponse<T = any> {
  status: string;
  message: string;
  data: T;
  meta?: any;
}
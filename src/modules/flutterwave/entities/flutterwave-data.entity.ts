export interface TransferData {
  account_bank: string;        // Bank code (e.g. "044" for Access Bank)
  account_number: string;      // 10-digit Nigerian account number
  amount: number;              // Amount to transfer
  narration: string;           // Reason/description for the transfer
  currency: string;            // e.g., "NGN"
  reference: string;           // Unique transaction reference
  callback_url?: string;       // Optional webhook callback
  debit_currency?: string;     // Optional if different from currency
  beneficiary_name?: string;   // Optional name for recipient
}

export interface VirtualAccountData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  narration: string;
}

export interface BillPaymentData {
  country: string;
  customer: string;
  amount: number;
  recurrence: string;
  type: string;
  reference: string;
  biller_name?: string;
}

export interface TransactionCardDetails {
  first_6digits: string;
  last_4digits: string;
  issuer: string;
  country: string;
  type: string;
  token: string;
  expiry: string;
}

export interface TransactionCustomer {
  id: number;
  name: string;
  phone_number: string;
  email: string;
  created_at: string;
}

export interface TransactionData {
  id: number;
  tx_ref: string;
  flw_ref: string;
  device_fingerprint: string;
  amount: number;
  currency: string;
  charged_amount: number;
  app_fee: number | null;
  merchant_fee: number;
  processor_response: string | null;
  auth_model: string;
  ip: string;
  narration: string;
  status: 'successful' | 'pending' | 'failed' | string;
  payment_type: string;
  created_at: string;
  amount_settled: number | null;
  card?: TransactionCardDetails;
  customer: TransactionCustomer;
}
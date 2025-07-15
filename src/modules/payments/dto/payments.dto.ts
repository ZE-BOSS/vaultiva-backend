
export interface BillPaymentDto {
  type: string;
  amount: number;
  customer: string;
  biller_name?: string;
  country?: string;
  recurrence?: string;
}

export interface AirtimeDto {
  amount: number;
  phone: string;
  network: string;
}

export interface DataDto {
  amount: number;
  phone: string;
  network: string;
  plan: string;
}
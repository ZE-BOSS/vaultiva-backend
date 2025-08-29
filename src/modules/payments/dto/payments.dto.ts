
export interface BillPaymentDto {
  type: string;
  amount: number;
  customer: string;
  biller_code?: string;
  country?: string;
  item_code?: string;
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
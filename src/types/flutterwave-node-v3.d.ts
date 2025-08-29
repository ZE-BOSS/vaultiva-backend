declare module 'flutterwave-node-v3' {
  interface FlutterwaveResponse<T = any> {
    status: string;
    message: string;
    data: T;
    meta?: any;
  }

  interface Biller {
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

  interface Transaction {
    phone_number: string
    amount: number
    network: string
    flw_ref: string
    tx_ref: string
    reference: string | null
  }

  interface Verify {
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

  interface PaymentData {
    amount: number | string;
    currency: string;
    tx_ref: string;
    redirect_url: string;
    payment_options?: string;
    customer: {
      email: string;
      phone_number?: string;
      name?: string;
    };
    customizations?: {
      title?: string;
      description?: string;
      logo?: string;
    };
    meta?: Record<string, any>;
  }

  interface TransferData {
    account_bank: string;
    account_number: string;
    amount: number;
    narration: string;
    currency: string;
    reference: string;
    callback_url?: string;
    debit_currency?: string;
  }

  interface VirtualAccountData {
    email: string;
    is_permanent: boolean;
    bvn: string;
    tx_ref: string;
    firstname: string;
    lastname: string;
    phonenumber: string;
    narration: string;
  }

  interface BillPaymentData {
    country: string;
    customer: string;
    amount: number;
    recurrence: string;
    type: string;
    reference: string;
    biller_name?: string;
  }

  interface AccountResolveData {
    account_number: string;
    account_bank: string;
  }

  class Flutterwave {
    constructor(publicKey: string, secretKey: string);

    Payment: {
      initialize(data: PaymentData): Promise<FlutterwaveResponse<{ link: string }>>;
    };

    Transaction: {
      verify(params: { id: string | number }): Promise<FlutterwaveResponse<any>>;
    };

    Transfer: {
      initiate(data: TransferData): Promise<FlutterwaveResponse<any>>;
      getTransfers(): Promise<FlutterwaveResponse<any>>;
      fetchTransfer(params: { id: string | number }): Promise<FlutterwaveResponse<any>>;
    };

    VirtualAcct: {
      create(data: VirtualAccountData): Promise<FlutterwaveResponse<any>>;
    };

    Bills: {
      fetch_bills_Cat(): Promise<FlutterwaveResponse<Biller[]>>;
      validate(params: {
        item_code: string;
        code: string;
        customer: string;
      }): Promise<FlutterwaveResponse<Verify>>;
      create_bill(data: BillPaymentData): Promise<FlutterwaveResponse<Transaction>>;
    };

    Bank: {
      country(params: { country: string }): Promise<FlutterwaveResponse<any>>;
    };

    Misc: {
      verify_Account(data: AccountResolveData): Promise<FlutterwaveResponse<any>>;
    };
  }

  export = Flutterwave;
}
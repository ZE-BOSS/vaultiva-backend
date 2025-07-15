import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Flutterwave from 'flutterwave-node-v3';
import { 
  ApiResponse, 
  Bank, 
  VerifyAccountResponse,
  TransferDataResponse,
  TransactionVerifyResponse,
  VirtualAccountCreateResponse,
  VirtualAccountResponse,
  BillPaymentApiResponse,
  BillPaymentResponse,
  TransferVerifyResponse,
} from './entities/flutterwave-response.entity';
import {
  TransactionData,
  TransferData,
  VirtualAccountData,
  BillPaymentData
} from './entities/flutterwave-data.entity';


@Injectable()
export class FlutterwaveService {
  private flw: InstanceType<typeof Flutterwave>;

  constructor(private configService: ConfigService) {
    this.flw = new Flutterwave(
      configService.get<string>('FLUTTERWAVE_PUBLIC_KEY'),
      configService.get<string>('FLUTTERWAVE_SECRET_KEY'),
    );
  }

  async initializePayment(data: {
    amount: number;
    email: string;
    reference: string;
    metadata?: Record<string, any>;
  }): Promise<any> {
    const payload = {
      tx_ref: data.reference,
      amount: data.amount,
      currency: 'NGN',
      redirect_url: process.env.FLW_REDIRECT_URL,
      payment_options: 'card,banktransfer',
      customer: {
        email: data.email,
      },
      customizations: {
        title: 'Wallet Funding',
        description: 'Fund your wallet',
      },
      meta: data.metadata || {},
    };

    const response = await this.flw.Payment.initialize(payload) as ApiResponse<any>;

    return response.data;
  }

  async getBillCategories(): Promise<ApiResponse<any>> {
    const resp = await this.flw.Bills.fetch_bills() as ApiResponse<any>;
    if (resp.status !== 'success' || !resp.data) {
      throw new BadRequestException(resp.message);
    }
    return resp.data;
  }

  async verifyPayment(transactionId: string): Promise<TransactionData> {
    const resp = await this.flw.Transaction.verify({ id: transactionId }) as TransactionVerifyResponse;
    if (resp.status !== 'success' || !resp.data) {
      throw new BadRequestException(resp.message);
    }
    return resp.data;
  }

  async validateBillService(billType: string, billerCode: string, customer: string): Promise<ApiResponse<any>> {
    const resp = await this.flw.Bills.validate({ item_code: billType, biller_code: billerCode, customer }) as ApiResponse<any>;
    
    if (resp.status !== 'success' || !resp.data) {
      throw new BadRequestException(resp.message);
    }
    return resp.data;
  }

  async initiateTransfer(payload: TransferData): Promise<TransferDataResponse> {
    const resp = await this.flw.Transfer.initiate(payload) as TransferVerifyResponse;
    if (resp.status !== 'success' || !resp.data) {
      throw new BadRequestException(resp.message);
    }
    return resp.data;
  }

  async createVirtualAccount(input: VirtualAccountData): Promise<VirtualAccountResponse> {
    const resp = await this.flw.VirtualAcct.create({
      ...input,
      is_permanent: true,
      bvn: '12345678901',
      tx_ref: `VA_${Date.now()}`,
      firstname: input.firstName,
      lastname: input.lastName,
      phonenumber: input.phone,
    }) as VirtualAccountCreateResponse;

    if (resp.status !== 'success' || !resp.data) {
      throw new BadRequestException(resp.message);
    }
    return resp.data;
  }

  async payBill(payload: BillPaymentData): Promise<BillPaymentResponse> {
    const resp = await this.flw.Bills.create_bill(payload) as BillPaymentApiResponse;
    if (resp.status !== 'success' || !resp.data) {
      throw new BadRequestException(resp.message);
    }
    return resp.data;
  }

  async getBanks(country = 'NG'): Promise<Bank[]> {
    const resp = await this.flw.Bank.country({ country }) as ApiResponse<Bank[]>;
    if (resp.status !== 'success' || !resp.data) {
      throw new BadRequestException(resp.message);
    }
    return resp.data;
  }

  async resolveAccountNumber(account_number: string, account_bank: string): Promise<VerifyAccountResponse> {
    const resp = await this.flw.Misc.verify_Account({ account_number, account_bank }) as ApiResponse<VerifyAccountResponse>;
    if (resp.status !== 'success' || !resp.data) {
      throw new BadRequestException(resp.message);
    }
    return resp.data;
  }
}


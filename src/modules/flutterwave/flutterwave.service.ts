import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Flutterwave from 'flutterwave-node-v3';
import { 
  ApiResponse, 
  TransactionVerifyResponse,
  BillPaymentApiResponse,
  BillPaymentResponse,
  Biller,
  Transaction,
  Verify,
  FlutterwaveResponse
} from './entities/flutterwave-response.entity';
import {
  TransactionData,
  TransferData,
  VirtualAccountData,
  BillPaymentData
} from './entities/flutterwave-data.entity';

// 2. Categories to group billers
export type Category = 'airtime' | 'data' | 'electricity' | 'internet' | 'tv' | 'betting' | 'others'

// 3. Function to sort billers into categories
export function sortByCategory(billers: Biller[]): Record<Category, Biller[]> {
  const categories: Record<Category, Biller[]> = {
    airtime: [],
    data: [],
    electricity: [],
    internet: [],
    tv: [],
    betting: [],
    others: [],
  }

  for (const biller of billers) {
    if (biller.is_airtime || biller.biller_name.toLowerCase() === 'airtime') {
      categories.airtime.push(biller)
    } else if (biller.biller_name.toLowerCase().includes('data')) {
      categories.data.push(biller)
    } else if (biller.biller_name.toLowerCase().includes('prepaid') || biller.biller_name.toLowerCase().includes('postpaid') || biller.biller_name.toLowerCase().includes('electric')) {
      categories.electricity.push(biller)
    } else if (biller.biller_name.toLowerCase().includes('internet')) {
      categories.internet.push(biller)
    } else if (biller.biller_name.toLowerCase().includes('tv') || biller.biller_name.toLowerCase().includes('dstv') || biller.biller_name.toLowerCase().includes('gotv')) {
      categories.tv.push(biller)
    } else if (biller.biller_name.toLowerCase().includes('bet') || biller.biller_name.toLowerCase().includes('sport')) {
      categories.betting.push(biller)
    } else {
      categories.others.push(biller)
    }
  }

  return categories
}

// 4. Function to get all plans by category
export function getPlansByCategory(billers: Biller[], category: Category): Biller[] {
  const categories = sortByCategory(billers)
  return categories[category] || []
}


@Injectable()
export class FlutterwaveService {
  private flw: InstanceType<typeof Flutterwave>;

  constructor(private configService: ConfigService) {
    this.flw = new Flutterwave(
      configService.get<string>('FLUTTERWAVE_PUBLIC_KEY'),
      configService.get<string>('FLUTTERWAVE_SECRET_KEY'),
    );
  }

  async getBillCategories(category: Category): Promise<Biller[]> {
    const resp = await this.flw.Bills.fetch_bills_Cat() as ApiResponse<Biller[]>;
    
    if (resp.status !== 'success' || !resp.data) {
      throw new BadRequestException(resp.message);
    }

    return getPlansByCategory(resp.data, category);
  }

  async verifyPayment(transactionId: string): Promise<TransactionData> {
    const resp = await this.flw.Transaction.verify({ id: transactionId }) as TransactionVerifyResponse;
    if (resp.status !== 'success' || !resp.data) {
      throw new BadRequestException(resp.message);
    }
    return resp.data;
  }

  async validateBillService(billType: string, billerCode: string, customer: string): Promise<Verify> {
    const resp = await this.flw.Bills.validate({ item_code: billType, code: billerCode, customer }) as ApiResponse<Verify>;
    
    if (resp.status !== 'success' || !resp.data) {
      throw new BadRequestException(resp.message);
    }

    return resp.data;
  }

  async getAccountInfo(): Promise<{ 
    account_number: string; 
    bank_code: string; 
    account_name: string; 
    bank_name: string 
  }> {
    const account_number = this.configService.get('FLUTTER_WAVE_ACCOUNT_NUMBER');
    const account_name = this.configService.get('FUTTER_WAVE_ACCOUNT_NAME');
    const bank_name = this.configService.get('FLUTTER_WAVE_BANK_NAME');
    const bank_code = this.configService.get('FLUTTER_WAVE_BANK_CODE');

    return({ 
      account_number: String(account_number), 
      bank_code: String(bank_code), 
      account_name: String(account_name), 
      bank_name: String(bank_name) 
    })
  }

  async payBill(payload: BillPaymentData): Promise<Transaction> {
    const resp = await this.flw.Bills.create_bill(payload);
    if (resp.status !== 'success' || !resp.data) {
      throw new BadRequestException(resp.message);
    }

    return resp.data;
  }
}
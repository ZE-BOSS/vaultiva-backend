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
  private _flw: InstanceType<typeof Flutterwave> | null = null;

  constructor(private configService: ConfigService) {}

  /**
   * Built on first use, not in the constructor.
   *
   * `new Flutterwave(...)` throws "Public Key required" when the keys are unset.
   * Doing that during construction meant the entire application refused to start
   * without Flutterwave credentials — including flows that never touch payments.
   * Now only the endpoints that actually call out fail, and with a message that
   * says what to configure.
   */
  private get flw(): InstanceType<typeof Flutterwave> {
    if (this._flw) return this._flw;

    const publicKey = this.configService.get<string>('FLUTTERWAVE_PUBLIC_KEY');
    const secretKey = this.configService.get<string>('FLUTTERWAVE_SECRET_KEY');

    if (!publicKey || !secretKey) {
      throw new BadRequestException(
        'Flutterwave is not configured — set FLUTTERWAVE_PUBLIC_KEY and ' +
          'FLUTTERWAVE_SECRET_KEY in .env',
      );
    }

    this._flw = new Flutterwave(publicKey, secretKey);
    return this._flw;
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
    // These were previously read as FLUTTER_WAVE_* / FUTTER_WAVE_* (sic) here while
    // payments.service.ts read the same settlement account as FLUTTERWAVE_*.
    // Whichever set was unset resolved to undefined and, because the values were
    // passed through String(), reached Flutterwave as the literal text "undefined"
    // rather than failing. One spelling now, and it fails fast when unset.
    const account_number = this.configService.get<string>('FLUTTERWAVE_ACCOUNT_NUMBER');
    const account_name = this.configService.get<string>('FLUTTERWAVE_ACCOUNT_NAME');
    const bank_name = this.configService.get<string>('FLUTTERWAVE_BANK_NAME');
    const bank_code = this.configService.get<string>('FLUTTERWAVE_BANK_CODE');

    const missing = Object.entries({
      FLUTTERWAVE_ACCOUNT_NUMBER: account_number,
      FLUTTERWAVE_ACCOUNT_NAME: account_name,
      FLUTTERWAVE_BANK_NAME: bank_name,
      FLUTTERWAVE_BANK_CODE: bank_code,
    })
      .filter(([, v]) => !v)
      .map(([k]) => k);

    if (missing.length) {
      throw new BadRequestException(
        `Flutterwave settlement account is not configured: ${missing.join(', ')}`,
      );
    }

    return { account_number, bank_code, account_name, bank_name };
  }

  async payBill(payload: BillPaymentData): Promise<Transaction> {
    const resp = await this.flw.Bills.create_bill(payload);
    if (resp.status !== 'success' || !resp.data) {
      throw new BadRequestException(resp.message);
    }

    return resp.data;
  }
}
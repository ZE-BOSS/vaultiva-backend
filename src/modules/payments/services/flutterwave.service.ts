import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Flutterwave from 'flutterwave-node-v3';

interface PaymentData {
  amount: number;
  currency: string;
  redirect_url: string;
  customer: {
    email: string;
    phone_number: string;
    name: string;
  };
  tx_ref: string;
  customizations: {
    title: string;
    description: string;
  };
}

interface TransferData {
  account_bank: string;
  account_number: string;
  amount: number;
  narration: string;
  currency: string;
  reference: string;
}

interface VirtualAccountData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
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

@Injectable()
export class FlutterwaveService {
  private flw: any;

  constructor(private configService: ConfigService) {
    this.flw = new Flutterwave(
      this.configService.get('FLUTTERWAVE_PUBLIC_KEY'),
      this.configService.get('FLUTTERWAVE_SECRET_KEY'),
    );
  }

  async initiatePayment(paymentData: PaymentData): Promise<string> {
    try {
      const payload = {
        ...paymentData,
        payment_options: 'card,banktransfer,ussd',
      };

      const response = await this.flw.StandardSubaccount.charge(payload);

      if (response.status !== 'success') {
        throw new BadRequestException(response.message || 'Failed to initiate payment');
      }

      return response.data.link;
    } catch (error) {
      throw new BadRequestException(error.message || 'Payment initiation failed');
    }
  }

  async verifyPayment(transactionId: string): Promise<any> {
    try {
      const response = await this.flw.Transaction.verify({ id: transactionId });

      if (response.status !== 'success') {
        throw new BadRequestException('Failed to verify payment');
      }

      return response.data;
    } catch (error) {
      throw new BadRequestException(error.message || 'Payment verification failed');
    }
  }

  async initiateTransfer(transferData: TransferData): Promise<any> {
    try {
      const response = await this.flw.Transfer.initiate(transferData);

      if (response.status !== 'success') {
        throw new BadRequestException(response.message || 'Transfer initiation failed');
      }

      return response.data;
    } catch (error) {
      throw new BadRequestException(error.message || 'Transfer failed');
    }
  }

  async createVirtualAccount(accountData: VirtualAccountData): Promise<any> {
    try {
      const payload = {
        email: accountData.email,
        is_permanent: true,
        bvn: '12345678901', // You should collect this from user
        tx_ref: `VA_${Date.now()}`,
        firstname: accountData.firstName,
        lastname: accountData.lastName,
        phonenumber: accountData.phone,
        narration: accountData.narration,
      };

      const response = await this.flw.VirtualAcct.create(payload);

      if (response.status !== 'success') {
        throw new BadRequestException(response.message || 'Virtual account creation failed');
      }

      return response.data;
    } catch (error) {
      throw new BadRequestException(error.message || 'Virtual account creation failed');
    }
  }

  async getBillCategories(): Promise<any> {
    try {
      const response = await this.flw.Bills.fetch_bills();

      if (response.status !== 'success') {
        throw new BadRequestException('Failed to fetch bill categories');
      }

      return response.data;
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to fetch bill categories');
    }
  }

  async validateBillService(itemCode: string, billerCode: string, customer: string): Promise<any> {
    try {
      const response = await this.flw.Bills.validate({
        item_code: itemCode,
        biller_code: billerCode,
        customer,
      });

      return response;
    } catch (error) {
      throw new BadRequestException(error.message || 'Bill validation failed');
    }
  }

  async payBill(billData: BillPaymentData): Promise<any> {
    try {
      const response = await this.flw.Bills.create_bill(billData);

      if (response.status !== 'success') {
        throw new BadRequestException(response.message || 'Bill payment failed');
      }

      return response.data;
    } catch (error) {
      throw new BadRequestException(error.message || 'Bill payment failed');
    }
  }

  async getBanks(country = 'NG'): Promise<any> {
    try {
      const response = await this.flw.Bank.country({ country });

      if (response.status !== 'success') {
        throw new BadRequestException('Failed to fetch banks');
      }

      return response.data;
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to fetch banks');
    }
  }

  async resolveAccountNumber(accountNumber: string, bankCode: string): Promise<any> {
    try {
      const response = await this.flw.Misc.verify_Account({
        account_number: accountNumber,
        account_bank: bankCode,
      });

      if (response.status !== 'success') {
        throw new BadRequestException('Account verification failed');
      }

      return response.data;
    } catch (error) {
      throw new BadRequestException(error.message || 'Account verification failed');
    }
  }
}
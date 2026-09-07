import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  IsOptional,
  Min,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TransferType } from '../entities/transfer.entity';

/** Either side of a transfer: a wallet, or a bank account. */
export interface TransferPartyDetails {
  walletId?: string;
  accountNumber?: string;
  bankCode?: string;
  bankName?: string;
  accountName?: string;
  [key: string]: unknown;
}

export class CreateTransferDto {
  @ApiProperty({ minimum: 100 })
  @IsNumber()
  @Min(100)
  amount: number;

  @ApiProperty({ enum: TransferType })
  @IsEnum(TransferType)
  type: TransferType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsUUID()
  @IsOptional()
  sourceWalletId?: string;

  @ApiProperty()
  @IsUUID()
  @IsOptional()
  destinationWalletId?: string;

  /**
   * These carried no class-validator decorator, so the global ValidationPipe's
   * `whitelist` stripped them and `forbidNonWhitelisted` then rejected the whole
   * request with "property sourceDetails should not exist" — every transfer
   * failed with a 400 regardless of payload.
   */
  @ApiProperty({ type: Object })
  @IsObject()
  sourceDetails: TransferPartyDetails;

  @ApiProperty({ type: Object })
  @IsObject()
  destinationDetails: TransferPartyDetails;

  @ApiProperty({ required: false })
  @IsOptional()
  metadata?: any;
}
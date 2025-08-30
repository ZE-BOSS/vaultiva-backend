import { IsEnum, IsNotEmpty, IsNumber, IsString, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SharedTransactionType } from '../entities/shared-wallet-transaction.entity';

export class CreateSharedWalletTransactionDto {
  @ApiProperty({ minimum: 100 })
  @IsNumber()
  @Min(100)
  amount: number;

  @ApiProperty({ enum: SharedTransactionType })
  @IsEnum(SharedTransactionType)
  type: SharedTransactionType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  metadata?: any;
}
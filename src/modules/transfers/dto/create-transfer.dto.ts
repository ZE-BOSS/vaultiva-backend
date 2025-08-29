import { IsEnum, IsNotEmpty, IsNumber, IsString, IsOptional, Min, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TransferType } from '../entities/transfer.entity';

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

  @ApiProperty({ type: Object })
  sourceDetails: any;

  @ApiProperty({ type: Object })
  destinationDetails: any;

  @ApiProperty({ required: false })
  @IsOptional()
  metadata?: any;
}
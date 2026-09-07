import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsArray,
  IsObject,
  IsOptional,
  IsUUID,
  Min,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SplitType, SplitFrequency } from '../entities/bill-split.entity';
import { ParticipantRole } from '../entities/bill-split-participant.entity';

export class CreateBillSplitDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ minimum: 100 })
  @IsNumber()
  @Min(100)
  totalAmount: number;

  @ApiProperty({ enum: SplitType })
  @IsEnum(SplitType)
  type: SplitType;

  @ApiProperty({ enum: SplitFrequency })
  @IsEnum(SplitFrequency)
  frequency: SplitFrequency;

  /**
   * Wallet the split settles into. `bill_splits.walletId` is NOT NULL, but this
   * field was missing from the DTO, so every create failed with a Postgres
   * not-null violation surfaced as an opaque 500.
   */
  @ApiProperty()
  @IsUUID()
  walletId: string;

  @ApiProperty({ type: [Object] })
  @IsArray()
  participants: Array<{
    userId: string;
    walletId: string;
    role: ParticipantRole;
    amount: number;
  }>;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  nextExecutionDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  schedule?: any;

  @ApiProperty({ required: false })
  @IsOptional()
  metadata?: any;
}
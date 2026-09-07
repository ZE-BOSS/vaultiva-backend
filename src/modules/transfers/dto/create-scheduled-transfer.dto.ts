import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  IsOptional,
  Min,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ScheduleFrequency } from '../entities/scheduled-transfer.entity';

export class CreateScheduledTransferDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ minimum: 100 })
  @IsNumber()
  @Min(100)
  amount: number;

  @ApiProperty({ enum: ScheduleFrequency })
  @IsEnum(ScheduleFrequency)
  frequency: ScheduleFrequency;

  @ApiProperty()
  @IsDateString()
  nextExecutionDate: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  maxExecutions?: number;

  // Same whitelist trap as CreateTransferDto: without a validator this property
  // is stripped and then rejected as unknown.
  @ApiProperty({ type: Object })
  @IsObject()
  transferTemplate: Record<string, unknown>;

  @ApiProperty({ required: false })
  @IsOptional()
  metadata?: any;
}
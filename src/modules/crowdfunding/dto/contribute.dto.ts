import { IsNotEmpty, IsNumber, IsString, IsOptional, Min, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ContributeDto {
  @ApiProperty({ minimum: 100 })
  @IsNumber()
  @Min(100)
  amount: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean;
}
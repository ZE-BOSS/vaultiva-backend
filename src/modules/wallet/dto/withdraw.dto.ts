import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WithdrawDto {
  @ApiProperty({ example: 1000, minimum: 100 })
  @IsNumber()
  @IsNotEmpty()
  @Min(100)
  amount: number;

  @ApiProperty({ example: '044' })
  @IsString()
  @IsNotEmpty()
  bankCode?: string;

  @ApiProperty({ example: '1234567890' })
  @IsString()
  @IsNotEmpty()
  accountNumber?: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  accountName?: string;
}
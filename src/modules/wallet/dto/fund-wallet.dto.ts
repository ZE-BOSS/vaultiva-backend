import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FundWalletDto {
  @ApiProperty({ example: 1000, minimum: 100 })
  @IsNumber()
  @IsNotEmpty()
  @Min(100)
  amount: number;
}
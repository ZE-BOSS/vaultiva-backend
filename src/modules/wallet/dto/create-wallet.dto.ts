import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { WalletType } from '../entities/wallet.entity';

export class CreateWalletDto {
  @ApiProperty({ enum: WalletType, default: WalletType.MAIN })
  @IsEnum(WalletType)
  @IsOptional()
  type?: WalletType;

  @ApiProperty({ default: 'NGN' })
  @IsString()
  @IsOptional()
  currency?: string;
}
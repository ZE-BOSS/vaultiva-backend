import { IsEnum, IsNotEmpty, IsNumber, IsString, IsArray, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SharedWalletMode } from '../entities/shared-wallet.entity';
import { MemberRole } from '../entities/shared-wallet-member.entity';

export class CreateSharedWalletDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: SharedWalletMode })
  @IsEnum(SharedWalletMode)
  mode: SharedWalletMode;

  @ApiProperty({ minimum: 1 })
  @IsNumber()
  @Min(1)
  requiredSignatures: number;

  @ApiProperty({ type: [Object] })
  @IsArray()
  members: Array<{
    userId: string;
    role: MemberRole;
    spendingLimit?: number;
    permissions?: string[];
  }>;

  @ApiProperty({ required: false })
  @IsOptional()
  rules?: any;

  @ApiProperty({ required: false })
  @IsOptional()
  metadata?: any;
}
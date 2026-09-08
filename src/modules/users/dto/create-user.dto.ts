import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsPhoneNumber,
  ValidateIf,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { normaliseNigerianPhone } from '../../common/transforms/phone.transform';
import { VerificationCode } from '../entities/user.entity';

export class CreateUserDto {
  @ApiPropertyOptional({ example: 'user@example.com' })
  @ValidateIf((o) => !o.phone)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty({ message: 'Email is required if phone number is not provided' })
  email?: string;

  @ApiPropertyOptional({ example: '+2348123456789', description: 'Accepts 08123456789 too' })
  @ValidateIf((o) => !o.email)
  // Runs before validation, so a number typed the way Nigerians actually write
  // it (08123456789) is accepted rather than rejected as invalid.
  @Transform(({ value }) => normaliseNigerianPhone(value))
  @IsPhoneNumber(undefined, { message: 'Invalid phone number' })
  @IsNotEmpty({ message: 'Phone number is required if email is not provided' })
  phone?: string;
}

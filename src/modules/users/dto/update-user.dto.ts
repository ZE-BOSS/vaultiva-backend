import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsBoolean } from 'class-validator';
import {
  IsEmail,
  IsString,
  MinLength,
  IsPhoneNumber,
  ValidateIf,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VerificationCode } from '../entities/user.entity';

export class UpdateUserDto {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ example: 'user@example.com' })
  @IsEmail({}, { message: 'Invalid email address' })
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: '+2348123456789' })
  @IsPhoneNumber(undefined, { message: 'Invalid phone number' })
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: '[{ id: "random_string", category: "create-account", code: "123456", expires: "expiration_date" }]' })
  @IsOptional()
  codes: VerificationCode[];

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsOptional()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password?: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsOptional()
  lastName?: string;

  @IsOptional()
  @IsBoolean()
  isEmailVerified?: boolean;

  @IsOptional()
  @IsBoolean()
  isPhoneVerified?: boolean;
}
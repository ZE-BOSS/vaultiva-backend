import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsPhoneNumber,
  ValidateIf,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VerificationCode } from '../entities/user.entity';

export class CreateUserDto {
  @ApiPropertyOptional({ example: 'user@example.com' })
  @ValidateIf((o) => !o.phone)
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty({ message: 'Email is required if phone number is not provided' })
  email?: string;

  @ApiPropertyOptional({ example: '+2348123456789' })
  @ValidateIf((o) => !o.email)
  @IsPhoneNumber(undefined, { message: 'Invalid phone number' })
  @IsNotEmpty({ message: 'Phone number is required if email is not provided' })
  phone?: string;

  @ApiPropertyOptional({ example: '[{ id: "random_string", category: "create-account", code: "123456", expires: "expiration_date" }]' })
  @IsOptional()
  codes: VerificationCode[];
}

import { IsNotEmpty, IsString } from 'class-validator';

export class BiometricLoginDto {
  @IsNotEmpty()
  @IsString()
  identifier: string; // email or phone

  @IsNotEmpty()
  @IsString()
  challenge: string; // random challenge sent from server

  @IsNotEmpty()
  @IsString()
  signature: string; // signed challenge by device biometrics
}

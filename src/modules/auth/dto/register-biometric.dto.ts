import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterBiometricDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  publicKey: string; // Device biometrics public key (e.g., RSA/ECDSA)
}

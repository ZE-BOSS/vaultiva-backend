import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum KycDocumentType {
  NIN = 'nin',
  VOTERS_CARD = 'voters_card',
  PASSPORT = 'passport',
  DRIVERS_LICENSE = 'drivers_license',
}

export class UploadKycDto {
  @IsEnum(KycDocumentType)
  @IsNotEmpty()
  documentType: KycDocumentType;

  @IsString()
  @IsNotEmpty()
  documentFile: string; // base64 or file path
}

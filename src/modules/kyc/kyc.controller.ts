import { Controller, Post, Body, Param } from '@nestjs/common';
import { KycService } from './kyc.service';
import { UploadKycDto } from './dto/upload-kyc.dto';

@Controller('kyc')
export class KycController {
  constructor(private readonly kycService: KycService) {}

  @Post(':userId/upload')
  async uploadDocument(
    @Param('userId') userId: string,
    @Body() dto: UploadKycDto,
  ) {
    return this.kycService.verifyAndUploadDocument(userId, dto);
  }
}

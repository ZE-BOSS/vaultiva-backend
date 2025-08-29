import { Injectable, BadRequestException } from '@nestjs/common';
import { UploadKycDto } from './dto/upload-kyc.dto';
import { UsersService } from '../users/users.service';
import axios from 'axios';
import { KYCStatus } from '../users/entities/user.entity';

@Injectable()
export class KycService {
  constructor(private readonly usersService: UsersService) {}

  async verifyAndUploadDocument(userId: string, dto: UploadKycDto) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new BadRequestException('User not found');

    try {
      // Example Sumsub upload flow
      const response = await axios.post(
        'https://api.sumsub.com/resources/applicants',
        {
          externalUserId: user.id,
          fixedInfo: {
            documentType: dto.documentType,
          },
        },
        {
          headers: {
            'X-App-Token': process.env.SUMSUB_APP_TOKEN,
            'X-App-Secret': process.env.SUMSUB_SECRET_KEY,
          },
        },
      );

      // You’ll likely need to upload the actual document file in a second step
      await axios.post(
        `https://api.sumsub.com/resources/applicants/${response.data.id}/info/idDoc`,
        {
          file: dto.documentFile,
          type: dto.documentType,
        },
        {
          headers: {
            'X-App-Token': process.env.SUMSUB_APP_TOKEN,
            'X-App-Secret': process.env.SUMSUB_SECRET_KEY,
          },
        },
      );

      // Update user KYC status
      await this.usersService.updateUser(user.id, {
        kycStatus: KYCStatus.PENDING,
      });

      return {
        message: 'KYC document uploaded successfully',
        applicantId: response.data.id,
        status: 'pending',
      };
    } catch (err) {
      throw new BadRequestException(err.response?.data || 'KYC upload failed');
    }
  }
}

import { Module } from '@nestjs/common';
import { KycService } from './kyc.service';
import { HttpModule } from '@nestjs/axios';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [HttpModule, UsersModule],
  providers: [KycService],
  exports: [KycService],
})
export class KycModule {}

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { LocalAuthGuard } from '../common/guards/local-auth.guard';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    NotificationsModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN', '7d'),
        },
      }),
    })
  ],
  providers: [AuthService, JwtStrategy, LocalStrategy, LocalAuthGuard],
  controllers: [AuthController],
  exports: [AuthService, LocalAuthGuard],
})
export class AuthModule {} 
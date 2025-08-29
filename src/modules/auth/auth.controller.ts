import { 
  Controller, 
  Post, 
  Body, 
  UseGuards, 
  Request, 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from '../common/guards/local-auth.guard';
import { User } from '../users/entities/user.entity';
import { BiometricLoginDto } from './dto/biometric-login.dto';
import { RegisterBiometricDto } from './dto/register-biometric.dto';

@ApiTags('Authentication')
@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'Verification code sent' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('resend-code')
  @ApiOperation({ summary: 'Resend verification code' })
  async resendCode(@Body() createUserDto: CreateUserDto) {
    return this.authService.resendCode(createUserDto);
  }

  @Post('verify-code')
  @ApiOperation({ summary: 'Verify code sent to email or phone' })
  async verifyCode(@Body() body: { contact: string; code: string }) {
    return this.authService.verifyCode(body.contact, body.code);
  }

  @Post('complete-profile')
  @ApiOperation({ summary: 'Complete user profile and create wallets' })
  async completeProfile(@Body() body: { contact: string; data: Partial<User> }) {
    return this.authService.completeProfile(body.contact, body.data);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'User successfully logged in' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto, @Request() req) {
    return this.authService.login(loginDto);
  }

  @Post('initiate-reset-pin')
  @ApiOperation({ summary: 'Send verification code for resetting PIN' })
  async initiateResetPin(@Body() body: { identifier: string }) {
    return this.authService.initiateResetPin(body.identifier);
  }

  @Post('reset-pin')
  @ApiOperation({ summary: 'Reset PIN with verification code' })
  async resetPin(@Body() body: { identifier: string; code: string; pin: string }) {
    return this.authService.resetPin(body.identifier, body.code, body.pin);
  }

  @Post('initiate-reset-password')
  @ApiOperation({ summary: 'Send verification code for resetting password' })
  async initiateResetPassword(@Body() body: { identifier: string }) {
    return this.authService.initiateResetPassword(body.identifier);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password with verification code' })
  async resetPassword(@Body() body: { identifier: string; code: string; newPassword: string }) {
    return this.authService.resetPassword(body.identifier, body.code, body.newPassword);
  }

  @Post('set-pin')
  @ApiOperation({ summary: 'Set transaction PIN' })
  async setPin(@Body() body: { userId: string; pin: string }) {
    return this.authService.setPin(body.userId, body.pin);
  }

  @Post('verify-pin')
  @ApiOperation({ summary: 'Verify transaction PIN' })
  async verifyPin(@Body() body: { userId: string; pin: string }) {
    return this.authService.verifyPin(body.userId, body.pin);
  }

  @Post('verify-token')
  @ApiOperation({ summary: 'Verify JWT token' })
  async verifyToken(@Body() body: { token: string }) {
    return this.authService.verifyToken(body.token);
  }

  @Post('register-biometric')
  @ApiOperation({ summary: 'Register Biometric' })
  async registerBiometric(@Body() dto: RegisterBiometricDto) {
    return this.authService.registerBiometricDevice(dto);
  }

  @Post('biometric-login')
  @ApiOperation({ summary: 'Biometric Login' })
  async biometricLogin(@Body() dto: BiometricLoginDto) {
    return this.authService.biometricLogin(dto);
  }

  @Post('update-password')
  @ApiOperation({ summary: 'Update password (only if not already set)' })
  async updatePassword(@Body() body: { userId: string; newPassword: string }) {
    return this.authService.updatePassword(body.userId, body.newPassword);
  }

  @Post('onboarding-status')
  @ApiOperation({ summary: 'Get user onboarding status' })
  async getOnboardingStatus(@Body() body: { userId: string }) {
    return this.authService.getOnboardingStatus(body.userId);
  }

  @Post('admin-login')
  @ApiOperation({ summary: 'Login as admin' })
  @ApiResponse({ status: 200, description: 'Admin successfully logged in' })
  @ApiResponse({ status: 401, description: 'Invalid admin credentials' })
  async adminLogin(@Body() body: { email: string; password: string }) {
    return this.authService.adminLogin(body.email, body.password);
  }
}

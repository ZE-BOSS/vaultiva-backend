import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/entities/user.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { XpressWalletSDK } from '../xpress-wallet';
import { ConfigService } from '@nestjs/config';
import { WalletService } from '../wallet/wallet.service';
import { WalletType } from '../wallet/entities/wallet.entity';
import * as crypto from 'crypto';
import { BiometricLoginDto } from './dto/biometric-login.dto';
import { RegisterBiometricDto } from './dto/register-biometric.dto';

@Injectable()
export class AuthService {
  private readonly xpressService: XpressWalletSDK;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly sendCodeService: NotificationsService,
    private readonly config: ConfigService,
    private readonly walletService: WalletService,
  ) {
    this.xpressService = new XpressWalletSDK({
      xpressEmail: this.config.get<string>('XPRESS_EMAIL'),
      xpressPassword: this.config.get<string>('XPRESS_PASSWORD'),
      baseUrl: this.config.get<string>('XPRESS_BASEURL'),
    });
  }

  async register(createUserDto: CreateUserDto) {
    const { email, phone } = createUserDto;
    const existingUser = await this.usersService.findByEmailOrPhone(email, phone);

    if (existingUser) {
      throw new ConflictException('User with this email or phone already exists');
    }

    const contact = email || phone;
    const type = this.getContactType(contact);
    const code = this.generateCode();

    await this.sendCodeService.sendVerificationCode(contact, "", code, type);
    await this.usersService.storeVerificationCode(contact, type, 'register', code);

    return { message: 'Verification code sent' };
  }

  async registerBiometricDevice(dto: RegisterBiometricDto) {
    const user = await this.usersService.findById(dto.userId);
    if (!user) throw new NotFoundException('User not found');

    return this.usersService.updateUser(user.id, {
      biometricPublicKey: dto.publicKey,
    });
  }

  async biometricLogin(dto: BiometricLoginDto) {
    const user = await this.usersService.findByEmailOrPhone(dto.identifier, dto.identifier);
    if (!user) throw new UnauthorizedException('Invalid identifier');

    if (!user.biometricPublicKey) {
      throw new BadRequestException('Biometrics not registered for this user');
    }

    // Verify signature with stored public key
    const verifier = crypto.createVerify('SHA256');
    verifier.update(dto.challenge);
    verifier.end();

    const isValid = verifier.verify(user.biometricPublicKey, dto.signature, 'base64');
    if (!isValid) {
      throw new UnauthorizedException('Invalid biometric signature');
    }

    const token = this.generateToken(user);
    const { password, pin, ...result } = user;

    return { user: result, token };
  }

  async resendCode(createUserDto: CreateUserDto) {
    const { email, phone } = createUserDto;
    const contact = email || phone;
    const type = this.getContactType(contact);

    const user = await this.usersService.findByEmailOrPhone(email, phone);
    if (!user) throw new NotFoundException('User with this email or phone does not exist');

    const code = this.generateCode();
    await this.sendCodeService.sendVerificationCode(contact, user.firstName? user.firstName : "", code, type);
    await this.usersService.storeVerificationCode(contact, type, 'resend', code);

    return { message: 'Verification code sent' };
  }

  async verifyCode(contact: string, code: string) {
    const type = this.getContactType(contact);
    const isValid = await this.usersService.verifyCode(contact, type, code);

    if (isValid === null) throw new BadRequestException('Verification code expired');
    if (!isValid) throw new BadRequestException('Invalid verification code');

    return { message: 'Verification successful' };
  }

  async completeProfile(contact: string, data: Partial<User>) {
    const user = await this.usersService.findByEmailOrPhone(contact, contact);
    if (!user) throw new NotFoundException('User not found');

    // Step 2: Create Wallet on XpressWallet
    const walletResult = await this.xpressService.wallet.createCustomerWallet({
      bvn: String(data.bvn),
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth,
      phoneNumber: data.phone,
      email: data.email,
      address: data.address || ''
    });

    // Step 3: Create System Wallets in DB
    const wallets = [
      { name: "Main Wallet", type: WalletType.MAIN },
      { name: "Escrow Wallet", type: WalletType.ESCROW },
      { name: "Airtime Wallet", type: WalletType.BILL_PAYMENT },
      { name: "Data Wallet", type: WalletType.BILL_PAYMENT },
      { name: "Electricity Wallet", type: WalletType.BILL_PAYMENT },
      { name: "TV Wallet", type: WalletType.BILL_PAYMENT },
      { name: "Internet Wallet", type: WalletType.BILL_PAYMENT },
      { name: "Betting Wallet", type: WalletType.BILL_PAYMENT },
    ];

    await Promise.all(
      wallets.map((wallet) =>
        this.walletService.createWallet(user.id, { name: wallet.name, type: wallet.type, customerId: walletResult.customer.id })
      )
    );

    // Step 4: Update user profile
    return this.usersService.updateUser(user.id, {
      ...data,
      accountName: walletResult.wallet.accountName,
      accountNumber: Number(walletResult.wallet.accountNumber),
      bank: walletResult.wallet.bankName,
    });
  }

  async updatePassword(userId: string, newPassword: string) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    if (user.password) throw new BadRequestException('Password already set');

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    return this.usersService.updateUser(userId, { password: hashedPassword });
  }

  async getOnboardingStatus(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    return {
      emailVerified: !!user.email && user.isEmailVerified,
      phoneVerified: !!user.phone && user.isPhoneVerified,
      profileCompleted: !!user.firstName && !!user.lastName && !!user.bvn,
      walletCreated: !!user.accountNumber,
      passwordSet: !!user.password,
    };
  }

  async adminLogin(email: string, password: string) {
    const admin = await this.usersService.findByEmail(email);
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      throw new UnauthorizedException('Invalid admin credentials');
    }
    return { token: this.generateToken(admin) };
  }

  async login({ identifier, password }: LoginDto) {
    const user = await this.usersService.findByEmailOrPhone(identifier, identifier);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(user);
    const { password: _, ...result } = user;
    return { user: result, token };
  }

  async validateUser(identifier: string, password: string): Promise<Partial<User> | null> {
    const user = await this.usersService.findByEmailOrPhone(identifier, identifier);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password: _, ...result } = user;
      
      return result;
    }

    return null;
  }

  async initiateResetPin(identifier: string) {
    const type = this.getContactType(identifier);
    const user = await this.usersService.findByEmailOrPhone(identifier, identifier);
    if (!user) throw new NotFoundException('User not found');

    const code = this.generateCode();
    await this.usersService.storeVerificationCode(identifier, type, 'reset-pin', code);
    await this.sendCodeService.sendVerificationCode(identifier, user.firstName? user.firstName : "", code, type);

    return { message: 'Verification code sent' };
  }

  async resetPin(identifier: string, code: string, pin: string) {
    const type = this.getContactType(identifier);
    const isValid = await this.usersService.verifyCode(identifier, type, code);

    if (!isValid) throw new BadRequestException('Invalid or expired verification code');

    const user = await this.usersService.findByEmailOrPhone(identifier, identifier);
    if (!user) throw new NotFoundException('User not found');

    return this.updatePin(user.id, pin);
  }

  async initiateResetPassword(identifier: string) {
    const type = this.getContactType(identifier);
    const user = await this.usersService.findByEmailOrPhone(identifier, identifier);
    if (!user) throw new NotFoundException('User not found');

    const code = this.generateCode();
    await this.usersService.storeVerificationCode(identifier, type, 'reset-password', code);
    await this.sendCodeService.sendVerificationCode(identifier, user.firstName? user.firstName : "", code, type);

    return { message: 'Verification code sent' };
  }

  async resetPassword(identifier: string, code: string, newPassword: string) {
    const type = this.getContactType(identifier);
    const isValid = await this.usersService.verifyCode(identifier, type, code);

    if (!isValid) throw new BadRequestException('Invalid or expired verification code');

    const user = await this.usersService.findByEmailOrPhone(identifier, identifier);
    if (!user) throw new NotFoundException('User not found');

    return this.updatePassword(user.id, newPassword);
  }

  async setPin(userId: string, pin: string) {
    const hashedPin = await bcrypt.hash(pin, 10);
    return this.usersService.updateUser(userId, { pin: hashedPin });
  }

  async verifyPin(userId: string, pin: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.pin || !(await bcrypt.compare(pin, user.pin))) {
      throw new UnauthorizedException('Invalid pin');
    }
    return { message: 'Pin verified' };
  }

  async updatePin(userId: string, newPin: string) {
    return this.setPin(userId, newPin);
  }

  private generateToken(user: User): string {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return this.jwtService.sign(payload);
  }

  private generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async verifyToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private getContactType(identifier: string): 'email' | 'phone' {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(identifier) ? 'email' : 'phone';
  }
}

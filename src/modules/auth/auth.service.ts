import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { createVerify, randomInt } from 'crypto';

import { User, Role, KYCStatus } from '../users/entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { BiometricLoginDto } from './dto/biometric-login.dto';
import { RegisterBiometricDto } from './dto/register-biometric.dto';
import { UsersService } from '../users/users.service';
import { NotificationsService } from '../notifications/notifications.service';
import { WalletService } from '../wallet/wallet.service';
import { WalletType } from '../wallet/entities/wallet.entity';

export interface LoginResponse {
  access_token: string;
  user: Partial<User>;
}

/** Verification codes are scoped so a signup code cannot be replayed to reset a PIN. */
export const CodeCategory = {
  SIGNUP: 'signup',
  RESET_PASSWORD: 'reset-password',
  RESET_PIN: 'reset-pin',
} as const;
type CodeCategory = (typeof CodeCategory)[keyof typeof CodeCategory];

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly notificationsService: NotificationsService,
    private readonly walletService: WalletService,
  ) {}

  // ── helpers ────────────────────────────────────────────────────────────────

  /** Registration accepts either an email or a phone number, so infer which. */
  private channelOf(identifier: string): 'email' | 'phone' {
    return identifier.includes('@') ? 'email' : 'phone';
  }

  private async findByIdentifier(identifier: string): Promise<User | null> {
    return this.channelOf(identifier) === 'email'
      ? this.userRepository.findOneBy({ email: identifier })
      : this.userRepository.findOneBy({ phone: identifier });
  }

  private generateCode(): string {
    return randomInt(0, 1_000_000).toString().padStart(6, '0');
  }

  private sign(user: User): string {
    return this.jwtService.sign({ sub: user.id, email: user.email, role: user.role });
  }

  /** Strip everything the client must never receive. */
  private sanitise(user: User): Partial<User> {
    const { password, pin, codes, biometricPublicKey, ...safe } = user;
    return safe;
  }

  /**
   * Validate a code and consume it.
   *
   * `UsersService.verifyCode` ignores the category and leaves the code on the
   * record, so a single code could be replayed indefinitely and across flows.
   * This checks the category, checks expiry, and deletes the code on success.
   */
  private async consumeCode(
    identifier: string,
    category: CodeCategory,
    code: string,
  ): Promise<User> {
    const user = await this.findByIdentifier(identifier);
    if (!user) throw new NotFoundException('No account found for that contact');

    const match = (user.codes ?? []).find(
      (c) => c.code === code && c.category === category,
    );
    if (!match) throw new BadRequestException('Invalid verification code');
    if (new Date(match.expires) < new Date()) {
      throw new BadRequestException('Verification code has expired');
    }

    await this.userRepository.update(user.id, {
      codes: (user.codes ?? []).filter((c) => c.id !== match.id),
    });
    return user;
  }

  private async issueCode(
    identifier: string,
    category: CodeCategory,
    name = '',
  ): Promise<void> {
    const channel = this.channelOf(identifier);
    const code = this.generateCode();

    // The code is stored first, so it stays valid even if delivery fails.
    await this.usersService.storeVerificationCode(identifier, channel, category, code);

    try {
      await this.notificationsService.sendVerificationCode(identifier, name, code, channel);
    } catch (error) {
      // Delivery depends on ZeptoMail / Termii being configured. A provider
      // outage or missing key must not fail the request or, worse, escape as an
      // unhandled rejection — the user can ask for the code again.
      this.logger.error(
        `Could not deliver the ${category} code to ${identifier} over ${channel}: ` +
          `${(error as Error).message}`,
      );
    }
  }

  // ── registration ───────────────────────────────────────────────────────────

  async register(createUserDto: CreateUserDto) {
    const identifier = createUserDto.email ?? createUserDto.phone;
    if (!identifier) {
      throw new BadRequestException('An email address or phone number is required');
    }

    const existing = await this.findByIdentifier(identifier);
    // A record with no password is an abandoned signup, not a registered account,
    // so it can be resumed rather than blocking the address forever.
    if (existing?.password) {
      throw new ConflictException('An account with those details already exists');
    }

    await this.issueCode(identifier, CodeCategory.SIGNUP);
    return {
      message: `Verification code sent to ${identifier}`,
      contact: identifier,
    };
  }

  async resendCode(createUserDto: CreateUserDto) {
    const identifier = createUserDto.email ?? createUserDto.phone;
    if (!identifier) {
      throw new BadRequestException('An email address or phone number is required');
    }
    await this.issueCode(identifier, CodeCategory.SIGNUP);
    return { message: `Verification code resent to ${identifier}`, contact: identifier };
  }

  async verifyCode(contact: string, code: string) {
    const user = await this.consumeCode(contact, CodeCategory.SIGNUP, code);

    await this.userRepository.update(user.id, {
      ...(this.channelOf(contact) === 'email'
        ? { isEmailVerified: true }
        : { isPhoneVerified: true }),
    });

    return { verified: true, userId: user.id, contact };
  }

  /**
   * Second half of signup: name, password, profile fields, and the user's first
   * wallet. Returns a token so the client can continue straight into the app.
   */
  async completeProfile(contact: string, data: Partial<User>): Promise<LoginResponse> {
    const user = await this.findByIdentifier(contact);
    if (!user) throw new NotFoundException('No account found for that contact');

    if (!user.isEmailVerified && !user.isPhoneVerified) {
      throw new BadRequestException('Verify your contact details before continuing');
    }

    const { id, role, codes, isEmailVerified, isPhoneVerified, ...safeData } = data;

    const patch: Partial<User> = { ...safeData };
    if (data.password) patch.password = await bcrypt.hash(data.password, 12);
    if (data.pin) patch.pin = await bcrypt.hash(data.pin, 12);

    await this.userRepository.update(user.id, patch);
    const updated = await this.usersService.findById(user.id);

    // First wallet. Failing here must not lose the completed profile, so it is
    // logged rather than thrown — the client can retry wallet creation.
    try {
      const existing = await this.walletService.findUserWalletByType(
        updated.id,
        WalletType.MAIN,
      );
      if (!existing) {
        await this.walletService.createWallet(updated.id, {
          type: WalletType.MAIN,
          name: 'Main Wallet',
          customerId: updated.id,
          currency: 'NGN',
        });
      }
    } catch (error) {
      this.logger.error(`Wallet creation failed for user ${updated.id}`, error as Error);
    }

    return { access_token: this.sign(updated), user: this.sanitise(updated) };
  }

  // ── login ──────────────────────────────────────────────────────────────────

  async validateUser(identifier: string, password: string): Promise<User | null> {
    try {
      const user = await this.findByIdentifier(identifier);
      if (!user?.password) return null;
      return (await bcrypt.compare(password, user.password)) ? user : null;
    } catch (error) {
      this.logger.error('Error validating user', error as Error);
      return null;
    }
  }

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const user = await this.validateUser(loginDto.identifier, loginDto.password);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    if (!user.isActive) throw new UnauthorizedException('This account is disabled');

    await this.usersService.updateLastLogin(user.id);
    return { access_token: this.sign(user), user: this.sanitise(user) };
  }

  async adminLogin(email: string, password: string): Promise<LoginResponse> {
    const user = await this.validateUser(email, password);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    if (user.role !== Role.ADMIN && user.role !== Role.SUPER_ADMIN) {
      throw new UnauthorizedException('This account is not an administrator');
    }

    await this.usersService.updateLastLogin(user.id);
    return { access_token: this.sign(user), user: this.sanitise(user) };
  }

  async verifyToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.usersService.findById(payload.sub);
      return { valid: true, user: this.sanitise(user) };
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  // ── password ───────────────────────────────────────────────────────────────

  async initiateResetPassword(identifier: string) {
    const user = await this.findByIdentifier(identifier);
    // Do not disclose whether the account exists.
    if (user) {
      await this.issueCode(identifier, CodeCategory.RESET_PASSWORD, user.firstName ?? '');
    }
    return { message: `If that account exists, a reset code has been sent` };
  }

  async resetPassword(identifier: string, code: string, newPassword: string) {
    const user = await this.consumeCode(identifier, CodeCategory.RESET_PASSWORD, code);
    await this.userRepository.update(user.id, {
      password: await bcrypt.hash(newPassword, 12),
    });
    return { message: 'Password updated' };
  }

  /** Used during onboarding, where no password has been set yet. */
  async updatePassword(userId: string, newPassword: string) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    if (user.password) {
      throw new BadRequestException(
        'A password is already set — use the reset-password flow instead',
      );
    }

    await this.userRepository.update(userId, {
      password: await bcrypt.hash(newPassword, 12),
    });
    return { message: 'Password set' };
  }

  // ── transaction PIN ────────────────────────────────────────────────────────

  async setPin(userId: string, pin: string) {
    if (!/^\d{4,6}$/.test(pin)) {
      throw new BadRequestException('PIN must be 4 to 6 digits');
    }
    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    await this.userRepository.update(userId, { pin: await bcrypt.hash(pin, 12) });
    return { message: 'PIN set' };
  }

  async verifyPin(userId: string, pin: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'pin'],
    });
    if (!user?.pin) throw new BadRequestException('No PIN has been set');

    const valid = await bcrypt.compare(pin, user.pin);
    if (!valid) throw new UnauthorizedException('Incorrect PIN');
    return { valid: true };
  }

  async initiateResetPin(identifier: string) {
    const user = await this.findByIdentifier(identifier);
    if (user) {
      await this.issueCode(identifier, CodeCategory.RESET_PIN, user.firstName ?? '');
    }
    return { message: 'If that account exists, a reset code has been sent' };
  }

  async resetPin(identifier: string, code: string, pin: string) {
    if (!/^\d{4,6}$/.test(pin)) {
      throw new BadRequestException('PIN must be 4 to 6 digits');
    }
    const user = await this.consumeCode(identifier, CodeCategory.RESET_PIN, code);
    await this.userRepository.update(user.id, { pin: await bcrypt.hash(pin, 12) });
    return { message: 'PIN updated' };
  }

  // ── biometrics ─────────────────────────────────────────────────────────────

  async registerBiometricDevice(dto: RegisterBiometricDto) {
    const user = await this.usersService.findById(dto.userId);
    if (!user) throw new NotFoundException('User not found');

    await this.userRepository.update(dto.userId, { biometricPublicKey: dto.publicKey });
    return { message: 'Biometric device registered' };
  }

  /**
   * The device signs a server-issued challenge with the private key held in its
   * secure enclave; we verify against the public key registered above.
   */
  async biometricLogin(dto: BiometricLoginDto): Promise<LoginResponse> {
    const user = await this.findByIdentifier(dto.identifier);
    if (!user?.biometricPublicKey) {
      throw new UnauthorizedException('No biometric device registered');
    }

    let verified = false;
    try {
      const verifier = createVerify('SHA256');
      verifier.update(dto.challenge);
      verifier.end();
      verified = verifier.verify(user.biometricPublicKey, dto.signature, 'base64');
    } catch (error) {
      this.logger.warn(`Biometric verification error for ${dto.identifier}`);
      verified = false;
    }

    if (!verified) throw new UnauthorizedException('Biometric verification failed');

    await this.usersService.updateLastLogin(user.id);
    return { access_token: this.sign(user), user: this.sanitise(user) };
  }

  // ── onboarding ─────────────────────────────────────────────────────────────

  async getOnboardingStatus(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const steps = {
      contactVerified: user.isEmailVerified || user.isPhoneVerified,
      profileComplete: Boolean(user.firstName && user.lastName),
      passwordSet: Boolean(user.password),
      pinSet: Boolean(user.pin),
      kycApproved: user.kycStatus === KYCStatus.APPROVED,
    };

    return {
      steps,
      complete: Object.values(steps).every(Boolean),
      kycStatus: user.kycStatus,
    };
  }
}

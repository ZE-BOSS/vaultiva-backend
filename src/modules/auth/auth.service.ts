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

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly sendCodeService: NotificationsService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const { email, phone } = createUserDto;
    const existingUser = await this.usersService.findByEmailOrPhone(email, phone);
    if (existingUser) {
      throw new ConflictException('User with this email or phone already exists');
    }

    const contact = email || phone;
    const type = this.getContactType(contact);
    const code = this.generateCode();

    await this.sendCodeService.sendVerificationCode(contact, code, type);
    await this.usersService.storeVerificationCode(contact, type, 'register', code);

    return { message: 'Verification code sent' };
  }

  async resendCode(createUserDto: CreateUserDto) {
    const { email, phone } = createUserDto;
    const contact = email || phone;
    const type = this.getContactType(contact);

    const user = await this.usersService.findByEmailOrPhone(email, phone);
    if (!user) throw new NotFoundException('User with this email or phone does not exist');

    const code = this.generateCode();
    await this.sendCodeService.sendVerificationCode(contact, code, type);
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

    return this.usersService.updateUser(user.id, data);
  }

  async updatePassword(userId: string, newPassword: string) {
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    return this.usersService.updateUser(userId, { password: hashedPassword });
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

  async initiateResetPassword(identifier: string) {
    const type = this.getContactType(identifier);
    const user = await this.usersService.findByEmailOrPhone(identifier, identifier);
    if (!user) throw new NotFoundException('User not found');

    const code = this.generateCode();
    await this.usersService.storeVerificationCode(identifier, type, 'reset-password', code);
    await this.sendCodeService.sendVerificationCode(identifier, code, type);

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

  async updatePin(userId: string, oldPin: string, newPin: string) {
    await this.verifyPin(userId, oldPin);
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

import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';

export interface LoginResponse {
  access_token: string;
  user: Partial<User>;
}

@Injectable() 
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async validateUser(identifier: string, password: string): Promise<User | null> {
    try {
      const user = await this.usersService.findByEmailOrPhone(identifier, identifier);
      if (!user) return null;

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) return null;

      return user;
    } catch (error) {
      this.logger.error('Error validating user:', error);
      return null;
    }
  }

  async login(identifier: string, password: string): Promise<LoginResponse> {
    const user = await this.validateUser(identifier, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    await this.usersService.updateLastLogin(user.id);

    const payload = { sub: user.id, email: user.email, role: user.role };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        role: user.role,
      },
    };
  }

  async register(createUserDto: CreateUserDto): Promise<User> {
    const { email, phone, password, ...userData } = createUserDto;

    // Check if user already exists
    const existingUser = await this.usersService.findByEmailOrPhone(email, phone);
    if (existingUser) {
      throw new BadRequestException('User with this email or phone already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = this.userRepository.create({
      ...userData,
      email,
      phone,
      password: hashedPassword,
    });

    return this.userRepository.save(user);
  }

  async sendVerificationCode(identifier: string, type: 'email' | 'phone'): Promise<void> {
    const code = this.generateVerificationCode();
    await this.usersService.storeVerificationCode(identifier, type, 'verification', code);
    
    // Send code via email or SMS
    this.logger.log(`Verification code sent to ${identifier}: ${code}`);
  }

  async verifyCode(identifier: string, type: 'email' | 'phone', code: string): Promise<boolean> {
    const isValid = await this.usersService.verifyCode(identifier, type, code);
    
    if (isValid === true) {
      // Mark as verified
      const user = await this.usersService.findByEmailOrPhone(
        type === 'email' ? identifier : undefined,
        type === 'phone' ? identifier : undefined,
      );
      
      if (user) {
        await this.usersService.updateUser(user.id, {
          isEmailVerified: type === 'email' ? true : user.isEmailVerified,
          isPhoneVerified: type === 'phone' ? true : user.isPhoneVerified,
        });
      }
      
      return true;
    }
    
    return false;
  }

  async resetPassword(identifier: string, type: 'email' | 'phone'): Promise<void> {
    const user = await this.usersService.findByEmailOrPhone(
      type === 'email' ? identifier : undefined,
      type === 'phone' ? identifier : undefined,
    );
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const code = this.generateVerificationCode();
    await this.usersService.storeVerificationCode(identifier, type, 'reset-password', code);
    
    this.logger.log(`Password reset code sent to ${identifier}: ${code}`);
  }

  async confirmPasswordReset(
    identifier: string,
    type: 'email' | 'phone',
    code: string,
    newPassword: string,
  ): Promise<void> {
    const isValid = await this.usersService.verifyCode(identifier, type, code);
    
    if (!isValid) {
      throw new BadRequestException('Invalid or expired verification code');
    }

    const user = await this.usersService.findByEmailOrPhone(
      type === 'email' ? identifier : undefined,
      type === 'phone' ? identifier : undefined,
    );
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await this.usersService.updateUser(user.id, { password: hashedPassword });
  }

  private generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}


  async updateLastLogin(id: string): Promise<void> {
    await this.userRepository.update(id, { lastLoginAt: new Date() });
  }

  async storeVerificationCode(
    identifier: string,
    type: 'email' | 'phone',
    category: string,
    code: string,
  ): Promise<void> {
    const user = await this.userRepository.findOneBy(
      type === 'email' ? { email: identifier } : { phone: identifier },
    );

    const newCode = {
      id: this.generateRandomString(),
      category,
      code,
      expires: this.getExpiryDate(),
    };

    if (!user) {
      const newUser = this.userRepository.create(
        type === 'email'
          ? { email: identifier, codes: [newCode] }
          : { phone: identifier, codes: [newCode] },
      );
      await this.userRepository.save(newUser);
    } else {
      await this.userRepository.update(user.id, {
        codes: [...(user.codes || []), newCode],
      });
    }
  }

  async verifyCode(
    identifier: string,
    type: 'email' | 'phone',
    code: string,
  ): Promise<boolean | null> {
    const user = await this.userRepository.findOneBy(
      type === 'email' ? { email: identifier } : { phone: identifier },
    );

    if (!user || !user.codes?.length) return false;

    const now = new Date();
    const match = user.codes.find((c) => c.code === code);

    if (!match) return false;
    if (match.expires < now) return null;

    return true;
  }

  private generateRandomString(length = 10): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_@%&$#!';
    let result = '';
    for (let i = 0; i < length; i++) {
      const index = Math.floor(Math.random() * chars.length);
      result += chars[index];
    }
    return result;
  }

  private getExpiryDate(minutes = 30): Date {
    const date = new Date();
    date.setMinutes(date.getMinutes() + minutes);
    return date;
  }
}

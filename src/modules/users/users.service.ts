import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'bvn',
        'nin',
        'accountNumber',
        'phone',
        'role',
        'isActive',
        'createdAt',
      ],
    });
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }

  async findByPhone(phone: string): Promise<User | null> {
    return this.userRepository.findOneBy({ phone });
  }

  async findByEmailOrPhone(email?: string, phone?: string): Promise<User | null> {
    if (!email && !phone) return null;

    return this.userRepository.findOne({
      where: [
        ...(email ? [{ email }] : []),
        ...(phone ? [{ phone }] : []),
      ],
    });
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    await this.userRepository.update(id, data);
    return this.findById(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
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

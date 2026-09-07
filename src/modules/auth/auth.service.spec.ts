import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import { AuthService, CodeCategory } from './auth.service';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { NotificationsService } from '../notifications/notifications.service';
import { WalletService } from '../wallet/wallet.service';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;
  let userRepository: jest.Mocked<Repository<User>>;
  let notifications: jest.Mocked<NotificationsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOneBy: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findById: jest.fn(),
            updateLastLogin: jest.fn(),
            storeVerificationCode: jest.fn(),
          },
        },
        { provide: JwtService, useValue: { sign: jest.fn(), verify: jest.fn() } },
        { provide: NotificationsService, useValue: { sendVerificationCode: jest.fn() } },
        {
          provide: WalletService,
          useValue: { createWallet: jest.fn(), findUserWalletByType: jest.fn() },
        },
        { provide: ConfigService, useValue: { get: jest.fn() } },
      ],
    }).compile();

    service = module.get(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
    userRepository = module.get(getRepositoryToken(User));
    notifications = module.get(NotificationsService);
  });

  it('is defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('issues a verification code for a new email', async () => {
      userRepository.findOneBy.mockResolvedValue(null);

      const result = await service.register({ email: 'test@example.com' });

      expect(result.contact).toBe('test@example.com');
      expect(usersService.storeVerificationCode).toHaveBeenCalledWith(
        'test@example.com',
        'email',
        CodeCategory.SIGNUP,
        expect.stringMatching(/^\d{6}$/),
      );
      expect(notifications.sendVerificationCode).toHaveBeenCalled();
    });

    it('rejects an address that already has a password set', async () => {
      userRepository.findOneBy.mockResolvedValue({ id: '1', password: 'hashed' } as User);

      await expect(service.register({ email: 'taken@example.com' })).rejects.toThrow(
        ConflictException,
      );
    });

    it('lets an abandoned signup (no password) be resumed', async () => {
      userRepository.findOneBy.mockResolvedValue({ id: '1', password: null } as unknown as User);

      await expect(service.register({ email: 'partial@example.com' })).resolves.toMatchObject(
        { contact: 'partial@example.com' },
      );
    });

    it('requires an email or a phone number', async () => {
      await expect(service.register({})).rejects.toThrow(BadRequestException);
    });
  });

  describe('login', () => {
    it('returns an access token for valid credentials', async () => {
      const password = await bcrypt.hash('password123', 4);
      userRepository.findOneBy.mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        password,
        isActive: true,
      } as User);
      jwtService.sign.mockReturnValue('signed-token');

      const result = await service.login({
        identifier: 'test@example.com',
        password: 'password123',
      });

      expect(result.access_token).toBe('signed-token');
      expect(result.user.email).toBe('test@example.com');
    });

    it('never returns the password hash or PIN', async () => {
      const password = await bcrypt.hash('password123', 4);
      userRepository.findOneBy.mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        password,
        pin: 'hashed-pin',
        isActive: true,
      } as User);
      jwtService.sign.mockReturnValue('signed-token');

      const { user } = await service.login({
        identifier: 'test@example.com',
        password: 'password123',
      });

      expect(user).not.toHaveProperty('password');
      expect(user).not.toHaveProperty('pin');
    });

    it('rejects a wrong password', async () => {
      const password = await bcrypt.hash('correct', 4);
      userRepository.findOneBy.mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        password,
        isActive: true,
      } as User);

      await expect(
        service.login({ identifier: 'test@example.com', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('rejects a disabled account', async () => {
      const password = await bcrypt.hash('password123', 4);
      userRepository.findOneBy.mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        password,
        isActive: false,
      } as User);

      await expect(
        service.login({ identifier: 'test@example.com', password: 'password123' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('verifyCode', () => {
    const future = new Date(Date.now() + 60_000);

    it('accepts a valid signup code and consumes it', async () => {
      userRepository.findOneBy.mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        codes: [{ id: 'c1', category: CodeCategory.SIGNUP, code: '123456', expires: future }],
      } as User);

      const result = await service.verifyCode('test@example.com', '123456');

      expect(result.verified).toBe(true);
      // the code must be removed so it cannot be replayed
      expect(userRepository.update).toHaveBeenCalledWith('1', { codes: [] });
    });

    it('rejects a code issued for a different flow', async () => {
      userRepository.findOneBy.mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        codes: [
          { id: 'c1', category: CodeCategory.RESET_PIN, code: '123456', expires: future },
        ],
      } as User);

      await expect(service.verifyCode('test@example.com', '123456')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('rejects an expired code', async () => {
      userRepository.findOneBy.mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        codes: [
          {
            id: 'c1',
            category: CodeCategory.SIGNUP,
            code: '123456',
            expires: new Date(Date.now() - 1000),
          },
        ],
      } as User);

      await expect(service.verifyCode('test@example.com', '123456')).rejects.toThrow(
        /expired/i,
      );
    });
  });

  describe('transaction PIN', () => {
    it('rejects a non-numeric PIN', async () => {
      usersService.findById.mockResolvedValue({ id: '1' } as User);
      await expect(service.setPin('1', 'abcd')).rejects.toThrow(BadRequestException);
    });

    it('verifies a correct PIN', async () => {
      const pin = await bcrypt.hash('1234', 4);
      userRepository.findOne.mockResolvedValue({ id: '1', pin } as User);

      await expect(service.verifyPin('1', '1234')).resolves.toEqual({ valid: true });
    });

    it('rejects an incorrect PIN', async () => {
      const pin = await bcrypt.hash('1234', 4);
      userRepository.findOne.mockResolvedValue({ id: '1', pin } as User);

      await expect(service.verifyPin('1', '9999')).rejects.toThrow(UnauthorizedException);
    });
  });
});

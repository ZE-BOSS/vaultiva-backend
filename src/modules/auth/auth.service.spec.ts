import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { NotificationsService } from '../notifications/notifications.service';
import { WalletService } from '../wallet/wallet.service';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmailOrPhone: jest.fn(),
            findByUsername: jest.fn(),
            findById: jest.fn(),
            updateUser: jest.fn(),
            storeVerificationCode: jest.fn(),
            verifyCode: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
        {
          provide: NotificationsService,
          useValue: {
            sendVerificationCode: jest.fn(),
          },
        },
        {
          provide: WalletService,
          useValue: {
            createWallet: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user with email', async () => {
      usersService.findByEmailOrPhone.mockResolvedValue(null);
      
      const result = await service.register({ email: 'test@example.com' });
      
      expect(result.message).toBe('Verification code sent');
      expect(usersService.storeVerificationCode).toHaveBeenCalled();
    });

    it('should throw conflict exception for existing user', async () => {
      usersService.findByEmailOrPhone.mockResolvedValue({} as any);
      
      await expect(
        service.register({ email: 'existing@example.com' })
      ).rejects.toThrow('User with this email or phone already exists');
    });
  });

  describe('login', () => {
    it('should login with valid email and password', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: '$2a$12$hashedpassword',
      };

      usersService.findByEmailOrPhone.mockResolvedValue(mockUser as any);
      jwtService.sign.mockReturnValue('mock-token');

      const result = await service.login({
        identifier: 'test@example.com',
        password: 'password123',
      });

      expect(result.token).toBe('mock-token');
      expect(result.user.email).toBe('test@example.com');
    });
  });
});
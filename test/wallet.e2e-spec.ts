import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('WalletController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Setup authenticated user
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'wallet@example.com' });

    await request(app.getHttpServer())
      .post('/auth/complete-profile')
      .send({
        contact: 'wallet@example.com',
        data: {
          firstName: 'John',
          lastName: 'Doe',
          bvn: '12345678901',
          password: 'password123',
        },
      });

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        identifier: 'wallet@example.com',
        password: 'password123',
      });

    authToken = loginResponse.body.token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/wallet (GET)', () => {
    it('should get user wallets', () => {
      return request(app.getHttpServer())
        .get('/wallet')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body.data)).toBe(true);
        });
    });
  });

  describe('/wallet (POST)', () => {
    it('should create a new wallet', () => {
      return request(app.getHttpServer())
        .post('/wallet')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Wallet',
          type: 'others',
          customerId: 'test-customer-id',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.data.name).toBe('Test Wallet');
        });
    });
  });

  describe('/wallet/transactions (GET)', () => {
    it('should get transaction history', () => {
      return request(app.getHttpServer())
        .get('/wallet/transactions')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.data.transactions).toBeDefined();
          expect(res.body.data.pagination).toBeDefined();
        });
    });
  });
});
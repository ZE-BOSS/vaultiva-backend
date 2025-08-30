import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('TransfersController (e2e)', () => {
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
      .send({ email: 'transfer@example.com' });

    await request(app.getHttpServer())
      .post('/auth/complete-profile')
      .send({
        contact: 'transfer@example.com',
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
        identifier: 'transfer@example.com',
        password: 'password123',
      });

    authToken = loginResponse.body.token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/transfers (POST)', () => {
    it('should create a new transfer', () => {
      return request(app.getHttpServer())
        .post('/transfers')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          amount: 5000,
          type: 'wallet_to_bank',
          description: 'Test transfer',
          sourceDetails: { walletId: 'test-wallet-id' },
          destinationDetails: {
            bankCode: '044',
            accountNumber: '1234567890',
            accountName: 'Test Account',
          },
        })
        .expect(201);
    });
  });

  describe('/transfers/bank-downtimes (GET)', () => {
    it('should get bank downtimes', () => {
      return request(app.getHttpServer())
        .get('/transfers/bank-downtimes')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body.data)).toBe(true);
        });
    });
  });
});
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('EscrowController (e2e)', () => {
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
      .send({ email: 'escrow@example.com' });

    await request(app.getHttpServer())
      .post('/auth/complete-profile')
      .send({
        contact: 'escrow@example.com',
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
        identifier: 'escrow@example.com',
        password: 'password123',
      });

    authToken = loginResponse.body.token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/escrow (POST)', () => {
    it('should create a new escrow', () => {
      return request(app.getHttpServer())
        .post('/escrow')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Escrow',
          description: 'Test escrow description',
          amount: 10000,
          type: 'one_time',
          mode: 'single',
          releaseDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          participants: [
            {
              userId: 'test-user-id',
              role: 'payee',
            },
          ],
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.data.title).toBe('Test Escrow');
        });
    });
  });

  describe('/escrow (GET)', () => {
    it('should get user escrows', () => {
      return request(app.getHttpServer())
        .get('/escrow')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body.data.escrows)).toBe(true);
        });
    });
  });
});
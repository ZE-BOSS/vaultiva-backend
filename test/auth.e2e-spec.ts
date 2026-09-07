import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/auth/register (POST)', () => {
    it('should register a new user with email', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@example.com',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.message).toBe('Verification code sent');
        });
    });

    it('should register a new user with phone', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          phone: '+2348123456789',
        })
        .expect(201);
    });

    it('should fail with invalid email', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'invalid-email',
        })
        .expect(400);
    });
  });

  describe('/auth/login (POST)', () => {
    it('should login with valid credentials', async () => {
      // First register and complete profile
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'login@example.com' });

      // Complete profile with password
      await request(app.getHttpServer())
        .post('/auth/complete-profile')
        .send({
          contact: 'login@example.com',
          data: {
            firstName: 'John',
            lastName: 'Doe',
            password: 'password123',
          },
        });

      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          identifier: 'login@example.com',
          password: 'password123',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.token).toBeDefined();
          expect(res.body.user.email).toBe('login@example.com');
        });
    });

    it('should fail with invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          identifier: 'nonexistent@example.com',
          password: 'wrongpassword',
        })
        .expect(401);
    });
  });
});
# Testing Guide - Vaultiva Backend

## Test Structure

```
test/
├── auth.e2e-spec.ts          # Authentication E2E tests
├── wallet.e2e-spec.ts        # Wallet E2E tests
├── escrow.e2e-spec.ts        # Escrow E2E tests
├── transfers.e2e-spec.ts     # Transfer E2E tests
└── jest-e2e.json            # E2E test configuration

src/modules/*/
├── *.service.spec.ts         # Unit tests for services
└── *.controller.spec.ts      # Unit tests for controllers
```

## Running Tests

### Unit Tests
```bash
# Run all unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov

# Run specific test file
npm run test -- auth.service.spec.ts
```

### E2E Tests
```bash
# Run all E2E tests
npm run test:e2e

# Run specific E2E test
npm run test:e2e -- auth.e2e-spec.ts
```

### Debug Tests
```bash
# Debug unit tests
npm run test:debug

# Debug E2E tests
npm run test:e2e -- --detectOpenHandles
```

## Test Database Setup

For E2E tests, use a separate test database:

```bash
# Create test database
createdb vaultiva_test_db

# Set test environment
export NODE_ENV=test
export DB_NAME=vaultiva_test_db
```

## Writing Tests

### Service Unit Tests
```typescript
describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmailOrPhone: jest.fn(),
            // ... other mocked methods
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
  });

  it('should register a new user', async () => {
    usersService.findByEmailOrPhone.mockResolvedValue(null);
    
    const result = await service.register({ email: 'test@example.com' });
    
    expect(result.message).toBe('Verification code sent');
  });
});
```

### E2E Tests
```typescript
describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/register (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'test@example.com' })
      .expect(201)
      .expect((res) => {
        expect(res.body.message).toBe('Verification code sent');
      });
  });
});
```

## Test Coverage Goals

- **Unit Tests**: 80%+ coverage
- **Integration Tests**: Critical flows covered
- **E2E Tests**: All API endpoints tested

## Mock Data

### Test Users
```typescript
const testUsers = {
  admin: {
    email: 'admin@test.com',
    password: 'admin123',
    role: 'super_admin',
  },
  user: {
    email: 'user@test.com',
    password: 'user123',
    role: 'user',
  },
};
```

### Test Wallets
```typescript
const testWallets = {
  main: {
    type: 'main',
    balance: 10000,
    currency: 'NGN',
  },
  escrow: {
    type: 'escrow',
    balance: 5000,
    currency: 'NGN',
  },
};
```

## Continuous Integration

### GitHub Actions Example
```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:13
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: vaultiva_test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
      
      redis:
        image: redis:6
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - run: npm ci
      - run: npm run test
      - run: npm run test:e2e
```

## Performance Testing

Use tools like Artillery or k6 for load testing:

```bash
# Install Artillery
npm install -g artillery

# Run load test
artillery run test/load/auth-load-test.yml
```

## Test Best Practices

1. **Isolation**: Each test should be independent
2. **Cleanup**: Clean up test data after each test
3. **Mocking**: Mock external services and dependencies
4. **Assertions**: Use descriptive assertions
5. **Coverage**: Aim for high test coverage
6. **Performance**: Keep tests fast and efficient
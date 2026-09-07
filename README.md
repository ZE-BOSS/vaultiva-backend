# Vaultiva Fintech Backend

A comprehensive NestJS-based fintech platform backend implementing multi-wallets, bill payments, escrow, transfers, crowdfunding, shared wallets, AI insights, and more.

## 🚀 Features

### Core Features
- **Multi-Wallet System**: Main, Escrow, Bill Payment, and Custom wallets
- **Authentication**: Email/Phone/Username login with PIN and biometric support
- **Bill Payments**: Airtime, Data, TV, Electricity, Internet, Betting with smart refill
- **Transfers**: Wallet-to-wallet, wallet-to-bank with scheduling and downtime detection
- **Escrow**: One-time and recurring escrow with single/group modes
- **Bill Splitting**: One-to-many and many-to-one with recurring support
- **Crowdfunding**: Shareable campaigns with contribution tracking
- **Shared Wallets**: Multi-user wallets with signature requirements
- **AI Insights**: Spending analysis and budget recommendations
- **Rewards**: Cashback, discounts, and streak bonuses
- **Ledger System**: Comprehensive transaction tracking and reconciliation

### Integrations
- **Providus/XpressWallet**: Virtual accounts and wallet management
- **Flutterwave**: Bill payments and transfers
- **InterSwitch**: Alternative bill payment provider
- **AI/ML Services**: Spending insights and recommendations

## 🛠️ Technology Stack

- **Framework**: NestJS
- **Database**: PostgreSQL with TypeORM
- **Queue**: BullMQ with Redis
- **Authentication**: JWT with Passport
- **Validation**: Class Validator
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL 13+
- Redis 6+
- npm or yarn

## 🚀 Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd vaultiva-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Database Setup**
```bash
# Run migrations
npm run migration:run
```

5. **Start the application**
```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## 📖 API Documentation

Once the application is running, visit:
- **Swagger UI**: `http://localhost:3000/docs`
- **Health Check**: `http://localhost:3000/health`

## 🏗️ Architecture

### Module Structure
```
src/
├── modules/
│   ├── auth/              # Authentication & authorization
│   ├── users/             # User management
│   ├── wallet/            # Wallet operations
│   ├── bills/             # Bill payments
│   ├── transfers/         # Money transfers
│   ├── escrow/            # Escrow services
│   ├── bill-splitting/    # Bill splitting
│   ├── crowdfunding/      # Crowdfunding campaigns
│   ├── shared-wallets/    # Shared wallet management
│   ├── ai-insights/       # AI spending insights
│   ├── rewards/           # Reward system
│   ├── ledger/            # Transaction ledger
│   ├── notifications/     # Notification system
│   ├── payments/          # Payment processing
│   └── common/            # Shared utilities
├── config/                # Configuration files
└── database/              # Database migrations
```

### Key Design Patterns
- **Clean Architecture**: Separation of concerns with clear boundaries
- **Event-Driven**: Async processing with event emitters
- **Queue-Based**: Background job processing with BullMQ
- **Repository Pattern**: Data access abstraction
- **Guard-Based Security**: JWT and role-based access control

## 🔐 Authentication Flow

1. **Registration**: Email/Phone → Verification Code → Profile Completion
2. **KYC**: Document upload and verification
3. **Login**: Email/Phone/Username + Password
4. **PIN Setup**: Transaction PIN for sensitive operations
5. **Biometric**: Optional fingerprint/FaceID support

## 💰 Wallet System

### Wallet Types
- **Main Wallet**: Primary wallet for general transactions
- **Escrow Wallet**: For escrow transactions
- **Bill Payment Wallets**: Dedicated wallets for each service type
- **Custom Wallets**: User-created wallets for specific purposes

### Features
- Fund locking with duration
- Multi-currency support
- Real-time balance tracking
- Transaction history

## 💸 Bill Payments

### Supported Services
- Airtime (MTN, Airtel, Glo, 9mobile)
- Data bundles
- Electricity (AEDC, EKEDC, etc.)
- TV subscriptions (DSTV, GoTV, Startimes)
- Internet services
- Betting account funding

### Smart Features
- **Auto Smart-Refill**: Pattern-based automatic refills
- **Bill Reminders**: Proactive payment notifications
- **Downtime Detection**: Real-time service availability
- **Recurring Payments**: Automated bill scheduling

## 🔄 Transfer System

### Transfer Types
- Wallet-to-wallet (internal)
- Wallet-to-bank (external)
- Scheduled transfers
- Auto-transfers

### Features
- Bank downtime detection
- Digital receipts
- Transfer scheduling
- Fee calculation
- Real-time status tracking

## 🤝 Escrow System

### Types
- **One-time Escrow**: Single transaction escrow
- **Recurring Escrow**: Repeated escrow cycles

### Modes
- **Single**: Two-party escrow
- **Group**: Multi-party escrow

### Features
- Condition-based release
- Dispute handling
- Automatic fund distribution
- Digital receipts

## 📊 Bill Splitting

### Types
- **One-to-Many**: Single payer to multiple recipients
- **Many-to-One**: Multiple payers to single recipient

### Features
- Recurring splits
- Participant invitations
- Payment reminders
- Automatic execution

## 🎯 Crowdfunding

### Features
- Campaign creation with targets
- Shareable links
- Anonymous contributions
- Progress tracking
- Automatic fund distribution

## 👥 Shared Wallets

### Modes
- **Free Action**: Any member can transact
- **Signatory Required**: Approval-based transactions

### Features
- Multi-user access
- Role-based permissions
- Spending limits
- Transaction approval workflow

## 🤖 AI Insights

### Capabilities
- Spending pattern analysis
- Budget recommendations
- Category-wise insights
- Savings opportunities
- Personalized suggestions

## 🎁 Reward System

### Reward Types
- **Cashback**: Percentage-based returns
- **Discounts**: Service fee reductions
- **Streak Bonuses**: Consecutive usage rewards
- **Milestones**: Achievement-based rewards

### Features
- Automatic reward calculation
- Expiration management
- Redemption tracking
- Custom reward rules

## 📚 Ledger System

### Features
- **Source of Truth**: Central transaction recording
- **Multi-Provider**: Supports all payment providers
- **Reconciliation**: Automatic and manual reconciliation
- **Audit Trail**: Complete transaction history
- **Discrepancy Detection**: Identifies imbalances

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📝 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/verify-code` - Verify OTP
- `POST /auth/complete-profile` - Complete user profile
- `POST /auth/set-pin` - Set transaction PIN

### Wallets
- `GET /wallet` - Get user wallets
- `POST /wallet` - Create new wallet
- `GET /wallet/transactions` - Transaction history
- `POST /wallet/withdraw` - Withdraw funds

### Bill Payments
- `GET /bills` - Get bill providers
- `POST /bills` - Pay bill
- `GET /bills/recurring/list/:type` - Get recurring payments

### Transfers
- `POST /transfers` - Create transfer
- `GET /transfers` - Get transfer history
- `POST /transfers/scheduled` - Schedule transfer
- `GET /transfers/bank-downtimes` - Check bank status

### Escrow
- `POST /escrow` - Create escrow
- `GET /escrow` - Get user escrows
- `POST /escrow/:id/fund` - Fund escrow
- `POST /escrow/:id/release` - Release escrow

### Bill Splitting
- `POST /bill-splitting` - Create bill split
- `GET /bill-splitting` - Get user bill splits
- `POST /bill-splitting/:id/execute` - Execute split

### Crowdfunding
- `POST /crowdfunding/campaigns` - Create campaign
- `GET /crowdfunding/campaigns` - Get user campaigns
- `POST /crowdfunding/campaigns/:id/contribute` - Contribute

### Shared Wallets
- `POST /shared-wallets` - Create shared wallet
- `GET /shared-wallets` - Get user shared wallets
- `POST /shared-wallets/:id/transact` - Initiate transaction

### AI Insights
- `POST /ai-insights/generate` - Generate insights
- `GET /ai-insights/insights` - Get insights
- `GET /ai-insights/recommendations` - Get recommendations

### Rewards
- `GET /rewards` - Get user rewards
- `GET /rewards/summary` - Get reward summary
- `POST /rewards/:id/redeem` - Redeem reward

### Ledger (Admin)
- `GET /ledger/entries` - Get ledger entries
- `GET /ledger/balance` - Get balance summary
- `POST /ledger/admin/reconcile` - Manual reconciliation

## 🔧 Configuration

### Environment Variables

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=vaultiva_db

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Flutterwave
FLUTTERWAVE_PUBLIC_KEY=your-public-key
FLUTTERWAVE_SECRET_KEY=your-secret-key

# XpressWallet
XPRESS_EMAIL=your-email
XPRESS_PASSWORD=your-password
XPRESS_BASEURL=https://api.xpresswallet.com

# Notifications
ZEPTO_API_KEY=your-zepto-key
TERMII_API_KEY=your-termii-key
```

## 🚀 Deployment

### Docker
```bash
# Build image
docker build -t vaultiva-backend .

# Run container
docker run -p 3000:3000 vaultiva-backend
```

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Configure SSL certificates
- [ ] Set up monitoring and logging
- [ ] Configure backup strategies
- [ ] Set up CI/CD pipeline

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ Core wallet functionality
- ✅ Bill payments
- ✅ Basic transfers
- ✅ Authentication system

### Phase 2 (In Progress)
- ✅ Escrow system
- ✅ Bill splitting
- ✅ Crowdfunding
- ✅ Shared wallets

### Phase 3 (Planned)
- ✅ AI insights
- ✅ Reward system
- ✅ Ledger system
- 🔄 Advanced analytics

### Phase 4 (Future)
- 📋 USSD integration
- 📋 Voice payments
- 📋 Advanced AI features
- 📋 International transfers
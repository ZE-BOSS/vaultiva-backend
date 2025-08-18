# Xpress Wallet TypeScript SDK

A comprehensive TypeScript SDK for the Xpress Wallet API that provides type-safe access to all wallet functionality including customer management, transactions, transfers, and more.

## Installation

```bash
npm install xpress-wallet-sdk
```

## Quick Start

```typescript
import { XpressWalletSDK } from 'xpress-wallet-sdk';

// Initialize the SDK
const sdk = new XpressWalletSDK({
  baseUrl: 'https://api.xpresswallet.com', // Replace with actual base URL
  timeout: 30000
});

// Login and authenticate
try {
  const { response, tokens } = await sdk.auth.login({
    email: 'your-email@example.com',
    password: 'your-password'
  });
  
  console.log('Logged in successfully:', response.data);
  
  // Tokens are automatically set, but you can also store them
  console.log('Access Token:', tokens.accessToken);
} catch (error) {
  console.error('Login failed:', error.message);
}
```

## Usage Examples

### Customer Management

```typescript
// Get all customers with pagination
const customers = await sdk.customer.getAllCustomers(1);
console.log('Customers:', customers.data);

// Find customer by phone number
const customer = await sdk.customer.findByPhoneNumber('08030223346');
console.log('Found customer:', customer.data);

// Update customer profile
await sdk.customer.updateCustomer('customer-id', {
  firstName: 'Updated Name',
  address: 'New Address'
});
```

### Wallet Operations

```typescript
// Create customer wallet
const walletResult = await sdk.wallet.createCustomerWallet({
  bvn: '22181029322',
  firstName: 'John',
  lastName: 'Doe',
  dateOfBirth: '1992-05-16',
  phoneNumber: '08020245368',
  email: 'john.doe@example.com',
  address: 'Lagos, Nigeria'
});

// Credit customer wallet
await sdk.wallet.creditWallet({
  amount: 1500,
  reference: 'unique-reference-123',
  customerId: 'customer-id',
  metadata: {
    source: 'mobile-app',
    reason: 'account-topup'
  }
});

// Debit customer wallet
await sdk.wallet.debitWallet({
  amount: 500,
  reference: 'debit-ref-456',
  customerId: 'customer-id'
});

// Batch credit multiple wallets
await sdk.wallet.batchCreditWallets({
  batchReference: 'batch-123',
  transactions: [
    { amount: 1000, customerId: 'customer-1' },
    { amount: 2000, customerId: 'customer-2' }
  ]
});
```

### Bank Transfers

```typescript
// Get list of supported banks
const banks = await sdk.transfer.getBankList();
console.log('Available banks:', banks.data);

// Verify bank account details
const accountDetails = await sdk.transfer.getBankAccountDetails({
  sortCode: '000013',
  accountNumber: '0167421242'
});
console.log('Account holder:', accountDetails.data?.accountName);

// Perform bank transfer from merchant wallet
const transfer = await sdk.transfer.merchantBankTransfer({
  amount: 5000,
  sortCode: '000013',
  narration: 'Payment for services',
  accountNumber: '0167421242',
  accountName: 'John Doe',
  metadata: { purpose: 'salary' }
});
```

### Transaction Management

```typescript
// Get merchant transactions with filters
const transactions = await sdk.transaction.getMerchantTransactions({
  page: 1,
  type: 'ALL',
  status: 'success',
  category: 'BANK_TRANSFER'
});

// Get transaction details
const transaction = await sdk.transaction.getTransactionDetails('transaction-reference');

// Get pending transactions
const pendingTransactions = await sdk.transaction.getPendingTransactions({
  page: 1,
  type: 'DEBIT'
});

// Approve a pending transaction
await sdk.transaction.approveTransaction({
  transactionId: 'transaction-id'
});
```

### Team Management

```typescript
// Invite team member
await sdk.team.inviteTeamMember({
  roleId: 'role-id',
  email: 'member@example.com',
  approvalLimit: 10000
});

// Get team members
const members = await sdk.team.getTeamMembers();

// Create custom role
const role = await sdk.team.createRole({
  name: 'Customer Support',
  permissions: ['BROWSE_CUSTOMERS', 'UPDATE_CUSTOMERS']
});
```

### Error Handling

```typescript
import { XpressWalletError } from 'xpress-wallet-sdk';

try {
  await sdk.wallet.creditWallet({
    amount: 1000,
    reference: 'ref-123',
    customerId: 'invalid-customer-id'
  });
} catch (error) {
  if (error instanceof XpressWalletError) {
    console.error('API Error:', error.message);
    console.error('Status Code:', error.statusCode);
    console.error('Response:', error.response);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

### Authentication with Bearer Token

```typescript
// Alternative authentication using bearer token (e.g., secret key)
sdk.setBearerToken('sk_live_your_secret_key_here');

// Now you can make API calls without session tokens
const customers = await sdk.customer.getAllCustomers();
```

## API Coverage

This SDK covers all endpoints from the Xpress Wallet API:

- **Authentication**: Login, logout, password reset, token refresh
- **Customer Management**: CRUD operations, phone lookup
- **Wallet Operations**: Create, credit, debit, freeze/unfreeze, batch operations
- **Transactions**: View, filter, approve/decline, batch operations
- **Bank Transfers**: Single and batch transfers, account verification
- **Team Management**: Invite members, manage roles and permissions
- **Merchant Operations**: Profile management, KYC, access keys
- **Card Management**: Setup, create, activate, fund prepaid cards

## Configuration

```typescript
const sdk = new XpressWalletSDK({
  baseUrl: 'https://api.xpresswallet.com',
  timeout: 30000, // 30 seconds (optional)
  retries: 3 // Number of retries for failed requests (optional)
});
```

## TypeScript Support

The SDK is built with TypeScript and provides full type safety:

```typescript
// All request/response types are fully typed
const request: CreditWalletRequest = {
  amount: 1000,
  reference: 'ref-123',
  customerId: 'customer-id'
};

const response: WalletOperationResponse = await sdk.wallet.creditWallet(request);
```

## License

MIT
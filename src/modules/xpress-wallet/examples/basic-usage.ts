import { XpressWalletSDK, XpressWalletError } from '../src';

async function basicExample() {
  // Initialize SDK
  const sdk = new XpressWalletSDK({
    baseUrl: 'https://api.xpresswallet.com' // Replace with actual URL
  });

  try {
    // 1. Login
    console.log('Logging in...');
    const { response: loginResponse, tokens } = await sdk.auth.login({
      email: 'merchant@example.com',
      password: 'password123'
    });
    
    console.log('Login successful:', loginResponse.data.firstName);

    // 2. Get merchant profile
    const profile = await sdk.merchant.getProfile();
    console.log('Merchant:', profile.data?.businessName);

    // 3. Get merchant wallet
    const wallet = await sdk.merchant.getWallet();
    console.log('Wallet Balance:', wallet.data?.availableBalance);

    // 4. Create customer wallet
    const newWallet = await sdk.wallet.createCustomerWallet({
      bvn: '22181029322',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1992-05-16',
      phoneNumber: '08020245368',
      email: 'john.doe@example.com',
      address: 'Lagos, Nigeria',
      metadata: {
        source: 'web-app',
        referralCode: 'REF123'
      }
    });

    console.log('New wallet created:', newWallet.wallet.accountNumber);

    // 5. Credit the customer wallet
    await sdk.wallet.creditWallet({
      amount: 5000,
      reference: `ref-${Date.now()}`,
      customerId: newWallet.customer.id,
      metadata: {
        purpose: 'welcome-bonus'
      }
    });

    console.log('Wallet credited successfully');

    // 6. Get customer transactions
    const transactions = await sdk.transaction.getCustomerTransactions({
      customerId: newWallet.customer.id,
      page: 1,
      perPage: 10
    });

    console.log('Customer transactions:', transactions.data?.length);

    // 7. Get supported banks
    const banks = await sdk.transfer.getBankList();
    console.log('Supported banks:', banks.data?.length);

    // 8. Logout
    await sdk.auth.logout();
    console.log('Logged out successfully');

  } catch (error) {
    if (error instanceof XpressWalletError) {
      console.error('Xpress Wallet API Error:', error.message);
      console.error('Status Code:', error.statusCode);
    } else {
      console.error('Unexpected error:', error);
    }
  }
}

// Run the example
basicExample().catch(console.error);
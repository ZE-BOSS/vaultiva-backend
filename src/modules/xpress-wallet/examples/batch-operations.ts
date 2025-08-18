import { XpressWalletSDK } from '../src';

async function batchOperationsExample() {
  const sdk = new XpressWalletSDK({
    baseUrl: 'https://api.xpresswallet.com'
  });

  // Login first
  await sdk.auth.login({
    email: 'merchant@example.com',
    password: 'password123'
  });

  try {
    // Batch credit multiple customer wallets
    console.log('Starting batch credit operation...');
    
    const batchCreditResult = await sdk.wallet.batchCreditWallets({
      batchReference: `batch-credit-${Date.now()}`,
      transactions: [
        { amount: 1000, customerId: 'customer-1-id' },
        { amount: 1500, customerId: 'customer-2-id' },
        { amount: 2000, customerId: 'customer-3-id' }
      ]
    });

    console.log('Batch credit completed:');
    console.log('Accepted:', batchCreditResult.data.accepted.length);
    console.log('Rejected:', batchCreditResult.data.rejected.length);

    // Batch bank transfers
    console.log('Starting batch bank transfers...');
    
    const batchTransferResult = await sdk.transfer.merchantBatchBankTransfer([
      {
        amount: 5000,
        sortCode: '000013',
        narration: 'Salary payment',
        accountNumber: '1234567890',
        accountName: 'Employee One',
        metadata: { department: 'engineering' }
      },
      {
        amount: 3000,
        sortCode: '000014',
        narration: 'Contractor payment',
        accountNumber: '0987654321',
        accountName: 'Contractor Two',
        metadata: { department: 'marketing' }
      }
    ]);

    console.log('Batch transfer result:', batchTransferResult.message);
    console.log('Accepted transfers:', batchTransferResult.data.accepted.length);

    // Get batch transaction details
    const batchTransactions = await sdk.transaction.getBatchTransactions({
      page: 1,
      perPage: 20,
      type: 'CREDIT'
    });

    console.log('Recent batch transactions:', batchTransactions.data?.length);

  } catch (error) {
    console.error('Batch operations failed:', error);
  }
}

batchOperationsExample().catch(console.error);
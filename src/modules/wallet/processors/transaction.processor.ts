import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Job } from 'bullmq';
import { WalletService } from '../wallet.service';

@Injectable()
@Processor('transaction')
export class TransactionProcessor extends WorkerHost {
  private readonly logger = new Logger(TransactionProcessor.name);

  constructor(
    private walletService: WalletService,
    private eventEmitter: EventEmitter2,
  ) {
    super();
  }

  async process(job: Job): Promise<any> {
    this.logger.log(`Processing job ${job.id} of type ${job.name}`);

    switch (job.name) {
      case 'process-deposit':
        return this.processDeposit(job.data);
      case 'process-withdrawal':
        return this.processWithdrawal(job.data);
      case 'reconcile-transaction':
        return this.reconcileTransaction(job.data);
      case 'retry-failed-transaction':
        return this.retryFailedTransaction(job.data);
      default:
        this.logger.warn(`Unknown job type: ${job.name}`);
    }
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job, result: any) {
    this.logger.log(`Job ${job.id} completed with result:`, result);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    this.logger.error(`Job ${job.id} failed:`, error);
    
    // Emit event for failed transaction handling
    this.eventEmitter.emit('transaction.processing.failed', {
      jobId: job.id,
      data: job.data,
      error: error.message,
    });
  }

  private async processDeposit(data: any): Promise<void> {
    this.logger.log('Processing deposit:', data);
    
    try {
      await this.walletService.processWebhook(data);
      this.logger.log('Deposit processed successfully');
    } catch (error) {
      this.logger.error('Failed to process deposit:', error);
      throw error;
    }
  }

  private async processWithdrawal(data: any): Promise<void> {
    this.logger.log('Processing withdrawal:', data);
    
    // Implementation for withdrawal processing
    // This could involve checking withdrawal status with payment provider
    // and updating the transaction accordingly
  }

  private async reconcileTransaction(data: any): Promise<void> {
    this.logger.log('Reconciling transaction:', data);
    
    // Implementation for transaction reconciliation
    // This involves checking transaction status with payment provider
    // and ensuring local records match
  }

  private async retryFailedTransaction(data: any): Promise<void> {
    this.logger.log('Retrying failed transaction:', data);
    
    // Implementation for retrying failed transactions
    // This could involve re-attempting the payment or withdrawal
  }
}
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SpendingInsight, InsightType, InsightPriority } from './entities/spending-insight.entity';
import { BudgetRecommendation, RecommendationType } from './entities/budget-recommendation.entity';
import { WalletService } from '../wallet/wallet.service';
import { TransactionType } from '../wallet/entities/transaction.entity';

@Injectable()
export class AiInsightsService {
  private readonly logger = new Logger(AiInsightsService.name);

  constructor(
    @InjectRepository(SpendingInsight)
    private insightRepository: Repository<SpendingInsight>,
    @InjectRepository(BudgetRecommendation)
    private recommendationRepository: Repository<BudgetRecommendation>,
    private walletService: WalletService,
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async generateInsights(userId: string): Promise<SpendingInsight[]> {
    try {
      // Get user transaction data
      const transactionData = await this.walletService.getTransactionHistory(userId, 1, 100);
      
      // Analyze spending patterns
      const spendingAnalysis = this.analyzeSpendingPatterns(transactionData.transactions);
      
      // Generate AI insights using OpenAI or similar service
      const aiInsights = await this.callAIService(spendingAnalysis);
      
      // Save insights to database
      const insights = aiInsights.map(insight => 
        this.insightRepository.create({
          ...insight,
          userId,
        })
      );

      return this.insightRepository.save(insights);
    } catch (error) {
      this.logger.error(`Failed to generate insights for user ${userId}:`, error);
      throw error;
    }
  }

  async getUserInsights(userId: string, page: number = 1, limit: number = 20) {
    const [insights, total] = await this.insightRepository.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      insights,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getBudgetRecommendations(userId: string): Promise<BudgetRecommendation[]> {
    return this.recommendationRepository.find({
      where: { userId, isImplemented: false },
      order: { potentialSavings: 'DESC' },
    });
  }

  async markInsightAsRead(insightId: string, userId: string): Promise<void> {
    await this.insightRepository.update(
      { id: insightId, userId },
      { isRead: true }
    );
  }

  async implementRecommendation(recommendationId: string, userId: string): Promise<void> {
    await this.recommendationRepository.update(
      { id: recommendationId, userId },
      { isImplemented: true }
    );
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async generateDailyInsights(): Promise<void> {
    this.logger.log('Generating daily AI insights for all users');
    
    // This would typically get a list of active users
    // For now, we'll implement the framework
    
    try {
      // Implementation would iterate through users and generate insights
      this.logger.log('Daily insights generation completed');
    } catch (error) {
      this.logger.error('Failed to generate daily insights:', error);
    }
  }

  private analyzeSpendingPatterns(transactions: any[]): any {
    const analysis = {
      totalSpending: 0,
      categoryBreakdown: {},
      monthlyTrend: [],
      frequentMerchants: [],
      averageTransactionAmount: 0,
    };

    // Analyze transactions
    transactions.forEach(transaction => {
      if (transaction.type === TransactionType.BILL_PAYMENT || 
          transaction.type === TransactionType.WITHDRAWAL) {
        analysis.totalSpending += Number(transaction.amount);
        
        // Category breakdown
        const category = transaction.metadata?.category || 'other';
        analysis.categoryBreakdown[category] = 
          (analysis.categoryBreakdown[category] || 0) + Number(transaction.amount);
      }
    });

    analysis.averageTransactionAmount = analysis.totalSpending / transactions.length || 0;

    return analysis;
  }

  private async callAIService(spendingData: any): Promise<Partial<SpendingInsight>[]> {
    // Mock AI service call - replace with actual AI service
    const insights: Partial<SpendingInsight>[] = [];

    // Example insight generation logic
    if (spendingData.totalSpending > 50000) {
      insights.push({
        type: InsightType.BUDGET_ALERT,
        priority: InsightPriority.HIGH,
        title: 'High Spending Alert',
        description: 'Your spending this month is significantly higher than usual',
        recommendation: 'Consider reviewing your budget and reducing discretionary spending',
        data: spendingData,
      });
    }

    if (spendingData.categoryBreakdown.entertainment > spendingData.totalSpending * 0.3) {
      insights.push({
        type: InsightType.CATEGORY_ANALYSIS,
        priority: InsightPriority.MEDIUM,
        title: 'Entertainment Spending High',
        description: 'Entertainment expenses account for over 30% of your spending',
        recommendation: 'Consider setting a monthly entertainment budget limit',
        data: { category: 'entertainment', percentage: 30 },
      });
    }

    return insights;
  }
}
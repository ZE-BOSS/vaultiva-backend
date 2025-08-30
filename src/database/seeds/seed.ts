import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { User, Role } from '../../modules/users/entities/user.entity';
import { Bill, BillCategory, BillProvider } from '../../modules/bills/entities/bill.entity';
import { Reward, RewardType, RewardCategory } from '../../modules/rewards/entities/reward.entity';
import * as bcrypt from 'bcryptjs';

const configService = new ConfigService();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get('DB_HOST', 'localhost'),
  port: configService.get('DB_PORT', 5432),
  username: configService.get('DB_USERNAME', 'postgres'),
  password: configService.get('DB_PASSWORD', 'password'),
  database: configService.get('DB_NAME', 'vaultiva_db'),
  entities: ['src/**/*.entity.ts'],
  synchronize: false,
});

async function seed() {
  await AppDataSource.initialize();

  // Seed admin user
  const userRepository = AppDataSource.getRepository(User);
  const adminExists = await userRepository.findOne({ where: { email: 'admin@vaultiva.com' } });
  
  if (!adminExists) {
    const admin = userRepository.create({
      email: 'admin@vaultiva.com',
      username: 'admin',
      password: await bcrypt.hash('admin123', 12),
      firstName: 'Admin',
      lastName: 'User',
      role: Role.SUPER_ADMIN,
      isEmailVerified: true,
      isActive: true,
    });
    await userRepository.save(admin);
    console.log('Admin user created');
  }

  // Seed bill providers
  const billRepository = AppDataSource.getRepository(Bill);
  const billsExist = await billRepository.count();
  
  if (billsExist === 0) {
    const bills = [
      {
        name: 'MTN Airtime',
        billerCode: 'MTN',
        itemCode: 'AT099',
        category: BillCategory.AIRTIME,
        provider: BillProvider.FLUTTERWAVE,
        fee: 0,
      },
      {
        name: 'DSTV Subscription',
        billerCode: 'DSTV',
        itemCode: 'CB140',
        category: BillCategory.TV,
        provider: BillProvider.FLUTTERWAVE,
        fee: 100,
      },
      {
        name: 'AEDC Electricity',
        billerCode: 'AEDC',
        itemCode: 'BIL099',
        category: BillCategory.ELECTRICITY,
        provider: BillProvider.FLUTTERWAVE,
        fee: 50,
      },
    ];

    await billRepository.save(bills);
    console.log('Bill providers seeded');
  }

  // Seed rewards
  const rewardRepository = AppDataSource.getRepository(Reward);
  const rewardsExist = await rewardRepository.count();
  
  if (rewardsExist === 0) {
    const rewards = [
      {
        name: 'Bill Payment Cashback',
        description: '2% cashback on all bill payments',
        type: RewardType.CASHBACK,
        category: RewardCategory.BILL_PAYMENT,
        value: 2.0,
        conditions: { minAmount: 1000 },
      },
      {
        name: 'Transfer Discount',
        description: '50% discount on transfer fees',
        type: RewardType.DISCOUNT,
        category: RewardCategory.TRANSFER,
        value: 50.0,
        conditions: { minTransfers: 5 },
      },
    ];

    await rewardRepository.save(rewards);
    console.log('Rewards seeded');
  }

  await AppDataSource.destroy();
  console.log('Seeding completed');
}

seed().catch(console.error);
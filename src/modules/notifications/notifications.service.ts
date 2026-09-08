import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/notifictions.dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { verifyMail, verifyMessage } from './template/verifymail.template';
import { EmailProvider, resolveEmailProvider } from './providers/email.provider';
import { SmsProvider, resolveSmsProvider } from './providers/sms.provider';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  private emailProvider?: EmailProvider;
  private smsProvider?: SmsProvider;

  private get email(): EmailProvider {
    return (this.emailProvider ??= resolveEmailProvider(this.configService, this.logger));
  }

  private get sms(): SmsProvider {
    return (this.smsProvider ??= resolveSmsProvider(this.configService, this.logger));
  }

  async sendVerificationCode(
    recipient: string,
    name = '',
    code: string,
    type: 'email' | 'phone',
  ) {
    if (type === 'email') {
      return this.sendEmail(recipient, 'Verification Code', verifyMail(name, code));
    }
    if (type === 'phone') {
      return this.sms.send(recipient, verifyMessage(code));
    }
    throw new Error('Invalid recipient type');
  }

  private async sendEmail(email: string, title: string, content: string) {
    try {
      await this.email.send(email, title, content);
      this.logger.log(`Sent "${title}" to ${email} via ${this.email.name}`);
    } catch (error) {
      this.logger.error(
        `Failed to send "${title}" to ${email}:`,
        error?.response?.data ?? error.message,
      );
      throw error;
    }
  }

  async create(
    createDto: CreateNotificationDto,
  ): Promise<Notification> {
    const notification = this.notificationRepo.create(createDto);
    return await this.notificationRepo.save(notification);
  }

  async findUserNotifications(
    userId: string,
    page = 1,
    limit = 20,
  ): Promise<{
    notifications: Notification[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    if (page < 1 || limit < 1) {
      throw new BadRequestException('Page and limit must be positive integers');
    }

    const [notifications, total] = await this.notificationRepo.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      notifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async markAsRead(id: string, userId: string): Promise<Notification> {
    const notification = await this.notificationRepo.findOne({
      where: { id, userId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    notification.isRead = true;
    return await this.notificationRepo.save(notification);
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepo.update(
      { userId, isRead: false },
      { isRead: true },
    );
  }

  async getUnreadCount(userId: string): Promise<number> {
    return await this.notificationRepo.count({
      where: { userId, isRead: false },
    });
  }

  async deleteNotification(id: string, userId: string): Promise<void> {
    const result = await this.notificationRepo.delete({ id, userId });

    if (result.affected === 0) {
      throw new NotFoundException('Notification not found');
    }
  }
}

import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Notification,
  NotificationType,
  NotificationChannel,
} from './entities/notification.entity';

export interface CreateNotificationDto {
  title: string;
  message: string;
  type: NotificationType;
  channel: NotificationChannel;
  userId: string;
  metadata?: Record<string, any>;
}
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private readonly twilioClient: Twilio;

  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.twilioClient = new Twilio(
      this.configService.get<string>('TWILIO_ACCOUNT_SID'),
      this.configService.get<string>('TWILIO_AUTH_TOKEN'),
    );
  }

  async sendVerificationCode(recipient: string, code: string, type: "email" | "phone") {

    if (type == "email") {
      return this.sendEmail(recipient, code);
    } else if (type == "phone") {
      await this.sendSms(recipient, code);
      await this.sendWhatsApp(recipient, code);
      return;
    }

    throw new Error('Invalid recipient type');
  }

  private async sendEmail(email: string, code: string) {
    const zeptoApiKey = this.configService.get<string>('ZEPTO_API_KEY');
    const zeptoFrom = this.configService.get<string>('ZEPTO_FROM');

    const payload = {
      from: { address: zeptoFrom, name: 'SwiftBank' },
      to: [{ email }],
      subject: 'Your Verification Code',
      htmlbody: `<p>Your SwiftBank verification code is <b>${code}</b>.</p>`,
    };

    const headers = {
      'Content-Type': 'application/json',
      'accept': 'application/json',
      'X-API-KEY': zeptoApiKey,
    };

    try {
      await firstValueFrom(this.httpService.post('https://api.zeptomail.com/v1.1/email', payload, { headers }));
      this.logger.log(`Verification code sent to email: ${email}`);
    } catch (error) {
      this.logger.error('Failed to send email:', error?.response?.data || error.message);
      throw error;
    }
  }

  private async sendSms(phone: string, code: string) {
    try {
      await this.twilioClient.messages.create({
        body: `Your SwiftBank verification code is ${code}`,
        to: phone,
        from: this.configService.get<string>('TWILIO_SMS_FROM'),
      });
      this.logger.log(`SMS sent to ${phone}`);
    } catch (error) {
      this.logger.error('Failed to send SMS:', error.message);
      throw error;
    }
  }

  private async sendWhatsApp(phone: string, code: string) {
    const formatted = phone.startsWith('+') ? phone : `+${phone}`;
    try {
      await this.twilioClient.messages.create({
        body: `Your SwiftBank WhatsApp verification code is ${code}`,
        to: `whatsapp:${formatted}`,
        from: this.configService.get<string>('TWILIO_WHATSAPP_FROM'),
      });
      this.logger.log(`WhatsApp message sent to ${formatted}`);
    } catch (error) {
      this.logger.error('Failed to send WhatsApp:', error.message);
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

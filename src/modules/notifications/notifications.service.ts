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
import { SendMailClient } from "zeptomail";
import { verifyMail, verifyMessage } from './template/verifymail.template';
import { Axios } from 'axios';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private readonly axios = new Axios()

  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {

  }

  async sendVerificationCode(recipient: string, name = "", code: string, type: "email" | "phone") {

    if (type == "email") {
      return this.sendEmail(
        recipient, 
        "Verification Code",
        verifyMail(name, code)
      );
    } else if (type == "phone") {
      await this.sendSms(recipient, verifyMessage(code));
      await this.sendWhatsApp(recipient, verifyMessage(code));
      return;
    }

    throw new Error('Invalid recipient type');
  }

  private async sendEmail(email: string, title: string, content: string) {
    const url = this.configService.get('ZEPTO_URL');
    const token = this.configService.get('ZEPTO_API_KEY');
    const from = this.configService.get('ZEPTO_FROM');

    try {
      let client = new SendMailClient({url, token});

      client.sendMail({
          "from": { "address": from, "name": "Vaultiva Team"},
          "to": [{
            "email_address": {"address": email}
          }],
          "subject": title,
          "htmlbody": content,
      })

      this.logger.log(`Verification code sent to email: ${email}`);
    } catch (error) {
      this.logger.error('Failed to send email:', error?.response?.data || error.message);
      throw error;
    }
  }

  private async sendSms(phone: string, sms: string) {
    try {
      const data = {
        "to": phone,
        "from": "Vaultiva Tech",
        "sms": sms,
        "type": "plain",
        "api_key": this.configService.get('TERMII_API_KEY'),
        "channel": "generic",  
      };

      await this.axios.post(`https://${this.configService.get('TERMII_BASE_URL')}/api/sms/send`, data);
      this.logger.log(`SMS sent to ${phone}`);
    } catch (error) {
      this.logger.error('Failed to send SMS:', error.message);
      throw error;
    }
  }

  private async sendWhatsApp(phone: string, message: string) {
    const formatted = phone.startsWith('+') ? phone : `+${phone}`;
    try {
      const data = {
        "to": phone,
        "from": "Vaultiva Tech",
        "sms": message,
        "type": "plain",
        "api_key": this.configService.get('TERMII_API_KEY'),
        "channel": "whatsapp",  
      };

      await this.axios.post(`https://${this.configService.get('TERMII_BASE_URL')}/api/sms/send`, data);
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

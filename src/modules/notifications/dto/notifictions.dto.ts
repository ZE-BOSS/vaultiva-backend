import {
  Notification,
  NotificationType,
  NotificationChannel,
} from '../entities/notification.entity';

export interface CreateNotificationDto {
  title: string;
  message: string;
  type: NotificationType;
  channel: NotificationChannel;
  userId: string;
  metadata?: Record<string, any>;
}
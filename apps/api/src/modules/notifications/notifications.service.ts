import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdatePreferenceDto } from './dto/update-notification.dto';
import { WhatsappService } from './whatsapp.service';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationType } from '@prisma/client';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private prisma: PrismaService,
    private whatsapp: WhatsappService,
    private gateway: NotificationsGateway
  ) {}

  async create(dto: CreateNotificationDto) {
    // 1. Save to DB
    const notification = await this.prisma.notification.create({
      data: dto
    });

    // 2. Fetch User Prefs
    const prefs = await this.prisma.notificationPreference.findUnique({
      where: {
        userId_type: { userId: dto.userId, type: dto.type }
      },
      include: { user: true }
    });

    // Default to TRUE if no pref exists?
    const emailEnabled = prefs ? prefs.email : true;
    const whatsappEnabled = prefs ? prefs.whatsapp : true;
    const inAppEnabled = prefs ? prefs.inApp : true;

    // 3. Dispatch
    if (inAppEnabled) {
      this.gateway.sendToUser(dto.userId, notification);
    }

    if (whatsappEnabled) {
       // Need user phone
       const user = prefs?.user || await this.prisma.user.findUnique({ where: { id: dto.userId } });
       if (user && user.phoneNumber) {
           await this.whatsapp.sendText(user.phoneNumber, `*${dto.title}*\n${dto.message}`);
       }
    }

    return notification;
  }

  async findAll(userId: string) {
    const unread = await this.prisma.notification.count({ where: { userId, isRead: false } });
    const total = await this.prisma.notification.count({ where: { userId } });
    const data = await this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    return {
      data,
      meta: { total, unread }
    };
  }
  
  async getUnreadCount(userId: string) {
      return this.prisma.notification.count({ where: { userId, isRead: false } });
  }

  async markAsRead(id: string, userId: string) {
    return this.prisma.notification.update({
      where: { id, userId }, // ensure ownership
      data: { isRead: true }
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true }
    });
  }
  
  async delete(id: string, userId: string) {
      return this.prisma.notification.delete({ where: { id, userId } });
  }

  // Preferences
  async getPreferences(userId: string) {
      return this.prisma.notificationPreference.findMany({ where: { userId } });
  }

  async updatePreference(userId: string, dto: UpdatePreferenceDto) {
      return this.prisma.notificationPreference.upsert({
          where: { userId_type: { userId, type: dto.type } },
          create: { ...dto, userId },
          update: { ...dto }
      });
  }
}

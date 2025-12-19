import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { NotificationsGateway } from './notifications.gateway';
import { WhatsappService } from './whatsapp.service';
import { NotificationSchedulerJob } from './jobs/notification-scheduler.job';
import { PrismaModule } from '../../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt'; // For Gateway token
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
      PrismaModule, 
      JwtModule.register({}), // Should ideally match App config
      ScheduleModule.forRoot()
  ],
  controllers: [NotificationsController],
  providers: [
      NotificationsService, 
      WhatsappService, 
      NotificationsGateway,
      NotificationSchedulerJob
  ],
  exports: [NotificationsService]
})
export class NotificationsModule {}

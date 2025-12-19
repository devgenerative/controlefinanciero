import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotificationsService } from '../notifications.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { NotificationType } from '@prisma/client';

@Injectable()
export class NotificationSchedulerJob {
  private readonly logger = new Logger(NotificationSchedulerJob.name);

  constructor(
    private notificationsService: NotificationsService,
    private prisma: PrismaService
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async handleDailyBillCheck() {
      this.logger.log('Running Daily Bill Check...');
      
      // 1. Get bills due in 1, 3, 7 days
      // We check Transactions (Expenses, PENDING) and Debts (Installments - harder to query directly if not materialized)
      // Checking Transactions only for now.
      
      const now = new Date();
      const targetDays = [1, 3, 7];

      for (const days of targetDays) {
          const targetDate = new Date();
          targetDate.setDate(now.getDate() + days);
          
          const start = new Date(targetDate.setHours(0,0,0,0));
          const end = new Date(targetDate.setHours(23,59,59,999));

          const bills = await this.prisma.transaction.findMany({
              where: {
                  type: 'EXPENSE',
                  status: 'PENDING',
                  date: { gte: start, lte: end }
              }
          });

          for (const bill of bills) {
              await this.notificationsService.create({
                  type: NotificationType.BILL_DUE_SOON,
                  title: 'Conta a vencer',
                  message: `A conta '${bill.description}' vence em ${days} dias. Valor: R$ ${bill.amount}`,
                  userId: bill.userId,
                  metadata: { transactionId: bill.id, daysRemaining: days }
              });
          }
      }
  }

  @Cron(CronExpression.EVERY_DAY_AT_10AM)
  async handleUnusualSpending() {
      // Mock logic: check yesterday's spending vs avg
  }
}

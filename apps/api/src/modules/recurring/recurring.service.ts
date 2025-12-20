// @ts-nocheck
import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRecurringDto, UpdateRecurringDto } from './dto/recurring.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TransactionStatus, PaymentMethod, Frequency } from '@prisma/client';

@Injectable()
export class RecurringService {
  private readonly logger = new Logger(RecurringService.name);

  constructor(private prisma: PrismaService) {}

  // ========================
  // CRUD Operations
  // ========================

  async create(userId: string, dto: CreateRecurringDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    // Calculate next run date based on start date
    const startDate = new Date(dto.startDate);
    const nextRunScheduledAt = this.calculateNextRunDate(startDate, dto.frequency, dto.dueDay);

    return this.prisma.recurringTransaction.create({
      data: {
        description: dto.description,
        amount: dto.amount,
        type: dto.type,
        frequency: dto.frequency,
        startDate,
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        dueDay: dto.dueDay,
        nextRunScheduledAt,
        userId,
        accountId: dto.accountId,
        categoryId: dto.categoryId,
        familyId: user.familyId,
      },
    });
  }

  async findAll(userId: string, activeOnly: boolean = true) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    return this.prisma.recurringTransaction.findMany({
      where: {
        familyId: user.familyId,
        ...(activeOnly ? { isActive: true } : {}),
      },
      include: {
        category: true,
        account: true,
      },
      orderBy: { nextRunScheduledAt: 'asc' },
    });
  }

  async findOne(id: string, userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const recurring = await this.prisma.recurringTransaction.findFirst({
      where: { id, familyId: user?.familyId },
      include: {
        category: true,
        account: true,
        transactions: {
          orderBy: { date: 'desc' },
          take: 10,
        },
      },
    });

    if (!recurring) throw new NotFoundException('Recurring transaction not found');
    return recurring;
  }

  async update(id: string, userId: string, dto: UpdateRecurringDto) {
    const existing = await this.findOne(id, userId);

    return this.prisma.recurringTransaction.update({
      where: { id: existing.id },
      data: {
        ...dto,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      },
    });
  }

  async toggleActive(id: string, userId: string) {
    const existing = await this.findOne(id, userId);

    return this.prisma.recurringTransaction.update({
      where: { id: existing.id },
      data: { isActive: !existing.isActive },
    });
  }

  async softDelete(id: string, userId: string) {
    const existing = await this.findOne(id, userId);

    return this.prisma.recurringTransaction.update({
      where: { id: existing.id },
      data: { isActive: false },
    });
  }

  // ========================
  // CronJob - Generate Due Transactions
  // ========================

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async processDueTransactions() {
    this.logger.log('Starting daily recurring transactions processing...');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Find active recurring transactions where nextRunScheduledAt is today or earlier
    const dueRecurrings = await this.prisma.recurringTransaction.findMany({
      where: {
        isActive: true,
        nextRunScheduledAt: {
          lte: tomorrow, // Due today or earlier (to catch missed ones)
        },
        OR: [
          { endDate: null },
          { endDate: { gte: today } },
        ],
      },
    });

    this.logger.log(`Found ${dueRecurrings.length} recurring transactions to process`);

    for (const recurring of dueRecurrings) {
      try {
        await this.generateTransactionIfNotExists(recurring, today);
      } catch (error) {
        this.logger.error(`Failed to process recurring ${recurring.id}: ${error.message}`);
      }
    }

    this.logger.log('Daily recurring transactions processing completed');
  }

  private async generateTransactionIfNotExists(recurring: any, targetDate: Date) {
    const month = targetDate.getMonth();
    const year = targetDate.getFullYear();

    // IDEMPOTENCY CHECK: Check if transaction already exists for this month/year
    const existingTransaction = await this.prisma.transaction.findFirst({
      where: {
        recurringTransactionId: recurring.id,
        date: {
          gte: new Date(year, month, 1),
          lt: new Date(year, month + 1, 1),
        },
      },
    });

    if (existingTransaction) {
      this.logger.log(`Transaction already exists for recurring ${recurring.id} in ${month + 1}/${year}`);
      // Still update nextRunScheduledAt to next month
      await this.updateNextRun(recurring);
      return;
    }

    // Create the real transaction
    const dueDate = new Date(year, month, recurring.dueDay || 1);

    await this.prisma.$transaction(async (tx) => {
      await tx.transaction.create({
        data: {
          amount: recurring.amount,
          type: recurring.type,
          description: recurring.description,
          date: dueDate,
          status: TransactionStatus.PENDING,
          paymentMethod: PaymentMethod.DEBIT, // Default
          accountId: recurring.accountId,
          categoryId: recurring.categoryId,
          userId: recurring.userId,
          recurringTransactionId: recurring.id,
        },
      });

      await tx.recurringTransaction.update({
        where: { id: recurring.id },
        data: {
          lastProcessedAt: new Date(),
          nextRunScheduledAt: this.calculateNextRunDate(
            dueDate,
            recurring.frequency,
            recurring.dueDay
          ),
        },
      });
    });

    this.logger.log(`Created transaction for recurring ${recurring.id}: ${recurring.description}`);
  }

  private async updateNextRun(recurring: any) {
    const nextDate = this.calculateNextRunDate(
      recurring.nextRunScheduledAt || new Date(),
      recurring.frequency,
      recurring.dueDay
    );

    await this.prisma.recurringTransaction.update({
      where: { id: recurring.id },
      data: { nextRunScheduledAt: nextDate },
    });
  }

  private calculateNextRunDate(fromDate: Date, frequency: Frequency, dueDay?: number): Date {
    const next = new Date(fromDate);
    
    switch (frequency) {
      case Frequency.WEEKLY:
        next.setDate(next.getDate() + 7);
        break;
      case Frequency.MONTHLY:
        next.setMonth(next.getMonth() + 1);
        if (dueDay) {
          next.setDate(Math.min(dueDay, this.getDaysInMonth(next)));
        }
        break;
      case Frequency.YEARLY:
        next.setFullYear(next.getFullYear() + 1);
        break;
      case Frequency.CUSTOM:
        // For CUSTOM, default to monthly
        next.setMonth(next.getMonth() + 1);
        break;
    }

    return next;
  }

  private getDaysInMonth(date: Date): number {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }

  // ========================
  // Projection (Cashflow Forecast)
  // ========================

  async getProjection(userId: string, startDate: Date, endDate: Date) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    // 1. Get current account balances
    const accounts = await this.prisma.account.findMany({
      where: { familyId: user.familyId, isActive: true },
      select: { id: true, name: true, balance: true },
    });

    const initialBalance = accounts.reduce((sum, acc) => sum + Number(acc.balance), 0);

    // 2. Get REAL transactions in period (PENDING or PAID)
    const realTransactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        date: { gte: startDate, lte: endDate },
        status: { in: [TransactionStatus.PENDING, TransactionStatus.PAID] },
      },
      orderBy: { date: 'asc' },
      include: { category: true, recurringTransaction: true },
    });

    // 3. Get active recurring templates
    const recurringTemplates = await this.prisma.recurringTransaction.findMany({
      where: {
        familyId: user.familyId,
        isActive: true,
        startDate: { lte: endDate },
        OR: [
          { endDate: null },
          { endDate: { gte: startDate } },
        ],
      },
      include: { category: true },
    });

    // 4. Generate VIRTUAL transactions from templates
    const virtualTransactions = this.generateVirtualTransactions(
      recurringTemplates,
      startDate,
      endDate,
      realTransactions
    );

    // 5. Combine and sort
    const allProjections = [
      ...realTransactions.map((t) => ({
        date: t.date,
        description: t.description,
        amount: Number(t.amount),
        type: t.type,
        source: 'REAL' as const,
        status: t.status,
        category: t.category?.name,
      })),
      ...virtualTransactions,
    ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // 6. Calculate running balance
    let runningBalance = initialBalance;
    const projectionsWithBalance = allProjections.map((p) => {
      const signedAmount = p.type === 'INCOME' ? p.amount : -p.amount;
      runningBalance += signedAmount;
      return {
        ...p,
        balance: Math.round(runningBalance * 100) / 100,
      };
    });

    return {
      initialBalance,
      projections: projectionsWithBalance,
      summary: {
        totalIncome: allProjections.filter((p) => p.type === 'INCOME').reduce((s, p) => s + p.amount, 0),
        totalExpenses: allProjections.filter((p) => p.type === 'EXPENSE').reduce((s, p) => s + p.amount, 0),
        finalBalance: runningBalance,
      },
    };
  }

  private generateVirtualTransactions(
    templates: any[],
    startDate: Date,
    endDate: Date,
    existingTransactions: any[]
  ) {
    const virtual: any[] = [];

    for (const template of templates) {
      let currentDate = new Date(template.startDate);
      
      // Move to first occurrence within the range
      while (currentDate < startDate) {
        currentDate = this.calculateNextRunDate(currentDate, template.frequency, template.dueDay);
      }

      // Generate virtual transactions until endDate
      while (currentDate <= endDate) {
        // Check end date
        if (template.endDate && currentDate > new Date(template.endDate)) {
          break;
        }

        // DOUBLE-COUNTING CHECK: Skip if real transaction exists for this date
        const hasRealTransaction = existingTransactions.some(
          (t) =>
            t.recurringTransactionId === template.id &&
            t.date.getMonth() === currentDate.getMonth() &&
            t.date.getFullYear() === currentDate.getFullYear()
        );

        if (!hasRealTransaction) {
          virtual.push({
            date: new Date(currentDate),
            description: template.description,
            amount: Number(template.amount),
            type: template.type,
            source: 'PROJECTED' as const,
            status: 'PROJECTED',
            category: template.category?.name,
            recurringId: template.id,
          });
        }

        currentDate = this.calculateNextRunDate(currentDate, template.frequency, template.dueDay);
      }
    }

    return virtual;
  }
}

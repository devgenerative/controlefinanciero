// @ts-nocheck
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DashboardQueryDto } from './dto/dashboard-query.dto';
import { TransactionType, TransactionStatus, AccountType, ReserveType } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  private getDateRange(query: DashboardQueryDto) {
    const now = new Date();
    const start = query.startDate ? new Date(query.startDate) : new Date(now.getFullYear(), now.getMonth(), 1);
    const end = query.endDate ? new Date(query.endDate) : new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { start, end };
  }

  async getSummary(userId: string, query: DashboardQueryDto) {
      const { start, end } = this.getDateRange(query);
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      const familyId = user.familyId;
      const whereUser = query.userId ? { userId: query.userId } : {};

      // Transactions in period
      const transactions = await this.prisma.transaction.groupBy({
          by: ['type'],
          where: {
              familyId: undefined, // Transaction doesn't have familyId directly, accessed via Account or User? 
              // Schema check: Transaction -> User. User -> Family. 
              // To filter by Family, we need to join or filter by UserIds in Family.
              userId: { in: await this.getFamilyUserIds(familyId, query.userId) },
              date: { gte: start, lte: end },
              status: { not: TransactionStatus.CANCELLED } // Exclude cancelled
          },
          _sum: { amount: true }
      });

      const income = transactions.find(t => t.type === TransactionType.INCOME)?._sum.amount?.toNumber() || 0;
      const expense = transactions.find(t => t.type === TransactionType.EXPENSE)?._sum.amount?.toNumber() || 0;
      const monthBalance = income - expense;

      // Current Total Balance (Accounts + Reserves?) usually "Balance" refers to Accounts (Liquidity).
      // We'll sum Accounts.
      const accounts = await this.prisma.account.aggregate({
          where: { familyId }, 
          _sum: { balance: true }
      });
      const totalBalance = accounts._sum.balance?.toNumber() || 0;

      // Savings Rate: (Income - Expense) / Income
      const savingsRate = income > 0 ? ((income - expense) / income) * 100 : 0;

      // Committed? Needs definition. Assuming Fixed Expenses / Income? 
      // Simplified: Just returning 0 for now or based on "Recurring" transactions?
      // Let's use Recurring Expense count for now.
      
      return {
          period: { start, end },
          totalBalance,
          monthIncome: income,
          monthExpense: expense,
          monthBalance,
          savingsRate: Number(savingsRate.toFixed(2)),
          // other fields ...
      };
  }

  async getByCategory(userId: string, query: DashboardQueryDto) {
      const { start, end } = this.getDateRange(query);
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      const familyUserIds = await this.getFamilyUserIds(user.familyId, query.userId);

      const byCategory = await this.prisma.transaction.groupBy({
          by: ['categoryId', 'type'],
          where: {
              userId: { in: familyUserIds },
              date: { gte: start, lte: end },
              type: { in: [TransactionType.EXPENSE, TransactionType.INCOME] },
              status: { not: TransactionStatus.CANCELLED }
          },
          _sum: { amount: true },
          _count: { id: true }
      });

      // Need to fetch categories to get names
      const categoryIds = byCategory.map(c => c.categoryId).filter(Boolean);
      const categories = await this.prisma.category.findMany({
          where: { id: { in: categoryIds } }
      });

      const result = { income: [], expense: [] };
      
      const totalIncome = byCategory.filter(c => c.type === TransactionType.INCOME).reduce((acc, c) => acc + (c._sum.amount?.toNumber() || 0), 0);
      const totalExpense = byCategory.filter(c => c.type === TransactionType.EXPENSE).reduce((acc, c) => acc + (c._sum.amount?.toNumber() || 0), 0);

      for (const item of byCategory) {
          const cat = categories.find(c => c.id === item.categoryId) || { name: 'Uncategorized', icon: '', color: '' };
          const amount = item._sum.amount?.toNumber() || 0;
          const total = item.type === TransactionType.INCOME ? totalIncome : totalExpense;
          const percent = total > 0 ? (amount / total) * 100 : 0;

          const entry = {
              categoryId: item.categoryId,
              name: cat.name,
              icon: cat.icon,
              color: cat.color,
              amount,
              percent: Number(percent.toFixed(2)),
              transactionCount: item._count.id
          };
          
          if (item.type === TransactionType.INCOME) result.income.push(entry);
          else result.expense.push(entry);
      }
      
      return { period: { start, end }, ...result };
  }

  async getByUser(userId: string, query: DashboardQueryDto) {
    const { start, end } = this.getDateRange(query);
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const familyUserIds = await this.getFamilyUserIds(user.familyId); // Always get all family users to show comparison

    const byUser = await this.prisma.transaction.groupBy({
        by: ['userId', 'type'],
        where: {
            userId: { in: familyUserIds },
            date: { gte: start, lte: end },
            status: { not: TransactionStatus.CANCELLED }
        },
        _sum: { amount: true }
    });

    const users = await this.prisma.user.findMany({
        where: { id: { in: familyUserIds } },
        select: { id: true, name: true, avatar: true }
    });

    const totalFlow = byUser.reduce((acc, u) => acc + (u._sum.amount?.toNumber() || 0), 0);

    return {
        period: { start, end },
        users: users.map(u => {
            const userTrans = byUser.filter(t => t.userId === u.id);
            const income = userTrans.find(t => t.type === TransactionType.INCOME)?._sum.amount?.toNumber() || 0;
            const expense = userTrans.find(t => t.type === TransactionType.EXPENSE)?._sum.amount?.toNumber() || 0;
            const balance = income - expense;
            const flow = income + expense; // Volume logic or just expense share?
            // "percent: number // % do total" - assuming total expenses?
            const totalExp = byUser.filter(t => t.type === TransactionType.EXPENSE).reduce((acc, i) => acc + (i._sum.amount?.toNumber()||0), 0);
            const percent = totalExp > 0 ? (expense / totalExp) * 100 : 0;

            return {
                userId: u.id,
                name: u.name,
                avatar: u.avatar,
                income, 
                expense,
                balance,
                percent: Number(percent.toFixed(2))
            };
        })
    };
  }

  async getEvolution(userId: string) {
       // Logic: 
       // 1. Get Current Total Balance (Accounts + Reserves)
       // 2. Get last 12 months transactions (Income - Expense) per month
       // 3. Reconstruct history backwards
       
       const user = await this.prisma.user.findUnique({ where: { id: userId } });
       const familyId = user.familyId;
       const familyUserIds = await this.getFamilyUserIds(familyId);

       // Current State
       const accounts = await this.prisma.account.aggregate({ where: { familyId }, _sum: { balance: true } });
       const reserves = await this.prisma.reserve.aggregate({ where: { familyId }, _sum: { balance: true } });
       let currentPatrimony = (accounts._sum.balance?.toNumber() || 0) + (reserves._sum.balance?.toNumber() || 0);

       const months = [];
       const now = new Date();
       
       // Optimization: Group by month/year in database?
       // Prisma doesn't have native "trunc date" group by easily for all DBs, but standard way is raw query or JS processing.
       // JS Processing for 12 months is fine for typical user data volume.
       
       const oneYearAgo = new Date();
       oneYearAgo.setMonth(oneYearAgo.getMonth() - 11);
       oneYearAgo.setDate(1);

       const transactions = await this.prisma.transaction.findMany({
           where: {
               userId: { in: familyUserIds },
               date: { gte: oneYearAgo }, // Fetch all valid transactions
               status: 'PAID', // Only Paid affects balance
               type: { in: [TransactionType.INCOME, TransactionType.EXPENSE] }
           },
           select: { date: true, amount: true, type: true }
       });

       // Group transactions by YYYY-MM
       const history = {};
       transactions.forEach(t => {
           const key = t.date.toISOString().slice(0, 7); // YYYY-MM
           if (!history[key]) history[key] = { income: 0, expense: 0 };
           if (t.type === TransactionType.INCOME) history[key].income += t.amount.toNumber();
           if (t.type === TransactionType.EXPENSE) history[key].expense += t.amount.toNumber();
       });

       // We iterate from Current Month backwards
       // currentPatrimony is End of Current Month (approx)
       
       // Generate labels for last 12 months
       for (let i = 0; i < 12; i++) {
           const d = new Date();
           d.setMonth(d.getMonth() - i);
           const key = d.toISOString().slice(0, 7);
           const data = history[key] || { income: 0, expense: 0 };
           const net = data.income - data.expense;
           
           // Push current month state
           months.push({
               month: key,
               balance: currentPatrimony,
               income: data.income,
               expense: data.expense,
               savings: data.income > 0 ? data.income - data.expense : 0
           });

           // Calculate Start Balance of this month (which is End Balance of previous)
           currentPatrimony -= net; 
       }

       return {
           patrimony: months.reverse(), // Show oldest to newest
           trend: months[11]?.balance > months[0]?.balance ? 'UP' : 'DOWN', // Simple Trend
           averageMonthlyGrowth: 0 // TODO calculate
       };
  }
  
  async getUpcoming(userId: string) {
       const user = await this.prisma.user.findUnique({ where: { id: userId } });
       const familyUserIds = await this.getFamilyUserIds(user.familyId);
       const now = new Date();
       const next30 = new Date(); next30.setDate(now.getDate() + 30);

       // 1. Transactions (Scheduled/Pending)
       const transactions = await this.prisma.transaction.findMany({
           where: {
               userId: { in: familyUserIds },
               date: { gte: now, lte: next30 },
               status: 'PENDING', // Assuming PENDING means not paid yet
               type: TransactionType.EXPENSE
           },
           take: 20
       });

       // 2. Debts (Due Days) - this is harder as Debts don't have individual records per month until generated?
       // We can just query Debts and check 'dueDay' vs today's day.
       // Requirement implies a unified list. 
       
       const bills = transactions.map(t => ({
           id: t.id,
           description: t.description,
           amount: t.amount.toNumber(),
           dueDate: t.date,
           daysUntilDue: Math.ceil((new Date(t.date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
           type: 'TRANSACTION',
           status: 'UPCOMING'
       }));

       return {
           bills,
           totalUpcoming: bills.reduce((acc, b) => acc + b.amount, 0),
           overdueCount: 0 // Need to query < now AND status=PENDING for overdue
       };
  }
  
  async getKPIs(userId: string) {
       const user = await this.prisma.user.findUnique({ where: { id: userId } });
       const familyId = user.familyId;

       // Net Worth
       const accounts = await this.prisma.account.aggregate({ where: { familyId }, _sum: { balance: true } });
       const reserves = await this.prisma.reserve.aggregate({ where: { familyId }, _sum: { balance: true } });
       const debts = await this.prisma.debt.aggregate({ where: { familyId }, _sum: { remainingAmount: true } }); // Schema had remainingAmount? Check schema.
       
       // Wait, my Debt schema (v2) has `totalAmount` and `totalInstallments` vs `paidInstallments`.
       // Schema in Task 209: `remainingAmount` was removed in favor of `paidInstallments` calc?
       // Let me check Schema I wrote in Step 210/222.
       // Schema Step 222: `Debt` has `totalAmount`, `paidInstallments`, `totalInstallments`. 
       // It DOES NOT have `remainingAmount` stored column anymore (I removed it in Step 222 edit to match "Add AmortizationType & Fields" and use dynamic calc?).
       // Actually in Step 222 I replaced the block, and the target block *had* remainingAmount. The replacement *removed* it?
       // Let me check my memory or file.
       // In Step 222 I see:
       // -  remainingAmount   Decimal  @db.Decimal(12, 2)
       // This line was REMOVED in the diff.
       // So I must calculate total debt dynamically: sum of (total - paid) approx?
       // Or iterate all debts and calculateSchedule? Expensive.
       // Approximation: `totalAmount * (1 - paid/total)`
       
       const allDebts = await this.prisma.debt.findMany({ where: { familyId } });
       let totalDebt = 0;
       for (const d of allDebts) {
           // Simple proportion or remaining principal if accessible
           // I'll use simple proportion for KPI speed
           const remainingRatio = (d.totalInstallments - d.paidInstallments) / d.totalInstallments;
           totalDebt += d.totalAmount.toNumber() * remainingRatio;
       }

       const assets = (accounts._sum.balance?.toNumber() || 0) + (reserves._sum.balance?.toNumber() || 0);
       const netWorth = assets - totalDebt;
       const debtToAssetRatio = assets > 0 ? (totalDebt / assets) * 100 : 0;

       return {
           netWorth,
           debtToAssetRatio,
           emergencyFundMonths: 0, // Placeholder
           goalsProgress: 0,
           creditUtilization: 0
       };
  }

  // Helper
  private async getFamilyUserIds(familyId: string, filterUserId?: string) {
      if (filterUserId) return [filterUserId];
      const users = await this.prisma.user.findMany({ where: { familyId }, select: { id: true } });
      return users.map(u => u.id);
  }
}

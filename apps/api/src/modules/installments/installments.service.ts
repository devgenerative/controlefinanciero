import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class InstallmentsService {
  constructor(private prisma: PrismaService) {}

  async findAllActive(userId: string) {
      // Find installments where not all generated transactions are paid? 
      // Or just return all installments for user's cards?
      // Requirement: "Listar todas parcelas ativas"
      // Since we create N transactions, "Active" installment plan means transactions in the future exist?
      // Or we can just list all installment headers created recently.
      // Let's list all linked to user's cards.
      return this.prisma.installment.findMany({
          where: {
              card: { userId: userId }
          },
          include: { card: true },
          orderBy: { startDate: 'desc' }
      });
  }

  async findOne(id: string, userId: string) {
      const installment = await this.prisma.installment.findFirst({
          where: { id, card: { userId } },
          include: { transactions: true, card: true }
      });
      if (!installment) throw new NotFoundException('Installment plan not found');
      return installment;
  }

  async simulateAnticipation(id: string, userId: string) {
      const installment = await this.findOne(id, userId);
      
      // Filter unpaid transactions (future)
      // Assuming 'PENDING' status or just date > now. 
      // For credit cards, 'PAID' usually means "posted to invoice". 
      // Let's assume we want to anticipate transactions that haven't happened yet.
      // Or simpler: all transactions linked to this installment.
      
      const futureTransactions = installment.transactions.filter(t => t.date > new Date());
      const remainingInstallments = futureTransactions.length;
      
      if (remainingInstallments === 0) return { message: 'No installments to anticipate' };

      const originalTotal = futureTransactions.reduce((acc, t) => acc + t.amount.toNumber(), 0);
      
      // Simple discount logic: 5% per year approx? ~0.4% per month?
      // Let's apply a flat 0.5% discount per month of anticipation per installment.
      let discountedTotal = 0;
      const now = new Date();

      futureTransactions.forEach(t => {
          const monthsDiff = (t.date.getFullYear() - now.getFullYear()) * 12 + (t.date.getMonth() - now.getMonth());
          const discountFactor = Math.max(0, monthsDiff * 0.005); // 0.5% per month
          discountedTotal += t.amount.toNumber() * (1 - discountFactor);
      });

      return {
          originalTotal,
          remainingInstallments,
          discountRate: '0.5% per month',
          discountedTotal: Number(discountedTotal.toFixed(2)),
          savings: Number((originalTotal - discountedTotal).toFixed(2))
      };
  }
}

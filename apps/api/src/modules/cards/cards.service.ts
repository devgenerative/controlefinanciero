import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCardDto, UpdateCardDto } from './dto/cards.dto';

@Injectable()
export class CardsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateCardDto) {
    return this.prisma.card.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    const cards = await this.prisma.card.findMany({
      where: { userId },
      include: {
        transactions: {
            where: {
                date: {
                    gte: new Date(new Date().setDate(1)) // transactions from this month (simplified logic for now)
                }
            }
        }
      }
    });

    // Calculate current invoice (simplified)
    return cards.map(card => {
        const currentInvoice = card.transactions
            .filter(t => t.type === 'EXPENSE')
            .reduce((sum, t) => sum + Number(t.amount), 0);
        
        return {
            ...card,
            currentInvoice
        };
    });
  }

  async findOne(userId: string, id: string) {
    const card = await this.prisma.card.findUnique({
      where: { id, userId },
    });

    if (!card) throw new NotFoundException('Card not found');
    return card;
  }

  async update(userId: string, id: string, dto: UpdateCardDto) {
    const card = await this.prisma.card.findUnique({ where: { id, userId } });
    if (!card) throw new NotFoundException('Card not found');

    return this.prisma.card.update({
      where: { id },
      data: dto,
    });
  }

  async remove(userId: string, id: string) {
    const card = await this.prisma.card.findUnique({ where: { id, userId } });
    if (!card) throw new NotFoundException('Card not found');

    return this.prisma.card.delete({
      where: { id },
    });
  }
}

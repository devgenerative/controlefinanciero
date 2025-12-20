import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAccountDto, UpdateAccountDto } from './dto/account.dto';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateAccountDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    return this.prisma.account.create({
      data: {
        name: dto.name,
        type: dto.type,
        balance: dto.balance || 0,
        color: dto.color,
        userId,
        familyId: user.familyId,
      },
    });
  }

  async findAll(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    return this.prisma.account.findMany({
      where: { 
        familyId: user.familyId,
        isActive: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string, userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const account = await this.prisma.account.findFirst({
      where: { id, familyId: user?.familyId },
    });

    if (!account) throw new NotFoundException('Account not found');
    return account;
  }

  async update(id: string, userId: string, dto: UpdateAccountDto) {
    const existing = await this.findOne(id, userId);

    return this.prisma.account.update({
      where: { id: existing.id },
      data: dto,
    });
  }

  async delete(id: string, userId: string) {
    const existing = await this.findOne(id, userId);

    return this.prisma.account.update({
      where: { id: existing.id },
      data: { isActive: false },
    });
  }
}

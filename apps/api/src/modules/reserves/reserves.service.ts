import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReserveDto, UpdateReserveDto, OperateReserveDto } from './dto/reserves.dto';

@Injectable()
export class ReservesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateReserveDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    
    return this.prisma.reserve.create({
      data: {
        ...dto,
        familyId: user.familyId,
      },
    });
  }

  async findAll(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    return this.prisma.reserve.findMany({
      where: { familyId: user.familyId },
    });
  }

  async findOne(userId: string, id: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    
    const reserve = await this.prisma.reserve.findFirst({
      where: { id, familyId: user.familyId },
    });

    if (!reserve) throw new NotFoundException('Reserve not found');
    return reserve;
  }

  async update(userId: string, id: string, dto: UpdateReserveDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    
    const reserve = await this.prisma.reserve.findFirst({ where: { id, familyId: user.familyId } });
    if (!reserve) throw new NotFoundException('Reserve not found');

    return this.prisma.reserve.update({
      where: { id },
      data: dto,
    });
  }

  async operate(userId: string, id: string, dto: OperateReserveDto) {
      const reserve = await this.findOne(userId, id);
      
      const newBalance = dto.type === 'DEPOSIT' 
        ? Number(reserve.balance) + dto.amount 
        : Number(reserve.balance) - dto.amount;

      return this.prisma.reserve.update({
          where: { id },
          data: { balance: newBalance }
      });
  }

  async remove(userId: string, id: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    
    const reserve = await this.prisma.reserve.findFirst({ where: { id, familyId: user.familyId } });
    if (!reserve) throw new NotFoundException('Reserve not found');

    return this.prisma.reserve.delete({
      where: { id },
    });
  }
}

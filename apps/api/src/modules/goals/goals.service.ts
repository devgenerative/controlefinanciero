import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateGoalDto, UpdateGoalDto } from './dto/goals.dto';

@Injectable()
export class GoalsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateGoalDto) {
    // Get user's family
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    
    return this.prisma.goal.create({
      data: {
        ...dto,
        familyId: user.familyId,
      },
    });
  }

  async findAll(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    return this.prisma.goal.findMany({
      where: { familyId: user.familyId },
      include: {
          contributions: true
      }
    });
  }

  async findOne(userId: string, id: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    
    const goal = await this.prisma.goal.findFirst({
      where: { id, familyId: user.familyId },
      include: { contributions: true }
    });

    if (!goal) throw new NotFoundException('Goal not found');
    return goal;
  }

  async update(userId: string, id: string, dto: UpdateGoalDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    
    const goal = await this.prisma.goal.findFirst({ where: { id, familyId: user.familyId } });
    if (!goal) throw new NotFoundException('Goal not found');

    return this.prisma.goal.update({
      where: { id },
      data: dto,
    });
  }

  async remove(userId: string, id: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    
    const goal = await this.prisma.goal.findFirst({ where: { id, familyId: user.familyId } });
    if (!goal) throw new NotFoundException('Goal not found');

    return this.prisma.goal.delete({
      where: { id },
    });
  }
}

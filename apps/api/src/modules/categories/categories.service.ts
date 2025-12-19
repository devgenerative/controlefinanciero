import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryType, Role } from '@prisma/client';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createCategoryDto: CreateCategoryDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    // If subcategory, ensure parent exists in same family and matches type
    if (createCategoryDto.parentId) {
      const parent = await this.prisma.category.findFirst({
        where: { id: createCategoryDto.parentId, familyId: user.familyId },
      });

      if (!parent) throw new BadRequestException('Parent category not found');
      if (parent.type !== createCategoryDto.type) {
        throw new BadRequestException('Subcategory type must match parent type');
      }
    }

    return this.prisma.category.create({
      data: {
        ...createCategoryDto,
        familyId: user.familyId,
        isDefault: false,
      },
    });
  }

  async findAll(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const categories = await this.prisma.category.findMany({
      where: { familyId: user.familyId },
      include: { children: true },
      orderBy: { name: 'asc' },
    });

    // Build trees for Income and Expense
    const income = this.buildTree(categories, CategoryType.INCOME);
    const expense = this.buildTree(categories, CategoryType.EXPENSE);

    return { income, expense };
  }

  private buildTree(categories: any[], type: CategoryType) {
    // Filter by type and only root categories (no parentId)
    // The query included children, so we can map them directly if they are loaded,
    // but typically `children` relation loads only one level.
    // Since we fetched ALL categories for the family, we can assemble them in memory for full depth if needed,
    // but the requirement implies a simple 2-level structure mostly.
    // However, `findAll` usually returns flat list or we construct it.
    // Let's filter roots first.
    const roots = categories.filter(
      (c) => c.type === type && c.parentId === null,
    );

    return roots.map((root) => ({
      ...root,
      children: categories
        .filter((c) => c.parentId === root.id)
        .sort((a, b) => a.name.localeCompare(b.name)),
    }));
  }

  async findOne(id: string, userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const category = await this.prisma.category.findFirst({
      where: { id, familyId: user?.familyId },
      include: {
        _count: { select: { transactions: true } },
      },
    });

    if (!category) throw new NotFoundException('Category not found');

    // Basic stats calculation could go here (e.g. total spent this month)
    // For now returning category info
    return category;
  }

  async update(id: string, userId: string, updateCategoryDto: UpdateCategoryDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    
    // Check ownership and if it is default
    const existing = await this.prisma.category.findFirst({
        where: { id, familyId: user?.familyId }
    });

    if (!existing) throw new NotFoundException('Category not found');
    if (existing.isDefault) throw new BadRequestException('Cannot update default categories');

    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  async remove(id: string, userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const category = await this.prisma.category.findFirst({
      where: { id, familyId: user?.familyId },
      include: { _count: { select: { transactions: true, children: true } } },
    });

    if (!category) throw new NotFoundException('Category not found');
    if (category.isDefault) throw new BadRequestException('Cannot delete default categories');
    if (category._count.transactions > 0) throw new BadRequestException('Cannot delete category with transactions');
    if (category._count.children > 0) throw new BadRequestException('Cannot delete category with subcategories. Delete them first.');

    return this.prisma.category.delete({ where: { id } });
  }

  // Seed method to be called when a family is created (e.g., from auth service)
  // Or manually for existing families if we implement a migration script
  async seedDefaults(familyId: string) {
      const defaults = [
          // INCOME
          { name: 'Salário', type: CategoryType.INCOME, icon: 'briefcase', color: '#10B981' },
          { name: 'Freelance', type: CategoryType.INCOME, icon: 'laptop', color: '#3B82F6' },
          { name: 'Investimentos', type: CategoryType.INCOME, icon: 'trending-up', color: '#8B5CF6' },
          { name: 'Bônus', type: CategoryType.INCOME, icon: 'gift', color: '#F59E0B' },
          { name: 'Outros', type: CategoryType.INCOME, icon: 'plus-circle', color: '#6B7280' },
          // EXPENSE Roots
          { 
              name: 'Moradia', type: CategoryType.EXPENSE, icon: 'home', color: '#EF4444',
              children: ['Aluguel', 'Condomínio', 'IPTU', 'Manutenção']
          },
          { 
              name: 'Alimentação', type: CategoryType.EXPENSE, icon: 'utensils', color: '#F97316',
              children: ['Mercado', 'Restaurante', 'Delivery']
          },
          { 
              name: 'Transporte', type: CategoryType.EXPENSE, icon: 'car', color: '#3B82F6',
              children: ['Combustível', 'Uber/99', 'Manutenção', 'Estacionamento']
          },
          { 
              name: 'Saúde', type: CategoryType.EXPENSE, icon: 'heart', color: '#EC4899',
              children: ['Plano de saúde', 'Farmácia', 'Consultas']
          },
          { name: 'Educação', type: CategoryType.EXPENSE, icon: 'book', color: '#8B5CF6' },
          { name: 'Lazer', type: CategoryType.EXPENSE, icon: 'gamepad', color: '#10B981' },
          { name: 'Assinaturas', type: CategoryType.EXPENSE, icon: 'repeat', color: '#6366F1' },
          { name: 'Outros', type: CategoryType.EXPENSE, icon: 'more-horizontal', color: '#6B7280' },
      ];

      for (const cat of defaults) {
          const { children, ...data } = cat;
          const parent = await this.prisma.category.create({
              data: { ...data, familyId, isDefault: true }
          });

          if (children && children.length > 0) {
              await this.prisma.category.createMany({
                  data: children.map(childName => ({
                      name: childName,
                      type: parent.type,
                      familyId,
                      isDefault: true,
                      parentId: parent.id,
                      color: parent.color, // inherit color default
                      icon: parent.icon // inherit icon default
                  }))
              });
          }
      }
  }
}

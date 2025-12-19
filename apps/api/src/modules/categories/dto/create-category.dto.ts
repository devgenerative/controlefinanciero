import { IsEnum, IsNotEmpty, IsOptional, IsString, IsHexColor, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CategoryType } from '@prisma/client';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Alimentação' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: CategoryType, example: CategoryType.EXPENSE })
  @IsEnum(CategoryType)
  type: CategoryType;

  @ApiPropertyOptional({ example: 'utensils' })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiPropertyOptional({ example: '#F97316' })
  @IsHexColor()
  @IsOptional()
  color?: string;

  @ApiPropertyOptional({ description: 'Parent Category ID for subcategories' })
  @IsUUID()
  @IsOptional()
  parentId?: string;
}

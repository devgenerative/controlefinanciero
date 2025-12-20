import { IsString, IsNumber, IsEnum, IsDateString, IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Frequency, TransactionType } from '@prisma/client';

export class CreateRecurringDto {
  @ApiProperty({ description: 'Description of the recurring transaction' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Amount of each transaction' })
  @IsNumber()
  @Type(() => Number)
  amount: number;

  @ApiProperty({ enum: TransactionType, description: 'INCOME or EXPENSE' })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({ enum: Frequency, description: 'Frequency: WEEKLY, MONTHLY, YEARLY, CUSTOM' })
  @IsEnum(Frequency)
  frequency: Frequency;

  @ApiProperty({ description: 'Start date (ISO 8601)' })
  @IsDateString()
  startDate: string;

  @ApiPropertyOptional({ description: 'End date (optional, ISO 8601)' })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Day of month for due date (1-31)' })
  @IsInt()
  @Min(1)
  @Max(31)
  @IsOptional()
  @Type(() => Number)
  dueDay?: number;

  @ApiProperty({ description: 'Account ID to use for transactions' })
  @IsString()
  accountId: string;

  @ApiPropertyOptional({ description: 'Category ID (optional)' })
  @IsString()
  @IsOptional()
  categoryId?: string;
}

export class UpdateRecurringDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  amount?: number;

  @ApiPropertyOptional({ enum: TransactionType })
  @IsEnum(TransactionType)
  @IsOptional()
  type?: TransactionType;

  @ApiPropertyOptional({ enum: Frequency })
  @IsEnum(Frequency)
  @IsOptional()
  frequency?: Frequency;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional()
  @IsInt()
  @Min(1)
  @Max(31)
  @IsOptional()
  @Type(() => Number)
  dueDay?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  accountId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  categoryId?: string;
}

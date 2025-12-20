import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  IsDateString,
  Min,
  IsArray,
  IsBoolean,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TransactionType, PaymentMethod } from '@prisma/client';

export class CreateTransactionDto {
  @ApiProperty({ example: 150.00 })
  @IsNumber()
  @Min(0.01)
  @Type(() => Number)
  amount: number;

  @ApiProperty({ enum: TransactionType })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({ example: 'Grocery shopping' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: '2023-12-25T10:00:00Z' })
  @IsDateString()
  date: string;

  @ApiPropertyOptional({ example: 'uuid-category' })
  @ValidateIf(o => o.type !== TransactionType.TRANSFER)
  @IsUUID()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({ example: 'uuid-account-source' })
  @IsUUID()
  @IsNotEmpty()
  accountId: string;

  @ApiPropertyOptional({ description: 'Destination Account for Transfers' })
  @ValidateIf(o => o.type === TransactionType.TRANSFER)
  @IsUUID()
  @IsNotEmpty()
  accountToId?: string;

  @ApiProperty({ enum: PaymentMethod, default: PaymentMethod.DEBIT })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiPropertyOptional({ description: 'Required if PaymentMethod is CREDIT' })
  @ValidateIf(o => o.paymentMethod === PaymentMethod.CREDIT)
  @IsUUID()
  @IsNotEmpty()
  cardId?: string;

  @ApiPropertyOptional({ example: 12, description: 'Number of installments' })
  @ValidateIf(o => o.paymentMethod === PaymentMethod.CREDIT)
  @IsNumber()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  installments?: number;

  @ApiPropertyOptional({ example: ['food', 'monthly'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isRecurring?: boolean;
}

import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min, Max, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DebtType, AmortizationType } from '@prisma/client';

export class CreateDebtDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: DebtType })
  @IsEnum(DebtType)
  type: DebtType;

  @ApiProperty()
  @IsNumber()
  @Min(0.01)
  totalAmount: number;

  @ApiProperty({ description: 'Monthly interest rate (%)', example: 1.5 })
  @IsNumber()
  @Min(0)
  interestRate: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  totalInstallments: number;

  @ApiPropertyOptional({ default: 0 })
  @IsInt()
  @Min(0)
  @IsOptional()
  paidInstallments?: number;

  @ApiProperty()
  @IsDateString()
  startDate: string;

  @ApiProperty({ description: 'Day of month (1-31)' })
  @IsInt()
  @Min(1)
  @Max(31)
  dueDay: number;

  @ApiProperty({ enum: AmortizationType, default: AmortizationType.SAC })
  @IsEnum(AmortizationType)
  @IsOptional()
  amortizationType: AmortizationType = AmortizationType.SAC;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;
}

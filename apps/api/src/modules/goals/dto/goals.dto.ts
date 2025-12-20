import { IsString, IsNumber, IsEnum, IsOptional, IsDateString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export enum GoalType {
  EMERGENCY = 'EMERGENCY',
  TRAVEL = 'TRAVEL',
  PURCHASE = 'PURCHASE',
  INVESTMENT = 'INVESTMENT',
  OTHER = 'OTHER',
}

export class CreateGoalDto {
  @IsString()
  name: string;

  @IsEnum(GoalType)
  type: GoalType;

  @IsNumber()
  @Min(0.01)
  @Type(() => Number)
  targetAmount: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  currentAmount?: number;

  @IsDateString()
  @IsOptional()
  deadline?: string;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsString()
  @IsOptional()
  color?: string;
  
  @IsString()
  @IsOptional()
  categoryId?: string;
}

export class UpdateGoalDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  targetAmount?: number;

  @IsNumber()
  @IsOptional()
  currentAmount?: number;

  @IsDateString()
  @IsOptional()
  deadline?: string;
}

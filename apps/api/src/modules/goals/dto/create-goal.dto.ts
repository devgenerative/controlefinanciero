import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min, IsDateString, IsHexColor } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GoalType } from '@prisma/client';

export class CreateGoalDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: GoalType })
  @IsEnum(GoalType)
  type: GoalType;

  @ApiProperty()
  @IsNumber()
  @Min(0.01)
  targetAmount: number;

  @ApiPropertyOptional({ default: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  currentAmount?: number;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  deadline?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiPropertyOptional()
  @IsHexColor()
  @IsOptional()
  color?: string;
}

import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ReserveType } from '@prisma/client';

export class CreateReserveDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: ReserveType })
  @IsEnum(ReserveType)
  type: ReserveType;

  @ApiPropertyOptional({ default: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  initialBalance?: number;

  @ApiPropertyOptional({ description: 'Expected annual return (%)' })
  @IsNumber()
  @IsOptional()
  expectedReturn?: number;
}

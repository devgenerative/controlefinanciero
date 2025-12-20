import { IsString, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AccountType } from '@prisma/client';

export class CreateAccountDto {
  @ApiProperty({ description: 'Account name' })
  @IsString()
  name: string;

  @ApiProperty({ enum: AccountType, description: 'Account type' })
  @IsEnum(AccountType)
  type: AccountType;

  @ApiPropertyOptional({ description: 'Initial balance' })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  balance?: number;

  @ApiPropertyOptional({ description: 'Color for the account' })
  @IsString()
  @IsOptional()
  color?: string;
}

export class UpdateAccountDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ enum: AccountType })
  @IsEnum(AccountType)
  @IsOptional()
  type?: AccountType;

  @ApiPropertyOptional()
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  balance?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  color?: string;

  @ApiPropertyOptional()
  @IsOptional()
  isActive?: boolean;
}

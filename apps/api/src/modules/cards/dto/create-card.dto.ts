import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, MinLength, MaxLength, IsHexColor } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum CardBrand {
  VISA = 'VISA',
  MASTERCARD = 'MASTERCARD',
  ELO = 'ELO',
  AMEX = 'AMEX',
  HIPERCARD = 'HIPERCARD',
  OTHER = 'OTHER',
}

export class CreateCardDto {
  @ApiProperty({ example: 'Nubank' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: CardBrand, example: CardBrand.MASTERCARD })
  @IsEnum(CardBrand)
  brand: CardBrand;

  @ApiProperty({ example: '1234', description: 'Last 4 digits' })
  @IsString()
  @MinLength(4)
  @MaxLength(4)
  lastFourDigits: string;

  @ApiProperty({ example: 5000.0 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  creditLimit: number;

  @ApiProperty({ example: 25, description: 'Day of month (1-31)' })
  @IsInt()
  @Min(1)
  @Max(31)
  @Type(() => Number)
  closingDay: number;

  @ApiProperty({ example: 5, description: 'Day of month (1-31)' })
  @IsInt()
  @Min(1)
  @Max(31)
  @Type(() => Number)
  dueDay: number;

  @ApiPropertyOptional({ example: '#820AD1' })
  @IsHexColor()
  @IsOptional()
  color?: string;
}

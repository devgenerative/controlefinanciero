import { IsString, IsNumber, IsEnum, IsInt, IsOptional, Length, Min } from 'class-validator';

export enum CardBrand {
  VISA = 'VISA',
  MASTERCARD = 'MASTERCARD',
  ELO = 'ELO',
  AMEX = 'AMEX',
  OTHER = 'OTHER',
}

export class CreateCardDto {
  @IsString()
  @Length(3)
  name: string;

  @IsEnum(CardBrand)
  brand: CardBrand;

  @IsString()
  @Length(4, 4)
  lastFourDigits: string;

  @IsNumber()
  @Min(0)
  creditLimit: number;

  @IsInt()
  @Min(1)
  closingDay: number;

  @IsInt()
  @Min(1)
  dueDay: number;

  @IsString()
  @IsOptional()
  color?: string;
}

export class UpdateCardDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  creditLimit?: number;

  @IsString()
  @IsOptional()
  color?: string;
}

import { IsString, IsNumber, IsEnum, IsOptional, Min } from 'class-validator';

export enum ReserveType {
  EMERGENCY = 'EMERGENCY',
  SHORT_TERM = 'SHORT_TERM',
  MEDIUM_TERM = 'MEDIUM_TERM',
  LONG_TERM = 'LONG_TERM',
}

export class CreateReserveDto {
  @IsString()
  name: string;

  @IsEnum(ReserveType)
  type: ReserveType;

  @IsNumber()
  @Min(0)
  balance: number;

  @IsString()
  @IsOptional()
  color?: string;

  @IsNumber()
  @IsOptional()
  expectedReturn?: number;
}

export class UpdateReserveDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  balance?: number;
  
  @IsString()
  @IsOptional()
  color?: string;
}

export class OperateReserveDto {
    @IsEnum(['DEPOSIT', 'WITHDRAW'])
    type: 'DEPOSIT' | 'WITHDRAW';

    @IsNumber()
    @Min(0.01)
    amount: number;
}

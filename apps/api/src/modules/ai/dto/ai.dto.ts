import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ClassifyTransactionDto {
  @IsString()
  description: string;

  @IsNumber()
  amount: number;

  @IsString()
  @IsOptional()
  paymentMethod?: string;
}

export class ChatDto {
  @IsString()
  message: string;

  @IsOptional()
  context?: any[];
}

export class SimulateDto {
    @IsString()
    type: 'SAVE_MONTHLY' | 'ANTICIPATE_DEBT' | 'INCREASE_GOAL' | 'CUT_CATEGORY';

    @IsOptional()
    params?: any;
}

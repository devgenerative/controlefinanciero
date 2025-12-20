import { IsDateString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterPaymentDto {
  @ApiProperty()
  @IsNumber()
  @Min(0.01)
  @Type(() => Number)
  amount: number;

  @ApiProperty()
  @IsDateString()
  date: string;
}

import { IsNumber, Min, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ContributeDto {
  @ApiProperty()
  @IsNumber()
  @Min(0.01)
  @Type(() => Number)
  amount: number;

  @ApiProperty()
  @IsDateString()
  date: string;
}

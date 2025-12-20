import { IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class TransferReserveDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  targetReserveId: string;

  @ApiProperty()
  @IsNumber()
  @Min(0.01)
  @Type(() => Number)
  amount: number;
}

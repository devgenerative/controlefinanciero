import { IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TransferReserveDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  targetReserveId: string;

  @ApiProperty()
  @IsNumber()
  @Min(0.01)
  amount: number;
}

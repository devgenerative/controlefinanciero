import { IsBoolean, IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { NotificationType } from '@prisma/client';

export class UpdatePreferenceDto {
  @ApiProperty({ enum: NotificationType })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty()
  @IsBoolean()
  email: boolean;

  @ApiProperty()
  @IsBoolean()
  push: boolean;

  @ApiProperty()
  @IsBoolean()
  inApp: boolean;

  @ApiProperty()
  @IsBoolean()
  whatsapp: boolean;
}

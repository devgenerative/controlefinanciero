import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { InstallmentsService } from './installments.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Installments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('installments')
export class InstallmentsController {
  constructor(private readonly installmentsService: InstallmentsService) {}

  @Get()
  @ApiOperation({ summary: 'List all installment plans' })
  findAll(@CurrentUser() user: any) {
    return this.installmentsService.findAllActive(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.installmentsService.findOne(id, user.id);
  }

  @Post(':id/anticipate')
  @ApiOperation({ summary: 'Simulate anticipation discount' })
  anticipate(@Param('id') id: string, @CurrentUser() user: any) {
      return this.installmentsService.simulateAnticipation(id, user.id);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { DebtsService } from './debts.service';
import { CreateDebtDto } from './dto/create-debt.dto';
import { UpdateDebtDto } from './dto/update-debt.dto';
import { RegisterPaymentDto } from './dto/register-payment.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Debts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('debts')
export class DebtsController {
  constructor(private readonly debtsService: DebtsService) {}

  @Post()
  @ApiOperation({ summary: 'Create debt' })
  create(@CurrentUser() user: any, @Body() dto: CreateDebtDto) {
    return this.debtsService.create(user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List debts' })
  findAll(@CurrentUser() user: any) {
    return this.debtsService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.debtsService.findOne(id, user.id);
  }

  @Get(':id/simulate')
  simulate(@Param('id') id: string, @CurrentUser() user: any) {
      return this.debtsService.simulateAnticipation(id, user.id);
  }

  @Post(':id/payment')
  payment(@Param('id') id: string, @CurrentUser() user: any, @Body() dto: RegisterPaymentDto) {
       return this.debtsService.registerPayment(id, user.id, dto);
  }
}

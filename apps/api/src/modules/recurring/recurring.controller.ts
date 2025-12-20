import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { RecurringService } from './recurring.service';
import { CreateRecurringDto, UpdateRecurringDto } from './dto/recurring.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Recurring Transactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('recurring')
export class RecurringController {
  constructor(private readonly recurringService: RecurringService) {}

  @Post()
  @ApiOperation({ summary: 'Create a recurring transaction template' })
  async create(@Req() req: any, @Body() dto: CreateRecurringDto) {
    return this.recurringService.create(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all recurring transactions' })
  @ApiQuery({ name: 'activeOnly', required: false, type: Boolean })
  async findAll(
    @Req() req: any,
    @Query('activeOnly') activeOnly?: string,
  ) {
    const isActiveOnly = activeOnly !== 'false';
    return this.recurringService.findAll(req.user.id, isActiveOnly);
  }

  @Get('projection')
  @ApiOperation({ summary: 'Get cashflow projection' })
  @ApiQuery({ name: 'start', required: true, type: String })
  @ApiQuery({ name: 'end', required: true, type: String })
  async getProjection(
    @Req() req: any,
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return this.recurringService.getProjection(req.user.id, startDate, endDate);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a recurring transaction by ID' })
  async findOne(@Req() req: any, @Param('id') id: string) {
    return this.recurringService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a recurring transaction' })
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateRecurringDto,
  ) {
    return this.recurringService.update(id, req.user.id, dto);
  }

  @Patch(':id/toggle')
  @ApiOperation({ summary: 'Toggle active status' })
  async toggleActive(@Req() req: any, @Param('id') id: string) {
    return this.recurringService.toggleActive(id, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete (deactivate) a recurring transaction' })
  async delete(@Req() req: any, @Param('id') id: string) {
    return this.recurringService.softDelete(id, req.user.id);
  }
}

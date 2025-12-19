import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Request, Patch } from '@nestjs/common';
import { ReservesService } from './reserves.service';
import { CreateReserveDto, UpdateReserveDto, OperateReserveDto } from './dto/reserves.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('reserves')
@UseGuards(JwtAuthGuard)
export class ReservesController {
  constructor(private readonly reservesService: ReservesService) {}

  @Post()
  create(@Request() req, @Body() dto: CreateReserveDto) {
    return this.reservesService.create(req.user.id, dto);
  }

  @Get()
  findAll(@Request() req) {
    return this.reservesService.findAll(req.user.id);
  }

  @Put(':id')
  update(@Request() req, @Param('id') id: string, @Body() dto: UpdateReserveDto) {
    return this.reservesService.update(req.user.id, id, dto);
  }

  @Post(':id/operate')
  operate(@Request() req, @Param('id') id: string, @Body() dto: OperateReserveDto) {
      return this.reservesService.operate(req.user.id, id, dto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.reservesService.remove(req.user.id, id);
  }
}

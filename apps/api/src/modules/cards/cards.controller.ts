import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Request } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto, UpdateCardDto } from './dto/cards.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('cards')
@UseGuards(JwtAuthGuard)
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  create(@Request() req, @Body() createCardDto: CreateCardDto) {
    return this.cardsService.create(req.user.id, createCardDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.cardsService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.cardsService.findOne(req.user.id, id);
  }

  @Put(':id')
  update(@Request() req, @Param('id') id: string, @Body() updateCardDto: UpdateCardDto) {
    return this.cardsService.update(req.user.id, id, updateCardDto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.cardsService.remove(req.user.id, id);
  }
}

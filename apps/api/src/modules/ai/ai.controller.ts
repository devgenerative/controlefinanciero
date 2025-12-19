import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { ChatDto, ClassifyTransactionDto, SimulateDto } from './dto/ai.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('classify')
  async classify(@Body() dto: ClassifyTransactionDto) {
    return this.aiService.classify(dto);
  }

  @Get('insights')
  async getInsights(@Req() req) {
    return this.aiService.getInsights(req.user.id);
  }

  @Post('chat')
  async chat(@Body() dto: ChatDto, @Req() req) {
    return this.aiService.chat(dto, req.user.id);
  }

  @Post('simulate')
  async simulate(@Body() dto: SimulateDto) {
    return this.aiService.simulate(dto);
  }
}

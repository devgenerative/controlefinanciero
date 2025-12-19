import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardQueryDto } from './dto/dashboard-query.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get general summary' })
  getSummary(@CurrentUser() user: any, @Query() query: DashboardQueryDto) {
    return this.dashboardService.getSummary(user.id, query);
  }

  @Get('by-category')
  getByCategory(@CurrentUser() user: any, @Query() query: DashboardQueryDto) {
    return this.dashboardService.getByCategory(user.id, query);
  }

  @Get('by-user')
  getByUser(@CurrentUser() user: any, @Query() query: DashboardQueryDto) {
    return this.dashboardService.getByUser(user.id, query);
  }

  @Get('evolution')
  getEvolution(@CurrentUser() user: any) {
    return this.dashboardService.getEvolution(user.id);
  }

  @Get('upcoming')
  getUpcoming(@CurrentUser() user: any) {
    return this.dashboardService.getUpcoming(user.id);
  }

  @Get('kpis')
  getKPIs(@CurrentUser() user: any) {
     return this.dashboardService.getKPIs(user.id);
  }
}

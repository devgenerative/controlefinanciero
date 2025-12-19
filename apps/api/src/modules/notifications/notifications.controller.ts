import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { UpdatePreferenceDto } from './dto/update-notification.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.notificationsService.findAll(user.id);
  }

  @Get('unread-count')
  getUnreadCount(@CurrentUser() user: any) {
    return this.notificationsService.getUnreadCount(user.id);
  }
  
  @Get('preferences')
  getPreferences(@CurrentUser() user: any) {
      return this.notificationsService.getPreferences(user.id);
  }

  @Patch('preferences')
  updatePreferences(@CurrentUser() user: any, @Body() dto: UpdatePreferenceDto) {
      return this.notificationsService.updatePreference(user.id, dto);
  }

  @Patch('read-all')
  readAll(@CurrentUser() user: any) {
      return this.notificationsService.markAllAsRead(user.id);
  }

  @Patch(':id/read')
  read(@Param('id') id: string, @CurrentUser() user: any) {
      return this.notificationsService.markAsRead(id, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
      return this.notificationsService.delete(id, user.id);
  }
}

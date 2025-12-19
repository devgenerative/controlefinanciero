import {
  Body,
  Controller,
  Post,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully created' })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  // We use a custom guard logic if we used strategy, but here we can just pass DTO or usage guard
  // Ideally use the Strategy for extraction
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
      // For simplicity in this implementation, we might extract userId from the old token or just trust the refresh token if unique
      // But typically we need the UserID to validate ownership.
      // In a strict implementation, we decode the expired access token or send user id.
      // Let's assume the client sends the refresh token and we look it up.
      // However, our Service logic `refreshTokens` expects userId. 
      // We should probably rely on the strategy to validate and return the user/token.
      
      // Let's adjust to use the refresh token to lookup user in service for this specific flow design
      const tokenRecord = await this.authService.refreshTokens(
          // We need a way to get user ID. Often refresh endpoint is public but takes a valid refresh token.
          // We will update service to find user by token.
          'LOOKUP_BY_TOKEN_IN_SERVICE', 
          refreshTokenDto.refresh_token
      );
      return tokenRecord;
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout user' })
  logout(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.logout(refreshTokenDto.refresh_token);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset' })
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password' })
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.token, dto.password);
  }
}

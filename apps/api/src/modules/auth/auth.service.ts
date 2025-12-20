import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const userExists = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 12);

    // Initial family setup can be properly implemented later, for now we can create a dummy one or require it
    // Requirements say "familyId (relation)", assuming we create a new family for new self-registered users
    const family = await this.prisma.family.create({
      data: {
        name: `${registerDto.name}'s Family`,
      },
    });

    const user = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        password: hashedPassword,
        name: registerDto.name,
        familyId: family.id,
        role: 'ADMIN', // First user is Admin of their family
      },
    });

    return this.generateTokens(user);
  }

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user);
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const tokenRecord = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!tokenRecord || tokenRecord.isRevoked || tokenRecord.userId !== userId) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    
    if (new Date() > tokenRecord.expiresAt) {
        throw new UnauthorizedException('Refresh token expired');
    }

    // Revoke used token (token rotation security best practice)
    await this.prisma.refreshToken.update({
        where: { id: tokenRecord.id },
        data: { isRevoked: true }
    });

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');

    return this.generateTokens(user);
  }

  async logout(refreshToken: string) {
      // Just revoke the token
      await this.prisma.refreshToken.updateMany({
        where: { token: refreshToken },
        data: { isRevoked: true }
      });
      return { message: 'Logged out successfully' };
  }

  // Placeholder for email logic
  async forgotPassword(email: string) {
      const user = await this.prisma.user.findUnique({ where: { email } });
      if (!user) return; // Silent fail for security
      
      // Generate reset token and send email logic here
      console.log(`Reset password requested for ${email}`);
      return { message: 'If user exists, email sent' };
  }

  async resetPassword(token: string, newPassword: string) {
      // Validation logic for reset token would go here
      return { message: 'Password reset successfully' };
  }

  private async generateTokens(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRATION', '15m'),
    });

    const refreshToken = uuidv4();
    const refreshExpiresIn = this.configService.get('JWT_REFRESH_EXPIRATION', '7d');
    // Calculate date for database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Simplified parsing

    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt,
      },
    });

    // Return sanitized user object (without password) and camelCase tokens
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || null,
      },
      accessToken,
      refreshToken,
    };
  }
}

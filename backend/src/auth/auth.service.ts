import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    @Inject('REDIS_CLIENT') private readonly redisClient: any,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.roleId };
    const accessToken = this.jwtService.sign(payload, { secret: process.env.JWT_SECRET || 'test_jwt_secret', expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { secret: process.env.JWT_REFRESH_SECRET || 'test_refresh_secret', expiresIn: '7d' });
    // Store refresh token in Redis with user id as key
    await this.redisClient.set(`refresh_token:${user.id}`, refreshToken, { EX: 7 * 24 * 60 * 60 });
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async register(email: string, password: string, name?: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: { email, password: hashedPassword, name, role: { connect: { name: 'user' } } },
    });
    return this.login(user);
  }
}

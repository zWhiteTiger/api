import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAdminStrategy extends PassportStrategy(Strategy, 'JWT-admin') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req.cookies?.access_token,
      ]),
      secretOrKey: configService.get<string>('JWT_SECRET_KEY'), // Replace 'JWT_SECRET' with your actual secret key variable
    });
  }

  async validate(payload: any) {
    // ตรวจสอบว่า role เป็น 'admin' หรือไม่
    if (payload.role !== 'admin') {
      throw new UnauthorizedException('Only admins are allowed');
    }
    return { email: payload.email, sub: payload.sub, role: payload.role };
  }
}

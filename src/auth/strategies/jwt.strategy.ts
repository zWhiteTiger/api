import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "JWT") {
    constructor(private configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req: Request) => req.cookies?.access_token,
            ]),
            secretOrKey: configService.get<string>('JWT_SECRET_KEY'), // Replace 'JWT_SECRET' with your actual secret key variable
        });
    }

    async validate(payload: any) {
        return { email: payload.email, sub: payload.sub };
    }
}

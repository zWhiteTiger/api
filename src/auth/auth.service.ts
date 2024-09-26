import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { UserDto } from './dto/user.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user && bcrypt.compareSync(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
  async login(dto: LoginDto) {
    const user = await this.validateUser(dto.email, dto.password);
    if (!user) {
      throw new HttpException('email or password is incorrect', HttpStatus.UNAUTHORIZED);
    }
    const payload = { email: user.email, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '1d' }),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }), // Refresh token valid for 7 days
    };
  }

  async refreshToken(email: string, sub: string): Promise<{ access_token: string, refresh_token: string }> {
    try {
      const payload = { email, sub }
      return {
        access_token: this.jwtService.sign(payload, { expiresIn: '1d' }),
        refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }), // Refresh token valid for 7 days
      };
    } catch (error) {
      throw error
    }
  }

  async register(user: UserDto) {
    const hashedPassword = bcrypt.hashSync(user.password, 8);
    return this.usersService.create({ ...user, password: hashedPassword });
  }

}

import { Controller, Post, Body, HttpException, HttpStatus, Req, Res, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from './dto/user.dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { JwtAuthGuard } from './auth.guard';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) { }

  @Post('login')
  // @UseGuards(JwtAuthGuard) permissions for logined users
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: LoginDto
  ) {
    const { access_token, refresh_token } = await this.authService.login(dto)
    res.cookie('access_token', access_token, { httpOnly: true })
    res.cookie('refresh_token', refresh_token, { httpOnly: true })
    return "ok"
  }

  @Post('register')
  async register(@Body() req: UserDto) {
    return this.authService.register(req);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(
    @Req() req: { user: { email: string, sub: string } }
  ) {
    const { email,firstName,lastName } = await this.usersService.findOne(req.user.email)
    return {
      email,
      firstName,
      lastName
    }
  }
}

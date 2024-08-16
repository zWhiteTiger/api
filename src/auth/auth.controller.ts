import { Controller, Post, Body, HttpException, HttpStatus, Req, Res, UseGuards, Get, HttpCode } from '@nestjs/common';
import { Request } from 'express';
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
    const { email, firstName, lastName, picture } = await this.usersService.findOne(req.user.email)
    return {
      email,
      firstName,
      lastName,
      picture
    }
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      if (request.cookies.access_token || request.cookies.user_id) {
        res.clearCookie('access_token', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
        })
        res.clearCookie('refresh_token', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
        })
      }

      return {
        message: 'OK',
        statusCode: 200,
      }
    } catch (error) {

      throw error
    }
  }

}

import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Req,
  Res,
  UseGuards,
  Get,
  HttpCode,
  Delete,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { UserDto } from './dto/user.dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { JwtAuthGuard } from './auth.guard';
import { UsersService } from 'src/users/users.service';
import { DocService } from 'src/doc/doc.service';
import { MailService } from 'src/mailer/mailer.service';
import { VerifyOtpDto } from 'src/mailer/dto/verify-otp.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailService: MailService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  // @UseGuards(JwtAuthGuard) permissions for logined users
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: LoginDto,
  ) {
    const { access_token, refresh_token } = await this.authService.login(dto);
    res.cookie('access_token', access_token, { httpOnly: true });
    res.cookie('refresh_token', refresh_token, { httpOnly: true });
    return 'ok';
  }

  @Post('register')
  async register(@Body() req: UserDto) {
    return this.authService.register(req);
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh/token')
  async reqToken(
    @Res({ passthrough: true }) res: Response,
    @Req() req: { user: { email: string; sub: string; role: string } },
  ) {
    const { access_token, refresh_token } = await this.authService.refreshToken(
      req.user.email,
      req.user.sub,
      req.user.role,
    );
    res.cookie('access_token', access_token, { httpOnly: true });
    res.cookie('refresh_token', refresh_token, { httpOnly: true });

    return 'ok';
  }

  @Post('token')
  async getRefToken(@Req() req: Request) {
    const token = req.cookies['refresh_token'];
    // Do something with the token
    return token ? true : false;
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(@Req() req: { user: { email: string; sub: string } }) {
    const { email, firstName, lastName, picture, _id, signature } =
      await this.usersService.findOne(req.user.email);
    return {
      email,
      firstName,
      lastName,
      picture,
      _id,
      signature,
    };
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
        });
        res.clearCookie('refresh_token', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
        });
      }

      return {
        message: 'OK',
        statusCode: 200,
      };
    } catch (error) {
      throw error;
    }
  }

  @Post('request-otp')
  async requestOtp(@Body('email') email: string): Promise<{ message: string }> {
    await this.mailService.sendOtpEmail(email);
    return { message: 'OTP sent to email.' };
  }

  @Post('verify-otp')
  async verifyOtp(
    @Body() verifyOtpDto: VerifyOtpDto,
    @Res() res: Response,
  ): Promise<void> {
    // Ensure the return type is void
    const { email, otp } = verifyOtpDto;
    try {
      const isOtpValid = await this.mailService.verifyOtp(email, otp);
      if (isOtpValid) {
        res
          .status(HttpStatus.OK)
          .json({ message: 'OTP verified successfully' });
      } else {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid OTP' });
      }
    } catch (error) {
      res.status(error.getStatus()).json({ message: error.message });
    }
  }

  @Get('set-new-password')
  async getSetNewPasswordPage(@Res() res: Response): Promise<void> {
    res.render('set-new-password'); // Render the password reset page
  }

  @Post('set-new-password')
  async setNewPassword(
    @Body('email') email: string,
    @Body('newPassword') newPassword: string,
  ): Promise<{ message: string }> {
    // Handle password reset logic (e.g., update in DB)
    // Example:
    // await this.userService.updatePassword(email, newPassword);
    return { message: 'Password successfully updated' };
  }
}

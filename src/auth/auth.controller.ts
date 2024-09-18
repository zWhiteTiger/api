import { Controller, Post, Body, HttpException, HttpStatus, Req, Res, UseGuards, Get, HttpCode, Delete } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { UserDto } from './dto/user.dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { JwtAuthGuard } from './auth.guard';
import { UsersService } from 'src/users/users.service';
import { DocService } from 'src/doc/doc.service';
import { MailService } from 'src/mailer/mailer.service';
import { generateOtp } from 'src/mailer/mailer.util';
import { VerifyOtpDto } from 'src/mailer/dto/verify-otp.dto';
import { ForgotPasswordDto } from 'src/mailer/dto/forgot-password.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailService: MailService,
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
  @Post('refresh/token')
  async reqToken(@Res({ passthrough: true }) res: Response, @Req() req: { user: { email: string, sub: string } }) {
    const { access_token, refresh_token } = await this.authService.refreshToken(req.user.email, req.user.sub)
    res.cookie('access_token', access_token, { httpOnly: true })
    res.cookie('refresh_token', refresh_token, { httpOnly: true })

    return 'ok';
  }

  @Post('token')
  async getRefToken(@Req() req: Request) {
    const token = req.cookies['refresh_token'];
    // Do something with the token
    return token ? true : false
  }


  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(
    @Req() req: { user: { email: string, sub: string } }
  ) {
    const { email, firstName, lastName, picture, _id, signature } = await this.usersService.findOne(req.user.email)
    return {
      email,
      firstName,
      lastName,
      picture,
      _id,
      signature
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

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;

    // Find user by email
    const user = await this.usersService.findUserByEmail(email); // usersService instead of userService

    // Generate OTP
    const otp = generateOtp();

    // Send OTP via email
    await this.mailService.sendOtpEmail(user.email, otp);

    // Save OTP to the database (optional step)

    return { message: 'OTP sent to your email' };
  }

  @Post('verify-otp')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    const { email, otp } = verifyOtpDto;

    // Fetch the stored OTP (implement this logic)
    const storedOtp = await this.mailService.getOtp(email);

    if (storedOtp === otp) {
      // OTP is correct, proceed with the password reset process
      return { message: 'OTP verified successfully' };
    } else {
      throw new HttpException('Invalid OTP', HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete')
  async deleteUser(
    @Req() req: { user: { email: string, sub: string } },
    @Res({ passthrough: true }) res: Response
  ) {
    try {
      // Delete the user using their email or ID
      const result = await this.usersService.delete(req.user.sub);

      if (result) {
        // Clear cookies after successful deletion
        res.clearCookie('access_token', { httpOnly: true });
        res.clearCookie('refresh_token', { httpOnly: true });

        return {
          message: 'User deleted successfully',
          statusCode: 200,
        };
      } else {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      throw new HttpException('Failed to delete user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}

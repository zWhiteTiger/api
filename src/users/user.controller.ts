import { Body, Controller, Get, Patch, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdatePassword } from './dto/user.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  // Endpoint to search users by name or email
  @Get('/search')
  async searchUsers(@Query('term') searchTerm: string) {
    return this.userService.searchUsers(searchTerm);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async users() {
    return this.userService.getUsers();
  }
  
  @UseGuards(JwtAuthGuard)
  @Patch()
  async updatePassword(@Body() dto: UpdatePassword) {
    return this.userService.updatePassword(dto.userId, dto.password);
  }
}

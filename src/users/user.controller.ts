import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdatePassword } from './dto/user.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schema/user.schema';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UsersService) { }

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

  @Patch(':id')
  async updateUser(
    @Param('id') _id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updateUserDetails(_id, updateUserDto);
  }
}

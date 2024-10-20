import { Body, Controller, Delete, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
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
  @Patch('/p/:id')
  async updatePassword(
    @Param('id') _id: string,
    @Body() dto: UpdatePassword) {
    return this.userService.updatePassword(_id, dto.password);
  }

  @Patch(':id')
  async updateUser(
    @Param('id') _id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updateUserDetails(_id, updateUserDto);
  }

  // Endpoint to delete a user by id
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteUser(@Param('id') _id: string): Promise<{ message: string }> {
    await this.userService.deleteUser(_id);
    return { message: 'User deleted successfully' };
  } โ
}

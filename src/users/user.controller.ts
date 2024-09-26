import { Controller, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UsersService) { }

    // Endpoint to search users by name or email
    @Get('/search')
    async searchUsers(@Query('term') searchTerm: string) {
        return this.userService.searchUsers(searchTerm);
    }
}
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile/:uid')
  async getUserById(@Param('uid') uid: string) {
    return this.usersService.getUserById(uid);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async getCurrentUser(@GetUser() uid: string) {
    return this.usersService.getUserById(uid);
  }

  @Get()
  @UseGuards(AuthGuard)
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }
}

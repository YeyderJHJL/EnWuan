import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':uid')
  async getUserById(@Param('uid') uid: string) {
    return this.usersService.getUserById(uid);
  }

  @Get()
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }
}

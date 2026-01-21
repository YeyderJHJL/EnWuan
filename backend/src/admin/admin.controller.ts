import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from '../auth/auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('metrics')
  @UseGuards(AuthGuard)
  async getGlobalMetrics(@GetUser() uid: string) {
    await this.adminService.verifyAdmin(uid);
    return this.adminService.getGlobalMetrics();
  }

  @Get('users')
  @UseGuards(AuthGuard)
  async getAllUsers(@GetUser() uid: string) {
    await this.adminService.verifyAdmin(uid);
    return this.adminService.getAllUsers();
  }

  @Get('companies')
  @UseGuards(AuthGuard)
  async getAllCompanies(@GetUser() uid: string) {
    await this.adminService.verifyAdmin(uid);
    return this.adminService.getAllCompanies();
  }

  @Get('companies/pending')
  @UseGuards(AuthGuard)
  async getPendingCompanies(@GetUser() uid: string) {
    await this.adminService.verifyAdmin(uid);
    return this.adminService.getPendingCompanies();
  }

  @Put('users/:uid/status')
  @UseGuards(AuthGuard)
  async updateUserStatus(
    @GetUser() currentUid: string,
    @Param('uid') uid: string,
    @Body() body: { status: 'active' | 'suspended' },
  ) {
    await this.adminService.verifyAdmin(currentUid);
    await this.adminService.updateUserStatus(uid, body.status);
    return { message: 'User status updated' };
  }

  @Put('companies/:id/status')
  @UseGuards(AuthGuard)
  async updateCompanyStatus(
    @GetUser() uid: string,
    @Param('id') companyId: string,
    @Body() body: { status: 'active' | 'suspended' },
  ) {
    await this.adminService.verifyAdmin(uid);
    await this.adminService.updateCompanyStatus(companyId, body.status);
    return { message: 'Company status updated' };
  }

  @Get('health')
  async getSystemHealth() {
    return this.adminService.getSystemHealth();
  }
}

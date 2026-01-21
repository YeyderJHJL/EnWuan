import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/company.dto';
import { AuthGuard } from '../auth/auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createCompany(
    @GetUser() userId: string,
    @Body() dto: CreateCompanyDto,
  ) {
    const id = await this.companiesService.createCompany({
      ...dto,
      userId,
    });
    return { id, message: 'Company created successfully' };
  }

  @Get(':id')
  async getCompanyById(@Param('id') id: string) {
    return this.companiesService.getCompanyById(id);
  }

  @Get('user/:userId')
  @UseGuards(AuthGuard)
  async getCompanyByUserId(@Param('userId') userId: string) {
    return this.companiesService.getCompanyByUserId(userId);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async updateCompany(
    @Param('id') id: string,
    @Body() dto: UpdateCompanyDto,
  ) {
    await this.companiesService.updateCompany(id, dto);
    return { message: 'Company updated successfully' };
  }

  @Get()
  async getAllCompanies() {
    return this.companiesService.getAllCompanies();
  }
}

import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/company.dto';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  async createCompany(@Body() dto: CreateCompanyDto) {
    const id = await this.companiesService.createCompany(dto);
    return { id, message: 'Company created successfully' };
  }

  @Get(':id')
  async getCompanyById(@Param('id') id: string) {
    return this.companiesService.getCompanyById(id);
  }

  @Get('user/:userId')
  async getCompanyByUserId(@Param('userId') userId: string) {
    return this.companiesService.getCompanyByUserId(userId);
  }

  @Put(':id')
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

import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { SurveysService } from './surveys.service';

@Controller('surveys')
export class SurveysController {
  constructor(private readonly surveysService: SurveysService) {}

  @Post()
  async createSurvey(@Body() body: any) {
    const id = await this.surveysService.createSurvey(body);
    return { id, message: 'Survey created successfully' };
  }

  @Get('active')
  async getActiveSurveys() {
    return this.surveysService.getActiveSurveys();
  }

  @Get('company/:companyId')
  async getSurveysByCompany(@Param('companyId') companyId: string) {
    return this.surveysService.getSurveysByCompany(companyId);
  }

  @Get('creator/:creatorId')
  async getSurveysByCreator(@Param('creatorId') creatorId: string) {
    return this.surveysService.getSurveysByCreator(creatorId);
  }

  @Get(':id')
  async getSurveyById(@Param('id') id: string) {
    return this.surveysService.getSurveyById(id);
  }

  @Put(':id')
  async updateSurvey(@Param('id') id: string, @Body() body: any) {
    await this.surveysService.updateSurvey(id, body);
    return { message: 'Survey updated successfully' };
  }

  @Put(':id/toggle')
  async toggleSurveyActive(@Param('id') id: string) {
    await this.surveysService.toggleSurveyActive(id);
    return { message: 'Survey status toggled' };
  }

  @Delete(':id')
  async deleteSurvey(@Param('id') id: string) {
    await this.surveysService.deleteSurvey(id);
    return { message: 'Survey deleted successfully' };
  }
}

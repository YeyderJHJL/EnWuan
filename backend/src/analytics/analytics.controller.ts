import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AuthGuard } from '../auth/auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard/user')
  @UseGuards(AuthGuard)
  async getUserDashboard(@GetUser() userId: string) {
    return this.analyticsService.getUserDashboard(userId);
  }

  @Get('dashboard/company/:companyId')
  async getCompanyDashboard(@Param('companyId') companyId: string) {
    return this.analyticsService.getCompanyDashboard(companyId);
  }

  @Get('survey/:surveyId/quality-trend')
  async getSurveyQualityTrend(@Param('surveyId') surveyId: string) {
    return this.analyticsService.getSurveyQualityTrend(surveyId);
  }

  @Get('survey/:surveyId/breakdown')
  async getSurveyBreakdown(@Param('surveyId') surveyId: string) {
    return this.analyticsService.getSurveyBreakdown(surveyId);
  }

  @Get('user/:userId/quality-progression')
  async getUserQualityProgression(@Param('userId') userId: string) {
    return this.analyticsService.getUserQualityProgression(userId);
  }
}

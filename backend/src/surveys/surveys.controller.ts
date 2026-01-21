import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { SurveysService } from './surveys.service';
import { AiService } from '../ai/ai.service';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { UpdateSurveyDto } from './dto/update-survey.dto';
import { AuthGuard } from '../auth/auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('surveys')
export class SurveysController {
  constructor(
    private readonly surveysService: SurveysService,
    private readonly aiService: AiService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  async createSurvey(
    @GetUser() userId: string,
    @Body() createSurveyDto: CreateSurveyDto,
  ) {
    const id = await this.surveysService.createSurvey({
      ...createSurveyDto,
      createdBy: userId,
      questions: createSurveyDto.questions as any,
    });
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
  @UseGuards(AuthGuard)
  async getSurveysByCreator(@Param('creatorId') creatorId: string) {
    return this.surveysService.getSurveysByCreator(creatorId);
  }

  @Get(':id')
  async getSurveyById(@Param('id') id: string) {
    return this.surveysService.getSurveyById(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async updateSurvey(
    @Param('id') id: string,
    @Body() updateSurveyDto: UpdateSurveyDto,
  ) {
    await this.surveysService.updateSurvey(id, {
      ...updateSurveyDto,
      questions: updateSurveyDto.questions as any,
    } as any);
    return { message: 'Survey updated successfully' };
  }

  @Put(':id/toggle')
  @UseGuards(AuthGuard)
  async toggleSurveyActive(@Param('id') id: string) {
    await this.surveysService.toggleSurveyActive(id);
    return { message: 'Survey status toggled' };
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteSurvey(@Param('id') id: string) {
    await this.surveysService.deleteSurvey(id);
    return { message: 'Survey deleted successfully' };
  }

  @Post(':id/suggest-questions')
  @UseGuards(AuthGuard)
  async suggestQuestions(
    @Param('id') surveyId: string,
    @Body() body: { goal: string },
  ) {
    const survey = await this.surveysService.getSurveyById(surveyId);
    if (!survey) {
      return { error: 'Survey not found' };
    }

    const suggestions = await this.aiService.suggestQuestions(
      {
        name: survey.title,
        description: survey.description,
        sector: '',
      },
      body.goal,
    );

    return suggestions;
  }
}

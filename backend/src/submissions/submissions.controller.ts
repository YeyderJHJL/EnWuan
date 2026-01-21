import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { SubmitSurveyDto } from './dto/submit-survey.dto';
import { AuthGuard } from '../auth/auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Post()
  @UseGuards(AuthGuard)
  async submitSurvey(
    @GetUser() userId: string,
    @Body() submitSurveyDto: SubmitSurveyDto,
  ) {
    const result = await this.submissionsService.submitSurvey(
      userId, 
      submitSurveyDto.surveyId, 
      submitSurveyDto.answers
    );
    
    // Get the full submission data to return to frontend
    const submission = await this.submissionsService.getSubmissionById(result.submissionId);
    
    return {
      submissionId: result.submissionId,
      qualityScore: result.qualityScore,
      rewardGiven: result.reward,
      validationReason: submission?.aiValidationReason || 'Validated successfully',
      newLevel: undefined, // Will be populated if user leveled up
      message: 'Survey submitted successfully'
    };
  }

  @Get('user/:userId')
  @UseGuards(AuthGuard)
  async getSubmissionsByUser(@Param('userId') userId: string) {
    return this.submissionsService.getSubmissionsByUser(userId);
  }

  @Get('survey/:surveyId')
  async getSubmissionsBySurvey(@Param('surveyId') surveyId: string) {
    return this.submissionsService.getSubmissionsBySurvey(surveyId);
  }

  @Get('company/:companyId')
  async getSubmissionsByCompany(@Param('companyId') companyId: string) {
    return this.submissionsService.getSubmissionsByCompany(companyId);
  }

  @Get(':id')
  async getSubmissionById(@Param('id') id: string) {
    return this.submissionsService.getSubmissionById(id);
  }
}

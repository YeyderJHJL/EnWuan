import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('validate-response')
  async validateResponse(
    @Body() body: { question: string; answer: string; questionType: string },
  ) {
    return this.aiService.validateResponse(
      body.question,
      body.answer,
      body.questionType,
    );
  }

  @Post('suggest-questions')
  async suggestQuestions(
    @Body() body: { companyProfile: any; surveyGoal: string },
  ) {
    return this.aiService.suggestQuestions(
      body.companyProfile,
      body.surveyGoal,
    );
  }

  @Post('analyze-results')
  async analyzeResults(@Body() body: { surveyData: any }) {
    return this.aiService.analyzeResults(body.surveyData);
  }
}

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
    @Body() body: { 
      title?: string;
      description?: string;
      companyProfile?: any; 
      surveyGoal?: string 
    },
  ) {
    // Support both formats: new (title/description) and old (companyProfile/surveyGoal)
    const title = body.title;
    const description = body.description;
    const surveyGoal = body.surveyGoal || body.description;
    
    return this.aiService.suggestQuestionsFromTitle(title, surveyGoal);
  }

  @Post('analyze-results')
  async analyzeResults(@Body() body: { surveyData: any }) {
    return this.aiService.analyzeResults(body.surveyData);
  }
}

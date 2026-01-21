import { IsString, IsObject, IsNotEmpty } from 'class-validator';

export class SubmitSurveyDto {
  @IsString()
  @IsNotEmpty()
  surveyId: string;

  @IsObject()
  @IsNotEmpty()
  answers: Record<string, any>;
}

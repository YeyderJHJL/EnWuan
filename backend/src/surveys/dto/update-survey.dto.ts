import {
  IsString,
  IsArray,
  IsNumber,
  IsOptional,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

class QuestionUpdateDto {
  @IsString()
  @IsOptional()
  text?: string;

  @IsArray()
  @IsOptional()
  options?: string[];

  @IsOptional()
  required?: boolean;
}

export class UpdateSurveyDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  goal?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionUpdateDto)
  @IsOptional()
  questions?: QuestionUpdateDto[];

  @IsNumber()
  @IsOptional()
  reward?: number;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}

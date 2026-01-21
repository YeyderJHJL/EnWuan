import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { ServiceMode } from '../company.interface';

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  sector: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  schedule?: string;

  @IsString()
  @IsOptional()
  targetAudience?: string;

  @IsEnum(ServiceMode)
  @IsOptional()
  serviceMode?: ServiceMode;
}

export class UpdateCompanyDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  schedule?: string;

  @IsString()
  @IsOptional()
  targetAudience?: string;

  @IsEnum(ServiceMode)
  @IsOptional()
  serviceMode?: ServiceMode;
}

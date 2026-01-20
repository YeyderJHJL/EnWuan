import { Module } from '@nestjs/common';
import { SurveysService } from './surveys.service';
import { SurveysController } from './surveys.controller';
import { CompaniesModule } from '../companies/companies.module';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [CompaniesModule, AiModule],
  controllers: [SurveysController],
  providers: [SurveysService],
  exports: [SurveysService],
})
export class SurveysModule {}

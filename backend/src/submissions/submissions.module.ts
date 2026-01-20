import { Module } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { SubmissionsController } from './submissions.controller';
import { UsersModule } from '../users/users.module';
import { SurveysModule } from '../surveys/surveys.module';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [UsersModule, SurveysModule, AiModule],
  controllers: [SubmissionsController],
  providers: [SubmissionsService],
  exports: [SubmissionsService],
})
export class SubmissionsModule {}

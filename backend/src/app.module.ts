import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CompaniesModule } from './companies/companies.module';
import { SurveysModule } from './surveys/surveys.module';
import { SubmissionsModule } from './submissions/submissions.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AiModule } from './ai/ai.module';
import { AdminModule } from './admin/admin.module';
import { FirebaseModule } from './common/firebase/firebase.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FirebaseModule,
    AuthModule,
    UsersModule,
    CompaniesModule,
    SurveysModule,
    SubmissionsModule,
    AnalyticsModule,
    AiModule,
    AdminModule,
  ],
})
export class AppModule {}

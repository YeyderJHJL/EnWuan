import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../common/firebase/firebase.service';
import { SubmissionsService } from '../submissions/submissions.service';
import { SurveysService } from '../surveys/surveys.service';

@Injectable()
export class AnalyticsService {
  constructor(
    private firebaseService: FirebaseService,
    private submissionsService: SubmissionsService,
    private surveysService: SurveysService,
  ) {}

  /**
   * Get dashboard data for user
   */
  async getUserDashboard(userId: string) {
    const db = this.firebaseService.getFirestore();

    // Get user data
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return null;
    }

    const user = userDoc.data();

    // Get user submissions
    const submissions = await this.submissionsService.getSubmissionsByUser(userId);

    // Calculate stats
    const totalEarned = submissions.reduce((sum, s) => sum + s.rewardGiven, 0);
    const avgQuality = Math.round(
      submissions.length > 0
        ? submissions.reduce((sum, s) => sum + s.qualityScore, 0) / submissions.length
        : 0,
    );

    // Get last 10 submissions for timeline
    const recentSubmissions = submissions.slice(0, 10);

    return {
      profile: user,
      stats: {
        totalSubmissions: submissions.length,
        totalEarned,
        averageQuality: avgQuality,
        validSubmissions: submissions.filter((s) => s.isValid).length,
        level: user.level,
        balance: user.balance,
      },
      recentActivity: recentSubmissions.map((s) => ({
        id: s.id,
        surveyId: s.surveyId,
        reward: s.rewardGiven,
        quality: s.qualityScore,
        isValid: s.isValid,
        createdAt: s.createdAt,
      })),
    };
  }

  /**
   * Get dashboard data for company
   */
  async getCompanyDashboard(companyId: string) {
    const db = this.firebaseService.getFirestore();

    // Get company data
    const companyDoc = await db.collection('companies').doc(companyId).get();
    if (!companyDoc.exists) {
      return null;
    }

    const company = companyDoc.data();

    // Get company surveys
    const surveys = await this.surveysService.getSurveysByCompany(companyId);

    // Get company submissions
    const submissions = await this.submissionsService.getSubmissionsByCompany(companyId);

    // Calculate stats
    const totalResponses = submissions.length;
    const validResponses = submissions.filter((s) => s.isValid).length;
    const avgQuality = Math.round(
      submissions.length > 0
        ? submissions.reduce((sum, s) => sum + s.qualityScore, 0) / submissions.length
        : 0,
    );

    // Survey insights
    const surveyInsights = await Promise.all(
      surveys.map(async (survey) => {
        const surveySubmissions = submissions.filter((s) => s.surveyId === survey.id);
        return {
          id: survey.id,
          title: survey.title,
          totalResponses: surveySubmissions.length,
          averageQuality: surveySubmissions.length
            ? Math.round(
                surveySubmissions.reduce((sum, s) => sum + s.qualityScore, 0) /
                  surveySubmissions.length,
              )
            : 0,
          validResponses: surveySubmissions.filter((s) => s.isValid).length,
        };
      }),
    );

    return {
      profile: company,
      stats: {
        level: company.level,
        totalSurveys: surveys.length,
        totalResponses,
        validResponses,
        completionRate: surveys.length > 0
          ? Math.round((totalResponses / (surveys.length * 100)) * 100)
          : 0,
        averageQuality: avgQuality,
      },
      surveys: surveyInsights,
      recentSubmissions: submissions.slice(0, 20).map((s) => ({
        id: s.id,
        surveyId: s.surveyId,
        qualityScore: s.qualityScore,
        isValid: s.isValid,
        createdAt: s.createdAt,
      })),
    };
  }

  /**
   * Get quality trend for survey
   */
  async getSurveyQualityTrend(surveyId: string) {
    const submissions = await this.submissionsService.getSubmissionsBySurvey(surveyId);

    // Group by date and calculate daily average
    const dailyTrend: any = {};

    submissions.forEach((submission) => {
      const date = new Date(submission.createdAt.toDate()).toISOString().split('T')[0];
      if (!dailyTrend[date]) {
        dailyTrend[date] = { total: 0, count: 0 };
      }
      dailyTrend[date].total += submission.qualityScore;
      dailyTrend[date].count += 1;
    });

    const trend = Object.entries(dailyTrend).map(([date, data]: [string, any]) => ({
      date,
      averageQuality: Math.round(data.total / data.count),
      submissions: data.count,
    }));

    return trend.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  /**
   * Get survey response breakdown
   */
  async getSurveyBreakdown(surveyId: string) {
    const submissions = await this.submissionsService.getSubmissionsBySurvey(surveyId);

    return {
      total: submissions.length,
      valid: submissions.filter((s) => s.isValid).length,
      invalid: submissions.filter((s) => !s.isValid).length,
      validityRate: submissions.length
        ? Math.round(
            (submissions.filter((s) => s.isValid).length / submissions.length) * 100,
          )
        : 0,
      averageQuality: Math.round(
        submissions.length > 0
          ? submissions.reduce((sum, s) => sum + s.qualityScore, 0) / submissions.length
          : 0,
      ),
      qualityDistribution: {
        excellent: submissions.filter((s) => s.qualityScore >= 85).length,
        good: submissions.filter((s) => s.qualityScore >= 70 && s.qualityScore < 85)
          .length,
        fair: submissions.filter((s) => s.qualityScore >= 50 && s.qualityScore < 70)
          .length,
        poor: submissions.filter((s) => s.qualityScore < 50).length,
      },
    };
  }

  /**
   * Get user quality progression
   */
  async getUserQualityProgression(userId: string) {
    const submissions = await this.submissionsService.getSubmissionsByUser(userId);

    // Calculate cumulative average quality over time
    let cumulativeSum = 0;
    const progression = submissions.reverse().map((submission, index) => {
      cumulativeSum += submission.qualityScore;
      const cumulativeAverage = Math.round(cumulativeSum / (index + 1));
      return {
        submissionNumber: index + 1,
        quality: submission.qualityScore,
        cumulativeAverage,
        timestamp: submission.createdAt,
      };
    });

    return progression;
  }
}

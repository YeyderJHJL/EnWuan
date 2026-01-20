import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../common/firebase/firebase.service';
import { UsersService } from '../users/users.service';
import { SurveysService } from '../surveys/surveys.service';
import { AiService } from '../ai/ai.service';

export interface Submission {
  id?: string;
  surveyId: string;
  userId: string;
  answers: any[];
  isValid: boolean;
  qualityScore: number;
  validationReason: string;
  reward: number;
  createdAt: any;
}

@Injectable()
export class SubmissionsService {
  constructor(
    private firebaseService: FirebaseService,
    private usersService: UsersService,
    private surveysService: SurveysService,
    private aiService: AiService,
  ) {}

  /**
   * Submit survey response with AI validation
   */
  async submitSurvey(
    surveyId: string,
    userId: string,
    answers: any[],
  ): Promise<{ success: boolean; message: string; reward?: number }> {
    const survey = await this.surveysService.getSurveyById(surveyId);
    if (!survey || !survey.active) {
      return { success: false, message: 'Survey not found or inactive' };
    }

    // Validate each answer with AI
    let totalScore = 0;
    const validations = [];

    for (let i = 0; i < answers.length; i++) {
      const question = survey.questions[i];
      const answer = answers[i];

      if (question.type === 'open') {
        // Only validate open-ended questions with AI
        const validation = await this.aiService.validateResponse(
          question.text,
          answer.value,
          question.type,
        );
        validations.push(validation);
        totalScore += validation.qualityScore;
      } else {
        // For multiple choice and ranking, assume valid
        validations.push({
          isValid: true,
          reason: 'Valid response',
          qualityScore: 85,
        });
        totalScore += 85;
      }
    }

    const avgScore = totalScore / answers.length;
    const isValid = avgScore >= 60; // Threshold for valid submission

    // Create submission
    const db = this.firebaseService.getFirestore();
    const submissionData: Partial<Submission> = {
      surveyId,
      userId,
      answers,
      isValid,
      qualityScore: Math.round(avgScore),
      validationReason: isValid ? 'Respuestas de calidad aceptable' : 'Respuestas de baja calidad',
      reward: isValid ? survey.reward : 0,
      createdAt: this.firebaseService.getServerTimestamp(),
    };

    await db.collection('submissions').add(submissionData);

    // Update user stats
    await this.usersService.incrementSubmissions(userId, isValid);
    await this.usersService.updateQualityScore(userId, avgScore);

    if (isValid) {
      await this.usersService.incrementBalance(userId, survey.reward);
    }

    // Update survey response count
    await this.surveysService.incrementResponses(surveyId);

    return {
      success: true,
      message: isValid
        ? `¡Respuestas validadas! Has ganado $${survey.reward}`
        : 'Respuestas de baja calidad. No se otorgó recompensa.',
      reward: isValid ? survey.reward : 0,
    };
  }

  /**
   * Get submissions by user
   */
  async getSubmissionsByUser(userId: string): Promise<Submission[]> {
    const db = this.firebaseService.getFirestore();
    const snapshot = await db
      .collection('submissions')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Submission));
  }

  /**
   * Get submissions by survey
   */
  async getSubmissionsBySurvey(surveyId: string): Promise<Submission[]> {
    const db = this.firebaseService.getFirestore();
    const snapshot = await db
      .collection('submissions')
      .where('surveyId', '==', surveyId)
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Submission));
  }
}

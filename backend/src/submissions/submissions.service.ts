import { Injectable, BadRequestException } from '@nestjs/common';
import { FirebaseService } from '../common/firebase/firebase.service';
import { AiService } from '../ai/ai.service';
import { UsersService } from '../users/users.service';
import { SurveysService } from '../surveys/surveys.service';

export interface Submission {
  id?: string;
  surveyId: string;
  companyId: string;
  userId: string;
  answers: Record<string, any>;
  isValid: boolean;
  qualityScore: number;
  aiValidationReason: string;
  rewardGiven: number;
  createdAt: any;
  updatedAt: any;
}

@Injectable()
export class SubmissionsService {
  constructor(
    private firebaseService: FirebaseService,
    private aiService: AiService,
    private usersService: UsersService,
    private surveysService: SurveysService,
  ) {}

  /**
   * Submit survey response with AI validation
   */
  async submitSurvey(
    userId: string,
    surveyId: string,
    answers: Record<string, any>,
  ): Promise<{ submissionId: string; qualityScore: number; reward: number }> {
    const db = this.firebaseService.getFirestore();

    // Get survey
    const survey = await this.surveysService.getSurveyById(surveyId);
    if (!survey) {
      throw new BadRequestException('Survey not found');
    }

    if (!survey.active) {
      throw new BadRequestException('Survey is not active');
    }

    // Validate answers against survey questions
    const missingAnswers = survey.questions
      .filter((q: any) => q.required && !answers[q.id])
      .map((q: any) => q.text);

    if (missingAnswers.length > 0) {
      throw new BadRequestException(
        `Missing required answers for: ${missingAnswers.join(', ')}`,
      );
    }

    // Validate with AI and calculate quality score
    const validationResult = await this.validateSubmissionWithAI(
      survey,
      answers,
    );

    // Calculate reward based on quality
    const reward = this.calculateReward(survey.reward, validationResult.qualityScore);

    // Create submission document
    const submission: Partial<Submission> = {
      surveyId,
      companyId: survey.companyId,
      userId,
      answers,
      isValid: validationResult.isValid,
      qualityScore: validationResult.qualityScore,
      aiValidationReason: validationResult.reason,
      rewardGiven: reward,
      createdAt: this.firebaseService.getServerTimestamp(),
      updatedAt: this.firebaseService.getServerTimestamp(),
    };

    const docRef = await db.collection('submissions').add(submission);

    // Update user profile
    await this.updateUserAfterSubmission(userId, validationResult, reward);

    // Increment survey responses
    await this.surveysService.incrementResponses(surveyId);

    return {
      submissionId: docRef.id,
      qualityScore: validationResult.qualityScore,
      reward,
    };
  }

  /**
   * Validate submission with AI
   */
  private async validateSubmissionWithAI(survey: any, answers: any) {
    // Build a validation prompt for Gemini
    const answerSummary = survey.questions
      .map((q: any) => {
        return `Q: ${q.text}\nA: ${JSON.stringify(answers[q.id])}`;
      })
      .join('\n\n');

    const validationPrompt = `
You are a quality validator for survey responses. Evaluate the following survey submission.

Survey Title: ${survey.title}
Survey Goal: ${survey.goal || 'General feedback'}

SUBMISSION CONTENT:
${answerSummary}

Please provide:
1. Is this a valid, genuine response? (true/false)
2. Why? (brief explanation)
3. Quality score (0-100, where 100 is excellent, thoughtful response)

IMPORTANT: Return ONLY valid JSON, no additional text.
Response format:
{
  "isValid": boolean,
  "reason": "brief explanation",
  "qualityScore": number
}
`;

    try {
      const result = await this.aiService.analyzeWithGemini(validationPrompt);
      const parsed = JSON.parse(result);
      return {
        isValid: parsed.isValid !== false,
        reason: parsed.reason || 'No reason provided',
        qualityScore: Math.min(100, Math.max(0, parsed.qualityScore || 50)),
      };
    } catch (error) {
      // Fallback to basic validation
      return {
        isValid: true,
        reason: 'Automated validation failed, using default',
        qualityScore: 70,
      };
    }
  }

  /**
   * Update user after submission
   */
  private async updateUserAfterSubmission(
    userId: string,
    validationResult: any,
    reward: number,
  ): Promise<void> {
    const user = await this.usersService.getUserById(userId);
    if (!user) return;

    const db = this.firebaseService.getFirestore();

    // Calculate new quality score (average)
    const newQualityScore =
      (user.qualityScore * (user.totalSubmissions || 0) +
        validationResult.qualityScore) /
      (user.totalSubmissions + 1);

    // Update user
    await db.collection('users').doc(userId).update({
      balance: this.firebaseService.increment(reward),
      qualityScore: newQualityScore,
      totalSubmissions: this.firebaseService.increment(1),
      validSubmissions: this.firebaseService.increment(
        validationResult.isValid ? 1 : 0,
      ),
      invalidSubmissions: this.firebaseService.increment(
        validationResult.isValid ? 0 : 1,
      ),
      updatedAt: this.firebaseService.getServerTimestamp(),
    });

    // Update user level based on new quality score
    await this.usersService.updateUserLevel(userId);
  }

  /**
   * Calculate reward based on quality score
   */
  private calculateReward(baseReward: number, qualityScore: number): number {
    if (qualityScore < 50) return 0; // No reward for poor quality
    if (qualityScore < 75) return Math.round(baseReward * 0.5); // 50%
    if (qualityScore < 90) return baseReward; // 100%
    return Math.round(baseReward * 1.25); // 125% bonus for excellent
  }

  /**
   * Get submission by ID
   */
  async getSubmissionById(id: string): Promise<Submission | null> {
    const db = this.firebaseService.getFirestore();
    const doc = await db.collection('submissions').doc(id).get();

    if (!doc.exists) {
      return null;
    }

    return { id: doc.id, ...doc.data() } as Submission;
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
   * Get submissions for a survey
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

  /**
   * Get submissions for company (all surveys)
   */
  async getSubmissionsByCompany(companyId: string): Promise<Submission[]> {
    const db = this.firebaseService.getFirestore();
    const snapshot = await db
      .collection('submissions')
      .where('companyId', '==', companyId)
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Submission));
  }

  /**
   * Get valid submissions count
   */
  async getValidSubmissionsCount(surveyId: string): Promise<number> {
    const db = this.firebaseService.getFirestore();
    const snapshot = await db
      .collection('submissions')
      .where('surveyId', '==', surveyId)
      .where('isValid', '==', true)
      .get();

    return snapshot.size;
  }

  /**
   * Get average quality score for survey
   */
  async getAverageQualityScore(surveyId: string): Promise<number> {
    const submissions = await this.getSubmissionsBySurvey(surveyId);

    if (submissions.length === 0) return 0;

    const total = submissions.reduce((sum, s) => sum + s.qualityScore, 0);
    return Math.round(total / submissions.length);
  }
}

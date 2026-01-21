import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../common/firebase/firebase.service';
import { CompaniesService } from '../companies/companies.service';
import { Survey, Question, QuestionType } from './survey.interface';

@Injectable()
export class SurveysService {
  constructor(
    private firebaseService: FirebaseService,
    private companiesService: CompaniesService,
  ) {}

  /**
   * Normalize questions from DTO to proper interface
   * Adds missing properties (id, ensures required is boolean)
   */
  private normalizeQuestions(dtoQuestions: any[]): Question[] {
    return dtoQuestions.map((q, index) => ({
      id: q.id || `q_${index}_${Date.now()}`,
      text: q.text,
      type: q.type as QuestionType,
      options: q.options || [],
      required: q.required ?? true, // Default to true if not provided
    }));
  }

  /**
   * Create new survey
   * Transforms DTO to proper Survey interface before saving
   */
  async createSurvey(surveyData: Partial<Survey>): Promise<string> {
    const db = this.firebaseService.getFirestore();
    
    // Normalize questions if they exist
    const normalizedQuestions = surveyData.questions
      ? this.normalizeQuestions(surveyData.questions)
      : [];
    
    const survey: Partial<Survey> = {
      ...surveyData,
      questions: normalizedQuestions,
      active: true,
      totalResponses: 0,
      createdAt: this.firebaseService.getServerTimestamp(),
      updatedAt: this.firebaseService.getServerTimestamp(),
    };

    const docRef = await db.collection('surveys').add(survey);
    
    // Increment company surveys count
    if (surveyData.companyId) {
      await this.companiesService.incrementSurveys(surveyData.companyId);
    }
    
    return docRef.id;
  }

  /**
   * Get survey by ID
   */
  async getSurveyById(id: string): Promise<Survey | null> {
    const db = this.firebaseService.getFirestore();
    const doc = await db.collection('surveys').doc(id).get();

    if (!doc.exists) {
      return null;
    }

    return { id: doc.id, ...doc.data() } as Survey;
  }

  /**
   * Get all active surveys
   */
  async getActiveSurveys(): Promise<Survey[]> {
    const db = this.firebaseService.getFirestore();
    const snapshot = await db
      .collection('surveys')
      .where('active', '==', true)
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Survey));
  }

  /**
   * Get surveys by company
   */
  async getSurveysByCompany(companyId: string): Promise<Survey[]> {
    const db = this.firebaseService.getFirestore();
    const snapshot = await db
      .collection('surveys')
      .where('companyId', '==', companyId)
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Survey));
  }

  /**
   * Get surveys by creator
   */
  async getSurveysByCreator(creatorId: string): Promise<Survey[]> {
    const db = this.firebaseService.getFirestore();
    const snapshot = await db
      .collection('surveys')
      .where('createdBy', '==', creatorId)
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Survey));
  }

  /**
   * Update survey
   */
  async updateSurvey(id: string, updates: Partial<Survey>): Promise<void> {
    const db = this.firebaseService.getFirestore();
    
    // Normalize questions if they exist
    const normalizedUpdates = updates.questions
      ? {
          ...updates,
          questions: this.normalizeQuestions(updates.questions),
        }
      : updates;
    
    await db.collection('surveys').doc(id).update({
      ...normalizedUpdates,
      updatedAt: this.firebaseService.getServerTimestamp(),
    });
  }

  /**
   * Toggle survey active status
   */
  async toggleSurveyActive(id: string): Promise<void> {
    const survey = await this.getSurveyById(id);
    if (!survey) return;

    const db = this.firebaseService.getFirestore();
    await db.collection('surveys').doc(id).update({
      active: !survey.active,
      updatedAt: this.firebaseService.getServerTimestamp(),
    });
  }

  /**
   * Increment response count
   */
  async incrementResponses(id: string): Promise<void> {
    const db = this.firebaseService.getFirestore();
    await db.collection('surveys').doc(id).update({
      totalResponses: this.firebaseService.increment(1),
      updatedAt: this.firebaseService.getServerTimestamp(),
    });
  }

  /**
   * Delete survey
   */
  async deleteSurvey(id: string): Promise<void> {
    const db = this.firebaseService.getFirestore();
    await db.collection('surveys').doc(id).delete();
  }
}

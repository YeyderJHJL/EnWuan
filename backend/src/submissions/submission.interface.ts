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

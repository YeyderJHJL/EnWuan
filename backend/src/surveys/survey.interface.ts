export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  RANKING = 'ranking',
  OPEN = 'open',
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[];
  required: boolean;
}

export interface Survey {
  id?: string;
  companyId: string;
  createdBy: string;
  title: string;
  description: string;
  goal?: string;
  questions: Question[];
  reward: number;
  active: boolean;
  totalResponses: number;
  createdAt: any;
  updatedAt: any;
}

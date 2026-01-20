export enum CompanyLevel {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
}

export enum ServiceMode {
  LOCAL = 'local',
  DELIVERY = 'delivery',
  BOTH = 'both',
}

export interface CompanyProfile {
  id?: string;
  userId: string;
  name: string;
  description: string;
  sector: string;
  location?: string;
  schedule?: string;
  targetAudience?: string;
  serviceMode?: ServiceMode;
  level: CompanyLevel;
  totalContribution: number;
  totalSurveys: number;
  totalAnalytics: number;
  qualityScore: number;
  createdAt: any;
  updatedAt: any;
}

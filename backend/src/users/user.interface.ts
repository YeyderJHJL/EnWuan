export enum UserRole {
  USER = 'user',
  BUSINESS = 'business',
  ADMIN = 'admin',
}

export enum UserLevel {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  level: UserLevel;
  balance: number;
  qualityScore: number;
  totalSubmissions: number;
  validSubmissions: number;
  invalidSubmissions: number;
  createdAt: any;
  updatedAt: any;
}

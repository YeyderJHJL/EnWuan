import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../common/firebase/firebase.service';
import { CompanyProfile, CompanyLevel } from './company.interface';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/company.dto';

@Injectable()
export class CompaniesService {
  constructor(private firebaseService: FirebaseService) {}

  /**
   * Create company profile
   */
  async createCompany(dto: CreateCompanyDto): Promise<string> {
    const db = this.firebaseService.getFirestore();
    
    const companyData: Partial<CompanyProfile> = {
      ...dto,
      level: CompanyLevel.BRONZE,
      totalContribution: 0,
      totalSurveys: 0,
      totalAnalytics: 0,
      qualityScore: 70,
      createdAt: this.firebaseService.getServerTimestamp(),
      updatedAt: this.firebaseService.getServerTimestamp(),
    };

    const docRef = await db.collection('companies').add(companyData);
    return docRef.id;
  }

  /**
   * Get company by ID
   */
  async getCompanyById(id: string): Promise<CompanyProfile | null> {
    const db = this.firebaseService.getFirestore();
    const doc = await db.collection('companies').doc(id).get();

    if (!doc.exists) {
      return null;
    }

    return { id: doc.id, ...doc.data() } as CompanyProfile;
  }

  /**
   * Get company by user ID
   */
  async getCompanyByUserId(userId: string): Promise<CompanyProfile | null> {
    const db = this.firebaseService.getFirestore();
    const snapshot = await db
      .collection('companies')
      .where('userId', '==', userId)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as CompanyProfile;
  }

  /**
   * Update company profile
   */
  async updateCompany(id: string, dto: UpdateCompanyDto): Promise<void> {
    const db = this.firebaseService.getFirestore();
    await db.collection('companies').doc(id).update({
      ...dto,
      updatedAt: this.firebaseService.getServerTimestamp(),
    });
  }

  /**
   * Update company level based on metrics
   */
  async updateCompanyLevel(id: string): Promise<void> {
    const company = await this.getCompanyById(id);
    if (!company) return;

    let newLevel = CompanyLevel.BRONZE;

    // Calculate level based on multiple factors
    const score =
      company.totalContribution * 0.4 +
      company.totalSurveys * 0.3 +
      company.totalAnalytics * 0.2 +
      company.qualityScore * 0.1;

    if (score >= 80) {
      newLevel = CompanyLevel.GOLD;
    } else if (score >= 50) {
      newLevel = CompanyLevel.SILVER;
    }

    if (newLevel !== company.level) {
      const db = this.firebaseService.getFirestore();
      await db.collection('companies').doc(id).update({
        level: newLevel,
        updatedAt: this.firebaseService.getServerTimestamp(),
      });
    }
  }

  /**
   * Increment company metrics
   */
  async incrementSurveys(id: string): Promise<void> {
    const db = this.firebaseService.getFirestore();
    await db.collection('companies').doc(id).update({
      totalSurveys: this.firebaseService.increment(1),
      updatedAt: this.firebaseService.getServerTimestamp(),
    });
    
    await this.updateCompanyLevel(id);
  }

  async incrementAnalytics(id: string): Promise<void> {
    const db = this.firebaseService.getFirestore();
    await db.collection('companies').doc(id).update({
      totalAnalytics: this.firebaseService.increment(1),
      updatedAt: this.firebaseService.getServerTimestamp(),
    });
    
    await this.updateCompanyLevel(id);
  }

  async incrementContribution(id: string, amount: number): Promise<void> {
    const db = this.firebaseService.getFirestore();
    await db.collection('companies').doc(id).update({
      totalContribution: this.firebaseService.increment(amount),
      updatedAt: this.firebaseService.getServerTimestamp(),
    });
    
    await this.updateCompanyLevel(id);
  }

  /**
   * Get all companies (admin)
   */
  async getAllCompanies(): Promise<CompanyProfile[]> {
    const db = this.firebaseService.getFirestore();
    const snapshot = await db.collection('companies').get();

    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as CompanyProfile),
    );
  }
}

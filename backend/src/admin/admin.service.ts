import { Injectable, ForbiddenException } from '@nestjs/common';
import { FirebaseService } from '../common/firebase/firebase.service';
import { UsersService } from '../users/users.service';
import { CompaniesService } from '../companies/companies.service';
import { UserRole } from '../users/user.interface';

@Injectable()
export class AdminService {
  constructor(
    private firebaseService: FirebaseService,
    private usersService: UsersService,
    private companiesService: CompaniesService,
  ) {}

  /**
   * Verify admin access
   */
  async verifyAdmin(uid: string): Promise<void> {
    const user = await this.usersService.getUserById(uid);
    if (!user || user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can access this resource');
    }
  }

  /**
   * Get global dashboard metrics
   */
  async getGlobalMetrics() {
    const db = this.firebaseService.getFirestore();

    // Get all users count
    const usersSnapshot = await db.collection('users').get();
    const totalUsers = usersSnapshot.size;

    // Get all submissions count
    const submissionsSnapshot = await db.collection('submissions').get();
    const totalSubmissions = submissionsSnapshot.size;

    // Get average quality
    const submissions = submissionsSnapshot.docs.map((doc) => doc.data());
    const avgQuality =
      submissions.length > 0
        ? Math.round(
            submissions.reduce((sum, s: any) => sum + (s.qualityScore || 0), 0) /
              submissions.length,
          )
        : 0;

    // Get companies by level
    const companiesSnapshot = await db.collection('companies').get();
    const companies = companiesSnapshot.docs.map((doc) => doc.data());
    const companiesByLevel = {
      bronze: companies.filter((c: any) => c.level === 'bronze').length,
      silver: companies.filter((c: any) => c.level === 'silver').length,
      gold: companies.filter((c: any) => c.level === 'gold').length,
    };

    // Calculate total revenue from rewards
    const totalRevenue = Math.round(
      submissions.reduce((sum, s: any) => sum + (s.rewardGiven || 0), 0),
    );

    return {
      totalUsers,
      totalSubmissions,
      averageQuality: avgQuality,
      totalRevenue,
      companiesByLevel,
      companiesTotal: companies.length,
      timestamp: new Date(),
    };
  }

  /**
   * Get all users (admin only)
   */
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }

  /**
   * Get all companies (admin only)
   */
  async getAllCompanies() {
    const db = this.firebaseService.getFirestore();
    const snapshot = await db.collection('companies').get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  /**
   * Approve/suspend user
   */
  async updateUserStatus(uid: string, status: 'active' | 'suspended') {
    const db = this.firebaseService.getFirestore();
    await db.collection('users').doc(uid).update({
      status,
      updatedAt: this.firebaseService.getServerTimestamp(),
    });
  }

  /**
   * Approve/suspend company
   */
  async updateCompanyStatus(companyId: string, status: 'active' | 'suspended') {
    const db = this.firebaseService.getFirestore();
    await db.collection('companies').doc(companyId).update({
      status,
      updatedAt: this.firebaseService.getServerTimestamp(),
    });
  }

  /**
   * Get pending companies for approval
   */
  async getPendingCompanies() {
    const db = this.firebaseService.getFirestore();
    const snapshot = await db
      .collection('companies')
      .where('status', '==', 'pending')
      .get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  /**
   * Get system health report
   */
  async getSystemHealth() {
    const db = this.firebaseService.getFirestore();

    // Check if collections exist
    const collections = [
      'users',
      'companies',
      'surveys',
      'submissions',
    ];

    const health: any = {};

    for (const collection of collections) {
      try {
        const snapshot = await db.collection(collection).limit(1).get();
        health[collection] = {
          status: 'healthy',
          count: (await db.collection(collection).get()).size,
        };
      } catch (error) {
        health[collection] = { status: 'error', error: error.message };
      }
    }

    return health;
  }
}

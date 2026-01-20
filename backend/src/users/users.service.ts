import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../common/firebase/firebase.service';
import { UserRole, UserLevel, UserProfile } from './user.interface';

@Injectable()
export class UsersService {
  constructor(private firebaseService: FirebaseService) {}

  /**
   * Get user by UID
   */
  async getUserById(uid: string): Promise<UserProfile | null> {
    const db = this.firebaseService.getFirestore();
    const userDoc = await db.collection('users').doc(uid).get();

    if (!userDoc.exists) {
      return null;
    }

    return { uid: userDoc.id, ...userDoc.data() } as UserProfile;
  }

  /**
   * Get all users (admin only)
   */
  async getAllUsers(): Promise<UserProfile[]> {
    const db = this.firebaseService.getFirestore();
    const snapshot = await db.collection('users').get();

    return snapshot.docs.map(
      (doc) => ({ uid: doc.id, ...doc.data() } as UserProfile),
    );
  }

  /**
   * Update user level based on quality score
   */
  async updateUserLevel(uid: string): Promise<void> {
    const user = await this.getUserById(uid);
    if (!user) return;

    let newLevel = UserLevel.BRONZE;
    
    if (user.qualityScore >= 90) {
      newLevel = UserLevel.GOLD;
    } else if (user.qualityScore >= 75) {
      newLevel = UserLevel.SILVER;
    }

    if (newLevel !== user.level) {
      const db = this.firebaseService.getFirestore();
      await db.collection('users').doc(uid).update({
        level: newLevel,
        updatedAt: this.firebaseService.getServerTimestamp(),
      });
    }
  }

  /**
   * Update user quality score
   */
  async updateQualityScore(uid: string, newScore: number): Promise<void> {
    const db = this.firebaseService.getFirestore();
    const user = await this.getUserById(uid);
    
    if (!user) return;

    // Calculate weighted average
    const totalSubmissions = user.totalSubmissions || 1;
    const currentScore = user.qualityScore || 70;
    const updatedScore = (currentScore * totalSubmissions + newScore) / (totalSubmissions + 1);

    await db.collection('users').doc(uid).update({
      qualityScore: Math.round(updatedScore),
      updatedAt: this.firebaseService.getServerTimestamp(),
    });

    // Update level based on new score
    await this.updateUserLevel(uid);
  }

  /**
   * Increment user balance
   */
  async incrementBalance(uid: string, amount: number): Promise<void> {
    const db = this.firebaseService.getFirestore();
    await db.collection('users').doc(uid).update({
      balance: this.firebaseService.increment(amount),
      updatedAt: this.firebaseService.getServerTimestamp(),
    });
  }

  /**
   * Decrement user balance
   */
  async decrementBalance(uid: string, amount: number): Promise<void> {
    const db = this.firebaseService.getFirestore();
    await db.collection('users').doc(uid).update({
      balance: this.firebaseService.increment(-amount),
      updatedAt: this.firebaseService.getServerTimestamp(),
    });
  }

  /**
   * Increment submission counters
   */
  async incrementSubmissions(uid: string, isValid: boolean): Promise<void> {
    const db = this.firebaseService.getFirestore();
    const updates: any = {
      totalSubmissions: this.firebaseService.increment(1),
      updatedAt: this.firebaseService.getServerTimestamp(),
    };

    if (isValid) {
      updates.validSubmissions = this.firebaseService.increment(1);
    } else {
      updates.invalidSubmissions = this.firebaseService.increment(1);
    }

    await db.collection('users').doc(uid).update(updates);
  }
}

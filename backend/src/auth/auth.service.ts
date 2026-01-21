import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { FirebaseService } from '../common/firebase/firebase.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserRole, UserLevel } from '../users/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private firebaseService: FirebaseService,
    private configService: ConfigService,
  ) {}

  /**
   * Register new user (USER or BUSINESS role)
   */
  async register(dto: RegisterDto): Promise<{ uid: string; token: string }> {
    const auth = this.firebaseService.getAuth();
    const db = this.firebaseService.getFirestore();

    try {
      // Create Firebase Auth user
      const userRecord = await auth.createUser({
        email: dto.email,
        password: dto.password,
        displayName: dto.displayName,
      });

      // Determine role
      const role: UserRole = dto.role === 'business' ? UserRole.BUSINESS : UserRole.USER;

      // Create Firestore user document
      const userProfile = {
        email: dto.email,
        displayName: dto.displayName,
        role,
        level: UserLevel.BRONZE,
        balance: 0,
        qualityScore: 100,
        totalSubmissions: 0,
        validSubmissions: 0,
        invalidSubmissions: 0,
        createdAt: this.firebaseService.getServerTimestamp(),
        updatedAt: this.firebaseService.getServerTimestamp(),
      };

      await db.collection('users').doc(userRecord.uid).set(userProfile);

      // Generate custom token for immediate login
      const token = await auth.createCustomToken(userRecord.uid);

      return {
        uid: userRecord.uid,
        token,
      };
    } catch (error: any) {
      if (error.code === 'auth/email-already-exists') {
        throw new BadRequestException('El correo ya está registrado');
      }
      throw new BadRequestException(error.message || 'Error en el registro');
    }
  }

  /**
   * Login with email and password
   * Note: This returns a custom token. Frontend should verify with Firebase SDK
   */
  async login(dto: LoginDto): Promise<{ uid: string; token: string }> {
    const auth = this.firebaseService.getAuth();

    try {
      // Get user by email
      const userRecord = await auth.getUserByEmail(dto.email);

      // Generate custom token
      const token = await auth.createCustomToken(userRecord.uid);

      return {
        uid: userRecord.uid,
        token,
      };
    } catch (error: any) {
      throw new UnauthorizedException('Correo o contraseña incorrectos');
    }
  }

  /**
   * Verify ID token
   */
  async verifyToken(token: string): Promise<admin.auth.DecodedIdToken> {
    const auth = this.firebaseService.getAuth();
    try {
      return await auth.verifyIdToken(token);
    } catch (error) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }

  /**
   * Get user role for authorization checks
   */
  async getUserRole(uid: string): Promise<UserRole | null> {
    const db = this.firebaseService.getFirestore();
    const doc = await db.collection('users').doc(uid).get();

    if (!doc.exists) {
      return null;
    }

    return doc.data()?.role || null;
  }

  /**
   * Check if user is admin
   */
  async isAdmin(uid: string): Promise<boolean> {
    const db = this.firebaseService.getFirestore();
    const doc = await db.collection('users').doc(uid).get();

    if (!doc.exists) {
      return false;
    }

    return doc.data()?.role === UserRole.ADMIN;
  }

  /**
   * Get current user profile from token
   */
  async getCurrentUser(uid: string) {
    const db = this.firebaseService.getFirestore();
    const doc = await db.collection('users').doc(uid).get();

    if (!doc.exists) {
      return null;
    }

    return { uid: doc.id, ...doc.data() };
  }
}

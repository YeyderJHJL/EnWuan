import { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { authService } from '../services/api';

export const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'jturpoan@unsa.edu.pe';

  // Registrar nuevo usuario
  const signup = async (email, password, displayName, accountType) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Register in backend
      const backendResponse = await authService.register(
        email,
        password,
        displayName,
        accountType === 'business' ? 'business' : 'user'
      );

      // Store backend token
      if (backendResponse.data.token) {
        localStorage.setItem('authToken', backendResponse.data.token);
      }

      // Crear documento de usuario en Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: displayName,
        role: email === ADMIN_EMAIL ? 'admin' : (accountType === 'business' ? 'business' : 'user'),
        balance: 0,
        createdAt: new Date().toISOString(),
      });

      return userCredential;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  // Iniciar sesión
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const idToken = await user.getIdToken();
      localStorage.setItem('authToken', idToken);
      return userCredential;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Cerrar sesión
  const logout = async () => {
    return await signOut(auth);
  };

  // Obtener datos del usuario desde Firestore
  const getUserData = async (uid) => {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);

      if (!user) {
        setFirebaseUser(null);
        setUserProfile(null);
        setUserRole(null);
        setLoading(false);
        return;
      }

      setFirebaseUser(user);

      try {
        const profile = await getUserData(user.uid);
        setUserProfile(profile);
        setUserRole(profile?.role || 'user');
      } catch (e) {
        console.error('Error loading profile', e);
        setUserProfile(null);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser: firebaseUser, // Alias para compatibilidad
    firebaseUser,
    userProfile,
    userRole,
    loading,
    signup,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>}
    </AuthContext.Provider>
  );
};

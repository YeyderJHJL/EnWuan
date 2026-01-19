import { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

  // Registrar nuevo usuario
  const signup = async (email, password, displayName, accountType) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Determinar rol
    let role = 'user';
    if (email === ADMIN_EMAIL) {
      role = 'admin';
    } else if (accountType === 'business') {
      role = 'business';
    }

    // Crear documento de usuario en Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: displayName,
      role: role,
      balance: 0,
      createdAt: new Date().toISOString(),
    });

    return userCredential;
  };

  // Iniciar sesión
  const login = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password);
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
      if (user) {
        const userData = await getUserData(user.uid);
        setCurrentUser({ ...user, ...userData });
        setUserRole(userData?.role || 'user');
      } else {
        setCurrentUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userRole,
    signup,
    login,
    logout,
    getUserData,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

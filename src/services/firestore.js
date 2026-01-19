import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  increment,
  setDoc
} from 'firebase/firestore';
import { db } from './firebase';

// ============= USERS =============
export const createUser = async (uid, userData) => {
  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, {
    ...userData,
    balance: 0,
    createdAt: serverTimestamp(),
  });
};

export const getUser = async (uid) => {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? { id: userSnap.id, ...userSnap.data() } : null;
};

export const updateUserRole = async (uid, role) => {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, { role });
};

export const getAllUsers = async () => {
  const usersRef = collection(db, 'users');
  const snapshot = await getDocs(usersRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// ============= TASKS =============
export const createTask = async (taskData) => {
  const tasksRef = collection(db, 'tasks');
  const docRef = await addDoc(tasksRef, {
    ...taskData,
    active: true,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const getTasks = async (onlyActive = false) => {
  const tasksRef = collection(db, 'tasks');
  let q = query(tasksRef, orderBy('createdAt', 'desc'));
  
  if (onlyActive) {
    q = query(tasksRef, where('active', '==', true), orderBy('createdAt', 'desc'));
  }
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getTasksByCreator = async (creatorId) => {
  const tasksRef = collection(db, 'tasks');
  const q = query(tasksRef, where('createdBy', '==', creatorId), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateTask = async (taskId, updates) => {
  const taskRef = doc(db, 'tasks', taskId);
  await updateDoc(taskRef, updates);
};

export const deleteTask = async (taskId) => {
  const taskRef = doc(db, 'tasks', taskId);
  await deleteDoc(taskRef);
};

// ============= SUBMISSIONS =============
export const createSubmission = async (submissionData) => {
  const submissionsRef = collection(db, 'submissions');
  const docRef = await addDoc(submissionsRef, {
    ...submissionData,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const getSubmissionsByUser = async (userId) => {
  const submissionsRef = collection(db, 'submissions');
  const q = query(submissionsRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getSubmissionsByTask = async (taskId) => {
  const submissionsRef = collection(db, 'submissions');
  const q = query(submissionsRef, where('taskId', '==', taskId), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// ============= WITHDRAWALS =============
export const createWithdrawal = async (withdrawalData) => {
  const withdrawalsRef = collection(db, 'withdrawals');
  const docRef = await addDoc(withdrawalsRef, {
    ...withdrawalData,
    status: 'pending',
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const getWithdrawalsByUser = async (userId) => {
  const withdrawalsRef = collection(db, 'withdrawals');
  const q = query(withdrawalsRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getAllWithdrawals = async () => {
  const withdrawalsRef = collection(db, 'withdrawals');
  const q = query(withdrawalsRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateWithdrawalStatus = async (withdrawalId, status) => {
  const withdrawalRef = doc(db, 'withdrawals', withdrawalId);
  await updateDoc(withdrawalRef, { 
    status,
    processedAt: serverTimestamp()
  });
};

// ============= BALANCE OPERATIONS =============
export const incrementUserBalance = async (userId, amount) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    balance: increment(amount)
  });
};

export const decrementUserBalance = async (userId, amount) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    balance: increment(-amount)
  });
};

import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db;

try {
  let serviceAccount;

  // ✅ 1. Try Environment Variable First
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

    // Fix private key formatting if needed
    if (serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }
  }
  // ✅ 2. Fallback to cred.json file
  else {
    const credPath = path.join(__dirname, '../../cred.json');
    if (!fs.existsSync(credPath)) {
      throw new Error('cred.json file not found');
    }
    serviceAccount = JSON.parse(fs.readFileSync(credPath, 'utf-8'));
  }

  // ✅ Initialize Firebase Admin
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  db = admin.firestore();
  console.log('🔥 Firebase Admin initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization error:', error.message);
  console.log('📝 Please ensure FIREBASE_SERVICE_ACCOUNT environment variable is set or cred.json file exists');

  // Mock DB (safe fallback)
  db = {
    collection: () => ({
      get: () => Promise.resolve({ docs: [] }),
      doc: () => ({
        get: () => Promise.resolve({ exists: false }),
        set: () => Promise.resolve(),
        update: () => Promise.resolve(),
        delete: () => Promise.resolve()
      }),
      add: () => Promise.resolve({ id: 'demo-id' })
    })
  };
}

const COLLECTION_NAME = 'questions';

// CRUD operations...
export const getAllQuestions = async () => {
  try {
    const snapshot = await db.collection(COLLECTION_NAME).get();
    return snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    console.error('Error fetching all questions:', error);
    throw error;
  }
};

export const getQuestionById = async (id) => {
  try {
    const doc = await db.collection(COLLECTION_NAME).doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  } catch (error) {
    console.error('Error fetching question by ID:', error);
    throw error;
  }
};

export const addQuestion = async (questionData) => {
  try {
    const docRef = await db.collection(COLLECTION_NAME).add(questionData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding question:', error);
    throw error;
  }
};

export const updateQuestion = async (id, questionData) => {
  try {
    const docRef = db.collection(COLLECTION_NAME).doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return false;

    await docRef.update(questionData);
    return true;
  } catch (error) {
    console.error('Error updating question:', error);
    throw error;
  }
};

export const deleteQuestion = async (id) => {
  try {
    const docRef = db.collection(COLLECTION_NAME).doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return false;

    await docRef.delete();
    return true;
  } catch (error) {
    console.error('Error deleting question:', error);
    throw error;
  }
};

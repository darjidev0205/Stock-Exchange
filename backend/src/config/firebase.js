import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

let db = null;
let auth = null;
let initialized = false;

const isPlaceholder = (value) =>
  !value ||
  value.includes('your-') ||
  value.includes('...') ||
  value === 'demo-project';

export const initFirebase = () => {
  if (initialized) return { db, auth };

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  const hasValidConfig =
    projectId &&
    clientEmail &&
    privateKey &&
    !isPlaceholder(projectId) &&
    !isPlaceholder(clientEmail) &&
    !isPlaceholder(privateKey) &&
    privateKey.includes('BEGIN PRIVATE KEY');

  if (hasValidConfig) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      db = admin.firestore();
      auth = admin.auth();
      initialized = true;
      console.log('✅ Firebase Admin initialized');
    } catch (err) {
      console.warn('⚠️  Firebase Admin init failed — using in-memory fallback:', err.message);
    }
  } else {
    console.warn('⚠️  Firebase Admin not configured — using in-memory fallback');
  }

  return { db, auth, admin };
};

export const getDb = () => db;
export const getAuth = () => auth;
export const isFirebaseReady = () => initialized;

import jwt from 'jsonwebtoken';
import { getAuth, isFirebaseReady } from '../config/firebase.js';

const verifyJwtToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
};

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split('Bearer ')[1];
    let user = null;

    if (isFirebaseReady()) {
      try {
        const decoded = await getAuth().verifyIdToken(token);
        user = {
          uid: decoded.uid,
          email: decoded.email,
          name: decoded.name || decoded.email?.split('@')[0],
          isAdmin: decoded.email === process.env.ADMIN_EMAIL,
        };
      } catch {
        // Not a Firebase token — try dev/demo JWT below
      }
    }

    if (!user) {
      const decoded = verifyJwtToken(token);
      user = {
        uid: decoded.uid,
        email: decoded.email,
        name: decoded.name || decoded.email?.split('@')[0],
        isAdmin: decoded.isAdmin || decoded.email === process.env.ADMIN_EMAIL,
      };
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) return next();

    const token = authHeader.split('Bearer ')[1];
    let user = null;

    if (isFirebaseReady()) {
      try {
        const decoded = await getAuth().verifyIdToken(token);
        user = { uid: decoded.uid, email: decoded.email, name: decoded.name };
      } catch {
        // fall through
      }
    }

    if (!user) {
      user = verifyJwtToken(token);
    }

    req.user = user;
  } catch {
    // optional auth — continue without user
  }
  next();
};

export const generateDevToken = (user) => {
  return jwt.sign(
    {
      uid: user.uid || user.email,
      email: user.email,
      name: user.name || user.email?.split('@')[0],
      isAdmin: user.email === process.env.ADMIN_EMAIL,
    },
    process.env.JWT_SECRET || 'dev-secret',
    { expiresIn: '7d' }
  );
};

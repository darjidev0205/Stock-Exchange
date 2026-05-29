import { Router } from 'express';
import { verifyToken, generateDevToken } from '../middleware/auth.js';
import { getDb, isFirebaseReady } from '../config/firebase.js';

const router = Router();

router.post('/dev-login', (req, res) => {
  const { email, name } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });

  const token = generateDevToken({ email, name: name || email.split('@')[0], uid: email });
  res.json({
    token,
    user: {
      uid: email,
      email,
      name: name || email.split('@')[0],
      isAdmin: email === process.env.ADMIN_EMAIL,
    },
  });
});

router.get('/profile', verifyToken, async (req, res) => {
  try {
    if (isFirebaseReady()) {
      const db = getDb();
      const doc = await db.collection('users').doc(req.user.uid).get();
      const userData = doc.exists ? doc.data() : {};
      return res.json({ ...req.user, ...userData });
    }
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { name, phone, avatar } = req.body;
    const updates = { name, phone, avatar, updatedAt: new Date().toISOString() };

    if (isFirebaseReady()) {
      const db = getDb();
      await db.collection('users').doc(req.user.uid).set(updates, { merge: true });
    }

    res.json({ ...req.user, ...updates });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/register-profile', verifyToken, async (req, res) => {
  try {
    const userData = {
      uid: req.user.uid,
      email: req.user.email,
      name: req.body.name || req.user.name,
      createdAt: new Date().toISOString(),
      isAdmin: req.user.email === process.env.ADMIN_EMAIL,
      walletBalance: 100000,
      beginnerMode: req.body.beginnerMode ?? true,
    };

    if (isFirebaseReady()) {
      const db = getDb();
      await db.collection('users').doc(req.user.uid).set(userData, { merge: true });
    }

    res.json(userData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

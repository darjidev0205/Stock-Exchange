import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import { getDb, isFirebaseReady } from '../config/firebase.js';

const router = Router();
const transactions = new Map();

router.use(verifyToken);

router.get('/', async (req, res) => {
  try {
    if (isFirebaseReady()) {
      const db = getDb();
      const snapshot = await db
        .collection('transactions')
        .where('userId', '==', req.user.uid)
        .orderBy('timestamp', 'desc')
        .limit(50)
        .get();
      const txs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      return res.json(txs);
    }

    const userTxs = transactions.get(req.user.uid) || [];
    res.json(userTxs.slice(0, 50));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export const saveTransaction = async (userId, transaction) => {
  const tx = { ...transaction, userId, id: Date.now().toString() };

  if (isFirebaseReady()) {
    const db = getDb();
    await db.collection('transactions').add(tx);
  } else {
    if (!transactions.has(userId)) transactions.set(userId, []);
    transactions.get(userId).unshift(tx);
  }

  return tx;
};

export default router;

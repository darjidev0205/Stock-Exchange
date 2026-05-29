import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import { getDb, isFirebaseReady } from '../config/firebase.js';
import { getStock } from '../services/stockService.js';

const router = Router();
const watchlists = new Map();

router.use(verifyToken);

router.get('/', async (req, res) => {
  try {
    let symbols = [];

    if (isFirebaseReady()) {
      const db = getDb();
      const doc = await db.collection('watchlists').doc(req.user.uid).get();
      symbols = doc.exists ? doc.data().symbols || [] : [];
    } else {
      symbols = watchlists.get(req.user.uid) || [];
    }

    const stocks = symbols.map((s) => getStock(s)).filter(Boolean);
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:symbol', async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase();
    if (!getStock(symbol)) return res.status(404).json({ error: 'Stock not found' });

    let symbols = [];

    if (isFirebaseReady()) {
      const db = getDb();
      const doc = await db.collection('watchlists').doc(req.user.uid).get();
      symbols = doc.exists ? doc.data().symbols || [] : [];
      if (!symbols.includes(symbol)) symbols.push(symbol);
      await db.collection('watchlists').doc(req.user.uid).set({ symbols, userId: req.user.uid });
    } else {
      symbols = watchlists.get(req.user.uid) || [];
      if (!symbols.includes(symbol)) symbols.push(symbol);
      watchlists.set(req.user.uid, symbols);
    }

    res.json({ symbols });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:symbol', async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase();
    let symbols = [];

    if (isFirebaseReady()) {
      const db = getDb();
      const doc = await db.collection('watchlists').doc(req.user.uid).get();
      symbols = (doc.exists ? doc.data().symbols || [] : []).filter((s) => s !== symbol);
      await db.collection('watchlists').doc(req.user.uid).set({ symbols, userId: req.user.uid });
    } else {
      symbols = (watchlists.get(req.user.uid) || []).filter((s) => s !== symbol);
      watchlists.set(req.user.uid, symbols);
    }

    res.json({ symbols });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

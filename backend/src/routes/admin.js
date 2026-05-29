import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/admin.js';
import {
  getAllStocks,
  addStock,
  removeStock,
  updateStockPrice,
} from '../services/stockService.js';
import { getDb, isFirebaseReady } from '../config/firebase.js';

const router = Router();

router.use(verifyToken, requireAdmin);

router.get('/stats', async (req, res) => {
  try {
    let userCount = 0;
    let transactionCount = 0;

    if (isFirebaseReady()) {
      const db = getDb();
      const usersSnap = await db.collection('users').get();
      userCount = usersSnap.size;
      const txSnap = await db.collection('transactions').get();
      transactionCount = txSnap.size;
    } else {
      userCount = Math.floor(Math.random() * 50 + 10);
      transactionCount = Math.floor(Math.random() * 200 + 50);
    }

    const stocks = getAllStocks();
    res.json({
      totalUsers: userCount,
      totalTransactions: transactionCount,
      totalStocks: stocks.length,
      activeTraders: Math.floor(userCount * 0.6),
      totalVolume: stocks.reduce((sum, s) => sum + s.volume, 0),
      marketCap: '$12.4T',
      systemStatus: 'operational',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/users', async (req, res) => {
  try {
    if (isFirebaseReady()) {
      const db = getDb();
      const snapshot = await db.collection('users').get();
      const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      return res.json(users);
    }
    res.json([
      { id: '1', email: 'admin@nextrade.ai', name: 'Admin', createdAt: new Date().toISOString() },
      { id: '2', email: 'trader@example.com', name: 'Demo Trader', createdAt: new Date().toISOString() },
    ]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/transactions', async (req, res) => {
  try {
    if (isFirebaseReady()) {
      const db = getDb();
      const snapshot = await db.collection('transactions').orderBy('timestamp', 'desc').limit(100).get();
      const txs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      return res.json(txs);
    }
    res.json([]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/stocks', (req, res) => {
  res.json(getAllStocks());
});

router.post('/stocks', (req, res) => {
  try {
    const { symbol, name, sector, price } = req.body;
    if (!symbol || !name || !price) return res.status(400).json({ error: 'Missing required fields' });
    const stock = addStock({
      symbol: symbol.toUpperCase(),
      name,
      sector: sector || 'Other',
      price: +price,
      change: 0,
      changePercent: 0,
      volume: 0,
      marketCap: 'N/A',
      description: req.body.description || '',
    });
    res.status(201).json(stock);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/stocks/:symbol', (req, res) => {
  try {
    const { price } = req.body;
    if (!price) return res.status(400).json({ error: 'Price required' });
    const stock = updateStockPrice(req.params.symbol, +price);
    if (!stock) return res.status(404).json({ error: 'Stock not found' });
    res.json(stock);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/stocks/:symbol', (req, res) => {
  const removed = removeStock(req.params.symbol);
  if (!removed) return res.status(404).json({ error: 'Stock not found' });
  res.json({ message: 'Stock removed' });
});

export default router;

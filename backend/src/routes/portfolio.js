import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import {
  getPortfolioAnalytics,
  buyStock,
  sellStock,
  getWalletBalance,
} from '../services/portfolioService.js';
import { saveTransaction } from '../routes/transactions.js';

const router = Router();

router.use(verifyToken);

router.get('/', async (req, res) => {
  try {
    const analytics = await getPortfolioAnalytics(req.user.uid);
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/wallet', async (req, res) => {
  try {
    const balance = await getWalletBalance(req.user.uid);
    res.json({ balance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/buy', async (req, res) => {
  try {
    const { symbol, quantity } = req.body;
    if (!symbol || !quantity) return res.status(400).json({ error: 'Symbol and quantity required' });
    const result = await buyStock(req.user.uid, symbol, quantity);
    await saveTransaction(req.user.uid, result.transaction);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/sell', async (req, res) => {
  try {
    const { symbol, quantity } = req.body;
    if (!symbol || !quantity) return res.status(400).json({ error: 'Symbol and quantity required' });
    const result = await sellStock(req.user.uid, symbol, quantity);
    await saveTransaction(req.user.uid, result.transaction);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;

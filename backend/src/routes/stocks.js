import { Router } from 'express';
import {
  getAllStocks,
  getStock,
  getHistoricalData,
  getIntradayData,
  getMarketDepth,
  searchStocks,
  getTrendingStocks,
  fetchExternalQuote,
} from '../services/stockService.js';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', optionalAuth, (req, res) => {
  res.json(getAllStocks());
});

router.get('/trending', (req, res) => {
  res.json(getTrendingStocks());
});

router.get('/search', (req, res) => {
  const { q } = req.query;
  if (!q) return res.json([]);
  res.json(searchStocks(q));
});

router.get('/:symbol', async (req, res) => {
  const { symbol } = req.params;
  let stock = getStock(symbol);

  if (!stock) return res.status(404).json({ error: 'Stock not found' });

  await fetchExternalQuote(symbol);
  stock = getStock(symbol);
  res.json(stock);
});

router.get('/:symbol/history', (req, res) => {
  const { period } = req.query;
  const data = getHistoricalData(req.params.symbol, period);
  if (!data) return res.status(404).json({ error: 'Stock not found' });
  res.json(data);
});

router.get('/:symbol/intraday', (req, res) => {
  const data = getIntradayData(req.params.symbol);
  if (!data) return res.status(404).json({ error: 'Stock not found' });
  res.json(data);
});

router.get('/:symbol/depth', (req, res) => {
  const data = getMarketDepth(req.params.symbol);
  if (!data) return res.status(404).json({ error: 'Stock not found' });
  res.json(data);
});

export default router;

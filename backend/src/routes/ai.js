import { Router } from 'express';
import { optionalAuth } from '../middleware/auth.js';
import {
  generateStockInsight,
  generatePortfolioSuggestions,
  generateMarketOverview,
  generatePricePrediction,
  getMarketNews,
} from '../services/aiService.js';
import { getPortfolioAnalytics } from '../services/portfolioService.js';

const router = Router();

router.get('/market-overview', (req, res) => {
  res.json(generateMarketOverview());
});

router.get('/news', (req, res) => {
  res.json(getMarketNews());
});

router.get('/insights/:symbol', (req, res) => {
  const insight = generateStockInsight(req.params.symbol);
  if (!insight) return res.status(404).json({ error: 'Stock not found' });
  res.json(insight);
});

router.get('/predictions/:symbol', (req, res) => {
  const prediction = generatePricePrediction(req.params.symbol);
  if (!prediction) return res.status(404).json({ error: 'Stock not found' });
  res.json(prediction);
});

router.get('/portfolio-suggestions', optionalAuth, async (req, res) => {
  try {
    if (req.user) {
      const analytics = await getPortfolioAnalytics(req.user.uid);
      return res.json(generatePortfolioSuggestions(analytics.holdings));
    }
    res.json(generatePortfolioSuggestions([]));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

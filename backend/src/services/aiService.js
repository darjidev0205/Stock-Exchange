import { getStock, getAllStocks } from './stockService.js';

const INSIGHT_TEMPLATES = {
  bullish: [
    '{symbol} shows strong momentum with {change}% gain. Technical indicators suggest continued upward movement.',
    'Analyst consensus for {symbol} is positive. Revenue growth and market position support a bullish outlook.',
    '{symbol} is breaking resistance levels. Volume surge indicates institutional buying interest.',
  ],
  bearish: [
    '{symbol} faces headwinds with {change}% decline. Consider reviewing your position size.',
    'Market sentiment for {symbol} is cautious. Watch for support at key price levels.',
    '{symbol} shows weakening momentum. Risk management recommended for existing positions.',
  ],
  neutral: [
    '{symbol} is trading in a consolidation range. Wait for a clear breakout signal.',
    'Mixed signals for {symbol}. Both support and resistance levels are being tested.',
    '{symbol} shows balanced risk-reward. Suitable for long-term investors with patience.',
  ],
};

export const generateStockInsight = (symbol) => {
  const stock = getStock(symbol);
  if (!stock) return null;

  const sentiment = stock.changePercent > 1 ? 'bullish' : stock.changePercent < -1 ? 'bearish' : 'neutral';
  const templates = INSIGHT_TEMPLATES[sentiment];
  const template = templates[Math.floor(Math.random() * templates.length)];

  const riskScore = Math.floor(Math.random() * 40 + (sentiment === 'bearish' ? 40 : 20));
  const confidence = Math.floor(Math.random() * 20 + 70);

  return {
    symbol: stock.symbol,
    name: stock.name,
    sentiment,
    insight: template.replace('{symbol}', stock.symbol).replace('{change}', Math.abs(stock.changePercent)),
    riskScore,
    riskLevel: riskScore > 70 ? 'High' : riskScore > 40 ? 'Medium' : 'Low',
    confidence,
    priceTarget: +(stock.price * (1 + (sentiment === 'bullish' ? 0.08 : sentiment === 'bearish' ? -0.05 : 0.02))).toFixed(2),
    recommendation: sentiment === 'bullish' ? 'BUY' : sentiment === 'bearish' ? 'HOLD/SELL' : 'HOLD',
    factors: [
      { name: 'Market Momentum', score: Math.floor(Math.random() * 30 + 60), trend: sentiment },
      { name: 'Volume Analysis', score: Math.floor(Math.random() * 30 + 55), trend: stock.volume > 20000000 ? 'bullish' : 'neutral' },
      { name: 'Sector Performance', score: Math.floor(Math.random() * 30 + 50), trend: 'neutral' },
      { name: 'Technical Indicators', score: Math.floor(Math.random() * 30 + 45), trend: sentiment },
    ],
    beginnerExplanation: getBeginnerExplanation(stock, sentiment),
    generatedAt: new Date().toISOString(),
  };
};

const getBeginnerExplanation = (stock, sentiment) => {
  const explanations = {
    bullish: `${stock.name} (${stock.symbol}) is doing well today! The stock price went up by ${stock.changePercent}%. This usually means more people want to buy it than sell it. Think of it like a popular item at a store — when demand goes up, the price tends to rise.`,
    bearish: `${stock.name} (${stock.symbol}) dropped ${Math.abs(stock.changePercent)}% today. This doesn't necessarily mean something is wrong — stocks go up and down all the time. It's like weather — sometimes sunny, sometimes rainy. Long-term investors usually don't worry about single-day changes.`,
    neutral: `${stock.name} (${stock.symbol}) is staying relatively stable today with a ${stock.changePercent}% change. Stable stocks can be good for beginners because they're less volatile. It's like a steady ship sailing calm waters.`,
  };
  return explanations[sentiment];
};

export const generatePortfolioSuggestions = (holdings) => {
  const suggestions = [];

  if (holdings.length === 0) {
    suggestions.push({
      type: 'diversification',
      title: 'Start Building Your Portfolio',
      description: 'Consider starting with diversified ETFs or blue-chip stocks like AAPL, MSFT, and GOOGL for stability.',
      priority: 'high',
    });
  }

  if (holdings.length > 0 && holdings.length < 5) {
    suggestions.push({
      type: 'diversification',
      title: 'Diversify Your Holdings',
      description: 'Your portfolio has limited stocks. Adding stocks from different sectors reduces risk.',
      priority: 'medium',
    });
  }

  const techHeavy = holdings.filter((h) => {
    const stock = getStock(h.symbol);
    return stock?.sector === 'Technology';
  }).length;

  if (techHeavy > holdings.length * 0.6 && holdings.length > 2) {
    suggestions.push({
      type: 'rebalance',
      title: 'Tech Sector Overweight',
      description: 'Over 60% of your portfolio is in tech. Consider adding healthcare or financial stocks for balance.',
      priority: 'high',
    });
  }

  const losers = holdings.filter((h) => h.pnlPercent < -10);
  if (losers.length > 0) {
    suggestions.push({
      type: 'risk',
      title: 'Review Underperforming Positions',
      description: `${losers.map((l) => l.symbol).join(', ')} ${losers.length === 1 ? 'is' : 'are'} down significantly. Review your investment thesis.`,
      priority: 'medium',
    });
  }

  suggestions.push({
    type: 'opportunity',
    title: 'AI-Recommended Watch',
    description: 'Based on market trends, NVDA and AMD show strong AI sector momentum.',
    priority: 'low',
  });

  return suggestions;
};

export const generateMarketOverview = () => {
  const stocks = getAllStocks();
  const gainers = [...stocks].sort((a, b) => b.changePercent - a.changePercent).slice(0, 5);
  const losers = [...stocks].sort((a, b) => a.changePercent - b.changePercent).slice(0, 5);
  const avgChange = stocks.reduce((sum, s) => sum + s.changePercent, 0) / stocks.length;

  return {
    marketSentiment: avgChange > 0.5 ? 'bullish' : avgChange < -0.5 ? 'bearish' : 'neutral',
    avgChange: +avgChange.toFixed(2),
    gainers,
    losers,
    summary: avgChange > 0.5
      ? 'Markets are trending upward today with broad sector participation. Risk appetite appears healthy.'
      : avgChange < -0.5
        ? 'Markets are under pressure today. Defensive positioning may be prudent for short-term traders.'
        : 'Markets are trading mixed with no clear directional bias. Selective stock picking favored.',
    activeStocks: stocks.length,
    totalVolume: stocks.reduce((sum, s) => sum + s.volume, 0),
  };
};

export const generatePricePrediction = (symbol) => {
  const stock = getStock(symbol);
  if (!stock) return null;

  const predictions = [];
  let price = stock.price;

  for (let i = 1; i <= 7; i++) {
    price *= 1 + (Math.random() - 0.45) * 0.02;
    predictions.push({
      day: i,
      date: new Date(Date.now() + i * 86400000).toISOString().split('T')[0],
      predicted: +price.toFixed(2),
      low: +(price * 0.97).toFixed(2),
      high: +(price * 1.03).toFixed(2),
    });
  }

  return {
    symbol: stock.symbol,
    currentPrice: stock.price,
    predictions,
    disclaimer: 'AI predictions are for educational purposes only. Not financial advice.',
    model: 'NexTrade AI v2.1',
    accuracy: '72.4%',
  };
};

export const getMarketNews = () => [
  { id: 1, title: 'Tech Stocks Rally on AI Optimism', source: 'MarketWatch', time: '2h ago', category: 'Technology', sentiment: 'positive' },
  { id: 2, title: 'Federal Reserve Holds Interest Rates Steady', source: 'Reuters', time: '4h ago', category: 'Economy', sentiment: 'neutral' },
  { id: 3, title: 'NVIDIA Surges Past $875 on Data Center Demand', source: 'Bloomberg', time: '5h ago', category: 'Technology', sentiment: 'positive' },
  { id: 4, title: 'Oil Prices Dip Amid Global Demand Concerns', source: 'CNBC', time: '6h ago', category: 'Commodities', sentiment: 'negative' },
  { id: 5, title: 'Tesla Deliveries Beat Analyst Expectations', source: 'WSJ', time: '8h ago', category: 'Automotive', sentiment: 'positive' },
  { id: 6, title: 'Crypto Markets Show Renewed Institutional Interest', source: 'CoinDesk', time: '10h ago', category: 'Crypto', sentiment: 'positive' },
  { id: 7, title: 'Healthcare Sector Faces Regulatory Headwinds', source: 'Financial Times', time: '12h ago', category: 'Healthcare', sentiment: 'negative' },
  { id: 8, title: 'Emerging Markets Outperform Developed Indices', source: 'Barron\'s', time: '14h ago', category: 'Global', sentiment: 'positive' },
];

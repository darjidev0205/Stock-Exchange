import axios from 'axios';
import { SEED_STOCKS } from '../data/seedStocks.js';

const stocks = new Map(SEED_STOCKS.map((s) => [s.symbol, { ...s }]));

const generateCandlestick = (basePrice, days = 30) => {
  const data = [];
  let price = basePrice * 0.92;
  const now = Date.now();

  for (let i = days; i >= 0; i--) {
    const volatility = basePrice * 0.025;
    const open = price;
    const close = open + (Math.random() - 0.48) * volatility;
    const high = Math.max(open, close) + Math.random() * volatility * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * 0.5;
    const volume = Math.floor(Math.random() * 50000000 + 1000000);

    data.push({
      date: new Date(now - i * 86400000).toISOString().split('T')[0],
      open: +open.toFixed(2),
      high: +high.toFixed(2),
      low: +low.toFixed(2),
      close: +close.toFixed(2),
      volume,
    });
    price = close;
  }
  return data;
};

const generateIntraday = (basePrice) => {
  const data = [];
  let price = basePrice;
  const now = new Date();
  now.setHours(9, 30, 0, 0);

  for (let i = 0; i < 78; i++) {
    price += (Math.random() - 0.49) * basePrice * 0.002;
    data.push({
      time: new Date(now.getTime() + i * 300000).toISOString(),
      price: +price.toFixed(2),
      volume: Math.floor(Math.random() * 500000 + 50000),
    });
  }
  return data;
};

export const getAllStocks = () => Array.from(stocks.values());

export const getStock = (symbol) => {
  const stock = stocks.get(symbol.toUpperCase());
  if (!stock) return null;
  return { ...stock };
};

export const updateStockPrice = (symbol, price) => {
  const stock = stocks.get(symbol.toUpperCase());
  if (!stock) return null;
  const oldPrice = stock.price;
  stock.price = +price;
  stock.change = +(price - oldPrice).toFixed(2);
  stock.changePercent = +(((price - oldPrice) / oldPrice) * 100).toFixed(2);
  stocks.set(symbol.toUpperCase(), stock);
  return { ...stock };
};

export const addStock = (stockData) => {
  const symbol = stockData.symbol.toUpperCase();
  stocks.set(symbol, { ...stockData, symbol });
  return { ...stockData, symbol };
};

export const removeStock = (symbol) => stocks.delete(symbol.toUpperCase());

export const simulatePriceTick = () => {
  const updates = [];
  stocks.forEach((stock, symbol) => {
    const change = (Math.random() - 0.48) * stock.price * 0.003;
    stock.price = +(stock.price + change).toFixed(2);
    stock.change = +(stock.change + change).toFixed(2);
    stock.changePercent = +((stock.change / (stock.price - stock.change)) * 100).toFixed(2);
    stock.volume += Math.floor(Math.random() * 10000);
    updates.push({ symbol, ...stock });
  });
  return updates;
};

export const getHistoricalData = (symbol, period = '1M') => {
  const stock = stocks.get(symbol.toUpperCase());
  if (!stock) return null;

  const daysMap = { '1D': 1, '1W': 7, '1M': 30, '3M': 90, '1Y': 365, '5Y': 1825 };
  const days = daysMap[period] || 30;
  return generateCandlestick(stock.price, days);
};

export const getIntradayData = (symbol) => {
  const stock = stocks.get(symbol.toUpperCase());
  if (!stock) return null;
  return generateIntraday(stock.price);
};

export const getMarketDepth = (symbol) => {
  const stock = stocks.get(symbol.toUpperCase());
  if (!stock) return null;

  const bids = [];
  const asks = [];
  for (let i = 0; i < 10; i++) {
    bids.push({
      price: +(stock.price - (i + 1) * 0.05).toFixed(2),
      quantity: Math.floor(Math.random() * 5000 + 100),
      total: 0,
    });
    asks.push({
      price: +(stock.price + (i + 1) * 0.05).toFixed(2),
      quantity: Math.floor(Math.random() * 5000 + 100),
      total: 0,
    });
  }
  return { bids, asks };
};

export const fetchExternalQuote = async (symbol) => {
  const finnhubKey = process.env.FINNHUB_API_KEY;
  if (!finnhubKey) return null;

  try {
    const { data } = await axios.get(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${finnhubKey}`
    );
    if (data.c) {
      updateStockPrice(symbol, data.c);
      return getStock(symbol);
    }
  } catch {
    return null;
  }
  return null;
};

export const searchStocks = (query) => {
  const q = query.toLowerCase();
  return getAllStocks().filter(
    (s) => s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
  );
};

export const getTrendingStocks = () =>
  getAllStocks()
    .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
    .slice(0, 6);

import { getStock } from './stockService.js';
import { getDb, isFirebaseReady } from '../config/firebase.js';

const portfolios = new Map();
const wallets = new Map();
const DEFAULT_BALANCE = 100000;

export const getOrCreatePortfolio = async (userId) => {
  if (isFirebaseReady()) {
    const db = getDb();
    const doc = await db.collection('portfolios').doc(userId).get();
    if (doc.exists) return doc.data();

    const portfolio = { userId, holdings: [], totalValue: 0, totalInvested: 0, createdAt: new Date().toISOString() };
    await db.collection('portfolios').doc(userId).set(portfolio);
    return portfolio;
  }

  if (!portfolios.has(userId)) {
    portfolios.set(userId, { userId, holdings: [], totalValue: 0, totalInvested: 0, createdAt: new Date().toISOString() });
  }
  return portfolios.get(userId);
};

export const getWalletBalance = async (userId) => {
  if (isFirebaseReady()) {
    const db = getDb();
    const doc = await db.collection('wallets').doc(userId).get();
    if (doc.exists) return doc.data().balance;
    await db.collection('wallets').doc(userId).set({ balance: DEFAULT_BALANCE, userId });
    return DEFAULT_BALANCE;
  }

  if (!wallets.has(userId)) wallets.set(userId, DEFAULT_BALANCE);
  return wallets.get(userId);
};

export const updateWallet = async (userId, amount) => {
  if (isFirebaseReady()) {
    const db = getDb();
    await db.collection('wallets').doc(userId).set({ balance: amount, userId }, { merge: true });
  } else {
    wallets.set(userId, amount);
  }
};

const savePortfolio = async (userId, portfolio) => {
  if (isFirebaseReady()) {
    const db = getDb();
    await db.collection('portfolios').doc(userId).set(portfolio, { merge: true });
  } else {
    portfolios.set(userId, portfolio);
  }
};

export const calculatePortfolioValue = (holdings) => {
  let totalValue = 0;
  let totalInvested = 0;

  const enriched = holdings.map((h) => {
    const stock = getStock(h.symbol);
    const currentPrice = stock?.price || h.avgPrice;
    const value = currentPrice * h.quantity;
    const invested = h.avgPrice * h.quantity;
    const pnl = value - invested;
    const pnlPercent = invested > 0 ? (pnl / invested) * 100 : 0;

    totalValue += value;
    totalInvested += invested;

    return {
      ...h,
      currentPrice,
      value: +value.toFixed(2),
      pnl: +pnl.toFixed(2),
      pnlPercent: +pnlPercent.toFixed(2),
      name: stock?.name || h.symbol,
      change: stock?.change || 0,
      changePercent: stock?.changePercent || 0,
    };
  });

  return {
    holdings: enriched,
    totalValue: +totalValue.toFixed(2),
    totalInvested: +totalInvested.toFixed(2),
    totalPnl: +(totalValue - totalInvested).toFixed(2),
    totalPnlPercent: totalInvested > 0 ? +(((totalValue - totalInvested) / totalInvested) * 100).toFixed(2) : 0,
  };
};

export const buyStock = async (userId, symbol, quantity) => {
  const stock = getStock(symbol);
  if (!stock) throw new Error('Stock not found');

  const qty = Math.floor(quantity);
  if (qty <= 0) throw new Error('Invalid quantity');

  const cost = stock.price * qty;
  const balance = await getWalletBalance(userId);
  if (balance < cost) throw new Error('Insufficient balance');

  const portfolio = await getOrCreatePortfolio(userId);
  const existing = portfolio.holdings.find((h) => h.symbol === symbol.toUpperCase());

  if (existing) {
    const totalQty = existing.quantity + qty;
    existing.avgPrice = +((existing.avgPrice * existing.quantity + stock.price * qty) / totalQty).toFixed(2);
    existing.quantity = totalQty;
  } else {
    portfolio.holdings.push({
      symbol: symbol.toUpperCase(),
      quantity: qty,
      avgPrice: stock.price,
      purchasedAt: new Date().toISOString(),
    });
  }

  await updateWallet(userId, +(balance - cost).toFixed(2));
  const calculated = calculatePortfolioValue(portfolio.holdings);
  portfolio.totalValue = calculated.totalValue;
  portfolio.totalInvested = calculated.totalInvested;
  await savePortfolio(userId, portfolio);

  return {
    transaction: {
      type: 'BUY',
      symbol: symbol.toUpperCase(),
      quantity: qty,
      price: stock.price,
      total: +cost.toFixed(2),
      timestamp: new Date().toISOString(),
    },
    portfolio: calculated,
    newBalance: +(balance - cost).toFixed(2),
  };
};

export const sellStock = async (userId, symbol, quantity) => {
  const stock = getStock(symbol);
  if (!stock) throw new Error('Stock not found');

  const qty = Math.floor(quantity);
  if (qty <= 0) throw new Error('Invalid quantity');

  const portfolio = await getOrCreatePortfolio(userId);
  const holding = portfolio.holdings.find((h) => h.symbol === symbol.toUpperCase());
  if (!holding || holding.quantity < qty) throw new Error('Insufficient shares');

  const proceeds = stock.price * qty;
  holding.quantity -= qty;

  if (holding.quantity === 0) {
    portfolio.holdings = portfolio.holdings.filter((h) => h.symbol !== symbol.toUpperCase());
  }

  const balance = await getWalletBalance(userId);
  await updateWallet(userId, +(balance + proceeds).toFixed(2));

  const calculated = calculatePortfolioValue(portfolio.holdings);
  portfolio.totalValue = calculated.totalValue;
  portfolio.totalInvested = calculated.totalInvested;
  await savePortfolio(userId, portfolio);

  return {
    transaction: {
      type: 'SELL',
      symbol: symbol.toUpperCase(),
      quantity: qty,
      price: stock.price,
      total: +proceeds.toFixed(2),
      timestamp: new Date().toISOString(),
    },
    portfolio: calculated,
    newBalance: +(balance + proceeds).toFixed(2),
  };
};

export const getPortfolioAnalytics = async (userId) => {
  const portfolio = await getOrCreatePortfolio(userId);
  const calculated = calculatePortfolioValue(portfolio.holdings);
  const balance = await getWalletBalance(userId);

  const sectorAllocation = {};
  calculated.holdings.forEach((h) => {
    const stock = getStock(h.symbol);
    const sector = stock?.sector || 'Other';
    sectorAllocation[sector] = (sectorAllocation[sector] || 0) + h.value;
  });

  const dailyPnl = calculated.totalPnl * (0.1 + Math.random() * 0.3);

  return {
    ...calculated,
    walletBalance: balance,
    netWorth: +(calculated.totalValue + balance).toFixed(2),
    dailyPnl: +dailyPnl.toFixed(2),
    sectorAllocation,
    holdingsCount: calculated.holdings.length,
  };
};

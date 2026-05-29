import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../config/api';

export const fetchPortfolio = createAsyncThunk('portfolio/fetch', async () => {
  const { data } = await api.get('/portfolio');
  return data;
});

export const buyStock = createAsyncThunk('portfolio/buy', async ({ symbol, quantity }) => {
  const { data } = await api.post('/portfolio/buy', { symbol, quantity });
  return data;
});

export const sellStock = createAsyncThunk('portfolio/sell', async ({ symbol, quantity }) => {
  const { data } = await api.post('/portfolio/sell', { symbol, quantity });
  return data;
});

export const fetchWatchlist = createAsyncThunk('portfolio/watchlist', async () => {
  const { data } = await api.get('/watchlist');
  return data;
});

export const addToWatchlist = createAsyncThunk('portfolio/addWatch', async (symbol) => {
  await api.post(`/watchlist/${symbol}`);
  return symbol;
});

export const removeFromWatchlist = createAsyncThunk('portfolio/removeWatch', async (symbol) => {
  await api.delete(`/watchlist/${symbol}`);
  return symbol;
});

export const fetchTransactions = createAsyncThunk('portfolio/transactions', async () => {
  const { data } = await api.get('/transactions');
  return data;
});

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState: {
    data: null,
    watchlist: [],
    transactions: [],
    loading: false,
    tradeLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPortfolio.fulfilled, (state, action) => { state.data = action.payload; state.loading = false; })
      .addCase(buyStock.fulfilled, (state, action) => {
        state.data = { ...action.payload.portfolio, walletBalance: action.payload.newBalance };
        state.tradeLoading = false;
      })
      .addCase(sellStock.fulfilled, (state, action) => {
        state.data = { ...action.payload.portfolio, walletBalance: action.payload.newBalance };
        state.tradeLoading = false;
      })
      .addCase(fetchWatchlist.fulfilled, (state, action) => { state.watchlist = action.payload; })
      .addCase(fetchTransactions.fulfilled, (state, action) => { state.transactions = action.payload; })
      .addCase(buyStock.pending, (state) => { state.tradeLoading = true; })
      .addCase(sellStock.pending, (state) => { state.tradeLoading = true; });
  },
});

export default portfolioSlice.reducer;

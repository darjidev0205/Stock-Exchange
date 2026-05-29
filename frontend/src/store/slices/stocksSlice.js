import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../config/api';

export const fetchStocks = createAsyncThunk('stocks/fetchAll', async () => {
  const { data } = await api.get('/stocks');
  return data;
});

export const fetchStock = createAsyncThunk('stocks/fetchOne', async (symbol) => {
  const { data } = await api.get(`/stocks/${symbol}`);
  return data;
});

export const fetchTrending = createAsyncThunk('stocks/trending', async () => {
  const { data } = await api.get('/stocks/trending');
  return data;
});

export const searchStocks = createAsyncThunk('stocks/search', async (query) => {
  const { data } = await api.get(`/stocks/search?q=${query}`);
  return data;
});

export const fetchHistory = createAsyncThunk('stocks/history', async ({ symbol, period }) => {
  const { data } = await api.get(`/stocks/${symbol}/history?period=${period}`);
  return data;
});

const stocksSlice = createSlice({
  name: 'stocks',
  initialState: {
    list: [],
    current: null,
    trending: [],
    searchResults: [],
    history: [],
    loading: false,
  },
  reducers: {
    updatePrices: (state, action) => {
      const updates = action.payload;
      updates.forEach((update) => {
        const idx = state.list.findIndex((s) => s.symbol === update.symbol);
        if (idx !== -1) state.list[idx] = { ...state.list[idx], ...update };
        if (state.current?.symbol === update.symbol) {
          state.current = { ...state.current, ...update };
        }
      });
    },
    clearSearch: (state) => {
      state.searchResults = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStocks.fulfilled, (state, action) => { state.list = action.payload; state.loading = false; })
      .addCase(fetchStock.fulfilled, (state, action) => { state.current = action.payload; })
      .addCase(fetchTrending.fulfilled, (state, action) => { state.trending = action.payload; })
      .addCase(searchStocks.fulfilled, (state, action) => { state.searchResults = action.payload; })
      .addCase(fetchHistory.fulfilled, (state, action) => { state.history = action.payload; });
  },
});

export const { updatePrices, clearSearch } = stocksSlice.actions;
export default stocksSlice.reducer;

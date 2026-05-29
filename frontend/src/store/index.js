import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import stocksReducer from './slices/stocksSlice';
import portfolioReducer from './slices/portfolioSlice';
import themeReducer from './slices/themeSlice';
import notificationsReducer from './slices/notificationsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    stocks: stocksReducer,
    portfolio: portfolioReducer,
    theme: themeReducer,
    notifications: notificationsReducer,
  },
});

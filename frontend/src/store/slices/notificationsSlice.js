import { createSlice } from '@reduxjs/toolkit';

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: { items: [] },
  reducers: {
    addNotification: (state, action) => {
      state.items.unshift({
        id: Date.now(),
        ...action.payload,
        read: false,
        timestamp: new Date().toISOString(),
      });
      if (state.items.length > 20) state.items.pop();
    },
    markRead: (state, action) => {
      const item = state.items.find((n) => n.id === action.payload);
      if (item) item.read = true;
    },
    clearAll: (state) => {
      state.items = [];
    },
  },
});

export const { addNotification, markRead, clearAll } = notificationsSlice.actions;
export default notificationsSlice.reducer;

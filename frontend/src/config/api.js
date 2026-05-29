import axios from 'axios';
import { auth } from './firebase';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
});

api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    const devToken = localStorage.getItem('devToken');
    if (devToken) config.headers.Authorization = `Bearer ${devToken}`;
  }
  return config;
});

export default api;

export const createWebSocket = () => {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = import.meta.env.VITE_WS_URL || `${protocol}//${window.location.hostname}:5000`;
  return new WebSocket(`${host}/ws`);
};

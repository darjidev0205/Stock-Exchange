import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { createWebSocket } from '../config/api';
import { updatePrices } from '../store/slices/stocksSlice';

export const useWebSocket = () => {
  const dispatch = useDispatch();
  const wsRef = useRef(null);

  useEffect(() => {
    const ws = createWebSocket();
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'price_update') {
          dispatch(updatePrices(message.data));
        }
      } catch {
        // ignore parse errors
      }
    };

    return () => ws.close();
  }, [dispatch]);
};

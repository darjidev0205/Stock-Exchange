import { WebSocketServer } from 'ws';
import { simulatePriceTick } from '../services/stockService.js';

export const initWebSocket = (server) => {
  const wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', (ws) => {
    ws.send(JSON.stringify({ type: 'connected', message: 'NexTrade AI WebSocket connected' }));

    const interval = setInterval(() => {
      if (ws.readyState === ws.OPEN) {
        const updates = simulatePriceTick();
        ws.send(JSON.stringify({ type: 'price_update', data: updates }));
      }
    }, 3000);

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);
        if (data.type === 'subscribe' && data.symbol) {
          ws.symbol = data.symbol;
        }
      } catch {
        // ignore malformed messages
      }
    });

    ws.on('close', () => clearInterval(interval));
  });

  console.log('✅ WebSocket server initialized on /ws');
  return wss;
};

# NexTrade AI

A premium AI-powered stock trading platform built with React, Node.js, Firebase, and real-time WebSocket updates.

![NexTrade AI](https://img.shields.io/badge/NexTrade-AI-00d4ff?style=for-the-badge)

## Features

- **Authentication** — Secure Firebase Authentication with email/password and Google OAuth
- **Real-Time Trading** — Buy/sell stocks with live price updates via WebSocket
- **Portfolio Analytics** — Track holdings, P&L, sector allocation, and net worth
- **Advanced Charts** — Candlestick charts, area charts, and historical data
- **AI Insights** — Stock analysis, risk scoring, price predictions, and portfolio suggestions
- **Watchlist** — Bookmark favorite stocks for quick access
- **Admin Panel** — Manage stocks, users, and transactions
- **Premium UI** — Glassmorphism dark theme with neon accents, Framer Motion animations

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 19, Vite, Tailwind CSS 4, Framer Motion, Redux Toolkit, Recharts, React Router |
| Backend | Node.js, Express, WebSocket (ws), Firebase Admin SDK |
| Database | Firebase Firestore |
| Auth | Firebase Authentication + JWT sessions |

## Project Structure

```
stock exchange web/
├── frontend/                 # React SPA
│   ├── src/
│   │   ├── components/       # UI, layout, charts, common
│   │   ├── pages/            # All route pages
│   │   ├── store/            # Redux slices
│   │   ├── config/           # Firebase & API config
│   │   ├── hooks/            # Custom hooks
│   │   └── utils/            # Formatters & helpers
│   └── public/
├── backend/                  # Express API
│   └── src/
│       ├── routes/           # API endpoints
│       ├── services/         # Business logic
│       ├── middleware/       # Auth & admin guards
│       ├── websocket/        # Real-time price feed
│       └── config/           # Firebase setup
└── README.md
```

## Quick Start

### Prerequisites

- Node.js 18+
- npm
- Active Firebase Project

### 1. Clone & Install

```bash
cd "stock exchange web"

# Backend
cd backend
cp .env.example .env
npm install

# Frontend
cd ../frontend
cp .env.example .env
npm install
```

### 2. Configure Environment

Ensure that your `backend/.env` and `frontend/.env` files are configured locally with your active environment parameters (port settings, database URIs, and Firebase API keys).

### 3. Run Development Servers

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Open **http://localhost:5173** in your browser.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/auth/dev-login` | Demo authentication |
| GET | `/api/stocks` | List all stocks |
| GET | `/api/stocks/:symbol` | Stock details |
| GET | `/api/stocks/:symbol/history` | Historical candlestick data |
| POST | `/api/portfolio/buy` | Buy stocks |
| POST | `/api/portfolio/sell` | Sell stocks |
| GET | `/api/portfolio` | Portfolio analytics |
| GET | `/api/watchlist` | User watchlist |
| GET | `/api/ai/insights/:symbol` | AI stock analysis |
| GET | `/api/ai/predictions/:symbol` | Price predictions |
| GET | `/api/admin/stats` | Admin dashboard stats |

WebSocket: `ws://localhost:5000/ws` — Real-time price updates every 3 seconds.

## Firebase Setup

1. Create a project at [Firebase Console](https://console.firebase.google.com)
2. Enable **Authentication** (Email/Password + Google)
3. Create a **Firestore** database
4. Generate a **Service Account** key for the backend
5. Add your web app config to `frontend/.env`

## Pages

| Page | Route | Description |
|------|-------|-------------|
| Landing | `/` | Marketing homepage |
| Login/Register | `/login`, `/register` | Authentication |
| Dashboard | `/dashboard` | Portfolio overview & AI suggestions |
| Portfolio | `/portfolio` | Holdings & sector allocation |
| Market | `/market` | All stocks with live prices |
| Stock Detail | `/stock/:symbol` | Charts, depth, AI insights, trade |
| Watchlist | `/watchlist` | Bookmarked stocks |
| News | `/news` | Market news feed |
| AI Insights | `/ai-insights` | AI market analysis |
| Transactions | `/transactions` | Trade history |
| Settings | `/settings` | Profile & preferences |
| Admin | `/admin` | Platform management |

## License

MIT — For educational purposes. Not financial advice.

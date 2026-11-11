# Google Isochrones Demo — Frontend

React SPA with Google Maps for visualizing isochrone reachable areas.

## Setup

```bash
cp .env.example .env
# Edit .env with your VITE_GOOGLE_MAPS_API_KEY
npm install
```

## Local Dev

```bash
npm run dev     # → http://localhost:5173
```

Make sure the [Lambda backend](../lambda/README.md) is running on port 3001.

## Build

```bash
npm run build   # → dist/
```

## Deploy (Amplify)

Set environment variables in Amplify Console:

| Key | Value |
|-----|-------|
| `VITE_API_BASE_URL` | Lambda Function URL or API Gateway URL |
| `VITE_GOOGLE_MAPS_API_KEY` | Your Google Maps API key |

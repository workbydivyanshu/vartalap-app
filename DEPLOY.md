# Vartalap Deployment Guide

## Architecture (Recommended: Vercel + Local Backend)
- **Frontend:** Vercel (React + Vite) — Fast CDN, no cold starts
- **Backend:** Local machine (Node.js + Express + MongoDB) — Exposed via ngrok tunnel
- **Database:** Local MongoDB (Docker)

## Quick Start (Vercel + Local Backend)

### Step 1: Deploy Frontend on Vercel
1. Go to [vercel.com](https://vercel.com) and sign up (no credit card)
2. Click "Add New" → "Project"
3. Import your GitHub repo: `workbydivyanshu/vartalap-app`
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `client`
   - **Build Command:** `npm install && npm run build`
   - **Output Directory:** `dist`

5. Add Environment Variables:
   ```
   VITE_API_URL=https://your-ngrok-url/api
   VITE_WS_URL=wss://your-ngrok-url
   VITE_MEDIA_URL=https://your-ngrok-url/uploads
   ```

6. Click "Deploy"

### Step 2: Start Local Backend
Run the startup script:
```bash
./start-remote.sh
```

This will:
1. Start MongoDB (Docker)
2. Start backend server (port 3001)
3. Start ngrok tunnel (exposes backend externally)
4. Display the public URL

### Step 3: Update Vercel Environment Variables
After ngrok starts, copy the displayed URL and update Vercel:
```
VITE_API_URL=https://your-ngrok-url/api
VITE_WS_URL=wss://your-ngrok-url
```

### Step 4: Test
1. Visit your Vercel URL
2. Register a new account
3. Create a server
4. Send messages

## Alternative: Manual Setup (Without ngrok)

### Start Backend Manually
```bash
# Start MongoDB
docker compose -f docker-compose.dev.yml up -d

# Start backend
cd server
MONGODB_URI=mongodb://localhost:27017/vartalap npm start
```

### Expose Backend
Choose one method:

**Option A: ngrok (Easiest)**
```bash
ngrok http 3001
```

**Option B: Cloudflare Tunnel (Free)**
```bash
cloudflared tunnel --url http://localhost:3001
```

**Option C: Local Network**
```bash
# Find your local IP
ip addr show | grep -oP 'inet \K[\d.]+' | grep -v 127.0.0.1 | head -1

# Access at: http://YOUR-IP:3001
```

## Environment Variables Reference

### Frontend (Vercel)
```bash
VITE_API_URL=https://your-ngrok-url/api
VITE_WS_URL=wss://your-ngrok-url
VITE_MEDIA_URL=https://your-ngrok-url/uploads
```

### Backend (Local)
```bash
PORT=3001
MONGODB_URI=mongodb://localhost:27017/vartalap
JWT_SECRET=your-secret-key
CLIENT_URL=https://your-app.vercel.app
```

## Troubleshooting

### WebSocket not connecting
- Make sure `VITE_WS_URL` uses `wss://` (secure WebSocket)
- Check that ngrok is running
- Check that backend is running on port 3001

### CORS errors
- Update `CLIENT_URL` on backend to match your Vercel URL
- Restart the backend server

### ngrok not working
- Install ngrok: `brew install ngrok`
- Authenticate: `ngrok config add-authtoken YOUR_TOKEN`
- Start: `ngrok http 3001`

### Build failures on Vercel
- Check Node.js version (use 20+)
- Check that all dependencies are in package.json
- Check build logs on Vercel

## Free Tier Limits
- **Vercel:** 100GB bandwidth, 100 builds/day
- **ngrok:** 1 tunnel, 40 connections/min (free tier)
- **Local Backend:** Unlimited (your machine)

## Production Notes
- For production, consider deploying backend on Render or Railway
- ngrok URL changes on restart (free tier)
- Keep your machine running for backend to be accessible

# Vartalap Deployment Guide

## Architecture
- **Frontend:** Vercel (React + Vite) — Fast CDN, no cold starts
- **Backend:** Render (Node.js + Express) — Supports WebSocket
- **Database:** Render MongoDB (free tier)

## Quick Start

### Step 1: Deploy Backend on Render
1. Go to [render.com](https://render.com) and sign up (no credit card)
2. Click "New" → "Web Service"
3. Connect your GitHub repo: `workbydivyanshu/vartalap-app`
4. Configure:
   - **Name:** vartalap-server
   - **Root Directory:** `server`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Plan:** Free

5. Add Environment Variables:
   ```
   PORT=3001
   NODE_ENV=production
   MONGODB_URI=<your-mongodb-connection-string>
   JWT_SECRET=<generate-random-string>
   CLIENT_URL=https://your-app.vercel.app
   ```

6. Click "Create Web Service"

### Step 2: Create MongoDB on Render
1. Click "New" → "MongoDB"
2. Configure:
   - **Name:** vartalap-mongo
   - **Plan:** Free
   - **Database:** vartalap

3. Copy the connection string and use it as `MONGODB_URI` in Step 1

### Step 3: Deploy Frontend on Vercel
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
   VITE_API_URL=https://your-server.onrender.com/api
   VITE_WS_URL=wss://your-server.onrender.com
   VITE_MEDIA_URL=https://your-server.onrender.com/uploads
   ```

6. Click "Deploy"

### Step 4: Update CORS on Backend
After Vercel deployment, update the `CLIENT_URL` environment variable on Render to your Vercel URL:
```
CLIENT_URL=https://your-app.vercel.app
```

### Step 5: Test
1. Visit your Vercel URL
2. Register a new account
3. Create a server
4. Send messages

## Environment Variables Reference

### Frontend (Vercel)
```bash
VITE_API_URL=https://vartalap-server.onrender.com/api
VITE_WS_URL=wss://vartalap-server.onrender.com
VITE_MEDIA_URL=https://vartalap-server.onrender.com/uploads
```

### Backend (Render)
```bash
PORT=3001
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/vartalap
JWT_SECRET=your-secret-key-here
CLIENT_URL=https://your-app.vercel.app
```

## Troubleshooting

### WebSocket not connecting
- Make sure `VITE_WS_URL` uses `wss://` (secure WebSocket)
- Check that Render service is running

### CORS errors
- Update `CLIENT_URL` on Render to match your Vercel URL
- Restart the Render service

### Cold starts
- Render free tier has 30-60s cold starts
- Consider upgrading to paid tier for always-on

### Build failures
- Check Node.js version (use 20+)
- Check that all dependencies are in package.json
- Check build logs on Render/Vercel

## Free Tier Limits
- **Vercel:** 100GB bandwidth, 100 builds/day
- **Render:** 750 hours/month, 512MB RAM, 0.1 CPU
- **MongoDB:** 512MB storage, 512MB RAM

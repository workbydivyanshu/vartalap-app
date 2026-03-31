#!/bin/bash
set -e

cd "$(dirname "$0")"

echo "============================================"
echo "  VARTALAP - Start Remote Access"
echo "============================================"
echo ""

# Check prerequisites
if ! command -v docker &>/dev/null; then
    echo "ERROR: Docker not installed"
    exit 1
fi

if ! command -v node &>/dev/null; then
    echo "ERROR: Node.js not installed"
    exit 1
fi

# Step 1: Start MongoDB
echo "[1/4] Starting MongoDB..."
docker start revo-database-1 2>/dev/null || docker compose -f docker-compose.dev.yml up -d 2>/dev/null
sleep 3

# Step 2: Start backend server
echo "[2/4] Starting backend server..."
pkill -f "node.*index.ts" 2>/dev/null || true
sleep 1
cd server
MONGODB_URI="mongodb://localhost:27017/vartalap" node --import file:///home/divyu/vartalap/vartalap-app/server/node_modules/tsx/dist/loader.mjs src/index.ts &
SERVER_PID=$!
sleep 4

# Check server is running
curl -s --max-time 3 http://localhost:3001/api/health >/dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "  Server running on port 3001"
else
    echo "  ERROR: Server failed to start"
    exit 1
fi

# Step 3: Start ngrok tunnel
echo "[3/4] Starting ngrok tunnel..."
if ! command -v ngrok &>/dev/null; then
    echo "  ngrok not installed. Install from: https://ngrok.com/download"
    echo "  Or use: brew install ngrok"
    echo "  Then run: ngrok http 3001"
    echo ""
    echo "  Alternative: Use local network access at:"
    LOCAL_IP=$(ip addr show | grep -oP 'inet \K[\d.]+' | grep -v 127.0.0.1 | head -1)
    echo "  http://${LOCAL_IP}:3001"
    echo ""
    exit 0
fi

# Start ngrok in background
ngrok http 3001 &
NGROK_PID=$!
sleep 5

# Get ngrok URL
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels 2>/dev/null | python3 -c "import json,sys;t=json.load(sys.stdin)['tunnels'];print(t[0]['public_url'] if t else 'N/A')" 2>/dev/null || echo "N/A")

if [ "$NGROK_URL" = "N/A" ]; then
    echo "  ERROR: Could not get ngrok URL"
    echo "  Make sure ngrok is authenticated: ngrok config add-authtoken YOUR_TOKEN"
    exit 1
fi

echo "  ngrok URL: $NGROK_URL"
echo ""

# Step 4: Display instructions
echo "[4/4] Configuration"
echo "============================================"
echo ""
echo "Your backend is accessible at:"
echo "  API:      ${NGROK_URL}/api"
echo "  Health:   ${NGROK_URL}/api/health"
echo ""
echo "For Vercel deployment, set these environment variables:"
echo "  BACKEND_URL=${NGROK_URL}"
echo "  VITE_API_URL=${NGROK_URL}/api"
echo "  VITE_WS_URL=${NGROK_URL/https:/wss:}"
echo ""
echo "============================================"
echo ""
echo "Services running:"
echo "  MongoDB:  localhost:27017 (Docker)"
echo "  Server:   localhost:3001 (PID: ${SERVER_PID})"
echo "  ngrok:    ${NGROK_URL} (PID: ${NGROK_PID})"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for interrupt
trap "kill $SERVER_PID $NGROK_PID 2>/dev/null; exit 0" INT TERM
wait

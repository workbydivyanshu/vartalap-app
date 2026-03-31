# Vartalap

A free and open-source instant messaging platform for friends, groups, and communities.

## Features

- **Real-time messaging** — Send and receive messages instantly via WebSocket
- **Channels** — Organized text channels within servers
- **Direct messages** — Private conversations between users
- **Reactions** — React to messages with emojis
- **Replies** — Reply to specific messages
- **Threads** — View all replies in a dedicated thread panel
- **File uploads** — Share images and files
- **Message search** — Search through message history
- **Pin messages** — Pin important messages
- **Edit/delete** — Edit or delete your own messages
- **Slash commands** — Use commands like /shrug, /me, /tableflip
- **Emoji picker** — 100+ emojis in 8 categories
- **Typing indicators** — See who's typing
- **Desktop notifications** — Get notified of new messages
- **PWA support** — Install as an app on mobile/desktop
- **Mobile responsive** — Works on all screen sizes
- **Quick switcher** — Ctrl+K to search channels and DMs
- **Server management** — Create, join, and manage servers
- **Settings** — Customize notifications, theme, language, and more

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript, Vite |
| Backend | Node.js, Express, Socket.IO |
| Database | MongoDB |
| Auth | JWT + bcrypt |
| Real-time | WebSocket (Socket.IO) |
| File upload | Multer |

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB 7+
- npm or pnpm

### Setup

```bash
# Clone the repository
git clone https://github.com/workbydivyanshu/vartalap.git
cd vartalap/vartalap-app

# Start MongoDB
docker compose -f docker-compose.dev.yml up -d

# Install dependencies
cd server && npm install
cd ../client && npm install

# Start backend
cd server
MONGODB_URI=mongodb://localhost:27017/vartalap npm run dev

# Start frontend (in another terminal)
cd client
npm run dev
```

### Access

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001

## Project Structure

```
vartalap-app/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # UI components
│   │   │   └── chat/        # Chat-specific components
│   │   ├── context/         # React contexts (Auth, Socket)
│   │   ├── pages/           # Page components
│   │   ├── styles/          # Global CSS
│   │   ├── types/           # TypeScript interfaces
│   │   └── test/            # Unit tests
│   ├── public/              # Static assets
│   └── package.json
├── server/                  # Node.js backend
│   ├── src/
│   │   ├── middleware/      # Auth middleware
│   │   ├── models/          # MongoDB models
│   │   ├── routes/          # API routes
│   │   └── socket/          # WebSocket handlers
│   └── package.json
├── README.md
├── API.md
└── docker-compose.dev.yml
```

## Testing

```bash
cd client
npm test
```

## API Documentation

See [API.md](./API.md) for full API documentation.

## License

MIT License

## Access

### Local Access
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001
- **API Health:** http://localhost:3001/api/health

### Network Access (same network)
- **Local IP:** 192.168.1.7
- **Frontend:** http://192.168.1.7:5173
- **Backend API:** http://192.168.1.7:3001

### External Access
For external access from outside your network, you need to:
1. Configure your router to forward ports 5173 and 3001 to your machine
2. Or use a tunneling service like ngrok:
   ```bash
   ngrok http 5173  # For frontend
   ngrok http 3001  # For API
   ```
3. Or deploy to a cloud server

## Auto-Start on Boot
The app uses systemd services that start automatically on boot:
- `vartalap-mongodb` — MongoDB database
- `vartalap-server` — Backend server
- `vartalap-client` — Frontend dev server

To manage services:
```bash
systemctl --user status vartalap-mongodb vartalap-server vartalap-client
systemctl --user restart vartalap-server  # Restart server
systemctl --user restart vartalap-client  # Restart client
```

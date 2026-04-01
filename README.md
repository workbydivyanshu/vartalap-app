# Vartalap

**A modern, open-source instant messaging platform built with React, TypeScript, and Node.js**

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=socketdotio&logoColor=white)](https://socket.io/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](./LICENSE)

---

## Overview

Vartalap is a full-stack real-time messaging platform that brings Discord-like functionality to the modern web. Built from the ground up with performance and developer experience in mind, it features a React frontend, Node.js backend, and MongoDB database with real-time WebSocket communication.

**Live Demo:** [https://vartalap-app-vert.vercel.app](https://vartalap-app-vert.vercel.app)

---

## Features

### Core Messaging
- Real-time messaging via WebSocket (Socket.IO)
- Message reactions with emoji picker (100+ emojis, 8 categories)
- Reply and thread system for organized conversations
- Edit and delete messages with confirmation
- Slash commands (`/shrug`, `/me`, `/tableflip`, `/unflip`)
- Typing indicators showing who's composing
- Message search across channels
- Pin important messages
- File and image uploads with progress indicator

### Server Management
- Create and manage multiple servers
- Text channels with categories
- Server invite system with codes
- Member list with online status
- Quick switcher (Ctrl+K) for navigation

### User Experience
- Dark theme with glassmorphism effects
- Neon glow effects and micro-interactions
- Desktop notifications for new messages
- PWA support (installable on mobile and desktop)
- Mobile-responsive design
- Settings persistence across sessions

### Security
- JWT authentication with bcrypt password hashing
- Rate limiting on API endpoints
- Helmet.js security headers
- CORS configuration for cross-origin requests

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 18, TypeScript, Vite | SPA with hot module replacement |
| **Backend** | Node.js, Express, Socket.IO | REST API + WebSocket server |
| **Database** | MongoDB, Mongoose | Document storage and schema validation |
| **Auth** | JWT, bcrypt | Token-based authentication |
| **Real-time** | Socket.IO | Bidirectional event-based communication |
| **Styling** | CSS Variables, CSS Modules | Component-scoped styling |
| **Testing** | Vitest, React Testing Library | Unit and integration tests |
| **Deployment** | Vercel (frontend) + ngrok (tunnel) | Free hosting with local backend |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT                                │
│  React 18 + TypeScript + Vite                               │
│  ├── Components (20+ chat components)                       │
│  ├── Contexts (Auth, Socket)                                │
│  ├── Pages (Landing, Login, Chat, Settings)                 │
│  └── Hooks (useAuth, useSocket)                             │
└─────────────────────────────────────────────────────────────┘
                            │
                    HTTP/WebSocket
                            │
┌─────────────────────────────────────────────────────────────┐
│                        SERVER                                │
│  Node.js + Express + Socket.IO                              │
│  ├── Routes (Auth, Servers, Channels, Messages, DMs, Upload)│
│  ├── Models (User, Server, Channel, Message, DM)            │
│  ├── Middleware (JWT Auth, CORS, Rate Limit)                │
│  └── Socket Handler (Events, Typing, Messages)              │
└─────────────────────────────────────────────────────────────┘
                            │
                            │
┌─────────────────────────────────────────────────────────────┐
│                      DATABASE                                │
│  MongoDB (Docker)                                           │
│  ├── Users collection                                       │
│  ├── Servers collection                                     │
│  ├── Channels collection                                    │
│  ├── Messages collection                                    │
│  └── DMs collection                                         │
└─────────────────────────────────────────────────────────────┘
```

---

## Quick Start

### Prerequisites
- Node.js 20+
- Docker and Docker Compose
- npm

### Local Development

```bash
# Clone the repository
git clone https://github.com/workbydivyanshu/vartalap-app.git
cd vartalap-app

# Start MongoDB
docker compose -f docker-compose.dev.yml up -d

# Install dependencies
cd server && npm install && cd ..
cd client && npm install && cd ..

# Start backend (terminal 1)
cd server
MONGODB_URI=mongodb://localhost:27017/vartalap npm start

# Start frontend (terminal 2)
cd client
npm run dev
```

### Access
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001
- **API Health:** http://localhost:3001/api/health

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get profile |
| POST | `/api/servers` | Create server |
| GET | `/api/servers` | List servers |
| POST | `/api/servers/:id/channels` | Create channel |
| GET | `/api/channels/:id/messages` | Get messages |
| POST | `/api/channels/:id/messages` | Send message |
| PATCH | `/api/channels/:id/messages/:id` | Edit message |
| DELETE | `/api/channels/:id/messages/:id` | Delete message |
| POST | `/api/channels/:id/messages/:id/react` | React to message |
| POST | `/api/channels/:id/pins/:id` | Pin message |
| GET | `/api/channels/:id/search` | Search messages |
| POST | `/api/upload` | Upload file |

Full API documentation: [API.md](./API.md)

---

## Testing

```bash
cd client
npm test
```

**46 unit tests** covering:
- Login and registration forms
- Quick switcher search and navigation
- Emoji picker categories and selection
- Settings sections and toggles
- Command suggestions and execution

---

## Deployment

The app supports multiple deployment options:

### Option A: Vercel + ngrok (Free)
1. Deploy frontend to Vercel
2. Run `ngrok http 3001` for backend tunnel
3. Configure Vercel environment variables

### Option B: Docker Compose
```bash
docker compose -f docker-compose.yml up -d
```

### Option C: Systemd Services
```bash
# Auto-start on boot
systemctl --user enable vartalap-mongodb vartalap-server vartalap-client
```

See [DEPLOY.md](./DEPLOY.md) for detailed deployment guide.

---

## Project Structure

```
vartalap-app/
├── client/                      # React frontend
│   ├── src/
│   │   ├── components/chat/     # 20+ chat components
│   │   ├── pages/               # 8 page components
│   │   ├── context/             # Auth and Socket contexts
│   │   ├── styles/              # Global CSS with variables
│   │   └── test/                # 46 unit tests
│   ├── public/
│   │   ├── manifest.json        # PWA manifest
│   │   └── serviceWorker.js     # Service worker
│   ├── Dockerfile
│   └── vercel.json              # Vercel deployment
├── server/                      # Node.js backend
│   ├── src/
│   │   ├── routes/              # 6 route files
│   │   ├── models/              # 5 MongoDB models
│   │   ├── middleware/          # Auth and validation
│   │   └── socket/              # WebSocket handlers
│   ├── Dockerfile
│   └── package.json
├── .github/workflows/ci.yml    # GitHub Actions
├── API.md                       # API documentation
├── CHANGELOG.md                 # Version history
└── DEPLOY.md                    # Deployment guide
```

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

MIT License — see [LICENSE](./LICENSE) for details.

---

## Contact

**Divyanshu Ganeshwani**
- GitHub: [@workbydivyanshu](https://github.com/workbydivyanshu)
- Email: divyanshuganeshwani@gmail.com

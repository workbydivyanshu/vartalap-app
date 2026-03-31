# Vartalap API Documentation

Base URL: `http://localhost:3001/api`

## Authentication

All endpoints (except register/login) require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

### POST /auth/register
Create a new user account.

**Request:**
```json
{ "username": "string", "email": "string", "password": "string" }
```

**Response:** `201`
```json
{ "token": "jwt_token", "user": { "_id": "...", "username": "...", "email": "..." } }
```

### POST /auth/login
Log in with email and password.

**Request:**
```json
{ "email": "string", "password": "string" }
```

**Response:** `200`
```json
{ "token": "jwt_token", "user": { "_id": "...", "username": "...", "email": "...", "status": "online" } }
```

### GET /auth/me
Get current user profile.

**Response:** `200`
```json
{ "_id": "...", "username": "...", "email": "...", "status": "online", "servers": [...] }
```

### PATCH /auth/me
Update current user profile.

**Request:**
```json
{ "username": "string", "displayName": "string", "email": "string", "avatar": "string" }
```

## Servers

### POST /servers
Create a new server.

**Request:**
```json
{ "name": "string" }
```

**Response:** `201` — Server with default #general channel

### GET /servers
List all servers the current user is a member of.

**Response:** `200` — Array of server objects with populated channels and members

### PATCH /servers/:serverId
Update server name (owner only).

**Request:**
```json
{ "name": "string" }
```

### DELETE /servers/:serverId/leave
Leave a server.

**Response:** `200` `{ "success": true }`

### POST /servers/:serverId/channels
Create a new channel in a server.

**Request:**
```json
{ "name": "string", "type": "text|voice" }
```

### POST /servers/:serverId/invite
Generate an invite code for a server.

**Response:** `200` `{ "inviteCode": "abc123", "inviteUrl": "/invite/abc123" }`

### POST /servers/join/:inviteCode
Join a server using an invite code.

## Messages

### GET /channels/:channelId/messages
Get messages in a channel.

**Query params:** `?before=timestamp&limit=50`

**Response:** `200` — Array of message objects

### POST /channels/:channelId/messages
Send a message to a channel.

**Request:**
```json
{ "content": "string", "replyTo": "messageId", "attachments": ["url"] }
```

### PATCH /channels/:channelId/messages/:messageId
Edit a message (author only).

**Request:**
```json
{ "content": "string" }
```

### DELETE /channels/:channelId/messages/:messageId
Delete a message (author only).

### POST /channels/:channelId/messages/:messageId/react
Toggle a reaction on a message.

**Request:**
```json
{ "emoji": "string" }
```

### GET /channels/:channelId/search?q=query
Search messages by content.

### POST /channels/:channelId/pins/:messageId
Pin a message.

### DELETE /channels/:channelId/pins/:messageId
Unpin a message.

### GET /channels/:channelId/pins
Get all pinned messages in a channel.

### GET /channels/:channelId/messages/:messageId/thread
Get all replies to a message (thread view).

**Response:** `200` `{ "parent": {...}, "replies": [...] }`

## Direct Messages

### GET /dms
List all DM conversations.

### POST /dms
Start a new DM conversation.

**Request:**
```json
{ "recipientId": "userId" }
```

### GET /dms/:conversationId/messages
Get messages in a DM conversation.

### POST /dms/:conversationId/messages
Send a message in a DM.

## File Upload

### POST /upload
Upload a file.

**Request:** `multipart/form-data` with `file` field

**Response:** `201`
```json
{ "url": "/uploads/filename.ext", "filename": "original_name.ext", "size": 1234, "mimetype": "image/png" }
```

## Users

### GET /users/search?q=username
Search for users by username.

### GET /users/:userId
Get a user's public profile.

## WebSocket Events

### Client → Server
- `channel:join` — Join a channel room
- `channel:leave` — Leave a channel room
- `dm:join` — Join a DM room
- `message:send` — Send a message
- `message:edit` — Edit a message
- `message:delete` — Delete a message
- `message:pin` — Pin/unpin a message
- `typing:start` — Start typing indicator
- `typing:stop` — Stop typing indicator

### Server → Client
- `message:new` — New message received
- `message:update` — Message edited/pinned
- `message:delete` — Message deleted
- `typing:start` — User started typing
- `typing:stop` — User stopped typing
- `user:status` — User status changed

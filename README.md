# Skribble Frontend (Sketch Clash)

React + TypeScript frontend for a real-time multiplayer drawing and guessing game (skribbl.io clone).

## Live Links

- Frontend Live URL: Add your deployed frontend URL here
- Backend Live URL: https://skribble-backend-8snk.onrender.com
- Backend Repo: https://github.com/Deepak-Varshney/skribble-backend

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS
- Socket.IO Client
- Fabric.js

## Core Features

- Create room with settings (max players, rounds, draw time, word choices, hints, private/public)
- Join room via room code and route link (`/room/:roomId`)
- Lobby with players + ready state + host controls
- Turn-based game rounds (one drawer, others guess)
- Real-time drawing sync
- Guessing + scoring + leaderboard + winner screen
- Drawing tools: brush, colors, size, undo, clear
- Hints over time and draw countdown
- Public room discovery and private room invite flow

## Local Setup

### 1. Install dependencies

```bash
cd frontend
npm install
```

### 2. Configure environment

Create `.env.local`:

```env
VITE_SERVER_URL=http://localhost:3001
```

For production, set it to your deployed backend URL (without trailing slash):

```env
VITE_SERVER_URL=https://skribble-backend-8snk.onrender.com
```

### 3. Run

```bash
npm run dev
```

Open: `http://localhost:5173`

### 4. Build

```bash
npm run build
```

## Frontend Architecture

- `src/GameContext.tsx`: global game state + all socket event handlers + actions
- `src/components/Landing.tsx`: create/join/public-room entry
- `src/components/Lobby.tsx`: room/lobby controls
- `src/components/GameScreen.tsx`: in-game layout
- `src/components/DrawingCanvas.tsx`: canvas tools + drawing sync
- `src/components/ChatPanel.tsx`: guesses/chat input and log

## Functional Checklist Mapping

### Must Have

- Create room with configurable settings: Yes
- Join room via link or code: Yes
- Lobby with player list + host start: Yes
- Turn-based rounds: Yes
- Real-time drawing sync: Yes
- Word selection (1-5 choices): Yes
- Guessing with points: Yes
- Scoring and leaderboard: Yes
- Game end with winner: Yes
- Basic drawing tools: Yes

### Should Have

- Hints: Yes
- Chat: Yes
- Countdown: Yes
- Private rooms via invite link: Yes

### Nice to Have

- Word categories: No
- Eraser: No
- Kick/Ban: No
- Votekick: No
- Multiple languages: No

## Submission Notes

- Keep frontend and backend deployed at the same time.
- If you update backend API routes, redeploy backend first, then frontend.

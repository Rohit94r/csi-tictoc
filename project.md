# Tick Tock - Multiplayer Tic Tac Toe Game

## Project Overview

**Tick Tock** is a real-time multiplayer Tic Tac Toe game where two friends can play together on separate devices by sharing a **Club Code**. The game features beautiful animations, win/loss celebrations, and a smooth real-time experience.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + Vite |
| **Backend** | Node.js + Express |
| **Real-time** | Socket.IO |
| **Styling** | CSS3 (Animations, Gradients, Glassmorphism) |
| **Port (Server)** | 3001 |
| **Port (Client)** | 5173 |

---

## Project Structure

```
tic-toc/
│
├── project.md                   # Project documentation
│
├── server/                      # Backend
│   ├── package.json
│   └── index.js                 # Express server + Socket.IO logic
│
└── client/                      # Frontend
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx             # React entry point
        ├── App.jsx              # Root component + routing
        ├── App.css              # Global styles
        └── components/
            ├── Home.jsx         # Home screen (Create/Join Club)
            ├── Home.css
            ├── Game.jsx         # Game screen (Board + Status)
            ├── Game.css
            ├── Board.jsx        # 3x3 Tic-Tac-Toe board
            ├── Board.css
            ├── WinLoss.jsx      # Win/Loss celebration overlay
            └── WinLoss.css
```

---

## Features

### Core Game
- **3x3 Tic Tac Toe** board
- **Real-time multiplayer** via Socket.IO
- **Club Code system** — create or join a game room
- **Turn-based play** with visual indicators
- **Win / Loss / Draw detection**
- **Play Again** functionality

### UI/UX
- **Glassmorphism design** with gradient backgrounds
- **Smooth CSS animations** (pulse, bounce, slide, confetti)
- **Responsive layout** — works on mobile and desktop
- **Animated X and O** marks
- **Turn indicator** with glow effect

### Win/Loss Celebrations
- **Winner** sees: Crown emoji, confetti blast, "You're the Champion!" message
- **Loser** sees: Sad cat PNG, "Better luck next time!" message
- **Draw** sees: Handshake emoji, "It's a Tie!" message
- **Animated overlay** with blur backdrop

---

## How to Play

1. **Player 1** opens the app → clicks **"Create Club"** → gets a 6-character Club Code
2. **Player 2** opens the app on their device → enters the Club Code → clicks **"Join Club"**
3. Both players connect to the same game room
4. **Player 1 (X)** goes first, then **Player 2 (O)**
5. Tap any empty cell to make your move
6. First to get 3 in a row wins!
7. Click **"Play Again"** to start a new round

---

## Socket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `createRoom` | Client → Server | Create a new game room, returns club code |
| `joinRoom` | Client → Server | Join existing room with club code |
| `roomCreated` | Server → Client | Room created, sends club code + player symbol |
| `roomJoined` | Server → Client | Successfully joined room, sends player symbol |
| `gameStart` | Server → Client | Both players connected, game begins |
| `makeMove` | Client → Server | Player makes a move (sends index 0-8) |
| `moveMade` | Server → Client | Move was valid, sends updated board state |
| `gameOver` | Server → Client | Game ended, sends result (win/loss/draw, winner) |
| `playAgain` | Client → Server | Player wants to play again |
| `playAgainReady` | Server → Client | Both players ready for new game |
| `playerDisconnected` | Server → Client | Opponent left the game |
| `error` | Server → Client | Error message (invalid room, room full, etc.) |

---

## Win Patterns

```
Rows:     [0,1,2] [3,4,5] [6,7,8]
Columns:  [0,3,6] [1,4,7] [2,5,8]
Diagonals:[0,4,8] [2,4,6]
```

---

## Setup & Running

### Install Dependencies
```bash
# Backend
cd server && npm install

# Frontend
cd client && npm install
```

### Start the App
```bash
# Terminal 1 — Start backend
cd server && node index.js

# Terminal 2 — Start frontend
cd client && npm run dev
```

### Access
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

---

## Future Enhancements

- Chat feature in game room
- Multiple game modes (4x4, 5x5 board)
- Leaderboard & player stats
- Custom player names & avatars
- Sound effects
- Mobile app (React Native)
- Room password protection
- Spectator mode

---

## Author

Built with ❤️ for friends to play together.

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST'],
  },
});

const WIN_PATTERNS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function generateClubCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function createEmptyBoard() {
  return Array(9).fill(null);
}

function checkWinner(board) {
  for (const pattern of WIN_PATTERNS) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], pattern };
    }
  }
  return null;
}

function isBoardFull(board) {
  return board.every((cell) => cell !== null);
}

const rooms = {};

io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`);

  socket.on('createRoom', () => {
    const code = generateClubCode();

    rooms[code] = {
      players: [{ id: socket.id, symbol: 'X', ready: false }],
      board: createEmptyBoard(),
      currentTurn: 'X',
      gameActive: false,
      playAgainVotes: new Set(),
    };

    socket.join(code);
    socket.roomCode = code;

    socket.emit('roomCreated', { code, symbol: 'X' });
    console.log(`Room created: ${code}`);
  });

  socket.on('joinRoom', (code) => {
    const room = rooms[code];

    if (!room) {
      socket.emit('error', { message: 'Club code not found!' });
      return;
    }

    if (room.players.length >= 2) {
      socket.emit('error', { message: 'Club is full! Max 2 players.' });
      return;
    }

    room.players.push({ id: socket.id, symbol: 'O', ready: false });
    socket.join(code);
    socket.roomCode = code;

    socket.emit('roomJoined', { code, symbol: 'O' });

    room.gameActive = true;
    room.board = createEmptyBoard();
    room.currentTurn = 'X';
    room.playAgainVotes.clear();

    io.to(code).emit('gameStart', {
      board: room.board,
      currentTurn: room.currentTurn,
      players: room.players.map((p) => ({ id: p.id, symbol: p.symbol })),
    });

    console.log(`Player joined room: ${code}`);
  });

  socket.on('makeMove', (index) => {
    const code = socket.roomCode;
    const room = rooms[code];

    if (!room || !room.gameActive) return;

    const player = room.players.find((p) => p.id === socket.id);
    if (!player) return;
    if (room.currentTurn !== player.symbol) {
      socket.emit('error', { message: "It's not your turn!" });
      return;
    }
    if (room.board[index] !== null) {
      socket.emit('error', { message: 'That cell is already taken!' });
      return;
    }

    room.board[index] = player.symbol;
    io.to(code).emit('moveMade', {
      board: room.board,
      index,
      symbol: player.symbol,
      currentTurn: player.symbol === 'X' ? 'O' : 'X',
    });

    room.currentTurn = player.symbol === 'X' ? 'O' : 'X';

    const result = checkWinner(room.board);
    if (result) {
      room.gameActive = false;
      const loser = room.players.find((p) => p.symbol !== result.winner);
      io.to(code).emit('gameOver', {
        winner: result.winner,
        winnerId: room.players.find((p) => p.symbol === result.winner).id,
        loserId: loser.id,
        pattern: result.pattern,
        board: room.board,
      });
    } else if (isBoardFull(room.board)) {
      room.gameActive = false;
      io.to(code).emit('gameOver', {
        winner: null,
        board: room.board,
      });
    }
  });

  socket.on('playAgain', () => {
    const code = socket.roomCode;
    const room = rooms[code];
    if (!room) return;

    room.playAgainVotes.add(socket.id);

    if (room.playAgainVotes.size >= 2) {
      room.board = createEmptyBoard();
      room.currentTurn = 'X';
      room.gameActive = true;
      room.playAgainVotes.clear();

      io.to(code).emit('playAgainReady', {
        board: room.board,
        currentTurn: room.currentTurn,
      });
    }
  });

  socket.on('disconnect', () => {
    const code = socket.roomCode;
    if (!code || !rooms[code]) return;

    socket.to(code).emit('playerDisconnected', {
      message: 'Opponent disconnected!',
    });

    delete rooms[code];
    console.log(`Room ${code} closed`);
  });
});

const PORT = 3001;
httpServer.listen(PORT, () => {
  console.log(`Tick Tock Server running on http://localhost:${PORT}`);
});

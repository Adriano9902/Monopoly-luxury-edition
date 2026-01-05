
import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import { GameManager } from './game/GameManager';
import { ClientAction } from './types';

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow all for dev
    methods: ["GET", "POST"]
  }
});

const gameManager = new GameManager();

io.on('connection', (socket: Socket) => {
  console.log('Client connected:', socket.id);

  socket.on('lobby:create', (payload: { playerName: string }) => {
    const gameId = gameManager.createGame();
    const game = gameManager.getGame(gameId);
    if (game) {
      const player = game.addPlayer(socket.id, payload.playerName);
      socket.join(gameId);
      socket.emit('lobby:joined', { gameId, playerId: player.id });
      io.to(gameId).emit('game:snapshot', game.state);
    }
  });

  socket.on('lobby:join', (payload: { gameId: string, playerName: string }) => {
    const game = gameManager.getGame(payload.gameId);
    if (game) {
      const player = game.addPlayer(socket.id, payload.playerName);
      socket.join(payload.gameId);
      socket.emit('lobby:joined', { gameId: payload.gameId, playerId: player.id });
      io.to(payload.gameId).emit('game:snapshot', game.state);
    } else {
      socket.emit('game:error', { message: 'Game not found' });
    }
  });

  socket.on('game:action', (payload: { gameId: string, action: ClientAction }) => {
    const game = gameManager.getGame(payload.gameId);
    if (game) {
      game.handleAction(socket.id, payload.action);
      io.to(payload.gameId).emit('game:snapshot', game.state);
    }
  });

  socket.on('disconnect', () => {
    // Handle disconnect
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

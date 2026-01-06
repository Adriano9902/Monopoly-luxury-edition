
import express from 'express';
import 'dotenv/config';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import OpenAI from 'openai';
import path from 'path';
import { GameManager } from './game/GameManager';
import { GameState, Player, PlayerToken, TileType, DiceType, LogEntry, ClientAction, ClientActionType, Card, Tile, PlayerConfig } from './types';

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the React frontend app
const clientDistPath = path.join(__dirname, '../../dist');
app.use(express.static(clientDistPath));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow all for dev
    methods: ["GET", "POST"]
  }
});

const openaiKey = process.env.OPENAI_API_KEY;
const openai = openaiKey ? new OpenAI({ apiKey: openaiKey }) : null;

const gameManager = new GameManager();

app.post('/ai/commentary', async (req, res) => {
  try {
    if (!openai) return res.status(503).json({ text: "Analisi di mercato non disponibile: API Key assente." });
    const { player, action, tile, gameState } = req.body;
    const system = `Sei "The Oracle", IA di trading cinica e stratega suprema. Rispondi SEMPRE in italiano, 2-3 frasi, senza markdown. Focus su liquidità e monopoli.`;
    const context = `DATI: player=${player?.name} cash=${player?.money} monopoli=${(gameState?.tiles || []).length} tile=${tile?.name} action=${action}`;
    const prompt = `Analizza la mossa e fornisci un consiglio tattico finanziario.`;
    const resp = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: context + '\n' + prompt }
      ],
      temperature: 0.8,
      max_tokens: 200
    });
    const text = resp.choices?.[0]?.message?.content || "Analisi di mercato in corso...";
    res.json({ text });
  } catch (err) {
    console.error('AI Commentary Error:', err);
    res.status(500).json({ text: "Analisi di mercato momentaneamente non disponibile." });
  }
});

app.post('/ai/global-event', async (_req, res) => {
  try {
    if (!openai) return res.status(503).json({
      title: "Mercato Stabile",
      description: "Nessun evento globale per assenza API.",
      effectLabel: "Nessun impatto",
      actionType: 'GIVE_MONEY_ALL'
    });
    const prompt = `Genera un evento globale di mercato per Monopoly Extreme Edition che causi un impatto immediato. Rispondi in JSON con {title, description, effectLabel, actionType in ["TAX_ALL","GIVE_MONEY_ALL","CHAOS_MOVE"]}.`;
    const resp = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Sei un analista di borsa cinico.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 200
    });
    const text = resp.choices?.[0]?.message?.content;
    let json;
    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      json = null;
    }
    if (!json) {
      json = {
        title: "Flash Crash",
        description: "Un glitch negli algoritmi di trading causa il panico.",
        effectLabel: "Tutti i giocatori perdono $80M",
        actionType: 'TAX_ALL'
      };
    }
    res.json(json);
  } catch (err) {
    console.error('Global Event Error:', err);
    res.status(500).json({
      title: "Flash Crash",
      description: "Errore generazione evento.",
      effectLabel: "Tutti i giocatori perdono $80M",
      actionType: 'TAX_ALL'
    });
  }
});

app.post('/ai/tts', async (req, res) => {
  try {
    if (!openai) return res.status(503).json({ audioBase64: null, mime: 'audio/mpeg' });
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Missing text' });
    const speech = await (openai as any).audio.speech.create({
      model: 'gpt-4o-mini-tts',
      voice: 'alloy',
      input: text
    });
    const buffer = Buffer.from(await speech.arrayBuffer());
    const audioBase64 = buffer.toString('base64');
    res.json({ audioBase64, mime: 'audio/mpeg' });
  } catch (err) {
    console.warn('TTS Error:', err);
    res.status(500).json({ audioBase64: null, mime: 'audio/mpeg' });
  }
});
io.on('connection', (socket: Socket) => {
  console.log('Client connected:', socket.id);

  socket.on('lobby:create', (payload: { players: PlayerConfig[] }) => {
    try {
      console.log('Received lobby:create request', JSON.stringify(payload));
      if (!payload || !payload.players || !Array.isArray(payload.players)) {
        throw new Error('Invalid payload: players array missing');
      }

      const gameId = gameManager.createGame();
      const game = gameManager.getGame(gameId);
      if (game) {
        const hostPlayer = game.initializeWithConfig(payload.players, socket.id);
        socket.join(gameId);
        socket.emit('lobby:joined', { gameId, playerId: hostPlayer.id });
        io.to(gameId).emit('game:snapshot', game.state);
        console.log(`Game ${gameId} created by ${hostPlayer.name}`);
      } else {
        throw new Error('Failed to create game instance');
      }
    } catch (err: any) {
      console.error('Error in lobby:create:', err);
      socket.emit('game:error', { message: 'Failed to create lobby: ' + err.message });
    }
  });

  socket.on('lobby:join', (payload: { gameId: string, playerName: string }) => {
    try {
      console.log('Received lobby:join request', JSON.stringify(payload));
      if (!payload || !payload.gameId || !payload.playerName) {
        throw new Error('Invalid payload: gameId or playerName missing');
      }

      const game = gameManager.getGame(payload.gameId);
      if (game) {
        const player = game.addPlayer(socket.id, payload.playerName);
        socket.join(payload.gameId);
        socket.emit('lobby:joined', { gameId: payload.gameId, playerId: player.id });
        io.to(payload.gameId).emit('game:snapshot', game.state);
        console.log(`Player ${payload.playerName} joined game ${payload.gameId}`);
      } else {
        socket.emit('game:error', { message: 'Game not found' });
      }
    } catch (err: any) {
      console.error('Error in lobby:join:', err);
      socket.emit('game:error', { message: 'Failed to join lobby: ' + err.message });
    }
  });

  socket.on('game:action', (payload: { gameId: string, action: ClientAction }) => {
    try {
      if (!payload || !payload.gameId || !payload.action) {
        return; // Silent fail for actions to avoid spam
      }
      const game = gameManager.getGame(payload.gameId);
      if (game) {
        game.handleAction(socket.id, payload.action);
        io.to(payload.gameId).emit('game:snapshot', game.state);
      }
    } catch (err) {
      console.error('Error in game:action:', err);
    }
  });

  socket.on('disconnect', () => {
    // Handle disconnect
    console.log('Client disconnected:', socket.id);
  });
});

// All other GET requests not handled before will return the React app
app.get('*', (_req, res) => {
  const clientDistPath = path.join(__dirname, '../../dist');
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

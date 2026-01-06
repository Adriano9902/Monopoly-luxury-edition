
import { io, Socket } from 'socket.io-client';
import { ServerToClientEvents, ClientToServerEvents } from './multiplayerTypes';
import { ClientAction, GameState } from '../types';

// Server URL logic:
// In production (Railway), use the same origin (relative path) because we expect the server to serve the frontend or be proxied correctly.
// In development, use localhost:3001 (or whatever port the server runs on).
const SERVER_URL = import.meta.env.PROD 
  ? window.location.origin // Use current origin in production
  : 'http://localhost:3001'; 

class MultiplayerService {
  private socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;
  private gameId: string | null = null;
  private playerId: number | null = null;

  public connect() {
    if (this.socket) return;
    
    this.socket = io(SERVER_URL, {
      transports: ['websocket'],
      autoConnect: true
    });

    this.socket.on('connect', () => {
      console.log('Connected to multiplayer server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });
  }

  public createLobby(players: any[]): Promise<{ gameId: string, playerId: number }> {
    return new Promise((resolve) => {
      if (!this.socket) this.connect();
      
      this.socket?.emit('lobby:create', { players });
      
      this.socket?.once('lobby:joined', (data) => {
        this.gameId = data.gameId;
        this.playerId = data.playerId;
        resolve(data);
      });
    });
  }

  public joinLobby(gameId: string, playerName: string): Promise<{ gameId: string, playerId: number }> {
    return new Promise((resolve, reject) => {
      if (!this.socket) this.connect();

      this.socket?.emit('lobby:join', { gameId, playerName });

      this.socket?.once('lobby:joined', (data) => {
        this.gameId = data.gameId;
        this.playerId = data.playerId;
        resolve(data);
      });

      this.socket?.once('game:error', (err) => {
        reject(err.message);
      });
    });
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  public sendAction(gameId: string, action: ClientAction) {
    if (!this.socket) return;
    this.socket.emit('game:action', { gameId, action });
  }

  public onGameStateUpdate(callback: (state: GameState) => void) {
    this.socket?.on('game:snapshot', callback);
    this.socket?.on('game:delta', (delta: any) => {
        // TODO: Implement delta merging logic if needed
        // For now, server sends full snapshot so this might not be triggered yet
    });
  }

  public onLobbyJoined(callback: (data: { gameId: string, playerId: number }) => void) {
    this.socket?.on('lobby:joined', callback);
  }

  public onGameError(callback: (error: { message: string }) => void) {
    this.socket?.on('game:error', callback);
  }

  public getGameId() {
    return this.gameId;
  }
  
  public getPlayerId() {
    return this.playerId;
  }
}

export const multiplayerService = new MultiplayerService();

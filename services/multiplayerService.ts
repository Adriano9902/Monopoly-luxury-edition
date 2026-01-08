
import { io, Socket } from 'socket.io-client';
import { ServerToClientEvents, ClientToServerEvents } from './multiplayerTypes';
import { ClientAction, GameState } from '../types';

// Server URL logic:
// In production (Railway), use the same origin (relative path) but ensure correct protocol.
// Socket.io client handles relative paths automatically if no URL is passed, but passing window.location.origin is safer.
const SERVER_URL = import.meta.env.PROD 
  ? window.location.origin 
  : 'http://localhost:3000'; 

class MultiplayerService {
  private socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;
  private gameId: string | null = null;
  private playerId: number | null = null;

  public connect() {
    if (this.socket) return;
    
    this.socket = io(SERVER_URL, {
      transports: ['polling', 'websocket'], // Allow polling first for better compatibility
      autoConnect: true,
      path: '/socket.io/', // Explicit default path
      reconnection: true,
      reconnectionAttempts: 5
    });

    this.socket.on('connect', () => {
      console.log('Connected to multiplayer server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });
  }

  public createLobby(players: any[]): Promise<{ gameId: string, playerId: number }> {
    return new Promise((resolve, reject) => {
      if (!this.socket) this.connect();
      
      // Timeout to prevent infinite loading
      const timeout = setTimeout(() => {
        console.error("Lobby creation timed out after 10s");
        reject(new Error("Connection timed out. Server not responding."));
      }, 10000);

      this.socket?.emit('lobby:create', { players });
      
      this.socket?.once('lobby:joined', (data) => {
        clearTimeout(timeout);
        this.gameId = data.gameId;
        this.playerId = data.playerId;
        resolve(data);
      });

      this.socket?.once('game:error', (err) => {
        clearTimeout(timeout);
        console.error("Game error during lobby creation:", err);
        reject(new Error(err.message));
      });

      this.socket?.once('connect_error', (err) => {
        clearTimeout(timeout);
        console.error("Socket connection error:", err);
        reject(new Error("Socket connection failed: " + err.message));
      });
    });
  }

  public joinLobby(gameId: string, playerName: string): Promise<{ gameId: string, playerId: number }> {
    return new Promise((resolve, reject) => {
      if (!this.socket) this.connect();

      const timeout = setTimeout(() => {
        reject(new Error("Connection timed out. Server not responding."));
      }, 10000);

      this.socket?.emit('lobby:join', { gameId, playerName });

      this.socket?.once('lobby:joined', (data) => {
        clearTimeout(timeout);
        this.gameId = data.gameId;
        this.playerId = data.playerId;
        resolve(data);
      });

      this.socket?.once('game:error', (err) => {
        clearTimeout(timeout);
        reject(err.message);
      });
      
      this.socket?.once('connect_error', (err) => {
        clearTimeout(timeout);
        reject(new Error("Socket connection failed: " + err.message));
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

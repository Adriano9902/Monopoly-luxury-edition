
import { GameState, ClientAction, PlayerConfig } from '../types';

export interface ServerToClientEvents {
  'lobby:state': (state: any) => void;
  'game:snapshot': (state: GameState) => void;
  'game:delta': (delta: any) => void;
  'game:turn': (playerId: number) => void;
  'game:error': (error: { message: string }) => void;
  'lobby:joined': (data: { gameId: string, playerId: number }) => void;
}

export interface ClientToServerEvents {
  'auth:hello': () => void;
  'lobby:create': (payload: { playerName: string }) => void;
  'lobby:join': (payload: { gameId: string, playerName: string }) => void;
  'lobby:ready': () => void;
  'game:start': () => void;
  'game:action': (payload: { gameId: string, action: ClientAction }) => void;
  'game:reconnect': (payload: { gameId: string, playerId: number }) => void;
  'game:requestSnapshot': (payload: { gameId: string }) => void;
}

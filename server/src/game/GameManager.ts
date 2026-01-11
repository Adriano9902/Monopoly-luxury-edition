
import { MonopolyGame } from './MonopolyGame';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../services/supabase';

export class GameManager {
  private games: Map<string, MonopolyGame> = new Map();

  createGame(): string {
    const gameId = uuidv4().substring(0, 6).toUpperCase(); // Short ID for easy sharing
    const game = new MonopolyGame(gameId);
    this.games.set(gameId, game);
    
    // Async persist creation
    this.persistLobby(gameId, 'LOBBY');
    
    return gameId;
  }

  getGame(gameId: string): MonopolyGame | undefined {
    return this.games.get(gameId);
  }

  removeGame(gameId: string) {
    this.games.delete(gameId);
    // Async update status
    this.persistLobby(gameId, 'FINISHED');
  }

  // --- Persistence Methods ---

  private async persistLobby(lobbyId: string, status: 'LOBBY' | 'PLAYING' | 'FINISHED') {
    try {
        if (status === 'LOBBY') {
            await supabase.from('lobbies').insert({
                id: lobbyId,
                status: status
            });
        } else {
            await supabase.from('lobbies').update({ status }).eq('id', lobbyId);
        }
    } catch (err) {
        console.error(`Failed to persist lobby ${lobbyId}:`, err);
    }
  }

  public async saveGameState(gameId: string, state: any) {
    // Call this periodically or on critical events (e.g. End Turn)
    try {
        // Upsert game state
        await supabase.from('games').upsert({
            lobby_id: gameId,
            game_state: state,
            updated_at: new Date().toISOString()
        }, { onConflict: 'lobby_id' });
    } catch (err) {
        console.error(`Failed to save game state for ${gameId}:`, err);
    }
  }

  public async loadGameState(gameId: string): Promise<any | null> {
      try {
          const { data, error } = await supabase
            .from('games')
            .select('game_state')
            .eq('lobby_id', gameId)
            .single();
          
          if (error || !data) return null;
          return data.game_state;
      } catch (err) {
          console.error(`Failed to load game state for ${gameId}:`, err);
          return null;
      }
  }
}

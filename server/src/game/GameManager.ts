
import { MonopolyGame } from './MonopolyGame';
import { v4 as uuidv4 } from 'uuid';

export class GameManager {
  private games: Map<string, MonopolyGame> = new Map();

  createGame(): string {
    const gameId = uuidv4().substring(0, 6).toUpperCase(); // Short ID for easy sharing
    const game = new MonopolyGame(gameId);
    this.games.set(gameId, game);
    return gameId;
  }

  getGame(gameId: string): MonopolyGame | undefined {
    return this.games.get(gameId);
  }

  removeGame(gameId: string) {
    this.games.delete(gameId);
  }
}

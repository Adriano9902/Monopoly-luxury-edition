
import { v4 as uuidv4 } from 'uuid';
import { GameState, Player, PlayerToken, TileType, DiceType, LogEntry, ClientAction, ClientActionType, Card, Tile } from '../types';
import { GAME_TILES, CHANCE_CARDS_GENERIC, COMMUNITY_CARDS, TRUFFA_CARDS, MEGA_RICCHEZZE_CARDS, BOARD_SIZE } from '../constants';

export class MonopolyGame {
  public state: GameState;

  constructor(lobbyId: string) {
    this.state = {
      id: lobbyId,
      players: [],
      currentPlayerIndex: 0,
      tiles: JSON.parse(JSON.stringify(GAME_TILES)), // Deep copy
      dice: [1, 1],
      activeDiceType: 'STANDARD',
      isRolling: false,
      remainingSteps: 0,
      consecutiveDoubles: 0,
      turnPhase: 'ROLL',
      gameLog: [],
      globalEventActive: null,
      currentCard: null,
      auctionState: {
        isActive: false,
        propertyId: null,
        currentBid: 0,
        highestBidderId: null,
        activeBidders: []
      }
    };
  }

  public addPlayer(socketId: string, name: string): Player {
    const existingTokens = this.state.players.map(p => p.token);
    const availableTokens = Object.values(PlayerToken).filter(t => !existingTokens.includes(t));
    const token = availableTokens[0] || PlayerToken.JET;

    const newPlayer: Player = {
      id: this.state.players.length + 1,
      socketId,
      name,
      token,
      money: 1500, // Starting money standard
      position: 0,
      isJailed: false,
      jailTurns: 0,
      properties: [],
      cards: [],
      nextDiceType: 'STANDARD'
    };

    this.state.players.push(newPlayer);
    this.addLog(`${name} joined the game.`, 'INFO');
    return newPlayer;
  }

  public removePlayer(socketId: string) {
    const index = this.state.players.findIndex(p => p.socketId === socketId);
    if (index !== -1) {
      const player = this.state.players[index];
      this.addLog(`${player.name} left the game.`, 'DANGER');
      this.state.players.splice(index, 1);
      // Logic to handle player leaving (bankrupt or just gone)
    }
  }

  public handleAction(socketId: string, action: ClientAction): GameState {
    const player = this.state.players.find(p => p.socketId === socketId);
    if (!player) return this.state;
    
    // Check if it's player's turn (unless it's an auction bid which can be anyone)
    if (action.type !== 'BID_AUCTION' && this.state.players[this.state.currentPlayerIndex]?.id !== player.id) {
       // Allow some out-of-turn actions? For now, strict turn based.
       return this.state;
    }

    switch (action.type) {
      case 'ROLL_DICE':
        this.rollDice(player);
        break;
      case 'END_TURN':
        this.endTurn(player);
        break;
      case 'BUY_PROPERTY':
        this.buyProperty(player);
        break;
      case 'DECLINE_PROPERTY':
        // Start auction if declined?
        this.startAuction(this.state.tiles[player.position]);
        break;
      case 'BID_AUCTION':
        this.bidAuction(player, action.payload);
        break;
        // ... Implement other actions
    }

    return this.state;
  }

  private rollDice(player: Player) {
    if (this.state.turnPhase !== 'ROLL') return;

    this.state.isRolling = true;
    
    // Simulate roll delay or just resolve
    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    this.state.dice = [d1, d2];
    
    const isDouble = d1 === d2;
    if (isDouble) {
      this.state.consecutiveDoubles++;
    } else {
      this.state.consecutiveDoubles = 0;
    }

    if (this.state.consecutiveDoubles >= 3) {
      this.goToJail(player);
      this.state.isRolling = false;
      return;
    }

    const total = d1 + d2;
    this.state.turnPhase = 'MOVING';
    this.movePlayer(player, total);
    this.state.isRolling = false;
  }

  private movePlayer(player: Player, steps: number) {
    const oldPos = player.position;
    let newPos = (oldPos + steps) % BOARD_SIZE;
    
    // Passing Go
    if (newPos < oldPos) {
      player.money += 200;
      this.addLog(`${player.name} passed GO and collected $200.`, 'SUCCESS');
    }

    player.position = newPos;
    this.processLandedTile(player, newPos);
  }

  private processLandedTile(player: Player, position: number) {
    const tile = this.state.tiles[position];

    // Simple logic for now, expanding based on tile type
    if (tile.type === TileType.GO_TO_JAIL) {
      this.goToJail(player);
    } else if (tile.type === TileType.PROPERTY || tile.type === TileType.RAILROAD || tile.type === TileType.UTILITY) {
       if (tile.ownerId === undefined || tile.ownerId === null) {
          this.state.turnPhase = 'ACTION'; // Can buy
       } else if (tile.ownerId !== player.id) {
          // Pay rent
          this.payRent(player, tile);
          this.state.turnPhase = 'END';
       } else {
          this.state.turnPhase = 'END';
       }
    } else if ([TileType.CHANCE, TileType.COMMUNITY_CHEST, TileType.TRUFFA, TileType.MEGA_RICCHEZZE].includes(tile.type)) {
       this.drawCard(player, tile.type);
    } else {
      this.state.turnPhase = 'END';
    }
  }

  private payRent(player: Player, tile: Tile) {
     const owner = this.state.players.find(p => p.id === tile.ownerId);
     if (!owner || owner.isJailed) return;
     
     const rent = tile.price ? Math.floor(tile.price * 0.1) : 50; // Simplified rent logic
     player.money -= rent;
     owner.money += rent;
     this.addLog(`${player.name} paid $${rent} rent to ${owner.name}.`, 'DANGER');
  }

  private buyProperty(player: Player) {
    const tile = this.state.tiles[player.position];
    if (tile.ownerId || player.money < (tile.price || 0)) return;

    player.money -= (tile.price || 0);
    tile.ownerId = player.id;
    player.properties.push(tile.id);
    this.addLog(`${player.name} bought ${tile.name}.`, 'SUCCESS');
    this.state.turnPhase = 'END';
  }

  private startAuction(tile: Tile) {
    this.state.auctionState = {
      isActive: true,
      propertyId: tile.id,
      currentBid: tile.price ? Math.floor(tile.price * 0.5) : 10, // Start at 50%
      highestBidderId: null,
      activeBidders: this.state.players.map(p => p.id) // All players start as bidders
    };
    this.addLog(`Auction started for ${tile.name}!`, 'INFO');
  }

  private bidAuction(player: Player, payload: any) {
    if (!this.state.auctionState || !this.state.auctionState.isActive) return;

    if (payload?.fold) {
       this.state.auctionState.activeBidders = this.state.auctionState.activeBidders.filter((id: number) => id !== player.id);
       this.addLog(`${player.name} withdrew from the auction.`, 'INFO');
       
       // Check if only one bidder remains
       if (this.state.auctionState.activeBidders.length === 1) {
           const winnerId = this.state.auctionState.activeBidders[0];
           const winner = this.state.players.find(p => p.id === winnerId);
           if (winner) {
               this.finalizeAuction(winner, this.state.auctionState.currentBid);
           }
       } else if (this.state.auctionState.activeBidders.length === 0) {
           // No one wants it
           this.state.auctionState.isActive = false;
           this.state.turnPhase = 'END';
           this.addLog(`Auction for property ended with no bids.`, 'INFO');
       }
       return;
    }

    const amount = payload?.amount;
    if (amount && amount > this.state.auctionState.currentBid && player.money >= amount) {
        this.state.auctionState.currentBid = amount;
        this.state.auctionState.highestBidderId = player.id;
        this.addLog(`${player.name} bid $${amount}M`, 'INFO');
        // Reset timer logic if we had one on server, for now reliant on client interaction flow
    }
  }

  private finalizeAuction(winner: Player, amount: number) {
      const propertyId = this.state.auctionState!.propertyId!;
      const tile = this.state.tiles.find(t => t.id === propertyId)!;
      
      if (winner.money >= amount) {
          winner.money -= amount;
          winner.properties.push(tile.id);
          tile.ownerId = winner.id;
          this.addLog(`${winner.name} won the auction for ${tile.name} at $${amount}M!`, 'SUCCESS');
      }
      
      this.state.auctionState!.isActive = false;
      this.state.turnPhase = 'END';
  }

  private goToJail(player: Player) {
    player.position = 15; // Jail pos
    player.isJailed = true;
    player.jailTurns = 0;
    this.state.turnPhase = 'END';
    this.addLog(`${player.name} went to jail.`, 'DANGER');
  }

  private drawCard(player: Player, type: TileType) {
    // Logic to draw card similar to client
    let deck = CHANCE_CARDS_GENERIC;
    if (type === TileType.TRUFFA) deck = TRUFFA_CARDS;
    else if (type === TileType.MEGA_RICCHEZZE) deck = MEGA_RICCHEZZE_CARDS;
    else if (type === TileType.COMMUNITY_CHEST) deck = COMMUNITY_CARDS;

    const cardTemplate = deck[Math.floor(Math.random() * deck.length)];
    const card: Card = { ...cardTemplate, id: uuidv4(), type: type as any };
    
    this.state.currentCard = card;
    this.applyCardEffect(player, card);
    this.state.turnPhase = 'END'; // Simplify for now, usually requires confirmation
  }

  private applyCardEffect(player: Player, card: Card) {
     this.addLog(`${player.name} drew ${card.title}: ${card.description}`, 'INFO');
     if (card.actionType === 'MONEY' && card.value) {
        player.money += card.value;
     } else if (card.actionType === 'MOVE' && card.value !== undefined) {
        player.position = card.value;
        // Should re-process tile, but avoid recursion loop for now
     } else if (card.actionType === 'JAIL') {
        this.goToJail(player);
     }
  }

  private endTurn(player: Player) {
    if (this.state.turnPhase !== 'END') return;
    
    // Next player
    this.state.currentPlayerIndex = (this.state.currentPlayerIndex + 1) % this.state.players.length;
    this.state.turnPhase = 'ROLL';
    this.state.dice = [1, 1]; // Reset dice visual
    this.state.currentCard = null;
  }

  private addLog(text: string, type: 'INFO' | 'DANGER' | 'SUCCESS' | 'AI') {
    this.state.gameLog.unshift({
      id: uuidv4(),
      text,
      type,
      timestamp: Date.now()
    });
    if (this.state.gameLog.length > 50) this.state.gameLog.pop();
  }
}

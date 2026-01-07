
import { v4 as uuidv4 } from 'uuid';
import { GameState, Player, PlayerToken, TileType, DiceType, LogEntry, ClientAction, ClientActionType, Card, Tile, PlayerConfig } from '../../types';
import { GAME_TILES, CHANCE_CARDS_GENERIC, COMMUNITY_CARDS, TRUFFA_CARDS, MEGA_RICCHEZZE_CARDS, BOARD_SIZE } from '../../constants';

export class LocalGameManager {
  public state: GameState;
  private subscribers: ((state: GameState) => void)[] = [];

  constructor() {
    this.state = {
      id: 'LOCAL_SESSION',
      players: [],
      currentPlayerIndex: 0,
      tiles: JSON.parse(JSON.stringify(GAME_TILES)),
      dice: [1, 1],
      activeDiceType: 'STANDARD',
      isRolling: false,
      remainingSteps: 0,
      consecutiveDoubles: 0,
      turnPhase: 'ROLL',
      gameStatus: 'LOBBY',
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

  public subscribe(callback: (state: GameState) => void) {
    this.subscribers.push(callback);
    callback(this.state);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  private notify() {
    this.subscribers.forEach(cb => cb({ ...this.state }));
  }

  public initializeGame(configs: PlayerConfig[]) {
    this.state.players = configs.map((cfg, index) => ({
      id: index + 1,
      name: cfg.name,
      token: cfg.token,
      type: cfg.type,
      isAi: cfg.type === 'AI',
      money: 1500,
      position: 0,
      isJailed: false,
      jailTurns: 0,
      properties: [],
      cards: [],
      nextDiceType: 'STANDARD',
      socketId: `local-p${index+1}`
    }));
    
    this.state.gameStatus = 'PLAYING'; // Local game starts immediately or after setup
    this.addLog(`Game Started with ${configs.length} players.`, 'INFO');
    this.notify();
  }

  public handleAction(action: ClientAction) {
    if (this.state.gameStatus === 'FINISHED') return;

    // Identify current player for turn-based actions
    const currentPlayer = this.state.players[this.state.currentPlayerIndex];
    
    // In local mode, we assume the action comes from the current player 
    // (or the UI prevents wrong actions)
    
    switch (action.type) {
      case 'START_GAME':
        this.state.gameStatus = 'PLAYING';
        this.addLog("Game Started!", 'SUCCESS');
        break;
      case 'ROLL_DICE':
        this.rollDice(currentPlayer);
        break;
      case 'END_TURN':
        this.endTurn(currentPlayer);
        break;
      case 'BUY_PROPERTY':
        this.buyProperty(currentPlayer);
        break;
      case 'DECLINE_PROPERTY':
        this.startAuction(this.state.tiles[currentPlayer.position]);
        break;
      case 'BID_AUCTION':
        // For local auction, we need to know WHO is bidding. 
        // In a real local implementation, the UI would pass the bidder ID or we handle it sequentially.
        // For now, let's assume the payload contains the bidderId or we infer it.
        // Wait, payload usually just has amount. 
        // In local mode, Auction Modal needs to allow selecting who bids? 
        // Or we just implement a simple auction where turn order matters?
        // Let's assume the action payload *might* have an injected playerId if we modify Controls, 
        // but typically Controls only sends type/payload. 
        // FIX: We need to know who is bidding.
        // I will assume payload might have `bidderId` for local logic if needed, 
        // but for now let's skip complex auction logic or just default to current player? 
        // No, auction is simultaneous. 
        // Let's rely on the fact that in LOCAL mode, the UI shows the auction modal for *everyone*?
        // Actually, the simplest way for Local Auction is to have buttons for each player?
        // Or just let the `currentPlayer` bid? No.
        // Let's defer complex auction.
        this.bidAuction(action.payload);
        break;
       // ... other cases
    }

    this.notify();
  }

  private rollDice(player: Player) {
    if (this.state.turnPhase !== 'ROLL') return;
    this.state.isRolling = true;
    this.notify();

    setTimeout(() => {
        const d1 = Math.floor(Math.random() * 6) + 1;
        const d2 = Math.floor(Math.random() * 6) + 1;
        this.state.dice = [d1, d2];
        
        const isDouble = d1 === d2;
        if (isDouble) this.state.consecutiveDoubles++;
        else this.state.consecutiveDoubles = 0;

        if (this.state.consecutiveDoubles >= 3) {
            this.goToJail(player);
        } else {
            this.state.turnPhase = 'MOVING';
            this.movePlayer(player, d1 + d2);
        }
        this.state.isRolling = false;
        this.notify();
    }, 1000); // Fake delay
  }

  private movePlayer(player: Player, steps: number) {
    const oldPos = player.position;
    const newPos = (oldPos + steps) % BOARD_SIZE;
    
    if (newPos < oldPos) {
        player.money += 200;
        this.addLog(`${player.name} passed GO and collected $200.`, 'SUCCESS');
    }

    player.position = newPos;
    this.processLandedTile(player, newPos);
  }

  private processLandedTile(player: Player, position: number) {
    const tile = this.state.tiles[position];

    if (tile.type === TileType.GO_TO_JAIL) {
      this.goToJail(player);
    } else if ([TileType.PROPERTY, TileType.RAILROAD, TileType.UTILITY, TileType.TECH_HUB, TileType.OIL_COMPANY].includes(tile.type)) {
       if (tile.ownerId === undefined || tile.ownerId === null) {
          this.state.turnPhase = 'ACTION';
       } else if (tile.ownerId !== player.id) {
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
     
     const rent = tile.price ? Math.floor(tile.price * 0.1) : 50; 
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
      currentBid: tile.price ? Math.floor(tile.price * 0.5) : 10,
      highestBidderId: null,
      activeBidders: this.state.players.map(p => p.id)
    };
    this.addLog(`Auction started for ${tile.name}!`, 'INFO');
  }

  private bidAuction(payload: any) {
    // In local mode, we need to hack the bidder identification
    // Assume payload.bidderId exists OR default to currentPlayer if not provided (which is wrong for auction)
    // We will update App.tsx to pass bidderId in local mode actions
    const player = this.state.players.find(p => p.id === payload.bidderId);
    if (!player) return;

    if (payload.fold) {
       this.state.auctionState.activeBidders = this.state.auctionState.activeBidders.filter(id => id !== player.id);
       this.addLog(`${player.name} withdrew.`, 'INFO');
       
       if (this.state.auctionState.activeBidders.length === 1) {
           const winnerId = this.state.auctionState.activeBidders[0];
           const winner = this.state.players.find(p => p.id === winnerId);
           if (winner) this.finalizeAuction(winner, this.state.auctionState.currentBid);
       } else if (this.state.auctionState.activeBidders.length === 0) {
           this.state.auctionState.isActive = false;
           this.state.turnPhase = 'END';
       }
       return;
    }

    const amount = payload.amount;
    if (amount > this.state.auctionState.currentBid && player.money >= amount) {
        this.state.auctionState.currentBid = amount;
        this.state.auctionState.highestBidderId = player.id;
        this.addLog(`${player.name} bid $${amount}M`, 'INFO');
    }
  }

  private finalizeAuction(winner: Player, amount: number) {
      const propertyId = this.state.auctionState!.propertyId!;
      const tile = this.state.tiles.find(t => t.id === propertyId)!;
      
      if (winner.money >= amount) {
          winner.money -= amount;
          winner.properties.push(tile.id);
          tile.ownerId = winner.id;
          this.addLog(`${winner.name} won ${tile.name}!`, 'SUCCESS');
      }
      
      this.state.auctionState!.isActive = false;
      this.state.turnPhase = 'END';
  }

  private goToJail(player: Player) {
    player.position = 15;
    player.isJailed = true;
    player.jailTurns = 0;
    this.state.turnPhase = 'END';
    this.addLog(`${player.name} went to jail.`, 'DANGER');
  }

  private drawCard(player: Player, type: TileType) {
    let deck = CHANCE_CARDS_GENERIC;
    if (type === TileType.TRUFFA) deck = TRUFFA_CARDS;
    else if (type === TileType.MEGA_RICCHEZZE) deck = MEGA_RICCHEZZE_CARDS;
    else if (type === TileType.COMMUNITY_CHEST) deck = COMMUNITY_CARDS;

    const cardTemplate = deck[Math.floor(Math.random() * deck.length)];
    const card: Card = { ...cardTemplate, id: uuidv4(), type: type as any };
    
    this.state.currentCard = card;
    this.applyCardEffect(player, card);
    this.state.turnPhase = 'END';
  }

  private applyCardEffect(player: Player, card: Card) {
     this.addLog(`${player.name} drew ${card.title}`, 'INFO');
     if (card.actionType === 'MONEY' && card.value) {
        player.money += card.value;
     } else if (card.actionType === 'MOVE' && card.value !== undefined) {
        player.position = card.value;
     } else if (card.actionType === 'JAIL') {
        this.goToJail(player);
     }
  }

  private endTurn(player: Player) {
    if (this.state.turnPhase !== 'END') return;
    
    this.state.currentPlayerIndex = (this.state.currentPlayerIndex + 1) % this.state.players.length;
    this.state.turnPhase = 'ROLL';
    this.state.dice = [1, 1];
    this.state.currentCard = null;
    this.addLog(`Turn of ${this.state.players[this.state.currentPlayerIndex].name}`, 'INFO');
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

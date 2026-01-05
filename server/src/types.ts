
export enum TileType {
  START = 'START',
  PROPERTY = 'PROPERTY',
  RAILROAD = 'RAILROAD',
  UTILITY = 'UTILITY',
  CHANCE = 'CHANCE',
  COMMUNITY_CHEST = 'COMMUNITY_CHEST',
  TAX = 'TAX',
  JAIL = 'JAIL',
  GO_TO_JAIL = 'GO_TO_JAIL',
  FREE_PARKING = 'FREE_PARKING',
  BLACK_MARKET = 'BLACK_MARKET',
  OIL_COMPANY = 'OIL_COMPANY',
  TECH_HUB = 'TECH_HUB',
  SCAM_ACADEMY = 'SCAM_ACADEMY',
  CRYPTO_EXCHANGE = 'CRYPTO_EXCHANGE',
  DISASTER = 'DISASTER',
  TRUFFA = 'TRUFFA',
  MEGA_RICCHEZZE = 'MEGA_RICCHEZZE'
}

export enum PlayerToken {
  JET = 'JET',
  YACHT = 'YACHT',
  OIL = 'OIL',
  CRYPTO = 'CRYPTO',
  SCAM = 'SCAM',
  TRAIN = 'TRAIN',
  BOLT = 'BOLT',
  CHIP = 'CHIP',
  DIAMOND = 'DIAMOND',
  WATCH = 'WATCH'
}

export type DiceType = 'STANDARD' | 'TRUFFA' | 'BUSINESS' | 'CHAOS';

export interface Card {
  id: string;
  type: 'CHANCE' | 'COMMUNITY' | 'TRUFFA' | 'MEGA_RICCHEZZE';
  title: string;
  description: string;
  actionType: 'MONEY' | 'MOVE' | 'JAIL' | 'REPAIR' | 'STEAL_PROPERTY' | 'STEAL_MONEY' | 'TAX_IMMUNITY' | 'ACTIVATE_DICE' | 'MONEY_PER_ASSET';
  value?: number; 
  targetPropertyId?: number;
  diceType?: DiceType; 
  targetTileTypes?: TileType[];
  skipTurns?: number;
}

export interface Tile {
  id: number;
  name: string;
  type: TileType;
  price?: number;
  rent?: number[];
  ownerId?: number | null;
  color?: string;
  description?: string;
  mortgaged?: boolean;
  upgradeLevel?: number;
  customStyle?: {
    borderColor?: string;
    icon?: string;
  };
}

export interface Player {
  id: number;
  socketId: string; // Added for server
  name: string;
  token: PlayerToken;
  money: number;
  position: number;
  isJailed: boolean;
  jailTurns: number;
  properties: number[];
  cards: string[];
  specialAbility?: string;
  taxImmunityTurns?: number;
  nextDiceType?: DiceType;
  skippedTurns?: number;
}

export interface AuctionState {
  isActive: boolean;
  propertyId: number | null;
  currentBid: number;
  highestBidderId: number | null;
  activeBidders: number[]; 
}

export interface LogEntry {
  id: string;
  text: string;
  type: 'INFO' | 'DANGER' | 'SUCCESS' | 'AI';
  timestamp: number;
}

export interface GameState {
  id: string; // Lobby ID
  players: Player[];
  currentPlayerIndex: number;
  tiles: Tile[];
  dice: [number, number, number?]; 
  activeDiceType: DiceType;
  isRolling: boolean;
  remainingSteps: number;
  consecutiveDoubles: number; 
  turnPhase: 'ROLL' | 'MOVING' | 'ACTION' | 'END';
  gameLog: LogEntry[];
  globalEventActive: { title: string, description: string } | null;
  currentCard: null | Card;
  auctionState: AuctionState;
  winnerId?: number | null;
}

// Client-Server Events
export type ClientActionType = 
  | 'ROLL_DICE' 
  | 'END_TURN' 
  | 'BUY_PROPERTY' 
  | 'DECLINE_PROPERTY' 
  | 'START_AUCTION' 
  | 'BID_AUCTION' 
  | 'USE_CARD' 
  | 'ATTEMPT_FRAUD' 
  | 'JAIL_CHOICE';

export interface ClientAction {
  type: ClientActionType;
  payload?: any;
}

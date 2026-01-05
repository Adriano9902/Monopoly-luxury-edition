
import { Tile, TileType, Card } from './types';

export const COLORS = {
  BROWN: '#794615',
  LIGHT_BLUE: '#38bdf8',
  PINK: '#db2777',
  ORANGE: '#f97316',
  RED: '#dc2626',
  YELLOW: '#eab308',
  GREEN: '#16a34a',
  BLUE: '#2563eb',
  PURPLE: '#9333ea', 
  BLACK: '#171717', 
  GOLD: '#d99a1c', 
  TEAL: '#14b8a6', 
};

export const BOARD_SIZE = 60;
export const TILES_PER_SIDE = 15;

const generateTiles = (): Tile[] => {
  const tiles: Tile[] = new Array(BOARD_SIZE).fill(null).map((_, i) => ({
    id: i,
    name: `Casella ${i}`,
    type: TileType.PROPERTY,
    price: 100,
    color: '#333'
  }));

  tiles[0] = { id: 0, name: "VIA!", type: TileType.START };
  tiles[15] = { id: 15, name: "Prigione 2.0", type: TileType.JAIL };
  tiles[30] = { id: 30, name: "Parcheggio Gratuito", type: TileType.FREE_PARKING };
  tiles[45] = { id: 45, name: "In Prigione!", type: TileType.GO_TO_JAIL };

  tiles[1] = { id: 1, name: "Vicolo Corto", type: TileType.PROPERTY, price: 60, color: COLORS.BROWN };
  tiles[2] = { id: 2, name: "TRUFFA", type: TileType.TRUFFA };
  tiles[3] = { id: 3, name: "Vicolo Stretto", type: TileType.PROPERTY, price: 60, color: COLORS.BROWN };
  tiles[4] = { id: 4, name: "Tassa Reddito", type: TileType.TAX, price: 200 };
  tiles[5] = { id: 5, name: "Stazione Sud", type: TileType.RAILROAD, price: 200 };
  tiles[6] = { id: 6, name: "Startup Hub", type: TileType.TECH_HUB, price: 150, color: COLORS.PURPLE };
  tiles[7] = { id: 7, name: "MEGA RICCHEZZE", type: TileType.MEGA_RICCHEZZE };
  tiles[8] = { id: 8, name: "Bastioni Gran Sasso", type: TileType.PROPERTY, price: 100, color: COLORS.LIGHT_BLUE };
  tiles[9] = { id: 9, name: "Viale Monterosa", type: TileType.PROPERTY, price: 100, color: COLORS.LIGHT_BLUE };
  
  tiles[10] = { id: 10, name: "Probabilità", type: TileType.CHANCE }; 
  
  tiles[11] = { id: 11, name: "Server Farm", type: TileType.UTILITY, price: 150 };
  tiles[12] = { id: 12, name: "Via Accademia", type: TileType.PROPERTY, price: 140, color: COLORS.PINK };
  tiles[13] = { id: 13, name: "TRUFFA", type: TileType.TRUFFA };
  tiles[14] = { id: 14, name: "Piazza Università", type: TileType.PROPERTY, price: 160, color: COLORS.PINK };

  tiles[16] = { id: 16, name: "Via Verdi", type: TileType.PROPERTY, price: 180, color: COLORS.ORANGE };
  
  tiles[17] = { id: 17, name: "Imprevisti", type: TileType.COMMUNITY_CHEST }; 
  
  tiles[18] = { id: 18, name: "Corso Raffaello", type: TileType.PROPERTY, price: 180, color: COLORS.ORANGE };
  tiles[19] = { id: 19, name: "Piazza Dante", type: TileType.PROPERTY, price: 200, color: COLORS.ORANGE };
  tiles[20] = { id: 20, name: "Stazione Ovest", type: TileType.RAILROAD, price: 200 };
  tiles[21] = { id: 21, name: "Mercato Nero", type: TileType.BLACK_MARKET };
  tiles[22] = { id: 22, name: "Via Marco Polo", type: TileType.PROPERTY, price: 220, color: COLORS.RED };
  tiles[23] = { id: 23, name: "TRUFFA", type: TileType.TRUFFA };
  tiles[24] = { id: 24, name: "Corso Magellano", type: TileType.PROPERTY, price: 220, color: COLORS.RED };
  tiles[25] = { id: 25, name: "Largo Colombo", type: TileType.PROPERTY, price: 240, color: COLORS.RED };
  tiles[26] = { id: 26, name: "Truffa Academy", type: TileType.SCAM_ACADEMY, price: 300, color: COLORS.BLACK };
  tiles[27] = { id: 27, name: "Viale Costantino", type: TileType.PROPERTY, price: 260, color: COLORS.YELLOW };
  
  tiles[28] = { id: 28, name: "Probabilità", type: TileType.CHANCE };
  
  tiles[29] = { id: 29, name: "Piazza Giulio Cesare", type: TileType.PROPERTY, price: 280, color: COLORS.YELLOW };

  tiles[31] = { id: 31, name: "Via Roma", type: TileType.PROPERTY, price: 300, color: COLORS.GREEN };
  tiles[32] = { id: 32, name: "Corso Impero", type: TileType.PROPERTY, price: 300, color: COLORS.GREEN };
  
  tiles[33] = { id: 33, name: "Probabilità", type: TileType.CHANCE };
  
  tiles[34] = { id: 34, name: "Largo Augusto", type: TileType.PROPERTY, price: 320, color: COLORS.GREEN };
  tiles[35] = { id: 35, name: "Stazione Nord", type: TileType.RAILROAD, price: 200 };
  
  tiles[36] = { id: 36, name: "Imprevisti", type: TileType.COMMUNITY_CHEST };
  
  tiles[37] = { id: 37, name: "Viale dei Giardini", type: TileType.PROPERTY, price: 350, color: COLORS.BLUE };
  tiles[38] = { id: 38, name: "Tassa di Lusso", type: TileType.TAX, price: 100 };
  tiles[39] = { id: 39, name: "Parco della Vittoria", type: TileType.PROPERTY, price: 400, color: COLORS.BLUE };
  tiles[40] = { id: 40, name: "Piattaforma Petrolifera", type: TileType.OIL_COMPANY, price: 450, color: COLORS.TEAL };
  tiles[41] = { id: 41, name: "Raffineria Dubai", type: TileType.OIL_COMPANY, price: 500, color: COLORS.TEAL };
  tiles[42] = { id: 42, name: "Satellite Link", type: TileType.UTILITY, price: 200 };
  tiles[43] = { id: 43, name: "Crypto Exchange", type: TileType.CRYPTO_EXCHANGE };
  tiles[44] = { id: 44, name: "Catastrofe", type: TileType.DISASTER };

  tiles[46] = { id: 46, name: "Penthouse NY", type: TileType.PROPERTY, price: 600, color: COLORS.GOLD };
  tiles[47] = { id: 47, name: "Villa Beverly Hills", type: TileType.PROPERTY, price: 600, color: COLORS.GOLD };
  tiles[48] = { id: 48, name: "Isola Privata", type: TileType.PROPERTY, price: 800, color: COLORS.GOLD };
  tiles[49] = { id: 49, name: "Stazione Est", type: TileType.RAILROAD, price: 200 };
  
  tiles[50] = { id: 50, name: "Imprevisti", type: TileType.COMMUNITY_CHEST };
  
  tiles[51] = { id: 51, name: "SpaceX Launchpad", type: TileType.TECH_HUB, price: 700, color: COLORS.PURPLE };
  tiles[52] = { id: 52, name: "Casino Royale", type: TileType.BLACK_MARKET, price: 500, color: COLORS.BLACK };
  tiles[53] = { id: 53, name: "Tassa Patrimoniale Global", type: TileType.TAX, price: 500 };
  tiles[54] = { id: 54, name: "Monte Carlo", type: TileType.PROPERTY, price: 750, color: COLORS.GOLD };
  tiles[55] = { id: 55, name: "Zurigo Bank", type: TileType.PROPERTY, price: 800, color: COLORS.GOLD };
  tiles[56] = { id: 56, name: "Dubai Tower", type: TileType.PROPERTY, price: 1000, color: COLORS.GOLD };
  
  tiles[57] = { id: 57, name: "Probabilità", type: TileType.CHANCE };
  
  tiles[58] = { id: 58, name: "Yacht Club", type: TileType.PROPERTY, price: 650, color: COLORS.TEAL };
  tiles[59] = { id: 59, name: "Jet Privato", type: TileType.RAILROAD, price: 400 };

  return tiles;
};

export const GAME_TILES = generateTiles();

export const CHANCE_CARDS_GENERIC: Omit<Card, 'id' | 'type'>[] = [
  { title: "Bolla Crypto Esplosa", description: "I tuoi investimenti in altcoin sono crollati. Perdi $150M.", actionType: 'MONEY', value: -150 },
  { title: "Dividendi Offshore", description: "Le tue holding alle Cayman hanno generato profitti. +$250M.", actionType: 'MONEY', value: 250 },
  { title: "Scalata Ostile", description: "Spostati su Via Roma. Se passi dal Via, ritira $200M.", actionType: 'MOVE', value: 31 },
  { title: "Soffiata di Mercato", description: "Hai informazioni privilegiate. Il prossimo turno userai il Dado BUSINESS.", actionType: 'ACTIVATE_DICE', diceType: 'BUSINESS' },
  { title: "Attacco Hacker", description: "Il sistema è compromesso. Il prossimo turno userai il Dado CHAOS.", actionType: 'ACTIVATE_DICE', diceType: 'CHAOS' },
  { title: "Eccesso di Velocità", description: "Multa per il tuo Jet Privato. Paga $50M.", actionType: 'MONEY', value: -50 },
  { title: "Viaggio di Lusso", description: "Vai avanti fino a Parco della Vittoria.", actionType: 'MOVE', value: 39 },
  { title: "Mandato di Cattura", description: "Sei indagato per Insider Trading. Vai direttamente in Prigione.", actionType: 'JAIL' },
];

export const COMMUNITY_CARDS: Omit<Card, 'id' | 'type'>[] = [
  { title: "Ristrutturazione Hotel", description: "Devi adeguare i tuoi immobili alle norme eco-sostenibili. Paga $25M per ogni proprietà posseduta.", actionType: 'REPAIR', value: 25 },
  { title: "Errore Bancario", description: "Un glitch nel sistema ti ha accreditato fondi extra. +$200M.", actionType: 'MONEY', value: 200 },
  { title: "Contributo Elettorale", description: "La campagna politica del tuo candidato chiede fondi. Paga $100M.", actionType: 'MONEY', value: -100 },
  { title: "Rimborso Fiscale", description: "L'anno scorso hai pagato troppe tasse. Ricevi $50M.", actionType: 'MONEY', value: 50 },
  { title: "Uscita di Prigione", description: "Hai pagato la cauzione in anticipo o corrotto il giudice. Tieni questa carta.", actionType: 'TAX_IMMUNITY', value: 1 }, 
  { title: "Back to Start", description: "Torna al VIA e incassa il bonus raddoppiato ($400M).", actionType: 'MOVE', value: 0 },
];

export const TRUFFA_CARDS: Omit<Card, 'id' | 'type'>[] = [
  { title: "Schema Ponzi", description: "Hai convinto i tuoi rivali a investire in 'nulla'. Ruba $50M a ogni giocatore.", actionType: 'STEAL_MONEY', value: 50 },
  { title: "Rug Pull", description: "Il progetto DeFi che hai lanciato è fallito 'misteriosamente'. Guadagni $300M ma la reputazione crolla.", actionType: 'MONEY', value: 300 },
  { title: "Falsificazione Asset", description: "Hai venduto un NFT inesistente. Prendi $100M dalla banca.", actionType: 'MONEY', value: 100 },
  { title: "Identità Sintetica", description: "Hai clonato il portafoglio di un rivale. Ruba una proprietà casuale a un avversario.", actionType: 'STEAL_PROPERTY' },
  { title: "Arresto per Frode", description: "L'FBI ha tracciato i tuoi movimenti. Vai direttamente in prigione senza passare dal VIA.", actionType: 'JAIL' },
  { title: "Riciclaggio Fallito", description: "I tuoi soldi sporchi sono stati sequestrati alla dogana. Perdi $200M.", actionType: 'MONEY', value: -200 },
  { title: "Exit Strategy", description: "Vendi tutto prima del crollo. Guadagni $150M ma salti il prossimo turno (sparizione tattica).", actionType: 'MONEY', value: 150, skipTurns: 1 },
  { title: "Insider Trading", description: "Usi informazioni riservate per rubare un asset a un rivale.", actionType: 'STEAL_PROPERTY' },
  { title: "Manipolazione Algoritmica", description: "Hai hackerato il sistema di trading. Il prossimo turno userai il Dado TRUFFA.", actionType: 'ACTIVATE_DICE', diceType: 'TRUFFA' }
];

export const MEGA_RICCHEZZE_CARDS: Omit<Card, 'id' | 'type'>[] = [
  { title: "IPO Unicorno", description: "La tua startup è stata quotata al NASDAQ. Incassa $500M.", actionType: 'MONEY', value: 500 },
  { title: "Eredità Reale", description: "Un lontano parente nobile ti ha lasciato tutto. Incassa $350M.", actionType: 'MONEY', value: 350 },
  { title: "Immunità Diplomatica", description: "Hai ottenuto un passaporto speciale. Niente tasse per i prossimi 3 turni.", actionType: 'TAX_IMMUNITY', value: 3 },
  { title: "Acquisizione Ostile", description: "Hai forzato la vendita di un asset rivale. Prendi una proprietà a caso da un avversario.", actionType: 'STEAL_PROPERTY' },
  { title: "Angel Investor", description: "Un fondo sovrano crede nella tua visione. Ricevi $400M per investimenti.", actionType: 'MONEY', value: 400 },
  { title: "Buyback Azionario", description: "Le tue azioni sono alle stelle. Tutti i giocatori ti pagano $50M di dividendi.", actionType: 'STEAL_MONEY', value: 50 },
  { title: "Monopolio Tech", description: "Il governo approva la tua fusione. Ruba una proprietà Tech Hub o Utility a un rivale.", actionType: 'STEAL_PROPERTY', targetTileTypes: [TileType.TECH_HUB, TileType.UTILITY] },
  { title: "Golden Parachute", description: "Ti dimetti da CEO con una buonuscita record. +$300M.", actionType: 'MONEY', value: 300 },
  { title: "Dominio Energetico", description: "Hai acquisito il controllo della rete. Ruba una Compagnia Petrolifera.", actionType: 'STEAL_PROPERTY', targetTileTypes: [TileType.OIL_COMPANY] },
  { title: "Rivalutazione Asset", description: "Il mercato immobiliare è in bolla. Incassa $50M per ogni proprietà posseduta.", actionType: 'MONEY_PER_ASSET', value: 50 },
];


import { Type, Modality } from "@google/genai";
import { GameState, Tile, Player, TileType } from '../types';
import { COLORS } from '../constants';

const ai = null;

const SYSTEM_INSTRUCTION = `
Sei "The Oracle", l'IA di trading algoritmico e consulente strategico supremo di "Monopoly Business & Lusso: Extreme Edition".
Il tuo tono è: Cinico (stile Wall Street), analitico, visionario, leggermente arrogante ma estremamente competente.
Parla SEMPRE in ITALIANO.

MANDATO STRATEGICO (PRIORITÀ ASSOLUTA):
1. GESTIONE CRISI (Liquidità Bassa < $500M): 
   - Se il giocatore ha pochi fondi, DEVI consigliare di vendere o ipotecare proprietà "orfane" (dove non ha monopolio) per generare liquidità immediata.
   - Sconsiglia spese futili. Usa termini come "Liquidazione asset tossici", "Stop-loss", "Cash is King".

2. ESPANSIONE (Monopolio Completo): 
   - Se il giocatore possiede tutti i colori di un set, DEVI SUGGERIRE di costruire/fare upgrade.
   - "Un monopolio senza edifici è capitale morto". "Massimizzare il ROI ora".

3. ACQUISIZIONE (Quasi Monopolio): 
   - Se manca 1 solo asset per completare un set, spingi per ottenerlo a tutti i costi (aste, scambi).
   - "Il dominio del settore è a un passo".

4. CONTESTO GENERALE:
   - Se sta dominando (Whale): Consiglia di schiacciare i rivali.
   - Se il percorso è pieno di proprietà rivali: "Campo minato, serve prudenza".

REGOLE DI FORMATTAZIONE:
- Risposta breve (max 2-3 frasi incisive).
- NON USARE MARKDOWN (niente asterischi, grassetto, corsivo). Solo testo semplice.
- Usa terminologia finanziaria (Leverage, Equity, Cash Flow, Asset Allocation, Bull/Bear, Hostile Takeover).
- Sii DIRETTO: "Vendi Vicolo Corto", "Costruisci su Parco della Vittoria".
`;

const getColorName = (hex: string): string => {
  switch(hex) {
    case COLORS.BROWN: return "Settore Marrone (Low Cost)";
    case COLORS.LIGHT_BLUE: return "Settore Azzurro";
    case COLORS.PINK: return "Settore Rosa";
    case COLORS.ORANGE: return "Settore Arancione";
    case COLORS.RED: return "Settore Rosso";
    case COLORS.YELLOW: return "Settore Giallo";
    case COLORS.GREEN: return "Settore Verde";
    case COLORS.BLUE: return "Settore Blu (Prime)";
    case COLORS.GOLD: return "Settore Oro (Luxury)";
    case COLORS.PURPLE: return "Settore Tech";
    case COLORS.TEAL: return "Settore Petrolifero";
    case COLORS.BLACK: return "Mercato Ombra";
    default: return "Settore Generico";
  }
};

const analyzePortfolio = (player: Player, gameState: GameState) => {
  const LOW_LIQUIDITY_THRESHOLD = 500;
  const CRITICAL_LIQUIDITY_THRESHOLD = 200;

  // 1. Analisi Liquidità
  let liquidityStatus = "STABILE";
  if (player.money < CRITICAL_LIQUIDITY_THRESHOLD) liquidityStatus = "CRISI CRITICA (Rischio Bancarotta)";
  else if (player.money < LOW_LIQUIDITY_THRESHOLD) liquidityStatus = "ATTENZIONE (Liquidità Bassa)";
  else if (player.money > 2000) liquidityStatus = "WHALE (Dominanza Finanziaria)";

  // 2. Analisi Monopoli e Rivali
  const colorStats: Record<string, {
    owned: number, 
    total: number, 
    name: string, 
    missingIds: number[],
    ownedTiles: Tile[]
  }> = {};
  
  gameState.tiles.forEach(t => {
    if (t.type === TileType.PROPERTY && t.color) {
      if (!colorStats[t.color]) {
        colorStats[t.color] = { owned: 0, total: 0, name: getColorName(t.color), missingIds: [], ownedTiles: [] };
      }
      colorStats[t.color].total++;
      if (t.ownerId === player.id) {
        colorStats[t.color].owned++;
        colorStats[t.color].ownedTiles.push(t);
      } else {
        colorStats[t.color].missingIds.push(t.id);
      }
    }
  });

  const strategicInsights: string[] = [];
  const liquidationCandidates: string[] = [];
  
  Object.values(colorStats).forEach(stat => {
    // Monopoly Logic
    if (stat.owned === stat.total) {
      strategicInsights.push(`★ MONOPOLIO COMPLETO in ${stat.name}. (STRATEGIA: Costruire/Upgrade massiccio per aumentare Cash Flow)`);
    } else if (stat.owned === stat.total - 1) {
      const missingInfo = stat.missingIds.map(id => {
        const tile = gameState.tiles.find(t => t.id === id);
        if (!tile) return '';
        if (tile.ownerId === null || tile.ownerId === undefined) return `${tile.name} (LIBERO)`;
        const rival = gameState.players.find(p => p.id === tile.ownerId);
        return `${tile.name} (RIVALE ${rival?.name})`;
      }).join(', ');
      strategicInsights.push(`⚠ QUASI MONOPOLIO in ${stat.name}. Manca: ${missingInfo}. (STRATEGIA: Acquisire prioritaria)`);
    }

    // Liquidation Logic: If player has low money and owns random pieces of a set, mark them for sale
    if (player.money < LOW_LIQUIDITY_THRESHOLD && stat.owned > 0 && stat.owned < stat.total) {
       const assetNames = stat.ownedTiles.map(t => t.name).join(', ');
       liquidationCandidates.push(`${assetNames} (${stat.name})`);
    }
  });

  // 3. Analisi Pericoli Imminenti (Next 6 steps)
  let dangerAlert = "PERCORSO LIBERO";
  let riskyTiles = 0;
  for(let i=1; i<=6; i++) {
    const checkPos = (player.position + i) % 60; // Assuming 60 tiles
    const tile = gameState.tiles[checkPos];
    if (tile.ownerId !== undefined && tile.ownerId !== null && tile.ownerId !== player.id) {
        // Stima rendita grezza
        const estRent = (tile.price || 100) * 0.1;
        if (estRent > 50) riskyTiles++;
    }
  }
  if (riskyTiles >= 2) dangerAlert = "ALTA VOLATILITÀ (Asset Rivali imminenti)";

  return { 
      liquidityStatus, 
      strategicInsights: strategicInsights.length > 0 ? strategicInsights.join(' | ') : "Nessun asset strategico dominante (Accumulazione fase iniziale).",
      dangerAlert,
      liquidationAdvice: liquidationCandidates.length > 0 ? `SUGGERIMENTO VENDITA (Per liquidità): ${liquidationCandidates.join(', ')}` : "Nessuna liquidazione urgente necessaria."
  };
};

export const getTurnCommentary = async (player: Player, action: string, tile: Tile, gameState: GameState): Promise<string> => {
  try {
    const resp = await fetch('/ai/commentary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ player, action, tile, gameState })
    });
    const data = await resp.json();
    return data.text || "Analisi di mercato in corso...";
  } catch (error) {
    console.error("Gemini Commentary Error:", error);
    return "Analisi di mercato momentaneamente non disponibile. Trust the process.";
  }
};

export const generateGlobalEvent = async (gameState: GameState): Promise<{ title: string, description: string, effectLabel: string, actionType: 'TAX_ALL' | 'GIVE_MONEY_ALL' | 'CHAOS_MOVE' }> => {
  try {
    const resp = await fetch('/ai/global-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gameState })
    });
    return await resp.json();
  } catch (error) {
    console.error("Global Event Error:", error);
    return {
      title: "Flash Crash",
      description: "Un glitch negli algoritmi di trading causa il panico.",
      effectLabel: "Tutti i giocatori perdono $80M",
      actionType: 'TAX_ALL'
    };
  }
};

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Manual PCM decoding since Gemini returns raw PCM data without headers
function pcmToAudioBuffer(data: Uint8Array, ctx: AudioContext, sampleRate: number): AudioBuffer {
  // Check if data is aligned to 16-bit
  if (data.length % 2 !== 0) {
      // Pad with one byte if odd (should not happen for valid PCM16)
      const newData = new Uint8Array(data.length + 1);
      newData.set(data);
      data = newData;
  }
  
  const pcm16 = new Int16Array(data.buffer);
  const frameCount = pcm16.length;
  const audioBuffer = ctx.createBuffer(1, frameCount, sampleRate);
  const channelData = audioBuffer.getChannelData(0);
  
  for (let i = 0; i < frameCount; i++) {
    // Normalize 16-bit integer to float [-1.0, 1.0]
    channelData[i] = pcm16[i] / 32768.0;
  }
  
  return audioBuffer;
}

const cleanTextForTTS = (text: string): string => {
  // Remove markdown characters that confuse the TTS model
  return text.replace(/[*_#~`]/g, '').trim();
};

export const speakText = async (text: string) => {
  const clean = cleanTextForTTS(text);
  if (!clean) return;

  try {
    const resp = await fetch('/ai/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: clean })
    });
    const data = await resp.json();
    if (data.audioBase64) {
      const audio = new Audio(`data:${data.mime};base64,${data.audioBase64}`);
      audio.play();
    }
  } catch (error: any) {
    // Graceful error handling for quota limits or model errors
    console.warn("TTS Playback failed (likely content/quota issue):", error);
  }
};

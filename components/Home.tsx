import * as React from 'react';
import { useMemo, useState, useEffect } from 'react';
import { PlayerToken, PlayerConfig, PlayerType } from '../types';
import { PlayerTokenIcon, IconLock } from './Icons';
import { audioService } from '../services/audioService';

interface HomeProps {
  onCreateGame: (players: PlayerConfig[]) => void;
  onJoinGame: (gameId: string, playerName: string) => void;
  isLoading?: boolean;
  error?: string | null;
}

const INVESTORS = [2, 3, 4, 5, 6, 7, 8] as const;
const TOKENS: PlayerToken[] = [
  PlayerToken.JET,
  PlayerToken.YACHT,
  PlayerToken.OIL,
  PlayerToken.CRYPTO,
  PlayerToken.SCAM,
  PlayerToken.TRAIN,
  PlayerToken.BOLT,
  PlayerToken.CHIP,
  PlayerToken.DIAMOND,
  PlayerToken.WATCH,
];

const Home: React.FC<HomeProps> = ({ onCreateGame, onJoinGame, isLoading, error }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [investors, setInvestors] = useState<(typeof INVESTORS)[number]>(2);
  const [mode, setMode] = useState<'CREATE' | 'JOIN'>('CREATE');
  
  // New State for Multi-Player Config
  const [players, setPlayers] = useState<PlayerConfig[]>([]);
  
  // Join Mode State
  const [joinName, setJoinName] = useState('');
  const [gameId, setGameId] = useState('');

  // Initialize Players when investors count changes
  useEffect(() => {
    setPlayers(prev => {
        const newPlayers: PlayerConfig[] = [];
        for (let i = 0; i < investors; i++) {
            // Keep existing config if available
            if (prev[i]) {
                newPlayers.push(prev[i]);
            } else {
                // Default new player
                const isHost = i === 0;
                // Find first unused token
                const usedTokens = new Set(newPlayers.map(p => p.token).concat(prev.map(p => p.token)));
                const availableToken = TOKENS.find(t => !usedTokens.has(t)) || TOKENS[i % TOKENS.length];
                
                newPlayers.push({
                    name: isHost ? 'Tycoon 1' : `Tycoon ${i + 1}`,
                    token: availableToken,
                    type: isHost ? 'HUMAN' : 'AI', // Default others to AI
                    isHost
                });
            }
        }
        return newPlayers;
    });
  }, [investors]);

  const particles = useMemo(() => {
    return Array.from({ length: 28 }).map((_, i) => {
      const left = ((i * 37) % 100) + 0.5;
      const top = ((i * 53) % 100) + 0.5;
      const size = 1 + ((i * 7) % 3);
      const opacity = 0.08 + (((i * 11) % 12) / 100);
      const blur = ((i * 5) % 2) ? 'blur-[0.5px]' : '';
      const delay = `${(i * 180) % 2400}ms`;
      return { left, top, size, opacity, blur, delay };
    });
  }, []);

  const handleUpdatePlayer = (index: number, updates: Partial<PlayerConfig>) => {
    setPlayers(prev => {
        const next = [...prev];
        next[index] = { ...next[index], ...updates };
        
        // Ensure token uniqueness if token changed
        if (updates.token) {
            // If another player had this token, swap or reset?
            // For now, UI prevents selecting taken tokens, so we assume it's valid.
        }
        return next;
    });
  };

  const handleCreate = () => {
    if (players.some(p => !p.name.trim())) return;
    audioService.playPurchase();
    if (mode === 'LOCAL' && onLocalStart) {
        onLocalStart(players);
    } else {
        onCreateGame(players);
    }
  };

  const handleJoin = () => {
    if (!joinName.trim() || !gameId.trim()) return;
    audioService.playPurchase();
    onJoinGame(gameId.trim().toUpperCase(), joinName.trim());
  };

  const getAvailableTokens = (playerIndex: number) => {
      const takenTokens = new Set(players.filter((_, idx) => idx !== playerIndex).map(p => p.token));
      return TOKENS.map(t => ({ token: t, disabled: takenTokens.has(t) }));
  };

  return (
    <div className="min-h-screen w-full bg-luxury-black flex items-center justify-center p-4 md:p-8 relative overflow-hidden font-sans selection:bg-gold-400/30 selection:text-gold-100">
      
      {/* --- ATMOSPHERE LAYERS --- */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-luxury-charcoal via-luxury-black to-black opacity-90"></div>
      <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-overlay pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(138,110,47,0.08),transparent_60%)] pointer-events-none mix-blend-screen"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)] pointer-events-none"></div>

      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p, idx) => (
          <div
            key={idx}
            className={`absolute rounded-full bg-gold-100 ${p.blur}`}
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: p.opacity * 0.6,
              boxShadow: `0 0 ${p.size * 2}px rgba(217,154,28,0.4)`,
              animation: `float ${10 + (idx % 10)}s ease-in-out infinite alternate ${p.delay}`,
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-4xl relative z-10">
        <div className="text-center mb-8">
           <div className="inline-block mb-2">
              <div className="h-px w-24 bg-gradient-to-r from-transparent via-gold-500/50 to-transparent mx-auto mb-2"></div>
              <div className="text-[10px] uppercase tracking-[0.6em] text-gold-shine font-black ml-[0.6em]">
                Business & Luxury Simulator
              </div>
              <div className="h-px w-24 bg-gradient-to-r from-transparent via-gold-500/50 to-transparent mx-auto mt-2"></div>
           </div>
        </div>

        {/* --- MAIN LUXURY CARD --- */}
        <div className="card-luxury rounded-2xl overflow-hidden relative group">
          <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] pointer-events-none mix-blend-overlay"></div>
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold-400/40 to-transparent"></div>

          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full blur-md bg-gold-500/20 animate-pulse"></div>
                <div className="relative w-12 h-12 border-2 border-gold-500/30 border-t-gold-300 rounded-full animate-spin"></div>
              </div>
              <div className="mt-6 text-[10px] font-mono uppercase tracking-[0.45em] text-gold-400/80 ml-[0.45em] animate-pulse">
                Establishing Secure Connection...
              </div>
            </div>
          ) : (
            <div className="p-6 md:p-10 relative z-10">
              {step === 1 && (
                <div className="text-center max-w-lg mx-auto">
                  <h1 className="text-4xl md:text-5xl text-gold-gradient font-display font-black mb-3 tracking-tight drop-shadow-xl">
                    Monopoly Extreme
                  </h1>
                  
                  {error && (
                    <div className="mb-6 bg-red-500/10 border border-red-500/50 p-4 rounded-lg text-red-200 text-xs font-mono uppercase tracking-wide">
                        <span className="font-bold block mb-1 text-red-400">Connection Error</span>
                        {error}
                    </div>
                  )}

                  <div className="text-[10px] uppercase tracking-[0.45em] text-slate-400 font-bold mb-10 ml-[0.45em]">
                    Seleziona il numero di investitori
                  </div>

                  <div className="flex flex-wrap justify-center gap-3 mb-10">
                    {INVESTORS.map((n) => {
                      const active = n === investors;
                      return (
                        <button
                          key={n}
                          onClick={() => setInvestors(n)}
                          className={`w-12 h-12 rounded-lg border transition-all duration-300 ${
                            active
                              ? 'bg-gradient-to-b from-gold-400 to-gold-600 border-gold-300 text-black shadow-[0_0_25px_rgba(217,154,28,0.4)] scale-110'
                              : 'bg-white/5 border-white/5 text-slate-500 hover:border-gold-500/30 hover:text-gold-200 hover:bg-white/10'
                          } font-display font-bold text-lg flex items-center justify-center`}
                        >
                          {n}
                        </button>
                      );
                    })}
                  </div>

                    <div className="flex gap-4 justify-center">
                    <button
                        onClick={() => {
                        setLocalMode(false);
                        setMode('CREATE');
                        setStep(2);
                        }}
                        className="group relative flex-1 py-4 bg-gradient-to-b from-gold-400 via-gold-500 to-gold-600 text-black font-black uppercase tracking-[0.3em] rounded-sm shadow-[0_5px_20px_rgba(217,154,28,0.15)] hover:shadow-[0_10px_30px_rgba(217,154,28,0.3)] transition-all transform hover:-translate-y-0.5 overflow-hidden text-xs"
                    >
                        <span className="relative z-10">Online Lobby</span>
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 blur-md"></div>
                    </button>
                    
                    <button
                        onClick={() => {
                        setLocalMode(true);
                        setMode('LOCAL');
                        setStep(2);
                        }}
                        className="flex-1 py-4 border border-gold-500/30 bg-black/40 text-gold-200 hover:text-white hover:bg-gold-500/10 font-bold uppercase tracking-[0.2em] rounded-sm transition-all text-xs"
                    >
                        Locale (Hotseat)
                    </button>

                    <button
                        onClick={() => {
                        setLocalMode(false);
                        setMode('JOIN');
                        setStep(2);
                        }}
                        className="flex-1 py-4 border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 font-bold uppercase tracking-[0.2em] rounded-sm transition-all text-xs"
                    >
                        Unisciti
                    </button>
                  </div>

                  <div className="mt-8 flex items-center justify-center gap-4 opacity-60">
                     <div className="h-px w-12 bg-white/10"></div>
                     <div className="text-[9px] uppercase tracking-[0.2em] text-slate-500 font-mono">
                        Market Status · <span className="text-emerald-500/80">Bullish</span> · Secure
                     </div>
                     <div className="h-px w-12 bg-white/10"></div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <div className="flex items-center justify-between gap-4 mb-8 border-b border-white/5 pb-4">
                    <div>
                      <h2 className="text-2xl md:text-3xl text-white font-display font-black tracking-tight">
                        {mode === 'CREATE' ? 'Configurazione' : 'Accesso'} <span className="text-gold-gradient">Lobby</span>
                      </h2>
                      <div className="mt-1 text-[10px] uppercase tracking-[0.35em] text-slate-500 font-bold ml-[0.35em]">
                        {mode === 'CREATE' ? 'Impostazione Asset & Players' : 'Inserimento Credenziali'}
                      </div>
                    </div>
                    {mode === 'CREATE' && (
                        <div className="flex flex-col items-center justify-center bg-black/40 border border-white/10 px-4 py-2 rounded-lg">
                        <span className="text-2xl font-display text-gold-400">{String(investors).padStart(2, '0')}</span>
                        <span className="text-[8px] uppercase tracking-widest text-slate-600">Players</span>
                        </div>
                    )}
                  </div>

                  {error && (
                    <div className="mb-6 bg-red-500/10 border border-red-500/50 p-4 rounded-lg text-red-200 text-xs font-mono uppercase tracking-wide">
                        <span className="font-bold block mb-1 text-red-400">Error</span>
                        {error}
                    </div>
                  )}

                  {mode === 'CREATE' || mode === 'LOCAL' ? (
                      <>
                        <div className="grid grid-cols-1 gap-4 mb-8 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                            {players.map((player, idx) => (
                                <div key={idx} className={`border ${player.type === 'AI' ? 'border-white/5 bg-white/5' : 'border-gold-500/20 bg-black/40'} rounded-xl p-4 relative overflow-hidden group transition-all`}>
                                    
                                    <div className="flex flex-col md:flex-row gap-4 items-center">
                                        {/* Left: Avatar & Type */}
                                        <div className="flex flex-col items-center gap-2 min-w-[80px]">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-b from-luxury-card to-black border border-gold-500/30 p-2 shadow-inner relative">
                                                <PlayerTokenIcon token={player.token} className="w-full h-full drop-shadow-lg" />
                                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-black rounded-full flex items-center justify-center border border-white/10">
                                                    <span className="text-[10px] font-bold text-gold-400">{idx + 1}</span>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => handleUpdatePlayer(idx, { type: player.type === 'HUMAN' ? 'AI' : 'HUMAN' })}
                                                className={`text-[9px] uppercase tracking-wider font-bold px-2 py-1 rounded border ${player.type === 'HUMAN' ? 'bg-gold-500/10 border-gold-500/50 text-gold-300' : 'bg-white/5 border-white/10 text-slate-500'}`}
                                            >
                                                {player.type}
                                            </button>
                                        </div>

                                        {/* Middle: Name Input */}
                                        <div className="flex-1 w-full">
                                            <div className="text-[9px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-1 ml-1">
                                                Nome Investitore
                                            </div>
                                            <input
                                                type="text"
                                                value={player.name}
                                                onChange={(e) => handleUpdatePlayer(idx, { name: e.target.value })}
                                                className="w-full bg-[#050505] border border-white/10 rounded-md p-3 text-white font-display uppercase tracking-wider focus:border-gold-500/50 outline-none transition-all placeholder:text-slate-700 text-sm shadow-inner"
                                            />
                                        </div>

                                        {/* Right: Token Grid */}
                                        <div className="flex-1 w-full">
                                            <div className="text-[9px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-1 ml-1">
                                                Seleziona Asset
                                            </div>
                                            <div className="flex flex-wrap gap-1.5">
                                                {getAvailableTokens(idx).map(({ token: t, disabled }) => (
                                                <button
                                                    key={t}
                                                    onClick={() => !disabled && handleUpdatePlayer(idx, { token: t })}
                                                    disabled={disabled && player.token !== t}
                                                    className={`w-8 h-8 rounded border flex items-center justify-center transition-all ${
                                                    player.token === t
                                                        ? 'border-gold-500 bg-gold-500/20 text-gold-200 shadow-[0_0_10px_rgba(217,154,28,0.2)]'
                                                        : disabled
                                                            ? 'border-transparent bg-white/5 text-slate-700 opacity-30 cursor-not-allowed'
                                                            : 'border-white/5 bg-white/5 text-slate-600 hover:border-gold-500/30 hover:text-gold-200'
                                                    }`}
                                                    title={t}
                                                >
                                                    {disabled && player.token !== t ? (
                                                        <IconLock className="w-3 h-3" />
                                                    ) : (
                                                        <PlayerTokenIcon token={t} className="w-4 h-4" />
                                                    )}
                                                </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-3 pt-4 border-t border-white/10">
                            <button
                                onClick={handleCreate}
                                className="w-full py-4 bg-gradient-to-r from-gold-600 via-gold-500 to-gold-400 text-black font-black uppercase tracking-[0.3em] rounded-sm shadow-[0_0_25px_rgba(217,154,28,0.15)] hover:shadow-[0_0_40px_rgba(217,154,28,0.3)] transition-all transform hover:-translate-y-0.5 text-xs relative overflow-hidden group"
                            >
                                <span className="relative z-10">Avvia Simulazione</span>
                                <div className="absolute inset-0 bg-white/30 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 blur-lg"></div>
                            </button>
                        </div>
                      </>
                  ) : (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-[9px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-2 ml-1">Nome Giocatore</label>
                            <input
                                type="text"
                                value={joinName}
                                onChange={(e) => setJoinName(e.target.value)}
                                className="w-full bg-[#050505] border border-white/10 rounded-md p-4 text-white font-display uppercase tracking-wider focus:border-gold-500/50 outline-none transition-all placeholder:text-slate-700 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-[9px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-2 ml-1">Codice Lobby</label>
                            <input
                                type="text"
                                value={gameId}
                                onChange={(e) => setGameId(e.target.value.toUpperCase())}
                                placeholder="XXXXXX"
                                className="w-full bg-[#050505] border border-white/10 rounded-md p-4 text-center text-gold-400 font-mono uppercase tracking-[0.5em] focus:border-gold-500 outline-none transition-all placeholder:text-slate-800 text-sm"
                            />
                        </div>
                        <button
                          onClick={handleJoin}
                          disabled={!joinName.trim() || !gameId.trim()}
                          className="w-full py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black uppercase tracking-[0.3em] rounded-sm transition-all text-xs"
                        >
                          Entra nel Board
                        </button>
                    </div>
                  )}

                  <button
                      onClick={() => setStep(1)}
                      className="w-full py-3 mt-4 text-[10px] uppercase tracking-[0.2em] text-slate-500 hover:text-gold-400 transition-colors"
                  >
                      ← Torna indietro
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-center">
            <p className="text-[9px] text-slate-700 font-mono tracking-widest">
                SECURED BY MONOPOLY QUANTUM LEDGER
            </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
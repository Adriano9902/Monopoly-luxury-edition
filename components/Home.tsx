import * as React from 'react';
import { useMemo, useState } from 'react';
import { PlayerToken } from '../types';
import { PlayerTokenIcon } from './Icons';
import { audioService } from '../services/audioService';

interface HomeProps {
  onCreateGame: (playerName: string) => void;
  onJoinGame: (gameId: string, playerName: string) => void;
  isLoading?: boolean;
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

const Home: React.FC<HomeProps> = ({ onCreateGame, onJoinGame, isLoading }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [investors, setInvestors] = useState<(typeof INVESTORS)[number]>(2);
  const [mode, setMode] = useState<'CREATE' | 'JOIN'>('CREATE');
  const [playerName, setPlayerName] = useState('');
  const [gameId, setGameId] = useState('');
  const [token, setToken] = useState<PlayerToken>(PlayerToken.JET);

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

  const handleCreate = () => {
    if (!playerName.trim()) return;
    audioService.playPurchase();
    onCreateGame(playerName.trim());
  };

  const handleJoin = () => {
    if (!playerName.trim() || !gameId.trim()) return;
    audioService.playPurchase();
    onJoinGame(gameId.trim().toUpperCase(), playerName.trim());
  };

  return (
    <div className="min-h-screen w-full bg-luxury-black flex items-center justify-center p-4 md:p-8 relative overflow-hidden font-sans selection:bg-gold-400/30 selection:text-gold-100">
      
      {/* --- ATMOSPHERE LAYERS --- */}
      {/* 1. Deep Base Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-luxury-charcoal via-luxury-black to-black opacity-90"></div>
      
      {/* 2. Noise Texture (Grain) */}
      <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-overlay pointer-events-none"></div>
      
      {/* 3. Ambient Gold Glow (Spotlight) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(138,110,47,0.08),transparent_60%)] pointer-events-none mix-blend-screen"></div>
      
      {/* 4. Deep Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)] pointer-events-none"></div>

      {/* 5. Particles */}
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
              opacity: p.opacity * 0.6, // More subtle
              boxShadow: `0 0 ${p.size * 2}px rgba(217,154,28,0.4)`,
              animation: `float ${10 + (idx % 10)}s ease-in-out infinite alternate ${p.delay}`,
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-2xl relative z-10">
        <div className="text-center mb-8">
           {/* Logo / Brand Header */}
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
          
          {/* Subtle Leather Texture Overlay */}
          <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] pointer-events-none mix-blend-overlay"></div>
          
          {/* Top Gold Bevel */}
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
            <div className="p-8 md:p-10 relative z-10">
              {step === 1 && (
                <div className="text-center">
                  <h1 className="text-4xl md:text-5xl text-gold-gradient font-display font-black mb-3 tracking-tight drop-shadow-xl">
                    Monopoly Extreme
                  </h1>
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

                  <button
                    onClick={() => {
                      setMode('CREATE');
                      setStep(2);
                    }}
                    className="group relative w-full max-w-sm mx-auto py-4 bg-gradient-to-b from-gold-400 via-gold-500 to-gold-600 text-black font-black uppercase tracking-[0.3em] rounded-sm shadow-[0_5px_20px_rgba(217,154,28,0.15)] hover:shadow-[0_10px_30px_rgba(217,154,28,0.3)] transition-all transform hover:-translate-y-0.5 overflow-hidden text-xs"
                  >
                    <span className="relative z-10">Configura Partita</span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 blur-md"></div>
                  </button>

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
                        Identità <span className="text-gold-gradient">Corporate</span>
                      </h2>
                      <div className="mt-1 text-[10px] uppercase tracking-[0.35em] text-slate-500 font-bold ml-[0.35em]">
                        Configurazione Asset
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-black/40 border border-white/10 px-4 py-2 rounded-lg">
                      <span className="text-2xl font-display text-gold-400">{String(investors).padStart(2, '0')}</span>
                      <span className="text-[8px] uppercase tracking-widest text-slate-600">Players</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {/* Player Setup Card */}
                    <div className="border border-white/5 bg-black/20 rounded-xl p-5 relative overflow-hidden group hover:border-gold-500/20 transition-colors">
                      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                      
                      <div className="flex items-center justify-between mb-4 relative z-10">
                        <div className="text-[9px] uppercase tracking-[0.35em] text-gold-500/70 font-black">
                          Tycoon 1
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-b from-luxury-card to-black border border-gold-500/30 p-2 shadow-inner">
                          <PlayerTokenIcon token={token} className="w-full h-full drop-shadow-lg" />
                        </div>
                      </div>

                      <input
                        type="text"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        placeholder="NOME TYCOON"
                        className="w-full bg-[#050505] border border-white/10 rounded-md p-4 text-white font-display uppercase tracking-wider focus:border-gold-500/50 focus:shadow-[0_0_15px_rgba(217,154,28,0.1)] outline-none transition-all placeholder:text-slate-700 text-sm shadow-[inset_0_2px_5px_rgba(0,0,0,0.5)]"
                      />

                      <div className="mt-4 flex flex-wrap gap-2">
                        {TOKENS.map((t) => (
                          <button
                            key={t}
                            onClick={() => setToken(t)}
                            className={`w-9 h-9 rounded-md border flex items-center justify-center transition-all duration-300 ${
                              token === t
                                ? 'border-gold-500 bg-gold-500/20 text-gold-200 shadow-[0_0_10px_rgba(217,154,28,0.2)]'
                                : 'border-white/5 bg-white/5 text-slate-600 hover:border-gold-500/30 hover:text-gold-200'
                            }`}
                            title={t}
                          >
                            <PlayerTokenIcon token={t} className="w-5 h-5" />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Placeholder Card (Locked) */}
                    <div className="border border-white/5 bg-black/20 rounded-xl p-5 opacity-40 flex flex-col justify-center items-center grayscale relative">
                       <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                       <div className="text-[9px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-2">
                          Next Players
                       </div>
                       <div className="text-xs text-slate-600 font-mono">
                          Auto-configured by AI
                       </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {mode === 'CREATE' ? (
                      <button
                        onClick={handleCreate}
                        disabled={!playerName.trim()}
                        className="w-full py-4 bg-gradient-to-r from-gold-600 via-gold-500 to-gold-400 text-black font-black uppercase tracking-[0.3em] rounded-sm shadow-[0_0_25px_rgba(217,154,28,0.15)] hover:shadow-[0_0_40px_rgba(217,154,28,0.3)] disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5 text-xs relative overflow-hidden group"
                      >
                         <span className="relative z-10">Avvia Simulazione</span>
                         <div className="absolute inset-0 bg-white/30 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 blur-lg"></div>
                      </button>
                    ) : (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={gameId}
                          onChange={(e) => setGameId(e.target.value.toUpperCase())}
                          placeholder="CODICE LOBBY"
                          className="w-full bg-[#050505] border border-white/10 rounded-md p-4 text-center text-gold-400 font-mono uppercase tracking-[0.5em] focus:border-gold-500 outline-none transition-all placeholder:text-slate-800 text-sm shadow-[inset_0_2px_5px_rgba(0,0,0,0.5)]"
                        />
                        <button
                          onClick={handleJoin}
                          disabled={!playerName.trim() || !gameId.trim()}
                          className="w-full py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black uppercase tracking-[0.3em] rounded-sm transition-all text-xs"
                        >
                          Entra nel Board
                        </button>
                      </div>
                    )}

                    <button
                      onClick={() => setStep(1)}
                      className="w-full py-3 text-[10px] uppercase tracking-[0.2em] text-slate-500 hover:text-gold-400 transition-colors"
                    >
                      ← Torna indietro
                    </button>
                  </div>
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

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
    <div className="min-h-screen w-full bg-black flex items-center justify-center p-4 md:p-8 relative overflow-hidden font-sans selection:bg-gold-500 selection:text-black">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#2a1d0a] via-[#050505] to-black"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(217,154,28,0.12),transparent_55%)] pointer-events-none"></div>
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p, idx) => (
          <div
            key={idx}
            className={`absolute rounded-full bg-gold-200/70 ${p.blur}`}
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: p.opacity,
              animation: `fadeIn 2400ms ease-in-out ${p.delay} infinite alternate`,
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-2xl relative z-10">
        <div className="text-center mb-6">
          <div className="text-[10px] uppercase tracking-[0.55em] text-gold-500/55 font-black ml-[0.55em]">
            Business & Luxury Simulator
          </div>
        </div>

        <div className="w-full border border-gold-500/20 bg-black/35 backdrop-blur-xl rounded-2xl shadow-[0_0_150px_rgba(0,0,0,0.9)] overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] pointer-events-none"></div>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-gold-500/50 to-transparent"></div>

          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <div className="text-[9px] font-mono uppercase tracking-[0.45em] text-gold-500/70 ml-[0.45em]">
                Connecting…
              </div>
            </div>
          ) : (
            <div className="p-6 md:p-8">
              {step === 1 && (
                <div className="text-center">
                  <h1 className="text-3xl text-white font-display font-black mb-1">
                    Inizia la Scalata
                  </h1>
                  <div className="text-[9px] uppercase tracking-[0.45em] text-slate-500 font-black mb-6 ml-[0.45em]">
                    Seleziona il numero di investitori
                  </div>

                  <div className="flex flex-wrap justify-center gap-2 mb-8">
                    {INVESTORS.map((n) => {
                      const active = n === investors;
                      return (
                        <button
                          key={n}
                          onClick={() => setInvestors(n)}
                          className={`w-10 h-10 rounded-full border transition-all ${
                            active
                              ? 'bg-gradient-to-b from-gold-400 to-gold-600 border-gold-300 text-black shadow-[0_0_20px_rgba(217,154,28,0.25)]'
                              : 'bg-white/5 border-white/10 text-slate-400 hover:border-gold-500/40 hover:text-gold-200'
                          } font-black text-sm`}
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
                    className="w-full max-w-sm mx-auto py-3 bg-gradient-to-r from-gold-700 via-gold-600 to-gold-500 text-black font-black uppercase tracking-[0.3em] rounded-sm hover:brightness-110 transition-all text-xs"
                  >
                    Configura Partita →
                  </button>

                  <div className="mt-4 text-[8px] uppercase tracking-[0.45em] text-slate-600 font-black ml-[0.45em]">
                    Market Status · Bullish · Secure
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-xl md:text-2xl text-white font-display font-black">
                        Identità Corporate
                      </h2>
                      <div className="mt-1 text-[9px] uppercase tracking-[0.35em] text-slate-500 font-black ml-[0.35em]">
                        Configurazione asset
                      </div>
                    </div>
                    <div className="text-slate-600 font-black text-xs border border-white/10 px-2 py-1 rounded">
                      {String(investors).padStart(2, '0')}
 PL
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                    <div className="border border-white/10 bg-black/30 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-[9px] uppercase tracking-[0.35em] text-slate-400 font-black ml-[0.35em]">
                          Tycoon 1
                        </div>
                        <div className="w-8 h-8 rounded-full bg-black border border-gold-500/30 p-1.5">
                          <PlayerTokenIcon token={token} className="w-full h-full" />
                        </div>
                      </div>

                      <input
                        type="text"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        placeholder="NOME TYCOON"
                        className="w-full bg-white/5 border border-white/10 rounded-sm p-3 text-white font-display uppercase tracking-wider focus:border-gold-500 outline-none transition-all placeholder:text-slate-700 text-sm"
                      />

                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {TOKENS.map((t) => (
                          <button
                            key={t}
                            onClick={() => setToken(t)}
                            className={`w-8 h-8 rounded-sm border flex items-center justify-center transition-all ${
                              token === t
                                ? 'border-gold-500/70 bg-gold-500/10'
                                : 'border-white/10 bg-white/5 hover:border-gold-500/40'
                            }`}
                            title={t}
                          >
                            <PlayerTokenIcon token={t} className="w-5 h-5" />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="border border-white/10 bg-black/30 rounded-lg p-4 opacity-70 flex flex-col justify-center">
                      <div className="text-center">
                         <div className="text-[9px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-2">
                           Lobby Multiplayer
                         </div>
                         <button
                           onClick={() => setMode('JOIN')}
                           className="w-full py-2 border border-white/10 text-slate-300 font-bold uppercase tracking-[0.1em] rounded-sm hover:bg-white/5 hover:text-white transition-all text-[10px]"
                         >
                           Inserisci Codice
                         </button>
                      </div>
                    </div>
                  </div>

                  {mode === 'JOIN' && (
                    <div className="border border-white/10 bg-black/25 rounded-lg p-4 mb-6">
                      <div className="text-[9px] uppercase tracking-[0.35em] text-slate-400 font-black ml-[0.35em] mb-2">
                        Codice Lobby
                      </div>
                      <input
                        type="text"
                        value={gameId}
                        onChange={(e) => setGameId(e.target.value.toUpperCase())}
                        placeholder="CODICE"
                        className="w-full bg-white/5 border border-white/10 rounded-sm p-3 text-center text-gold-500 font-mono text-lg uppercase tracking-widest focus:border-gold-500 outline-none transition-all placeholder:text-slate-800"
                      />
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setMode('CREATE');
                        setStep(1);
                      }}
                      className="flex-1 py-3 border border-white/10 text-slate-400 text-[10px] uppercase tracking-wider rounded-sm hover:bg-white/5"
                    >
                      Indietro
                    </button>
                    <button
                      onClick={() => {
                        if (mode === 'JOIN') handleJoin();
                        else handleCreate();
                      }}
                      disabled={mode === 'JOIN' ? !playerName.trim() || !gameId.trim() : !playerName.trim()}
                      className="flex-[2] py-3 bg-white text-black text-xs font-black uppercase tracking-widest rounded-sm hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Lancia Partita
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;

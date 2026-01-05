
import * as React from 'react';
import { useState } from 'react';
import { PlayerToken } from '../types';
import { PlayerTokenIcon } from './Icons';
import { audioService } from '../services/audioService';

interface HomeProps {
  onCreateGame: (playerName: string) => void;
  onJoinGame: (gameId: string, playerName: string) => void;
  isLoading?: boolean;
}

const Home: React.FC<HomeProps> = ({ onCreateGame, onJoinGame, isLoading }) => {
  const [playerName, setPlayerName] = useState('');
  const [gameId, setGameId] = useState('');
  const [mode, setMode] = useState<'MENU' | 'CREATE' | 'JOIN'>('MENU');

  const handleCreate = () => {
    if (!playerName.trim()) return;
    audioService.playPurchase();
    onCreateGame(playerName);
  };

  const handleJoin = () => {
    if (!playerName.trim() || !gameId.trim()) return;
    audioService.playPurchase();
    onJoinGame(gameId, playerName);
  };

  return (
    <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-gold-500 selection:text-black">
      
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#2a1d0a] via-[#050505] to-black z-0"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] opacity-30 pointer-events-none z-0 mix-blend-overlay"></div>
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gold-500/5 rounded-full blur-[150px] pointer-events-none animate-pulse" style={{animationDuration: '10s'}}></div>

      <div className="z-10 w-full max-w-xl flex flex-col items-center justify-center relative">
        
        {/* Logo */}
        <div className="relative group mb-12 animate-slide-up">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-radial-gradient from-gold-500/20 to-transparent blur-[60px] rounded-full pointer-events-none"></div>
             <img 
               src="/assets/monopoly_extreme_logo.png" 
               alt="Monopoly Extreme Edition" 
               className="relative w-[400px] max-w-full h-auto object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
               onError={(e) => { e.currentTarget.style.display = 'none'; }}
             />
             <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <span className="text-[10px] md:text-xs font-black tracking-[0.6em] text-gold-500 uppercase drop-shadow-md">
                    Online Multiplayer
                </span>
             </div>
        </div>

        {/* Main Card */}
        <div className="w-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_0_100px_rgba(0,0,0,0.9)] animate-fade-in relative overflow-hidden ring-1 ring-gold-500/20 p-8">
           <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold-500/50 to-transparent"></div>

           {isLoading ? (
             <div className="flex flex-col items-center justify-center py-12">
               <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mb-4"></div>
               <p className="text-gold-500 font-mono text-xs uppercase tracking-widest">Connecting to Server...</p>
             </div>
           ) : (
             <>
               {mode === 'MENU' && (
                 <div className="space-y-4">
                   <div className="mb-6">
                     <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-2 font-bold">Identità Tycoon</label>
                     <input 
                       type="text" 
                       value={playerName}
                       onChange={(e) => setPlayerName(e.target.value)}
                       placeholder="Inserisci il tuo nome"
                       className="w-full bg-white/5 border border-white/10 rounded-sm p-4 text-white font-display uppercase tracking-wider focus:border-gold-500 outline-none transition-all placeholder:text-slate-700"
                     />
                   </div>
                   
                   <button 
                     onClick={() => { if(playerName) setMode('CREATE'); }}
                     disabled={!playerName}
                     className="w-full py-4 bg-gradient-to-r from-gold-600 via-gold-500 to-amber-600 text-black font-black uppercase tracking-[0.2em] rounded-sm disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 transition-all"
                   >
                     Crea Nuova Partita
                   </button>
                   
                   <button 
                     onClick={() => { if(playerName) setMode('JOIN'); }}
                     disabled={!playerName}
                     className="w-full py-4 border border-white/10 text-slate-300 font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-white/5 hover:text-white transition-all text-xs"
                   >
                     Unisciti a Partita
                   </button>
                 </div>
               )}

               {mode === 'CREATE' && (
                  <div className="space-y-6 text-center">
                    <h3 className="text-xl text-white font-display font-bold">Creazione Lobby</h3>
                    <p className="text-slate-400 text-xs">Stai per fondare un nuovo impero finanziario.</p>
                    
                    <div className="flex gap-4">
                      <button onClick={() => setMode('MENU')} className="flex-1 py-3 border border-white/10 text-slate-400 text-xs uppercase tracking-wider rounded-sm hover:bg-white/5">Indietro</button>
                      <button onClick={handleCreate} className="flex-1 py-3 bg-gold-500 text-black text-xs font-black uppercase tracking-wider rounded-sm hover:bg-gold-400">Conferma</button>
                    </div>
                  </div>
               )}

               {mode === 'JOIN' && (
                 <div className="space-y-4">
                    <h3 className="text-xl text-white font-display font-bold text-center mb-6">Inserisci Codice Accesso</h3>
                    
                    <input 
                       type="text" 
                       value={gameId}
                       onChange={(e) => setGameId(e.target.value.toUpperCase())}
                       placeholder="CODICE LOBBY (ES. AB12CD)"
                       className="w-full bg-white/5 border border-white/10 rounded-sm p-4 text-center text-gold-500 font-mono text-xl uppercase tracking-widest focus:border-gold-500 outline-none transition-all placeholder:text-slate-800"
                     />

                    <div className="flex gap-4 mt-6">
                      <button onClick={() => setMode('MENU')} className="flex-1 py-3 border border-white/10 text-slate-400 text-xs uppercase tracking-wider rounded-sm hover:bg-white/5">Indietro</button>
                      <button onClick={handleJoin} disabled={!gameId} className="flex-1 py-3 bg-white text-black text-xs font-black uppercase tracking-wider rounded-sm hover:bg-gray-200 disabled:opacity-50">Entra</button>
                    </div>
                 </div>
               )}
             </>
           )}
        </div>
      </div>
    </div>
  );
};

export default Home;

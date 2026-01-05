
import React, { useEffect, useState, useRef } from 'react';
import { Player, Tile } from '../types';
import { PlayerTokenIcon } from './Icons';
import { audioService } from '../services/audioService';

interface AuctionModalProps {
  property: Tile;
  currentBid: number;
  highestBidderId: number | null;
  activeBidders: Player[];
  allPlayers: Player[];
  myPlayerId: number;
  onBid: (playerId: number, amount: number) => void;
  onFold: (playerId: number) => void;
}

const AuctionModal: React.FC<AuctionModalProps> = ({ 
  property, 
  currentBid, 
  highestBidderId, 
  activeBidders, 
  allPlayers,
  myPlayerId,
  onBid, 
  onFold
}) => {
  const [lastBidderId, setLastBidderId] = useState<number | null>(null);
  // Time is now managed loosely on client for display, but server is authoritative
  const [timeLeft, setTimeLeft] = useState(10); 
  
  // Reset timer on new bid (visual only)
  useEffect(() => {
    if (currentBid > 0) {
        setTimeLeft(10);
        if (highestBidderId !== lastBidderId) {
            setLastBidderId(highestBidderId);
        }
    }
  }, [currentBid, highestBidderId, lastBidderId]);

  // Visual Countdown
  useEffect(() => {
    if (activeBidders.length <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeBidders.length, currentBid]);

  const getPlayerName = (id: number) => allPlayers.find(p => p.id === id)?.name || 'Unknown';
  const getPlayerToken = (id: number) => allPlayers.find(p => p.id === id)?.token;

  const progressPercentage = (timeLeft / 10) * 100;
  const isUrgent = timeLeft <= 3;

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4">
      <div className="w-full max-w-4xl h-[85vh] flex flex-col md:flex-row bg-[#050505] border border-gold-500/30 rounded-lg shadow-[0_0_150px_rgba(217,154,28,0.15)] overflow-hidden animate-slide-up relative">
        
        {/* Timer Bar Overlay at Top */}
        <div className="absolute top-0 left-0 w-full h-2 bg-slate-800 z-50">
             <div 
                className={`h-full transition-all duration-1000 ease-linear ${isUrgent ? 'bg-red-500 shadow-[0_0_20px_#ef4444]' : 'bg-gold-500 shadow-[0_0_10px_#eab308]'}`}
                style={{ width: `${progressPercentage}%` }}
             ></div>
        </div>

        {/* Left Side: Asset Display */}
        <div className="w-full md:w-1/3 relative border-b md:border-b-0 md:border-r border-white/10 bg-gradient-to-b from-slate-900 to-black p-8 flex flex-col items-center justify-center text-center">
            {/* Background color glow matching property */}
            {property.color && (
                <div className="absolute top-0 w-full h-full z-0 opacity-10 pointer-events-none" style={{ background: `radial-gradient(circle at top left, ${property.color}, transparent 70%)` }}></div>
            )}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
            
            <div className="mb-6 relative z-10">
                 <div className="w-32 h-32 rounded-full border-4 border-gold-500/30 flex items-center justify-center bg-white/5 shadow-[0_0_50px_rgba(217,154,28,0.2)]">
                     {property.customStyle?.icon ? (
                         <span className="text-6xl filter drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">{property.customStyle.icon}</span>
                     ) : (
                         <span className="text-6xl">🏛️</span>
                     )}
                 </div>
                 <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gold-500 text-black text-[9px] font-black uppercase px-3 py-1 rounded-full whitespace-nowrap shadow-lg">
                    {timeLeft > 0 ? `Chiude in ${timeLeft}s` : 'ASTA CHIUSA'}
                 </div>
            </div>

            <h2 className="text-2xl font-display font-black text-white uppercase tracking-tighter mb-2 relative z-10">{property.name}</h2>
            <div className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mb-6 relative z-10">Valore Base: ${property.price}M</div>

            <div className={`w-full bg-white/5 rounded-sm p-4 border transition-colors duration-300 relative z-10 ${isUrgent ? 'border-red-500/50 bg-red-900/10' : 'border-white/5'}`}>
                <div className="text-[9px] text-slate-400 uppercase font-bold mb-1">Offerta Attuale</div>
                <div className={`text-4xl font-mono font-black animate-pulse tracking-tight ${isUrgent ? 'text-red-500' : 'text-gold-400'}`}>
                    ${currentBid}M
                </div>
            </div>
            
            {highestBidderId !== null && (
                <div className="mt-6 flex flex-col items-center animate-fade-in relative z-10">
                    <span className="text-[9px] text-emerald-500 uppercase font-black tracking-widest mb-2">Miglior Offerente</span>
                    <div className="flex items-center gap-3 px-4 py-2 bg-emerald-900/20 border border-emerald-500/30 rounded-full">
                         <div className="w-6 h-6">
                            {getPlayerToken(highestBidderId) && <PlayerTokenIcon token={getPlayerToken(highestBidderId)!} className="w-full h-full" />}
                         </div>
                         <span className="text-xs font-bold text-white">{getPlayerName(highestBidderId)}</span>
                    </div>
                </div>
            )}
        </div>

        {/* Right Side: Bidding Floor */}
        <div className="flex-1 p-8 flex flex-col relative">
             <header className="mb-6 flex justify-between items-end border-b border-white/10 pb-4">
                 <div>
                    <h3 className="text-xl font-bold text-white uppercase tracking-[0.2em]">Sala Aste Live</h3>
                    <p className="text-[10px] text-slate-500 mt-1">L'asta termina quando il timer raggiunge lo zero.</p>
                 </div>
                 <span className={`text-[10px] animate-pulse font-black uppercase ${isUrgent ? 'text-red-500' : 'text-emerald-500'}`}>
                    ● {timeLeft}s Rimanenti
                 </span>
             </header>

             <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4 content-start custom-scrollbar">
                 {activeBidders.map(player => {
                     const isWinning = player.id === highestBidderId;
                     const isMe = player.id === myPlayerId;
                     const canBid = isMe && player.money > currentBid;

                     return (
                         <div key={player.id} className={`p-4 rounded-sm border transition-all relative group ${isWinning ? 'bg-emerald-900/10 border-emerald-500/50' : isMe ? 'bg-gold-900/10 border-gold-500/30' : 'bg-white/5 border-white/10'}`}>
                             <div className="flex justify-between items-start mb-4">
                                 <div className="flex items-center gap-3">
                                     <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center p-2 border border-white/10">
                                        <PlayerTokenIcon token={player.token} className="w-full h-full" />
                                     </div>
                                     <div>
                                         <div className="text-xs font-black text-white uppercase tracking-wider">
                                            {player.name} {isMe && <span className="text-gold-500">(TU)</span>}
                                         </div>
                                         <div className="text-[10px] font-mono text-slate-400 font-bold">${player.money}M Liquidità</div>
                                     </div>
                                 </div>
                                 {isWinning && <span className="text-2xl animate-bounce">👑</span>}
                             </div>

                             {isMe ? (
                                 <>
                                     <div className="grid grid-cols-2 gap-2">
                                         <button
                                             onClick={() => onBid(player.id, 10)}
                                             disabled={!canBid}
                                             className="bg-gold-600 hover:bg-gold-500 disabled:opacity-20 disabled:cursor-not-allowed text-black text-[9px] font-black uppercase py-2 rounded-sm transition-all flex items-center justify-center gap-1 hover:shadow-[0_0_15px_rgba(217,154,28,0.4)] active:scale-95"
                                         >
                                             Bid +$10M
                                         </button>
                                         <button
                                             onClick={() => onBid(player.id, 50)}
                                             disabled={!canBid || player.money < currentBid + 50}
                                             className="bg-amber-700 hover:bg-amber-600 disabled:opacity-20 disabled:cursor-not-allowed text-white text-[9px] font-black uppercase py-2 rounded-sm transition-all active:scale-95"
                                         >
                                             +$50M
                                         </button>
                                     </div>
                                     <button
                                         onClick={() => onFold(player.id)}
                                         className="w-full mt-2 border border-red-900/50 text-red-500 hover:bg-red-900/20 text-[9px] font-black uppercase py-1.5 rounded-sm transition-all hover:text-red-400"
                                     >
                                         RITIRATI (FOLD)
                                     </button>
                                 </>
                             ) : (
                                 <div className="text-center py-2 bg-black/20 rounded border border-white/5">
                                     <span className="text-[9px] text-slate-500 uppercase tracking-widest animate-pulse">
                                         Sta pensando...
                                     </span>
                                 </div>
                             )}
                         </div>
                     );
                 })}
                 
                 {allPlayers.filter(p => !activeBidders.find(b => b.id === p.id)).map(foldedPlayer => (
                     <div key={foldedPlayer.id} className="p-4 rounded-sm border border-white/5 bg-black opacity-30 grayscale flex items-center justify-between pointer-events-none">
                         <div className="flex items-center gap-3">
                            <span className="text-xl">❌</span>
                            <span className="text-xs font-bold text-slate-500 uppercase decoration-line-through">{foldedPlayer.name}</span>
                         </div>
                         <span className="text-[9px] text-red-800 font-black uppercase">RITIRATO</span>
                     </div>
                 ))}
             </div>
             
             {activeBidders.length === 0 && (
                 <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20 backdrop-blur-sm">
                     <div className="text-red-500 font-black uppercase tracking-widest text-xl animate-pulse">Asta Deserta</div>
                 </div>
             )}
        </div>
      </div>
    </div>
  );
};

export default AuctionModal;

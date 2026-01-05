
import React from 'react';
import { TransferInfo } from '../types';
import { PlayerTokenIcon } from './Icons';

interface TransferEffectProps {
  transfer: TransferInfo;
}

const TransferEffect: React.FC<TransferEffectProps> = ({ transfer }) => {
  const isBank = transfer.toPlayer === null;

  return (
    <div className="fixed inset-0 z-[300] pointer-events-none flex items-center justify-center">
      {/* Reduced blur and opacity to ensure board highlight is visible behind */}
      <div className="flex flex-col items-center animate-slide-up bg-black/60 backdrop-blur-md p-10 rounded-2xl border border-gold-500/40 shadow-[0_0_120px_rgba(217,154,28,0.3)]">
        <div className="flex items-center gap-14">
          {/* Payer */}
          <div className="flex flex-col items-center relative z-10 group">
            <div className="w-24 h-24 rounded-full bg-red-950/30 border-2 border-red-500/60 flex items-center justify-center shadow-[0_0_40px_rgba(239,68,68,0.3)] p-6 transition-transform hover:scale-105">
              <PlayerTokenIcon token={transfer.fromPlayer.token} className="w-full h-full animate-pulse" color="#ef4444" />
            </div>
            <div className="mt-3 flex flex-col items-center">
                <span className="text-[10px] text-red-400 font-bold uppercase tracking-widest bg-black/60 px-2 rounded-full border border-red-900/50">{transfer.fromPlayer.name}</span>
                <span className="text-xl text-red-500 font-mono font-black animate-pulse">-${transfer.amount}M</span>
            </div>
          </div>

          {/* Arrow & Visual Flow */}
          <div className="relative flex items-center justify-center w-56 h-20">
            {/* Background Stream Line */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-800/50 rounded-full overflow-hidden -translate-y-1/2">
                <div className="h-full w-full bg-gradient-to-r from-red-600 via-gold-500 to-emerald-500 animate-gradient-x opacity-60"></div>
            </div>
            
            {/* Flying Particles - Dense Stream */}
            <div className="absolute inset-0 flex items-center justify-start overflow-visible pointer-events-none">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div 
                        key={i} 
                        className="absolute text-xl animate-cash-stream" 
                        style={{ 
                            animationDelay: `${i * 0.15}s`,
                            top: '50%',
                            left: '0%',
                            marginTop: '-12px'
                        }}
                    >
                        {i % 2 === 0 ? '💸' : '🪙'}
                    </div>
                ))}
            </div>

            {/* Label */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-black text-gold-500 tracking-[0.4em] uppercase whitespace-nowrap bg-black/90 px-4 py-1 border border-gold-900/30 rounded-full shadow-lg z-20">
              {transfer.label}
            </div>
          </div>

          {/* Receiver (Player or Bank) */}
          <div className="flex flex-col items-center relative z-10">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.3)] border-2 transition-transform hover:scale-105 ${
                isBank ? 'bg-slate-900 border-slate-500' : 'bg-emerald-950/30 border-emerald-500/60 p-6'
            }`}>
              {isBank ? (
                  <span className="text-5xl drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] animate-bounce" style={{ animationDuration: '2s' }}>🏦</span>
              ) : (
                  <div className="w-full h-full animate-bounce" style={{ animationDuration: '2s' }}>
                    <PlayerTokenIcon token={transfer.toPlayer!.token} className="w-full h-full" color="#10b981" />
                  </div>
              )}
            </div>
            <div className="mt-3 flex flex-col items-center">
                <span className={`text-[10px] font-bold uppercase tracking-widest bg-black/60 px-2 rounded-full border border-white/10 ${isBank ? 'text-slate-400' : 'text-emerald-400'}`}>
                    {isBank ? 'BANCA CENTRALE' : transfer.toPlayer?.name}
                </span>
                <span className={`text-xl font-mono font-black animate-pulse ${isBank ? 'text-slate-500' : 'text-emerald-500'}`}>
                    +${transfer.amount}M
                </span>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes cash-stream {
          0% { transform: translateX(0) scale(0.5) rotate(0deg); opacity: 0; }
          10% { opacity: 1; transform: translateX(20px) scale(1) rotate(45deg); }
          90% { opacity: 1; transform: translateX(200px) scale(1) rotate(180deg); }
          100% { transform: translateX(220px) scale(0.5) rotate(220deg); opacity: 0; }
        }
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        .animate-cash-stream {
          animation: cash-stream 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .animate-gradient-x {
           background-size: 200% 200%;
           animation: gradient-x 1.5s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default TransferEffect;

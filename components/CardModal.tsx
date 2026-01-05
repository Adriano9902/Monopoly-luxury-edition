
import React, { useEffect, useState } from 'react';
import { Card } from '../types';

interface CardModalProps {
  card: Card;
  onConfirm: () => void;
}

const CardModal: React.FC<CardModalProps> = ({ card, onConfirm }) => {
  const [isDrawn, setIsDrawn] = useState(false);

  useEffect(() => {
    // Trigger the draw animation
    const timer = setTimeout(() => setIsDrawn(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const getTypeConfig = () => {
    switch(card.type) {
      case 'CHANCE': return { 
        label: 'IMPREVISTI', 
        color: 'text-orange-400', 
        border: 'border-orange-500', 
        bg: 'from-orange-950 via-stone-900 to-black',
        startX: '-40%', startY: '-40%', startRot: '-15deg'
      };
      case 'COMMUNITY': return { 
        label: 'PROBABILITÀ', 
        color: 'text-blue-400', 
        border: 'border-blue-500', 
        bg: 'from-blue-950 via-slate-900 to-black',
        startX: '40%', startY: '-40%', startRot: '15deg'
      };
      case 'TRUFFA': return { 
        label: 'OPERAZIONE TRUFFA', 
        color: 'text-purple-400', 
        border: 'border-purple-600 shadow-[0_0_20px_rgba(147,51,234,0.5)]', 
        bg: 'from-purple-950 via-black to-slate-950',
        startX: '-40%', startY: '40%', startRot: '-10deg'
      };
      case 'MEGA_RICCHEZZE': return { 
        label: 'MEGA RICCHEZZE', 
        color: 'text-gold-400', 
        border: 'border-gold-500 shadow-[0_0_30px_rgba(217,154,28,0.5)]', 
        bg: 'from-gold-800 via-gold-950 to-black',
        startX: '40%', startY: '40%', startRot: '10deg'
      };
      default: return { 
        label: 'INFO', color: 'text-slate-400', border: 'border-slate-500', bg: 'from-slate-800 to-black',
        startX: '0%', startY: '0%', startRot: '0deg'
      };
    }
  };

  const config = getTypeConfig();

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80 backdrop-blur-xl p-6">
      <div 
        className={`relative w-full max-w-[320px] aspect-[2/3] transition-all duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isDrawn ? 'opacity-100 scale-100 translate-x-0 translate-y-0 rotate-0' : 'opacity-0 scale-50'}`}
        style={{
            transform: !isDrawn ? `translate(${config.startX}, ${config.startY}) rotate(${config.startRot}) scale(0.2)` : undefined
        }}
      >
        {/* PHYSICAL CARD EFFECT */}
        <div className={`w-full h-full rounded-2xl border-[3px] p-1.5 shadow-[0_30px_60px_rgba(0,0,0,1)] ${config.border} bg-gradient-to-b ${config.bg} preserve-3d`}>
          <div className="w-full h-full rounded-xl border border-white/10 flex flex-col p-8 text-center relative overflow-hidden bg-black/20">
            {/* Texture overlay */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none"></div>
            
            {/* Holographic pulse for Truffa/Richness */}
            {(card.type === 'TRUFFA' || card.type === 'MEGA_RICCHEZZE') && (
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent animate-[glow_3s_infinite] pointer-events-none"></div>
            )}
            
            <header className="mb-8">
              <div className={`text-[9px] font-black tracking-[0.5em] uppercase mb-2 ${config.color}`}>
                {config.label}
              </div>
              <div className="h-px w-16 mx-auto bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
            </header>

            <main className="flex-1 flex flex-col justify-center gap-6">
              <h2 className="text-2xl font-display font-black text-white leading-tight uppercase tracking-tight shadow-black drop-shadow-md">
                {card.title}
              </h2>
              <div className="h-0.5 w-8 mx-auto bg-gold-500/30"></div>
              <p className="text-xs text-slate-300 leading-relaxed font-medium italic opacity-80 px-2">
                "{card.description}"
              </p>
            </main>

            <footer className="mt-8 space-y-6 relative z-10">
               <div className={`text-3xl font-mono font-black tracking-tighter ${card.value && card.value > 0 ? 'text-emerald-400' : 'text-rose-500'} drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]`}>
                 {card.actionType === 'MONEY' && card.value && card.value !== -1 && (
                    <span>{card.value > 0 ? '+' : ''}${Math.abs(card.value)}M</span>
                 )}
                 {card.actionType === 'STEAL_MONEY' && <span className="text-xl">LIQUIDAZIONE</span>}
                 {card.actionType === 'TAX_IMMUNITY' && <span className="text-xl">DIPLOMACY</span>}
                 {card.actionType === 'STEAL_PROPERTY' && <span className="text-xl">ESPROPRIO</span>}
                 {card.actionType === 'MOVE' && <span className="text-xl">TRANSFER</span>}
                 {card.actionType === 'JAIL' && <span className="text-xl">SENTENCE</span>}
               </div>

               <button 
                onClick={onConfirm}
                className={`w-full py-4 rounded-sm font-black uppercase tracking-[0.4em] text-[10px] transition-all transform hover:-translate-y-1 active:scale-95 shadow-2xl ${
                  card.type === 'MEGA_RICCHEZZE' 
                    ? 'bg-gradient-to-r from-gold-600 to-gold-400 text-black shadow-gold-500/20' 
                    : card.type === 'TRUFFA'
                    ? 'bg-gradient-to-r from-purple-800 to-purple-600 text-white shadow-purple-500/20'
                    : 'bg-white text-black hover:bg-slate-200'
                }`}
               >
                 Esegui Ordine
               </button>
            </footer>

            {/* Corner Embellishments */}
            <div className={`absolute top-2 left-2 w-4 h-4 border-t border-l opacity-30 ${config.color.replace('text-', 'border-')}`}></div>
            <div className={`absolute bottom-2 right-2 w-4 h-4 border-b border-r opacity-30 ${config.color.replace('text-', 'border-')}`}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardModal;

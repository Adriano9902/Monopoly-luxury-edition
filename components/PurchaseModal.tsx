
import React, { useEffect } from 'react';
import { Tile, Player } from '../types';
import { IconDiamond, PlayerTokenIcon } from './Icons';

interface PurchaseModalProps {
  tile: Tile;
  player: Player;
  onBuy: () => void;
  onAuction: () => void;
  onPass: () => void;
  onClose: () => void;
  priceDiscounted?: number; // Optional discounted price (e.g. Business dice)
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({ tile, player, onBuy, onAuction, onPass, onClose, priceDiscounted }) => {
  const finalPrice = priceDiscounted || tile.price || 0;
  const canAfford = player.money >= finalPrice;
  const rentBase = tile.rent ? tile.rent[0] : Math.floor((tile.price || 100) * 0.1);

  // Auto-close handler just in case
  useEffect(() => {
     // If player lost money while modal open, or tile owner changed, close it
     if (tile.ownerId !== null && tile.ownerId !== undefined && tile.ownerId !== player.id) {
         onClose();
     }
  }, [tile.ownerId, player.id, onClose]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-[#0a0a0a] border border-gold-500/50 rounded-lg shadow-[0_0_100px_rgba(217,154,28,0.2)] overflow-hidden flex flex-col animate-slide-up">
        
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] opacity-20 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-[80px] pointer-events-none"></div>

        {/* Header: Property Identity */}
        <div className="relative h-24 bg-gradient-to-r from-black via-slate-900 to-black border-b border-white/10 flex items-center justify-between px-6 z-10 overflow-hidden">
             {tile.color && (
                 <div 
                    className="absolute inset-0 opacity-30" 
                    style={{ background: `linear-gradient(90deg, ${tile.color} 0%, transparent 100%)` }}
                 ></div>
             )}
             <div>
                 <div className="text-[10px] text-gold-500 font-black uppercase tracking-[0.3em] mb-1">Opportunità di Investimento</div>
                 <h2 className="text-2xl md:text-3xl font-display font-black text-white uppercase tracking-tighter shadow-black drop-shadow-lg relative z-10">
                    {tile.name}
                 </h2>
             </div>
             {tile.customStyle?.icon ? (
                 <div className="text-4xl filter drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">{tile.customStyle.icon}</div>
             ) : (
                <div className="w-12 h-12 rounded-full border border-gold-500/25 bg-black/40 flex items-center justify-center">
                    <IconDiamond className="w-6 h-6" />
                </div>
             )}
        </div>

        {/* Body: Financial Data */}
        <div className="p-8 space-y-8 relative z-10">
            
            <div className="flex justify-between items-center bg-white/5 p-4 rounded-sm border border-white/5">
                <div className="flex flex-col">
                    <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-1">Prezzo di Mercato</span>
                    <div className="flex items-baseline gap-2">
                        {priceDiscounted && priceDiscounted < (tile.price || 0) && (
                            <span className="text-sm text-slate-500 line-through decoration-red-500">${tile.price}M</span>
                        )}
                        <span className="text-4xl font-mono font-black text-white">${finalPrice}M</span>
                    </div>
                </div>
                {priceDiscounted && (
                    <div className="px-2 py-1 bg-finance-500/10 border border-gold-500/35 rounded-sm text-[9px] text-gold-200 font-black uppercase tracking-widest animate-pulse">
                        Sconto Business
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/40 p-3 rounded-sm border border-white/5">
                    <span className="block text-[8px] text-slate-500 uppercase font-bold mb-1">Rendita Stimata (Base)</span>
                    <span className="block text-xl font-mono text-gold-400 font-bold">${rentBase}M</span>
                </div>
                <div className="bg-black/40 p-3 rounded-sm border border-white/5">
                    <span className="block text-[8px] text-slate-500 uppercase font-bold mb-1">Saldo Attuale</span>
                    <span className={`block text-xl font-mono font-bold ${canAfford ? 'text-gold-300' : 'text-danger-500'}`}>${player.money}M</span>
                </div>
            </div>
            
            {!canAfford && (
                <div className="text-center p-2 bg-danger-500/10 border border-danger-500/35 rounded-sm">
                    <p className="text-[10px] text-danger-500 uppercase font-black tracking-widest">Liquidità Insufficiente</p>
                </div>
            )}
        </div>

        {/* Footer: Actions */}
        <div className="p-6 bg-black/60 border-t border-white/10 flex flex-col gap-3 backdrop-blur-md z-20">
            <div className="flex gap-3">
                <button
                    onClick={onBuy}
                    disabled={!canAfford}
                    className="flex-1 h-14 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 disabled:opacity-20 disabled:cursor-not-allowed text-black text-xs font-black uppercase tracking-widest rounded-sm transition-all hover:shadow-[0_0_22px_rgba(212,175,55,0.30)] active:scale-95 flex items-center justify-center gap-2"
                >
                    <span>ACQUISTA</span>
                    <span className="text-[10px] opacity-60">($ {finalPrice}M)</span>
                </button>
                <button
                    onClick={onAuction}
                    className="flex-1 h-14 bg-black/55 hover:bg-black/70 text-gold-200 text-xs font-black uppercase tracking-widest rounded-sm transition-all border border-gold-500/30 hover:border-gold-500/55 hover:shadow-[0_0_18px_rgba(212,175,55,0.18)] active:scale-95 flex items-center justify-center gap-2"
                >
                    <span>ASTA</span>
                    <span className="text-[10px] opacity-60">(DA $10M)</span>
                </button>
            </div>
            <button
                onClick={onPass}
                className="w-full h-12 border border-white/10 hover:bg-white/5 text-slate-400 hover:text-white text-[10px] font-bold uppercase tracking-widest rounded-sm transition-all"
            >
                NON INTERESSATO (PASSA)
            </button>
        </div>

        {/* Close X */}
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-white/20 transition-all z-50"
        >
            ✕
        </button>
      </div>
    </div>
  );
};

export default PurchaseModal;

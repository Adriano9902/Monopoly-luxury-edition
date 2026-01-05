
import React, { useMemo } from 'react';
import { Tile, TileType, Player } from '../types';
import { PlayerTokenIcon } from './Icons';

interface PropertyDeedProps {
  tile: Tile;
  owner?: Player | null;
  onClose: () => void;
}

const PropertyDeed: React.FC<PropertyDeedProps> = ({ tile, owner, onClose }) => {
  const isProperty = tile.type === TileType.PROPERTY || tile.type === TileType.TECH_HUB || tile.type === TileType.OIL_COMPANY || tile.type === TileType.CRYPTO_EXCHANGE;
  
  // Genera dati simulati per il trend di prezzo
  const trendData = useMemo(() => {
    return Array.from({ length: 8 }, () => Math.floor(Math.random() * 40) + 60);
  }, [tile.id]);

  const defaultRent = tile.price ? Math.floor(tile.price * 0.1) : 10;
  const rents = tile.rent || [
    defaultRent,
    defaultRent * 5,
    defaultRent * 15,
    defaultRent * 45,
    defaultRent * 80,
    defaultRent * 125
  ];

  const upgradeCost = tile.price ? Math.floor(tile.price * 0.5) : 50;

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/90 backdrop-blur-md p-4" onClick={onClose}>
      <div 
        className="w-full max-sm bg-[#0a0a0a] border border-gold-500/30 rounded-sm shadow-[0_0_80px_rgba(0,0,0,1)] overflow-hidden animate-slide-up flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header - Property Color */}
        <div className="h-2 relative overflow-hidden">
          <div 
            className="absolute inset-0 opacity-80"
            style={{ backgroundColor: tile.color || '#333' }}
          ></div>
        </div>

        <div className="p-6 flex-1 space-y-6 overflow-y-auto custom-scrollbar">
          {/* Title Section */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-display font-black text-white uppercase tracking-tighter leading-none mb-1">
                {tile.name}
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-gold-500 uppercase tracking-widest bg-gold-500/10 px-1">
                  Asset ID: {tile.id.toString().padStart(3, '0')}
                </span>
                <span className="text-[10px] font-mono text-slate-500 uppercase">
                  {tile.type.replace('_', ' ')}
                </span>
              </div>
            </div>
            <div className="text-right">
               <div className="text-xl font-mono font-bold text-white">${tile.price || '---'}M</div>
               <div className="text-[8px] text-slate-500 uppercase font-bold">Valutazione Attuale</div>
            </div>
          </div>

          {/* Simulated Chart Section */}
          <div className="bg-black/40 border border-white/5 p-3 rounded-sm space-y-2">
            <div className="flex justify-between items-center text-[9px] font-bold uppercase text-slate-400">
              <span>Trend Trimestrale</span>
              <span className="text-emerald-500">+12.4% Volatilità</span>
            </div>
            <div className="h-16 flex items-end gap-1 px-1">
              {trendData.map((val, i) => (
                <div 
                  key={i} 
                  className="flex-1 bg-gradient-to-t from-gold-900 to-gold-400 opacity-60 hover:opacity-100 transition-opacity rounded-t-sm" 
                  style={{ height: `${val}%` }}
                ></div>
              ))}
            </div>
          </div>

          {/* Financial Breakdown */}
          {isProperty ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/5 p-3 border border-white/5">
                  <div className="text-[8px] text-slate-500 uppercase font-bold mb-1">Affitto Base</div>
                  <div className="text-lg font-mono font-bold text-white">${rents[0]}M</div>
                </div>
                <div className="bg-white/5 p-3 border border-white/5">
                  <div className="text-[8px] text-slate-500 uppercase font-bold mb-1">Costo Upgrade</div>
                  <div className="text-lg font-mono font-bold text-gold-500">${upgradeCost}M</div>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <span className="w-1 h-1 bg-gold-500 rounded-full"></span> Proiezione Rendite
                </div>
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <div key={lvl} className="flex justify-between items-center text-[10px] border-b border-white/5 pb-1 group hover:bg-white/5 px-1">
                    <span className="text-slate-500 uppercase">{lvl === 5 ? 'Sky-Scraper' : `Livello Building ${lvl}`}</span>
                    <span className={`font-mono font-bold ${lvl === 5 ? 'text-emerald-400' : 'text-white'}`}>${rents[lvl]}M</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-8 text-center bg-white/5 border border-dashed border-white/10 p-4">
              <p className="text-xs font-serif italic text-slate-300">
                "{tile.description || 'Questo asset appartiene a una categoria speciale di infrastrutture globali. La rendita è soggetta a variabili di mercato estreme.'}"
              </p>
            </div>
          )}

          {/* Status Bar */}
          <div className="pt-4 border-t border-white/10 flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-500 uppercase font-bold">Proprietario Attuale</span>
              <span className={`text-xs font-bold uppercase tracking-widest ${owner ? 'text-blue-400' : 'text-emerald-500'}`}>
                {owner ? owner.name : 'LIBERO SUL MERCATO'}
              </span>
            </div>
            {owner && (
              <div className="w-8 h-8 rounded-full border border-blue-500/50 flex items-center justify-center bg-blue-500/10 p-1.5">
                <PlayerTokenIcon token={owner.token} className="w-full h-full" color="#60a5fa" />
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-black border-t border-white/10">
          <button 
            onClick={onClose}
            className="w-full py-4 bg-gradient-to-r from-neutral-800 to-neutral-900 text-white text-[10px] font-bold uppercase tracking-[0.4em] hover:from-gold-800 hover:to-gold-900 transition-all border border-white/10"
          >
            Chiudi Visura Immobiliare
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyDeed;


import React, { useState } from 'react';
import { GameState, Player, Tile, TileType } from '../types';
import { COLORS } from '../constants';
import { PlayerTokenIcon } from './Icons';

interface PortfolioProps {
  player: Player;
  gameState: GameState;
  onClose: () => void;
  onMortgage: (tileId: number) => void;
  onSell: (tileId: number) => void;
  onCustomize: (tileId: number, style: {borderColor?: string, icon?: string}) => void;
}

const CUSTOM_COLORS = [
    { name: 'Neon Pink', hex: '#ec4899' },
    { name: 'Cyber Cyan', hex: '#06b6d4' },
    { name: 'Lime Acid', hex: '#84cc16' },
    { name: 'Royal Purple', hex: '#a855f7' },
    { name: 'Pure Gold', hex: '#eab308' },
    { name: 'Matrix Green', hex: '#10b981' },
    { name: 'Inferno Red', hex: '#ef4444' },
    { name: 'Ice White', hex: '#f8fafc' },
];

const CUSTOM_ICONS = ['🏢', '💎', '🚀', '🎰', '🏛️', '🍸', '🥩', '👑', '🔌', '📡', '🐉', '👁️', '🤖', '🏭', '🛳️', '🌐', '🔋', '🧬'];

const Portfolio: React.FC<PortfolioProps> = ({ player, gameState, onClose, onMortgage, onSell, onCustomize }) => {
  const [customizingTileId, setCustomizingTileId] = useState<number | null>(null);
  const playerProperties = gameState.tiles.filter(t => t.ownerId === player.id);
  const totalAssetValue = playerProperties.reduce((acc, tile) => acc + (tile.price || 0), 0);
  
  // Raccogliamo tutti i colori unici del tabellone per raggruppare gli asset
  const allPropertyColors = Array.from(new Set(gameState.tiles
    .filter(t => t.type === TileType.PROPERTY && t.color)
    .map(t => t.color as string)
  )) as string[];

  const getGroupDetails = (color: string) => {
    const allInGroup = gameState.tiles.filter(t => t.color === color);
    const ownedByPlayer = allInGroup.filter(t => t.ownerId === player.id);
    const isComplete = allInGroup.length === ownedByPlayer.length;
    const progress = (ownedByPlayer.length / allInGroup.length) * 100;
    
    return { allInGroup, ownedByPlayer, isComplete, progress };
  };

  const getTileStatus = (t: Tile) => {
    if (t.ownerId === player.id) return t.mortgaged ? 'MORTGAGED' : 'OWNED';
    if (t.ownerId === null || t.ownerId === undefined) return 'AVAILABLE';
    return 'RIVAL';
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-end bg-black/95 backdrop-blur-2xl p-0 md:p-4 animate-fade-in">
      <div className="w-full max-w-6xl h-full md:h-[95vh] bg-[#020202] border-l md:border border-gold-900/40 shadow-[0_0_150px_rgba(0,0,0,1)] flex flex-col animate-slide-up relative overflow-hidden rounded-l-xl md:rounded-xl">
        
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-20"></div>

        {/* Header Section: Executive Identity */}
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-black/40 z-10 sticky top-0 backdrop-blur-md">
          <div className="flex items-center gap-8">
            <div className="relative group hidden md:block">
              <div className="absolute inset-0 bg-gold-500 rounded-full blur-2xl opacity-10 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative w-20 h-20 flex items-center justify-center bg-[#0a0a0a] rounded-full border-2 border-gold-500/30 p-4 shadow-2xl">
                  <PlayerTokenIcon token={player.token} className="w-full h-full" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-4 mb-2">
                <h2 className="text-white font-display text-3xl md:text-4xl font-black uppercase tracking-widest">{player.name}</h2>
                <div className="px-3 py-1 bg-gold-500 text-black text-[9px] font-black uppercase tracking-[0.2em] rounded-sm shadow-lg">CEO DASHBOARD</div>
              </div>
              <div className="flex gap-8 items-center">
                <div className="flex flex-col">
                  <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">Fondi Disponibili</span>
                  <span className="text-2xl md:text-3xl font-mono text-emerald-400 font-bold leading-none shadow-emerald-500/20 drop-shadow-md">${player.money}M</span>
                </div>
                <div className="w-[1px] h-8 bg-white/10"></div>
                <div className="flex flex-col">
                  <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">Valore Asset</span>
                  <span className="text-2xl md:text-3xl font-mono text-blue-400 font-bold leading-none shadow-blue-500/20 drop-shadow-md">${totalAssetValue}M</span>
                </div>
                <div className="w-[1px] h-8 bg-white/10"></div>
                <div className="flex flex-col">
                  <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">Volume Portfolio</span>
                  <span className="text-2xl md:text-3xl font-mono text-gold-500 font-bold leading-none">{playerProperties.length} Asset</span>
                </div>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-12 h-12 flex items-center justify-center rounded-full border border-white/10 text-slate-500 hover:text-white hover:border-white/50 hover:bg-white/5 transition-all"
          >
            <span className="text-2xl">✕</span>
          </button>
        </div>

        {/* Strategic Dashboard Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-12 custom-scrollbar z-10 relative">
          
          {/* Customization Overlay Modal */}
          {customizingTileId !== null && (
              <div className="absolute inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-fade-in rounded-xl">
                  <div className="w-full max-w-lg bg-[#0a0a0a] border border-gold-500/50 p-8 rounded-lg shadow-[0_0_50px_rgba(217,154,28,0.2)] animate-slide-up relative">
                      <button 
                        onClick={() => setCustomizingTileId(null)}
                        className="absolute top-4 right-4 text-slate-500 hover:text-white"
                      >
                        ✕
                      </button>

                      <div className="text-center mb-8">
                         <h4 className="text-gold-500 font-display text-2xl uppercase tracking-widest font-black mb-2">Rebrand Asset</h4>
                         <p className="text-slate-500 text-xs uppercase tracking-wider font-bold">Definisci l'identità visiva della tua proprietà</p>
                      </div>

                      <div className="space-y-8">
                          <div>
                              <label className="block text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-4">Neon Signature</label>
                              <div className="flex flex-wrap justify-center gap-4">
                                  {CUSTOM_COLORS.map(c => (
                                      <button 
                                        key={c.hex} 
                                        onClick={() => { onCustomize(customizingTileId, { borderColor: c.hex }); setCustomizingTileId(null); }}
                                        className="w-10 h-10 rounded-full border border-white/20 hover:scale-125 transition-transform relative group"
                                        style={{ backgroundColor: c.hex, boxShadow: `0 0 15px ${c.hex}60` }}
                                        title={c.name}
                                      >
                                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-30 rounded-full transition-opacity"></div>
                                      </button>
                                  ))}
                              </div>
                          </div>
                          
                          <div className="h-[1px] bg-white/10 w-full"></div>

                          <div>
                              <label className="block text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-4">Asset Iconography</label>
                              <div className="flex flex-wrap justify-center gap-3">
                                  {CUSTOM_ICONS.map(icon => (
                                      <button 
                                        key={icon} 
                                        onClick={() => { onCustomize(customizingTileId, { icon }); setCustomizingTileId(null); }}
                                        className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-sm hover:bg-gold-500/20 hover:border-gold-500/50 transition-all text-xl hover:scale-110"
                                      >
                                        {icon}
                                      </button>
                                  ))}
                              </div>
                          </div>
                          
                          <button 
                            onClick={() => { onCustomize(customizingTileId, { borderColor: undefined, icon: undefined }); setCustomizingTileId(null); }}
                            className="w-full py-3 border border-red-900/50 text-red-500 hover:bg-red-900/20 uppercase text-xs font-black tracking-widest rounded-sm transition-all"
                          >
                            Reset Branding
                          </button>
                      </div>
                  </div>
              </div>
          )}

          {/* ASSET MANAGEMENT SECTION */}
          <section className="space-y-16">
            
            {/* Loop through each color group */}
            {allPropertyColors.map(color => {
               const { allInGroup, isComplete, progress } = getGroupDetails(color);
               
               return (
                 <div key={color} className="space-y-6 animate-slide-up">
                    {/* Group Header */}
                    <div className="flex items-center gap-4 border-b border-white/10 pb-3">
                       <div className="w-1.5 h-8" style={{ backgroundColor: color, boxShadow: `0 0 15px ${color}` }}></div>
                       <div className="flex-1">
                          <h3 className="text-xl font-black text-white uppercase tracking-widest leading-none">
                            {color === COLORS.GOLD ? 'SETTORE PRESTIGE' : 
                             color === COLORS.PURPLE ? 'TECH DISTRICT' :
                             color === COLORS.TEAL ? 'ENERGY SECTOR' : 
                             'SETTORE SVILUPPO'}
                          </h3>
                          <span className="text-[9px] text-slate-500 font-mono uppercase tracking-[0.2em]">{allInGroup.length} Asset nel distretto</span>
                       </div>
                       <div className="text-right">
                           {isComplete ? (
                               <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-sm">
                                   <span className="text-xl animate-pulse">✓</span>
                                   <div className="flex flex-col items-end">
                                      <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Monopolio Attivo</span>
                                      <span className="text-[8px] text-emerald-500/70 font-bold uppercase">Costruzione Autorizzata</span>
                                   </div>
                               </div>
                           ) : (
                               <div className="flex flex-col items-end opacity-60">
                                   <span className="text-[10px] text-red-400 font-bold uppercase tracking-widest flex items-center gap-2">
                                       <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                                       Costruzione Bloccata
                                   </span>
                                   <span className="text-[9px] text-slate-500 font-mono">
                                      {Math.round(progress)}% Completato
                                   </span>
                               </div>
                           )}
                       </div>
                    </div>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {allInGroup.map(t => {
                            const status = getTileStatus(t);
                            const rivalOwner = status === 'RIVAL' ? gameState.players.find(p => p.id === t.ownerId) : null;
                            const mortgageValue = Math.floor((t.price || 0) * 0.5);
                            const sellValue = Math.floor((t.price || 0) * 0.5); 
                            const liftCost = Math.floor(mortgageValue * 1.2);

                            return (
                                <div key={t.id} className={`relative p-5 rounded-md border transition-all duration-300 flex flex-col gap-4 group/card overflow-hidden ${
                                    status === 'OWNED' ? 'bg-gradient-to-br from-white/5 to-transparent border-white/10 hover:border-gold-500/40 shadow-lg' :
                                    status === 'MORTGAGED' ? 'bg-black border-slate-800 grayscale opacity-60' :
                                    status === 'RIVAL' ? 'bg-red-950/10 border-red-500/20 border-dashed opacity-90' :
                                    'bg-blue-900/5 border-blue-500/10 border-dashed opacity-70 hover:opacity-100'
                                }`}>
                                    
                                    {/* Color Indicator Strip */}
                                    <div className="absolute top-0 left-0 w-1.5 h-full opacity-60" style={{ backgroundColor: t.color }}></div>

                                    {/* Header Info */}
                                    <div className="flex justify-between items-start pl-4 relative z-10">
                                        <div>
                                            <div className="text-xs font-black text-white uppercase tracking-wider mb-1 flex items-center gap-2">
                                                {t.name}
                                            </div>
                                            <div className="text-[9px] font-mono text-slate-400 uppercase tracking-wide">
                                                Valore Mercato: ${t.price}M
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            {status === 'OWNED' && <div className="text-[14px]">✅</div>}
                                            {status === 'MORTGAGED' && <span className="text-[8px] bg-slate-700 text-white px-1.5 py-0.5 rounded-sm font-bold tracking-wider">IPOTECATA</span>}
                                            {t.customStyle?.icon && <span className="text-2xl mt-1 drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">{t.customStyle.icon}</span>}
                                        </div>
                                    </div>

                                    {/* Status Body */}
                                    <div className="pl-4 flex-1 flex flex-col justify-end relative z-10">
                                        {status === 'OWNED' || status === 'MORTGAGED' ? (
                                            <div className="space-y-3 mt-4">
                                                {/* Rent Info */}
                                                <div className="flex justify-between items-center bg-black/40 p-2 rounded-sm border border-white/5">
                                                    <span className="text-[9px] text-slate-500 uppercase font-bold">Rendita Corrente</span>
                                                    <span className={`text-sm font-mono font-bold ${status === 'MORTGAGED' ? 'text-slate-600 line-through' : 'text-emerald-400'}`}>
                                                        ${t.rent?.[t.upgradeLevel || 0] || Math.floor((t.price||0)*0.1)}M
                                                    </span>
                                                </div>

                                                {/* Action Grid */}
                                                <div className="grid grid-cols-2 gap-2">
                                                    <button 
                                                        onClick={() => onMortgage(t.id)}
                                                        className={`text-[9px] font-black uppercase py-2 px-1 rounded-sm border transition-all shadow-md active:scale-95 ${
                                                            status === 'MORTGAGED'
                                                            ? 'bg-emerald-900/30 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500 hover:text-black'
                                                            : 'bg-amber-900/20 border-amber-500/30 text-amber-500 hover:bg-amber-500 hover:text-black'
                                                        }`}
                                                    >
                                                        {status === 'MORTGAGED' ? `RISCATTA (-$${liftCost}M)` : `IPOTECA (+$${mortgageValue}M)`}
                                                    </button>
                                                    <button 
                                                        onClick={() => onSell(t.id)}
                                                        className="text-[9px] font-black uppercase py-2 px-1 rounded-sm border bg-red-900/10 border-red-500/30 text-red-500 hover:bg-red-600 hover:text-white transition-all shadow-md active:scale-95"
                                                    >
                                                        VENDI (+${sellValue}M)
                                                    </button>
                                                </div>
                                                <button 
                                                    onClick={() => setCustomizingTileId(t.id)}
                                                    className="w-full text-[9px] font-bold uppercase py-1.5 border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:border-white/30 hover:bg-white/10 rounded-sm transition-all"
                                                >
                                                    Personalizza Asset
                                                </button>
                                            </div>
                                        ) : status === 'RIVAL' ? (
                                            <div className="bg-red-950/40 p-3 border border-red-500/20 rounded-sm mt-2">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="w-6 h-6 rounded-full bg-black border border-white/20 overflow-hidden p-1">
                                                        {rivalOwner && <PlayerTokenIcon token={rivalOwner.token} className="w-full h-full grayscale" />}
                                                    </div>
                                                    <div>
                                                       <span className="block text-[8px] text-red-400 font-bold uppercase tracking-wider">Proprietario</span>
                                                       <span className="block text-xs font-black text-white uppercase">{rivalOwner?.name}</span>
                                                    </div>
                                                </div>
                                                <div className="h-[1px] bg-red-500/20 w-full mb-2"></div>
                                                <p className="text-[9px] text-red-300/70 italic leading-tight">
                                                    <span className="font-bold text-red-400">⚠ MANCANTE:</span> Questo asset è necessario per costruire. Negozia o usa carte "Esproprio".
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="mt-4 bg-blue-950/20 p-3 border border-blue-500/10 rounded-sm flex flex-col gap-2">
                                                <div className="flex justify-between items-center">
                                                   <span className="text-[9px] text-blue-300 uppercase font-bold tracking-widest">Disponibile</span>
                                                   <span className="text-[8px] border border-blue-500/30 text-blue-400 px-1 rounded">FREE MARKET</span>
                                                </div>
                                                <p className="text-[9px] text-slate-400 leading-tight">
                                                    Acquistabile atterrando sulla casella.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                 </div>
               );
            })}
          </section>

          {/* Infrastructure Section */}
          <section className="space-y-8 pt-12 border-t border-white/10">
             <div className="flex items-center gap-4">
                 <div className="w-1.5 h-8 bg-blue-500 shadow-[0_0_15px_#3b82f6]"></div>
                 <h3 className="text-xl font-black text-white uppercase tracking-widest leading-none">
                    LOGISTICA & INFRASTRUTTURE
                 </h3>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {gameState.tiles.filter(t => t.type === TileType.RAILROAD || t.type === TileType.UTILITY).map(t => {
                     const status = getTileStatus(t);
                     const rivalOwner = status === 'RIVAL' ? gameState.players.find(p => p.id === t.ownerId) : null;
                     const mortgageValue = Math.floor((t.price || 0) * 0.5);
                     const liftCost = Math.floor(mortgageValue * 1.2);
                     
                     return (
                        <div key={t.id} className={`p-5 rounded-md border flex flex-col justify-between min-h-[180px] relative overflow-hidden group ${
                            status === 'OWNED' ? 'bg-blue-900/10 border-blue-500/40' : 'bg-white/5 border-white/10 opacity-60 hover:opacity-100'
                        }`}>
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`text-xs font-black uppercase tracking-widest ${status === 'OWNED' ? 'text-white' : 'text-slate-400'}`}>{t.name}</span>
                                    {status === 'OWNED' && <div className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6]"></div>}
                                </div>
                                <span className="text-[9px] text-slate-500 font-mono uppercase tracking-[0.2em]">{t.type}</span>
                            </div>

                            <div className="mt-4">
                                {status === 'OWNED' || status === 'MORTGAGED' ? (
                                    <button 
                                        onClick={() => onMortgage(t.id)}
                                        className={`w-full text-[9px] font-black uppercase py-2 rounded-sm border transition-all ${
                                            status === 'MORTGAGED' 
                                            ? 'text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20' 
                                            : 'text-amber-500 border-amber-600/30 hover:bg-amber-600/20'
                                        }`}
                                    >
                                        {status === 'MORTGAGED' ? `RISCATTA (-$${liftCost}M)` : 'IPOTECA'}
                                    </button>
                                ) : status === 'RIVAL' ? (
                                    <div className="flex items-center gap-2 mt-2 opacity-80">
                                        <div className="w-5 h-5 rounded-full border border-white/20 p-0.5">
                                            {rivalOwner && <PlayerTokenIcon token={rivalOwner.token} className="w-full h-full grayscale" />}
                                        </div>
                                        <span className="text-[9px] font-bold text-slate-400 uppercase">{rivalOwner?.name}</span>
                                    </div>
                                ) : (
                                    <span className="text-[9px] text-slate-600 font-mono border border-white/10 px-2 py-1 rounded">DISPONIBILE</span>
                                )}
                            </div>
                        </div>
                     );
                })}
             </div>
          </section>

        </div>

        {/* Footer: Strategic Output */}
        <div className="p-8 bg-black border-t border-gold-900/20 flex flex-col md:flex-row gap-8 items-center justify-between relative z-20 shadow-[0_-10px_50px_rgba(0,0,0,0.5)]">
           <div className="flex gap-12 w-full md:w-auto justify-between md:justify-start">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 uppercase font-black tracking-[0.3em] mb-1">ROI Proiettato</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl md:text-4xl font-mono text-emerald-400 font-black tracking-tighter">
                    +${playerProperties.reduce((acc, t) => t.mortgaged ? acc : acc + (t.rent?.[t.upgradeLevel || 0] || (t.price ? Math.floor(t.price * 0.1) : 0)), 0)}M
                  </span>
                </div>
              </div>
              <div className="w-[1px] bg-white/10 hidden md:block"></div>
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 uppercase font-black tracking-[0.3em] mb-1">Dominanza Globale</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl md:text-4xl font-mono text-blue-400 font-black tracking-tighter">
                    {Math.round((playerProperties.length / (gameState.tiles.filter(t => t.type === TileType.PROPERTY).length || 1)) * 100)}%
                  </span>
                </div>
              </div>
           </div>
           
           <button 
            onClick={onClose}
            className="w-full md:w-auto px-12 py-5 bg-gradient-to-r from-gold-600 via-gold-500 to-amber-700 text-black font-black uppercase tracking-[0.4em] text-xs hover:shadow-[0_0_60px_rgba(217,154,28,0.4)] transition-all transform hover:-translate-y-1 active:scale-95 shadow-2xl rounded-sm"
           >
             TORNA AL GIOCO
           </button>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;

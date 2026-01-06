
import React from 'react';
import { Tile, TileType, Player } from '../types';
import { 
  IconTrain, IconBolt, IconOil, IconCrypto, 
  IconScam, IconJail, IconChance, IconLuxuryChance, IconCommunity, IconChip, IconDisaster, IconLock,
  PlayerTokenIcon
} from './Icons';

interface TileProps {
  tile: Tile;
  playersOnTile: Player[];
  width: string;
  height: string;
  side: 'top' | 'bottom' | 'left' | 'right' | 'corner';
  tileIndex: number;
  onPlayerDrop?: (playerId: number) => void;
}

const TileComponent: React.FC<TileProps> = ({ 
  tile, 
  playersOnTile, 
  side,
  onPlayerDrop
}) => {
  const renderIcon = (size: string = "w-5 h-5") => {
    const iconColor = "#d99a1c";
    switch (tile.type) {
      case TileType.RAILROAD: return <IconTrain className={size} color={iconColor} />;
      case TileType.UTILITY: return <IconBolt className={size} color={iconColor} />;
      case TileType.CHANCE: return <IconChance className={size} color="#f97316" />;
      case TileType.COMMUNITY_CHEST: return <IconCommunity className={size} color="#3b82f6" />;
      case TileType.TRUFFA: return <IconScam className={size} color="#a855f7" />;
      case TileType.MEGA_RICCHEZZE: return <IconLuxuryChance className={size} color="#eab308" />;
      case TileType.BLACK_MARKET: return <IconScam className={size} color="#ef4444" />;
      case TileType.SCAM_ACADEMY: return <IconScam className={size} color="#ef4444" />;
      case TileType.OIL_COMPANY: return <IconOil className={size} color="#14b8a6" />;
      case TileType.CRYPTO_EXCHANGE: return <IconCrypto className={size} color="#a855f7" />;
      case TileType.TECH_HUB: return <IconChip className={size} color="#3b82f6" />;
      case TileType.JAIL: return <IconJail className={size} color="#f97316" />;
      case TileType.GO_TO_JAIL: return <IconJail className={size} color="#ef4444" />;
      case TileType.DISASTER: return <IconDisaster className={size} color="#ef4444" />;
      case TileType.START: return <span className="text-2xl filter drop-shadow-md">🚩</span>;
      default: return null;
    }
  };

  const hasColorBar = (tile.type === TileType.PROPERTY || tile.type === TileType.TECH_HUB || tile.type === TileType.SCAM_ACADEMY || tile.type === TileType.OIL_COMPANY) && side !== 'corner';

  const isVerticalSide = side === 'top' || side === 'bottom';
  const isHorizontalSide = side === 'left' || side === 'right';

  // Contenitore principale con stile dinamico
  const containerStyle: React.CSSProperties = {
    borderColor: tile.customStyle?.borderColor || 'rgba(255,255,255,0.15)',
    boxShadow: tile.customStyle?.borderColor ? `inset 0 0 10px ${tile.customStyle.borderColor}30` : undefined,
  };

  return (
    <div 
      className={`w-full h-full relative transition-all duration-300 border overflow-hidden group/inner
        ${side === 'bottom' ? 'flex flex-col' : ''}
        ${side === 'top' ? 'flex flex-col-reverse' : ''}
        ${side === 'left' ? 'flex flex-row-reverse' : ''}
        ${side === 'right' ? 'flex flex-row' : ''}
        ${side === 'corner' ? 'flex flex-col justify-center bg-[#0a0a0a]' : 'bg-[#080808]'}
        ${tile.mortgaged ? 'grayscale opacity-50' : ''}
      `}
      style={containerStyle}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const pid = e.dataTransfer.getData('playerId');
        if (pid && onPlayerDrop) onPlayerDrop(parseInt(pid));
      }}
    >
      {/* Texture di fondo elegante */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none"></div>
      
      {/* Glow effect al passaggio del mouse */}
      <div className="absolute inset-0 opacity-0 group-hover/tile:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-gold-500/10 to-transparent pointer-events-none"></div>

      {/* Barra Colore Proprietà con effetto vetro */}
      {hasColorBar && (
        <div 
          className={`shrink-0 z-20 shadow-[0_0_10px_rgba(0,0,0,0.5)] border-black/20 backdrop-blur-sm relative overflow-hidden
            ${isVerticalSide ? 'h-[22%] w-full border-b' : 'w-[22%] h-full border-r'}
          `} 
          style={{ backgroundColor: tile.color }}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
        </div>
      )}

      {/* Area Contenuto - Ottimizzata */}
      <div className={`flex-1 flex relative z-10 p-0.5
        ${isVerticalSide ? 'flex-col items-center justify-between' : 'flex-row items-center justify-between px-1'}
        ${side === 'corner' ? 'flex-col items-center justify-center p-2' : ''}
      `}>
        
        {/* Nome Asset */}
        <div className={`flex items-center justify-center
          ${isVerticalSide ? 'w-full h-auto min-h-[35%]' : 'w-[45%] h-full'}
          ${side === 'corner' ? 'h-auto mb-2' : ''}
        `}>
             <span className={`text-[9px] md:text-[10px] leading-tight font-black uppercase text-center tracking-tighter text-slate-200 drop-shadow-md
                ${isHorizontalSide ? 'rotate-90 whitespace-nowrap' : ''}
             `}>
                {tile.name}
             </span>
        </div>

        {/* Icona Centrale (se presente) */}
        {tile.customStyle?.icon || renderIcon() ? (
             <div className="flex-1 flex items-center justify-center opacity-80 group-hover/tile:scale-110 transition-transform duration-300">
                {tile.customStyle?.icon ? (
                    <span className="text-xl filter drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">{tile.customStyle.icon}</span>
                ) : renderIcon()}
             </div>
        ) : <div className="flex-1"></div>}

        {/* Prezzo */}
        {tile.price && (
            <div className={`flex items-center justify-center
                ${isVerticalSide ? 'mb-0.5' : 'mr-0.5'}
            `}>
                <span className={`font-mono text-[9px] font-bold text-gold-400
                     ${isHorizontalSide ? 'rotate-90' : ''}
                `}>
                    ${tile.price}M
                </span>
            </div>
        )}
      </div>

      {/* Indicatori di stato (Owner/Mortgage) */}
      {tile.ownerId !== null && tile.ownerId !== undefined && (
        <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-gold-500 border border-black/50 z-30 shadow-[0_0_8px_gold]"></div>
      )}

      {tile.mortgaged && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-40 backdrop-blur-[1px]">
           <IconLock className="w-5 h-5" color="#94a3b8" />
        </div>
      )}

      {/* Pedine Giocatori - Rimosse da qui, ora gestite nel layer globale in Board.tsx */}
    </div>
  );
};

export default TileComponent;

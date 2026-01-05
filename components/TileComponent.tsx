
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
      className={`w-full h-full relative transition-all duration-300 border bg-[#050505] overflow-visible group/inner
        ${side === 'bottom' ? 'flex flex-col' : ''}
        ${side === 'top' ? 'flex flex-col-reverse' : ''}
        ${side === 'left' ? 'flex flex-row-reverse' : ''}
        ${side === 'right' ? 'flex flex-row' : ''}
        ${side === 'corner' ? 'flex flex-col justify-center' : ''}
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
      {/* Texture di fondo */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none"></div>

      {/* Barra Colore Proprietà */}
      {hasColorBar && (
        <div 
          className={`shrink-0 z-20 shadow-inner border-black/10 
            ${isVerticalSide ? 'h-[22%] w-full' : 'w-[22%] h-full'}
          `} 
          style={{ backgroundColor: tile.color }}
        ></div>
      )}

      {/* Area Contenuto - Ottimizzata per lettura orizzontale */}
      <div className={`flex-1 flex overflow-visible relative z-10 p-0.5
        ${isVerticalSide ? 'flex-col items-center justify-between' : 'flex-row items-center justify-between px-1'}
        ${side === 'corner' ? 'flex-col items-center justify-center p-2' : ''}
      `}>
        
        {/* Nome Asset - Sempre orizzontale, adattivo */}
        <div className={`flex items-center justify-center overflow-visible
          ${isVerticalSide ? 'w-full h-auto min-h-[35%]' : 'w-[45%] h-full'}
          ${side === 'corner' ? 'h-auto mb-2' : ''}
        `}>
          <span className={`font-sans font-black uppercase text-white tracking-tighter text-center leading-[0.9]
            ${side === 'corner' ? 'text-[0.65rem]' : isHorizontalSide ? 'text-[0.45rem] md:text-[0.55rem]' : 'text-[0.45rem] md:text-[0.52rem] px-0.5'} 
            group-hover/tile:text-gold-200 transition-colors drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]
          `}>
            {tile.name}
          </span>
        </div>

        {/* Icona Centrale - Centrata nel rimanente spazio */}
        <div className={`flex items-center justify-center flex-1 min-w-0 min-h-0
           ${isHorizontalSide ? 'w-auto' : 'w-full'}
        `}>
          <div className="transform transition-transform duration-300 group-hover/tile:scale-125">
            {renderIcon(side === 'corner' ? "w-10 h-10" : "w-6 h-6")}
          </div>
        </div>

        {/* Tag Prezzo - Sempre leggibile */}
        {tile.price && side !== 'corner' && (
          <div className={`flex items-center justify-center shrink-0
            ${isVerticalSide ? 'w-full mt-auto' : 'w-[22%] h-full ml-1'}
          `}>
            <span className="text-[0.45rem] md:text-[0.55rem] font-mono text-emerald-400 font-black tracking-tighter opacity-90 group-hover/tile:opacity-100 group-hover/tile:scale-110 transition-all">
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

      {/* Pedine Giocatori - Rendering pulito sopra lo zoom */}
      {playersOnTile.length > 0 && (
        <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="flex -space-x-3 filter drop-shadow-[0_4px_12px_rgba(0,0,0,1)] group-hover/tile:scale-50 transition-transform duration-300">
            {playersOnTile.map(p => (
              <div 
                key={p.id} 
                className="w-8 h-8 md:w-9 md:h-9 animate-bounce pointer-events-auto cursor-grab active:cursor-grabbing" 
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('playerId', p.id.toString());
                  e.dataTransfer.effectAllowed = 'move';
                }}
              >
                <PlayerTokenIcon token={p.token} className="w-full h-full" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TileComponent;

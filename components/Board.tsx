
import React, { useMemo } from 'react';
import { GameState, TransferInfo, TileType, Card } from '../types';
import { GAME_TILES } from '../constants';
import TileComponent from './TileComponent';
import Dice from './Dice';
import { PlayerTokenIcon } from './Icons';

interface BoardProps {
  gameState: GameState;
  onTileClick: (index: number) => void;
  onManualStep: () => void;
  activeTransfer?: TransferInfo | null;
  recentlyPurchased?: {tileId: number, playerId: number} | null;
  onPlayerDrag?: (playerId: number, tileId: number) => void;
}

const Board: React.FC<BoardProps> = ({ gameState, onTileClick, onManualStep, activeTransfer, recentlyPurchased, onPlayerDrag }) => {
  const CORNER_SIZE = 14.5; 
  const SIDE_TILES_COUNT = 14; 
  const TILE_BREADTH = (100 - (CORNER_SIZE * 2)) / SIDE_TILES_COUNT;

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const targetNextPos = currentPlayer ? (currentPlayer.position + 1) % 60 : -1;

  // Helper per calcolare la posizione centrale di una casella (0-100%)
  const getTileCenter = (index: number) => {
    // Normalizza index
    const i = index % 60;
    
    // Costanti per centri
    const CENTER_CORNER = CORNER_SIZE / 2;
    const CENTER_EDGE = 100 - (CORNER_SIZE / 2);
    
    // Bottom Side (0-15)
    if (i >= 0 && i <= 15) {
      const y = CENTER_EDGE;
      if (i === 0) return { x: CENTER_EDGE, y }; // Bottom Right
      if (i === 15) return { x: CENTER_CORNER, y }; // Bottom Left
      // 1-14: Right to Left
      const offset = (i - 1) * TILE_BREADTH + (TILE_BREADTH / 2);
      const x = 100 - CORNER_SIZE - offset;
      return { x, y };
    }
    
    // Left Side (16-30)
    if (i > 15 && i <= 30) {
      const x = CENTER_CORNER;
      if (i === 30) return { x, y: CENTER_CORNER }; // Top Left
      // 16-29: Bottom to Top
      const offset = (i - 16) * TILE_BREADTH + (TILE_BREADTH / 2);
      const y = 100 - CORNER_SIZE - offset;
      return { x, y };
    }
    
    // Top Side (31-45)
    if (i > 30 && i <= 45) {
      const y = CENTER_CORNER;
      if (i === 45) return { x: CENTER_EDGE, y }; // Top Right
      // 31-44: Left to Right
      const offset = (i - 31) * TILE_BREADTH + (TILE_BREADTH / 2);
      const x = CORNER_SIZE + offset;
      return { x, y };
    }
    
    // Right Side (46-59)
    if (i > 45) {
      const x = CENTER_EDGE;
      // 46-59: Top to Bottom
      const offset = (i - 46) * TILE_BREADTH + (TILE_BREADTH / 2);
      const y = CORNER_SIZE + offset;
      return { x, y };
    }
    
    return { x: 50, y: 50 };
  };

  const renderTiles = useMemo(() => {
    return GAME_TILES.map((tile, i) => {
      const playersOnTile = gameState.players.filter(p => p.position === i);
      let style: React.CSSProperties = {};
      let side: 'top' | 'bottom' | 'left' | 'right' | 'corner' = 'bottom';
      let transformOrigin = 'center center';

      // Posizionamento e calcolo origine per zoom INWARD (verso il centro)
      if (i >= 0 && i <= 15) {
        if (i === 0) { 
          style = { bottom: 0, right: 0, width: `${CORNER_SIZE}%`, height: `${CORNER_SIZE}%` }; 
          side = 'corner'; 
          transformOrigin = 'bottom right';
        } else if (i === 15) { 
          style = { bottom: 0, left: 0, width: `${CORNER_SIZE}%`, height: `${CORNER_SIZE}%` }; 
          side = 'corner'; 
          transformOrigin = 'bottom left';
        } else { 
          const pos = CORNER_SIZE + (i - 1) * TILE_BREADTH; 
          style = { bottom: 0, right: `${pos}%`, width: `${TILE_BREADTH}%`, height: `${CORNER_SIZE}%` }; 
          side = 'bottom';
          transformOrigin = 'bottom center';
        }
      } else if (i > 15 && i <= 30) {
        if (i === 30) { 
          style = { top: 0, left: 0, width: `${CORNER_SIZE}%`, height: `${CORNER_SIZE}%` }; 
          side = 'corner'; 
          transformOrigin = 'top left';
        } else { 
          const pos = CORNER_SIZE + (i - 16) * TILE_BREADTH; 
          style = { left: 0, bottom: `${pos}%`, width: `${CORNER_SIZE}%`, height: `${TILE_BREADTH}%` }; 
          side = 'left';
          transformOrigin = 'left center';
        }
      } else if (i > 30 && i <= 45) {
        if (i === 45) { 
          style = { top: 0, right: 0, width: `${CORNER_SIZE}%`, height: `${CORNER_SIZE}%` }; 
          side = 'corner'; 
          transformOrigin = 'top right';
        } else { 
          const pos = CORNER_SIZE + (i - 31) * TILE_BREADTH; 
          style = { top: 0, left: `${pos}%`, width: `${TILE_BREADTH}%`, height: `${CORNER_SIZE}%` }; 
          side = 'top';
          transformOrigin = 'top center';
        }
      } else if (i > 45) {
        const pos = CORNER_SIZE + (i - 46) * TILE_BREADTH; 
        style = { right: 0, top: `${pos}%`, width: `${CORNER_SIZE}%`, height: `${TILE_BREADTH}%` }; 
        side = 'right';
        transformOrigin = 'right center';
      }

      const isTarget = gameState.turnPhase === 'MOVING' && i === targetNextPos;

      return (
        <div 
          key={i} 
          style={{ ...style, transformOrigin }} 
          onClick={() => isTarget ? onManualStep() : onTileClick(i)}
          className={`absolute box-border transition-all duration-300 hover:scale-[2.4] hover:z-[100] hover:shadow-[0_0_100px_rgba(0,0,0,1)] group/tile ${isTarget ? 'z-[60]' : 'z-10'}`}
        >
          {isTarget && <div className="absolute inset-0 ring-2 ring-emerald-500 ring-inset animate-pulse bg-emerald-900/10 z-[5] pointer-events-none"></div>}
          <TileComponent 
            tile={tile} 
            playersOnTile={playersOnTile} 
            width="100%" 
            height="100%"
            side={side}
            tileIndex={i}
            onPlayerDrop={(playerId) => onPlayerDrag && onPlayerDrag(playerId, i)}
          />
        </div>
      );
    });
  }, [gameState.players, gameState.turnPhase, targetNextPos, onManualStep, onTileClick, onPlayerDrag]);

  const showDice = gameState.isRolling || gameState.turnPhase === 'MOVING';

  return (
    <div className="relative w-full h-full bg-[#020202] overflow-visible border-[4px] border-[#1a1a1a] shadow-[inset_0_0_120px_rgba(0,0,0,1)] rounded-xl">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] opacity-15 pointer-events-none"></div>
      
      {/* CENTRAL AREA */}
      <div 
        className="absolute flex flex-col items-center justify-center z-0"
        style={{ inset: `${CORNER_SIZE}%` }}
      >
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:35px_35px]"></div>

        <div className="absolute inset-4 md:inset-8 grid grid-cols-2 grid-rows-2 gap-8 pointer-events-none opacity-40">
          <div className="flex flex-col items-center justify-center">
             <div className="w-20 h-12 bg-orange-950/20 border border-orange-500/20 rounded-sm rotate-[-8deg]"></div>
             <span className="mt-1 text-[7px] text-orange-400/60 font-black uppercase tracking-[0.3em]">Imprevisti</span>
          </div>
          <div className="flex flex-col items-center justify-center">
             <div className="w-20 h-12 bg-blue-900/20 border border-blue-500/20 rounded-sm rotate-[8deg]"></div>
             <span className="mt-1 text-[7px] text-blue-400/60 font-black uppercase tracking-[0.3em]">Probabilità</span>
          </div>
          <div className="flex flex-col items-center justify-center">
             <div className="w-20 h-12 bg-purple-900/20 border border-purple-500/20 rounded-sm rotate-[-4deg]"></div>
             <span className="mt-1 text-[7px] text-purple-400/60 font-black uppercase tracking-[0.3em]">Truffa</span>
          </div>
          <div className="flex flex-col items-center justify-center">
             <div className="w-20 h-12 bg-gold-900/20 border border-gold-500/20 rounded-sm rotate-[4deg]"></div>
             <span className="mt-1 text-[7px] text-gold-400/60 font-black uppercase tracking-[0.3em]">Ricchezze</span>
          </div>
        </div>

        <div className="z-10 text-center pointer-events-none select-none px-4">
          {!showDice && (
             <div className="relative animate-fade-in">
                <h1 className="text-5xl md:text-7xl font-display font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-gold-400 to-gold-900 leading-none drop-shadow-2xl">EXTREME</h1>
                <div className="h-0.5 w-24 mx-auto bg-gold-500/30 my-4"></div>
                <p className="text-[8px] text-gold-500/50 font-black tracking-[1.5em] uppercase ml-[1.5em]">Executive Simulator</p>
             </div>
          )}
        </div>

        {showDice && (
           <div className="z-50 absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-[4px] animate-fade-in rounded-lg">
               <div className="flex gap-12 items-center justify-center scale-110 md:scale-125">
                   <Dice value={gameState.dice[0]} isRolling={gameState.isRolling} type={gameState.activeDiceType} />
                   <Dice value={gameState.dice[1]} isRolling={gameState.isRolling} type={gameState.activeDiceType} />
               </div>
               {gameState.turnPhase === 'MOVING' && (
                   <div 
                    className="mt-12 px-10 py-3 bg-emerald-600 border border-emerald-400 text-white font-black uppercase tracking-[0.4em] rounded shadow-2xl text-[10px] animate-pulse cursor-pointer hover:bg-emerald-500 transition-colors"
                    onClick={onManualStep}
                   >
                     Passi: {gameState.remainingSteps}
                   </div>
               )}
           </div>
        )}
      </div>

      {renderTiles}

      {/* PLAYER TOKEN LAYER - Global Animation System */}
      <div className="absolute inset-0 z-[200] pointer-events-none">
        {gameState.players.map((p, idx) => {
          const { x, y } = getTileCenter(p.position);
          // Offset calculation for multiple players on the same tile
          const playersOnSameTile = gameState.players.filter(pl => pl.position === p.position);
          let offsetX = 0;
          let offsetY = 0;
          
          if (playersOnSameTile.length > 1) {
             const playerIndexOnTile = playersOnSameTile.findIndex(pl => pl.id === p.id);
             const count = playersOnSameTile.length;
             // Tile size is approx 5% to 14%. We want offset to be small (e.g. 1.5% of board)
             const spacing = 1.8; 
             
             // Grid Layout for better visibility
             if (count === 2) {
                 offsetX = playerIndexOnTile === 0 ? -spacing/2 : spacing/2;
                 offsetY = playerIndexOnTile === 0 ? -spacing/2 : spacing/2;
             } else if (count === 3) {
                 if (playerIndexOnTile === 0) { offsetX = 0; offsetY = -spacing; }
                 else if (playerIndexOnTile === 1) { offsetX = -spacing; offsetY = spacing/2; }
                 else { offsetX = spacing; offsetY = spacing/2; }
             } else {
                 // 2x2 or spiral for 4+
                 const col = playerIndexOnTile % 2;
                 const row = Math.floor(playerIndexOnTile / 2);
                 offsetX = (col === 0 ? -spacing/2 : spacing/2);
                 offsetY = (row === 0 ? -spacing/2 : spacing/2);
             }
          }

          return (
            <div
              key={p.id}
              className="absolute w-8 h-8 md:w-10 md:h-10 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] pointer-events-auto cursor-grab active:cursor-grabbing hover:scale-125 hover:z-[100] drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)]"
              style={{
                left: `${x + offsetX}%`,
                top: `${y + offsetY}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: (gameState.currentPlayerIndex === idx ? 150 : 60) + idx
              }}
              draggable
              onDragStart={(e) => {
                  if (onPlayerDrag) {
                    e.dataTransfer.setData('playerId', p.id.toString());
                    e.dataTransfer.effectAllowed = 'move';
                  }
              }}
            >
              <PlayerTokenIcon token={p.token} className="w-full h-full filter drop-shadow-lg" />
              {/* Turn Indicator */}
              {gameState.currentPlayerIndex === idx && (
                <div className="absolute -inset-2 border-2 border-gold-400 rounded-full animate-ping opacity-50 pointer-events-none"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Board;

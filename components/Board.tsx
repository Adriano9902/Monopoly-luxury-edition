
import React, { useMemo } from 'react';
import { GameState, TransferInfo, TileType, Card } from '../types';
import { GAME_TILES } from '../constants';
import TileComponent from './TileComponent';
import Dice from './Dice';

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
    </div>
  );
};

export default Board;

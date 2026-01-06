
import React from 'react';
import { GameState } from '../types';
import Dice from './Dice';
import { IconOracle, PlayerTokenIcon } from './Icons';

interface ControlsProps {
  gameState: GameState;
  playerId: number; // Added to know if it's my turn
  onRoll: () => void;
  onBuy: () => void;
  onEndTurn: () => void;
  onAiConsult: () => void;
  loading: boolean;
}

const Controls: React.FC<ControlsProps> = ({ gameState, playerId, onRoll, onBuy, onEndTurn, onAiConsult, loading }) => {
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const isMyTurn = currentPlayer?.id === playerId;
  const currentTile = gameState.tiles[currentPlayer?.position || 0];
  
  const isOwned = currentTile.ownerId !== null && currentTile.ownerId !== undefined;
  const owner = isOwned ? gameState.players.find(p => p.id === currentTile.ownerId) : null;
  // Can buy if it's my turn, I have money, and it's the action phase
  const canBuy = isMyTurn && currentTile.price && !isOwned && currentPlayer.money >= currentTile.price && gameState.turnPhase === 'ACTION';
  // Can end turn if it's my turn and phase allows
  const canEndTurn = isMyTurn && (gameState.turnPhase === 'ACTION' || gameState.turnPhase === 'END') && !loading;

  const getTheme = () => {
    switch (gameState.activeDiceType) {
        case 'TRUFFA': return { text: 'text-danger-500', bg: 'bg-danger-500/10', label: 'TRUFFA' };
        case 'BUSINESS': return { text: 'text-gold-400', bg: 'bg-gold-900/10', label: 'BUSINESS' };
        case 'CHAOS': return { text: 'text-danger-500', bg: 'bg-danger-500/10', label: 'CHAOS' };
        default: return { text: 'text-slate-500', bg: 'bg-black', label: 'STANDARD' };
    }
  };
  const theme = getTheme();
  const hasPendingDoubles = gameState.consecutiveDoubles > 0 && !currentPlayer.isJailed;

  return (
    <div className="w-full bg-black/80 backdrop-blur-xl border-t border-gold-900/30 p-3 md:p-6 pb-6 md:pb-6 shadow-[0_-10px_40px_rgba(0,0,0,0.8)] z-50">
      {/* Mobile: Grid Layout for thumb reachability. Desktop: Flex row */}
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6">
        
        {!isMyTurn ? (
           <div className="w-full h-12 md:h-14 flex items-center justify-center bg-white/5 border border-white/10 rounded-lg animate-pulse">
             <span className="text-xs md:text-sm text-slate-400 font-black uppercase tracking-[0.2em]">
               In attesa di {currentPlayer?.name}...
             </span>
           </div>
        ) : (
        <>
            {/* Primary Action: ROLL */}
            <button
            onClick={onRoll}
            disabled={gameState.turnPhase !== 'ROLL' || loading}
            className={`
                flex-1 h-14 md:h-16 w-full md:w-auto min-w-[160px]
                flex items-center justify-center gap-2
                bg-gradient-to-br from-gold-400 via-gold-500 to-gold-700
                text-black text-sm font-black tracking-[0.15em] uppercase 
                rounded-lg shadow-[0_0_20px_rgba(212,175,55,0.3)]
                border border-white/20
                hover:shadow-[0_0_40px_rgba(212,175,55,0.5)] hover:scale-[1.02]
                disabled:opacity-40 disabled:grayscale disabled:cursor-not-allowed disabled:shadow-none
                transition-all duration-200 active:scale-[0.96]
                ${gameState.turnPhase !== 'ROLL' ? 'hidden md:flex' : ''} 
            `}
            >
            <span className="text-xl">🎲</span> LANCIA {theme.label}
            </button>

            {/* Secondary Action: BUY / MANAGE */}
            <button
            onClick={onBuy}
            disabled={gameState.turnPhase !== 'ACTION' || !canBuy || loading}
            className={`
                flex-1 h-14 md:h-16 w-full md:w-auto min-w-[160px]
                flex items-center justify-center
                border transition-all active:scale-[0.98] rounded-lg
                text-xs md:text-sm font-black tracking-[0.1em] uppercase
                shadow-lg
                ${canBuy 
                ? 'bg-gradient-to-br from-emerald-900/80 to-emerald-950/90 border-emerald-500 text-emerald-400 hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:border-emerald-400' 
                : 'bg-white/5 border-white/10 text-slate-500 cursor-not-allowed'
                }
                ${gameState.turnPhase !== 'ACTION' && gameState.turnPhase !== 'ROLL' ? 'hidden md:flex' : ''}
            `}
            >
            {isOwned ? `PROPRIETÀ DI ${owner?.name}` : `ACQUISTA $${currentTile.price || '---'}M`}
            </button>

            {/* Utility Group */}
            <div className="flex gap-3 w-full md:w-auto">
                {/* AI Consultant */}
                <button
                    onClick={onAiConsult}
                    disabled={loading}
                    className="h-14 w-14 flex-shrink-0 flex items-center justify-center bg-black border border-gold-500/30 text-gold-500 rounded-md hover:bg-gold-500/10 active:scale-95 transition-all"
                >
                    <IconOracle className="w-6 h-6" />
                </button>

                {/* End Turn - Always visible if possible */}
                <button
                    onClick={onEndTurn}
                    disabled={!canEndTurn}
                    className={`
                        flex-1 h-14 md:h-16 px-6 
                        flex items-center justify-center
                        border-2 rounded-md transition-all active:scale-[0.98]
                        text-xs font-black tracking-[0.2em] uppercase
                        ${hasPendingDoubles
                            ? 'bg-gold-500 text-black border-gold-500 animate-pulse'
                            : gameState.turnPhase === 'END' || (canEndTurn && gameState.turnPhase === 'ACTION')
                                ? 'bg-danger-900/50 border-danger-500 text-white hover:bg-danger-900/80' 
                                : 'bg-transparent border-white/10 text-slate-600 cursor-not-allowed'
                        }
                    `}
                >
                    {hasPendingDoubles ? "TIRA ANCORA" : "FINE TURNO"}
                </button>
            </div>
        </>
        )}
      </div>
    </div>
  );
};

export default Controls;

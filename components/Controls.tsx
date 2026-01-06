
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
    <div className="w-full bg-luxury-card/95 backdrop-blur-2xl border-t border-white/10 p-4 md:p-6 pb-safe-area-bottom shadow-[0_-10px_50px_rgba(0,0,0,0.9)] z-50">
      {/* Mobile: Grid Layout for thumb reachability. Desktop: Flex row */}
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6">
        
        {!isMyTurn ? (
           <div className="w-full h-14 md:h-16 flex items-center justify-center bg-white/5 border border-white/5 rounded-xl animate-pulse">
             <div className="flex flex-col items-center">
                <span className="text-[9px] text-slate-500 font-mono tracking-widest uppercase mb-1">Current Turn</span>
                <span className="text-sm md:text-base text-gold-300 font-display font-bold uppercase tracking-widest">
                  {currentPlayer?.name}
                </span>
             </div>
           </div>
        ) : (
        <>
            {/* Primary Action: ROLL */}
            <button
            onClick={onRoll}
            disabled={gameState.turnPhase !== 'ROLL' || loading}
            className={`
                flex-1 h-14 md:h-16 w-full md:w-auto min-w-[200px]
                flex items-center justify-center gap-3
                bg-gradient-to-b from-gold-300 via-gold-500 to-gold-700
                text-black text-sm font-black tracking-[0.2em] uppercase 
                rounded-xl shadow-[0_0_30px_rgba(212,175,55,0.2)]
                border-t border-white/40 border-b border-gold-900/50
                hover:shadow-[0_0_50px_rgba(212,175,55,0.4)] hover:brightness-110
                disabled:opacity-40 disabled:grayscale disabled:cursor-not-allowed disabled:shadow-none
                transition-all duration-300 active:scale-[0.98]
                relative overflow-hidden group
                ${gameState.turnPhase !== 'ROLL' ? 'hidden md:flex' : ''} 
            `}
            >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 blur-md"></div>
                <span className="text-2xl drop-shadow-md">🎲</span> 
                <span className="drop-shadow-sm">Lancia {theme.label}</span>
            </button>

            {/* Secondary Action: BUY / MANAGE */}
            <button
            onClick={onBuy}
            disabled={gameState.turnPhase !== 'ACTION' || !canBuy || loading}
            className={`
                flex-1 h-14 md:h-16 w-full md:w-auto min-w-[200px]
                flex items-center justify-center
                border transition-all active:scale-[0.98] rounded-xl
                text-xs md:text-sm font-black tracking-[0.15em] uppercase
                shadow-lg relative overflow-hidden group
                ${canBuy 
                ? 'bg-gradient-to-b from-emerald-800 to-emerald-950 border-emerald-500/50 text-white shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:border-emerald-400' 
                : 'bg-white/5 border-white/5 text-slate-600 cursor-not-allowed'
                }
                ${gameState.turnPhase !== 'ACTION' && gameState.turnPhase !== 'ROLL' ? 'hidden md:flex' : ''}
            `}
            >
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                {isOwned 
                  ? <span className="opacity-60">Proprietà di {owner?.name}</span> 
                  : <span className="flex flex-col items-center leading-none gap-1">
                        <span>Acquista Asset</span>
                        <span className="font-mono text-emerald-300">${currentTile.price}M</span>
                    </span>
                }
            </button>

            {/* Utility Group */}
            <div className="flex gap-3 w-full md:w-auto">
                {/* AI Consultant */}
                <button
                    onClick={onAiConsult}
                    disabled={loading}
                    className="h-14 w-14 md:h-16 md:w-16 flex-shrink-0 flex items-center justify-center bg-luxury-black border border-gold-500/30 text-gold-400 rounded-xl hover:bg-gold-500/10 hover:border-gold-500 hover:text-gold-200 active:scale-95 transition-all shadow-inner"
                    title="Consult AI Advisor"
                >
                    <IconOracle className="w-6 h-6 md:w-7 md:h-7" />
                </button>

                {/* End Turn - Always visible if possible */}
                <button
                    onClick={onEndTurn}
                    disabled={!canEndTurn}
                    className={`
                        flex-1 h-14 md:h-16 px-8
                        flex items-center justify-center
                        border rounded-xl transition-all active:scale-[0.98]
                        text-xs font-black tracking-[0.2em] uppercase
                        shadow-lg
                        ${hasPendingDoubles
                            ? 'bg-gradient-to-r from-gold-400 to-gold-600 text-black border-gold-400 animate-pulse shadow-[0_0_20px_gold]'
                            : gameState.turnPhase === 'END' || (canEndTurn && gameState.turnPhase === 'ACTION')
                                ? 'bg-gradient-to-b from-red-900/80 to-red-950 border-red-500/50 text-red-100 hover:border-red-400 hover:text-white shadow-[0_0_15px_rgba(220,38,38,0.3)]' 
                                : 'bg-transparent border-white/5 text-slate-700 cursor-not-allowed'
                        }
                    `}
                >
                    {hasPendingDoubles ? "Tira Ancora" : "Fine Turno"}
                </button>
            </div>
        </>
        )}
      </div>
    </div>
  );
};

export default Controls;

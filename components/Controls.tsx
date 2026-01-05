
import React from 'react';
import { GameState } from '../types';
import Dice from './Dice';
import { PlayerTokenIcon } from './Icons';

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
        case 'TRUFFA': return { text: 'text-purple-500', bg: 'bg-purple-900/10', label: 'TRUFFA' };
        case 'BUSINESS': return { text: 'text-gold-400', bg: 'bg-gold-900/10', label: 'BUSINESS' };
        case 'CHAOS': return { text: 'text-red-500', bg: 'bg-red-900/10', label: 'CHAOS' };
        default: return { text: 'text-slate-500', bg: 'bg-black', label: 'STANDARD' };
    }
  };
  const theme = getTheme();
  const hasPendingDoubles = gameState.consecutiveDoubles > 0 && !currentPlayer.isJailed;

  return (
    <div className={`h-20 px-4 md:px-6 flex items-center justify-between border-t border-white/10 ${theme.bg} shadow-2xl relative z-40 backdrop-blur-xl bg-black/60`}>
      {/* Player Identity (Ultra Compact) */}
      <div className="flex items-center gap-3 md:gap-4 w-1/4 min-w-[120px]">
        <div className="relative">
            <div className="w-12 h-12 bg-black border border-gold-500/30 rounded-full flex items-center justify-center p-2 shadow-lg">
                {currentPlayer && <PlayerTokenIcon token={currentPlayer.token} className="w-full h-full" />}
            </div>
            {hasPendingDoubles && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-black text-[10px] font-black rounded-full flex items-center justify-center border border-black animate-bounce">X2</div>
            )}
        </div>
        <div>
          <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none mb-1 opacity-60">{currentPlayer?.name}</div>
          <div className="text-xl font-mono text-emerald-400 font-black leading-none tracking-tighter">${currentPlayer?.money}M</div>
        </div>
      </div>

      {/* Main Action Group (Sleek Toolbar) */}
      <div className="flex-1 flex justify-center items-center gap-3 md:gap-4">
        {!isMyTurn ? (
           <div className="h-12 px-6 md:px-8 flex items-center justify-center bg-black/40 border border-white/5 rounded-sm w-full md:w-auto">
             <span className="text-xs text-slate-500 font-black uppercase tracking-[0.2em] animate-pulse whitespace-nowrap">
               Turno di {currentPlayer?.name}...
             </span>
           </div>
        ) : (
        <>
        <button
          onClick={onRoll}
          disabled={gameState.turnPhase !== 'ROLL' || loading}
          className="h-12 px-6 md:px-10 bg-gradient-to-r from-gold-600 to-amber-700 text-black text-xs font-black tracking-[0.2em] md:tracking-[0.4em] uppercase rounded-sm hover:shadow-[0_0_30px_rgba(217,154,28,0.5)] disabled:opacity-10 transition-all transform active:scale-95 flex items-center justify-center group w-full md:w-auto min-w-[140px]"
        >
          <span className="group-hover:animate-pulse">LANCIA {theme.label}</span>
        </button>

        <div className="h-10 w-px bg-white/10 hidden md:block"></div>

        <button
          onClick={onBuy}
          disabled={gameState.turnPhase !== 'ACTION' || !canBuy || loading}
          className={`h-12 px-4 md:px-8 text-xs font-black tracking-[0.1em] md:tracking-[0.3em] uppercase rounded-sm border transition-all w-full md:w-auto min-w-[140px] flex items-center justify-center ${
            canBuy 
              ? 'bg-emerald-900/20 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/40 hover:text-white' 
              : 'bg-black/40 border-white/5 text-slate-700 cursor-not-allowed'
          }`}
        >
          {isOwned ? `PROPRIETÀ DI ${owner?.name}` : `ACQUISTA ($${currentTile.price || '---'}M)`}
        </button>

        <button
          onClick={onAiConsult}
          disabled={loading}
          className="h-12 w-12 flex-shrink-0 flex items-center justify-center bg-indigo-950/30 border border-indigo-500/30 text-indigo-400 rounded-full hover:bg-indigo-500 hover:text-white transition-all text-lg shadow-lg hover:shadow-indigo-500/20"
          title="Consulenza Strategica AI"
        >
          🤖
        </button>

        <div className="h-10 w-px bg-white/10 hidden md:block"></div>

        <button
          onClick={onEndTurn}
          disabled={!canEndTurn}
          className={`h-10 px-8 text-[10px] font-black tracking-[0.3em] uppercase rounded-sm border transition-all ${
            hasPendingDoubles
                ? 'bg-emerald-600 border-emerald-400 text-white animate-pulse'
                : gameState.turnPhase === 'END' 
                    ? 'bg-red-900/60 border-red-500/60 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]' 
                    : 'bg-black/60 border-white/10 text-slate-500'
          } disabled:opacity-10`}
        >
          {hasPendingDoubles ? "TIRA DI NUOVO" : "FINE TURNO"}
        </button>
        </>
        )}
      </div>

      {/* Right Stats (Sleek HUD) */}
      <div className="w-1/4 text-right flex items-center justify-end gap-6">
        <div className="flex flex-col items-end">
            <span className={`text-[8px] font-black tracking-[0.3em] uppercase mb-1 ${theme.text} animate-pulse`}>Status</span>
            <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                {gameState.turnPhase === 'ROLL' ? 'Pronto' : 
                 gameState.turnPhase === 'MOVING' ? 'In Transito' :
                 gameState.turnPhase === 'ACTION' ? 'Operativo' : 'In attesa'}
            </span>
        </div>
        
        <div className="flex gap-1.5 p-1.5 bg-black/40 border border-white/5 rounded-sm">
            <div className="w-6 h-6 bg-white/10 rounded-sm flex items-center justify-center text-[10px] font-mono font-bold text-white">
                {gameState.dice[0] || 1}
            </div>
            <div className="w-6 h-6 bg-white/10 rounded-sm flex items-center justify-center text-[10px] font-mono font-bold text-white">
                {gameState.dice[1] || 1}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Controls;

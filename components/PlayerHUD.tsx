import React from 'react';
import { GameState } from '../types';
import { PlayerTokenIcon } from './Icons';

interface PlayerHUDProps {
  gameState: GameState;
  playerId: number;
}

const PlayerHUD: React.FC<PlayerHUDProps> = ({ gameState, playerId }) => {
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const myPlayer = gameState.players.find(p => p.id === playerId);
  const isMyTurn = currentPlayer?.id === playerId;
  
  // Theme logic for status
  const getTheme = () => {
    switch (gameState.activeDiceType) {
        case 'TRUFFA': return { text: 'text-danger-500' };
        case 'BUSINESS': return { text: 'text-gold-400' };
        case 'CHAOS': return { text: 'text-danger-500' };
        default: return { text: 'text-slate-500' };
    }
  };
  const theme = getTheme();

  return (
    <div className="w-full flex justify-between items-start pointer-events-auto">
      {/* Left: Current Player Info */}
      <div className="flex items-center gap-3 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg p-2 md:p-3 shadow-xl">
        <div className="relative">
            <div className={`w-10 h-10 md:w-12 md:h-12 bg-black border ${isMyTurn ? 'border-gold-500' : 'border-white/20'} rounded-full flex items-center justify-center p-2 shadow-lg transition-colors`}>
                {currentPlayer && <PlayerTokenIcon token={currentPlayer.token} className="w-full h-full" />}
            </div>
            {gameState.consecutiveDoubles > 0 && !currentPlayer?.isJailed && (
                <div className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-gold-500 text-black text-[10px] font-black rounded-full flex items-center justify-center border border-black animate-bounce">
                    x2
                </div>
            )}
        </div>
        <div>
          <div className="text-[9px] md:text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1">
             {isMyTurn ? 'IL TUO TURNO' : `TURNO DI ${currentPlayer?.name}`}
          </div>
          <div className="text-lg md:text-xl font-mono text-gold-400 font-black leading-none tracking-tighter">
             ${currentPlayer?.money}M
          </div>
        </div>
      </div>

      {/* Right: Game Stats / Dice */}
      <div className="flex flex-col items-end gap-2">
         {/* Phase Indicator */}
         <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded px-3 py-1.5">
             <span className={`text-[8px] font-black tracking-[0.2em] uppercase mr-2 ${theme.text}`}>
                 {gameState.turnPhase}
             </span>
             <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                 {gameState.turnPhase === 'ROLL' ? 'Tira' : 
                  gameState.turnPhase === 'MOVING' ? 'Muovi' :
                  gameState.turnPhase === 'ACTION' ? 'Azione' : 'Attesa'}
             </span>
         </div>

         {/* Dice Result (Last Roll) */}
         <div className="flex gap-1">
            <div className="w-6 h-6 md:w-7 md:h-7 bg-black/80 border border-white/10 rounded flex items-center justify-center text-xs font-mono font-bold text-white shadow-lg">
                {gameState.dice[0]}
            </div>
            <div className="w-6 h-6 md:w-7 md:h-7 bg-black/80 border border-white/10 rounded flex items-center justify-center text-xs font-mono font-bold text-white shadow-lg">
                {gameState.dice[1]}
            </div>
         </div>
      </div>
    </div>
  );
};

export default PlayerHUD;

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
    <div className="w-full flex justify-between items-start pointer-events-auto p-2">
      {/* Left: Current Player Info */}
      <div className="flex items-center gap-3 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-2 pr-6 md:p-3 md:pr-8 shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all hover:bg-black/80 hover:scale-[1.02]">
        <div className="relative">
            <div className={`w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-gray-900 to-black border-2 ${isMyTurn ? 'border-gold-500 shadow-[0_0_15px_rgba(217,154,28,0.5)]' : 'border-white/10'} rounded-full flex items-center justify-center p-2.5 shadow-2xl`}>
                {currentPlayer && <PlayerTokenIcon token={currentPlayer.token} className="w-full h-full filter drop-shadow-md" />}
            </div>
            {gameState.consecutiveDoubles > 0 && !currentPlayer?.isJailed && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-gold-400 to-gold-600 text-black text-[10px] font-black rounded-full flex items-center justify-center border-2 border-black animate-bounce shadow-lg">
                    x2
                </div>
            )}
        </div>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
             <div className={`w-1.5 h-1.5 rounded-full ${isMyTurn ? 'bg-green-500 animate-pulse' : 'bg-slate-600'}`}></div>
             <div className="text-[9px] md:text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none">
                {isMyTurn ? 'IL TUO TURNO' : `TURNO DI ${currentPlayer?.name}`}
             </div>
          </div>
          <div className="text-xl md:text-2xl font-mono text-white font-black leading-none tracking-tighter drop-shadow-lg flex items-baseline">
             <span className="text-gold-500 text-sm mr-0.5">$</span>{currentPlayer?.money}M
          </div>
        </div>
      </div>

      {/* Right: Game Stats / Dice */}
      <div className="flex flex-col items-end gap-2">
         {/* Phase Indicator */}
         <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5 shadow-lg flex items-center gap-2">
             <span className={`w-2 h-2 rounded-full ${gameState.turnPhase === 'ACTION' ? 'bg-emerald-500' : 'bg-gold-500'} animate-pulse`}></span>
             <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                 {gameState.turnPhase === 'ROLL' ? 'Tira i Dadi' : 
                  gameState.turnPhase === 'MOVING' ? 'In Movimento' :
                  gameState.turnPhase === 'ACTION' ? 'Fase Azioni' : 'In Attesa'}
             </span>
         </div>

         {/* Dice Result (Last Roll) */}
         <div className="flex gap-2 p-1 bg-black/40 rounded-lg backdrop-blur-sm">
            <div className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-br from-gray-800 to-black border border-white/10 rounded-md flex items-center justify-center text-sm font-mono font-bold text-white shadow-inner">
                {gameState.dice[0]}
            </div>
            <div className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-br from-gray-800 to-black border border-white/10 rounded-md flex items-center justify-center text-sm font-mono font-bold text-white shadow-inner">
                {gameState.dice[1]}
            </div>
         </div>
      </div>
    </div>
  );
};

export default PlayerHUD;

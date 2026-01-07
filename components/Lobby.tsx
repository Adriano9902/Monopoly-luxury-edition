import React from 'react';
import { GameState, Player } from '../types';
import { PlayerTokenIcon } from './Icons';

interface LobbyProps {
  gameState: GameState;
  playerId: number;
  onStartGame: () => void;
  onCopyInvite: () => void;
}

const Lobby: React.FC<LobbyProps> = ({ gameState, playerId, onStartGame, onCopyInvite }) => {
  const isHost = gameState.players[0]?.id === playerId;
  const gameId = gameState.id || 'Unknown';

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4 relative overflow-hidden font-mono text-neutral-300">
      {/* Background Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-amber-500/5 blur-sm animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              animationDuration: `${Math.random() * 3 + 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-2xl bg-neutral-900/90 border border-neutral-800 rounded-xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-md">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600 mb-2 uppercase tracking-widest drop-shadow-[0_2px_10px_rgba(251,191,36,0.2)]">
            Lobby Attesa
          </h1>
          <p className="text-neutral-500 text-sm tracking-widest">
            SECURED BY MONOPOLY QUANTUM LEDGER
          </p>
        </div>

        {/* Game ID Section */}
        <div className="bg-neutral-950/50 border border-neutral-800 rounded-lg p-6 mb-8 flex flex-col items-center">
          <span className="text-neutral-400 text-xs uppercase tracking-widest mb-2">Codice Partita</span>
          <div className="flex items-center gap-4">
            <code className="text-3xl font-bold text-amber-400 tracking-widest">{gameId}</code>
            <button
              onClick={onCopyInvite}
              className="p-2 hover:bg-neutral-800 rounded-md transition-colors text-neutral-400 hover:text-white"
              title="Copia Codice"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
            </button>
          </div>
          <p className="text-xs text-neutral-600 mt-2">Condividi questo codice con i tuoi amici per invitarli.</p>
        </div>

        {/* Players List */}
        <div className="space-y-3 mb-10">
          <div className="flex justify-between items-center px-2 mb-2">
            <span className="text-neutral-500 text-xs uppercase tracking-widest">Investitori ({gameState.players.length})</span>
            <span className="text-neutral-500 text-xs uppercase tracking-widest">Stato</span>
          </div>
          
          {gameState.players.map((player) => (
            <div 
              key={player.id}
              className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                player.id === playerId 
                  ? 'bg-amber-950/20 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.1)]' 
                  : 'bg-neutral-800/50 border-neutral-700/50'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-neutral-900 border ${
                  player.id === playerId ? 'border-amber-500/50' : 'border-neutral-700'
                }`}>
                  <PlayerTokenIcon token={player.token} className="w-6 h-6" />
                </div>
                <div>
                  <div className={`font-bold ${player.id === playerId ? 'text-amber-400' : 'text-neutral-200'}`}>
                    {player.name} {player.id === playerId && '(Tu)'}
                  </div>
                  <div className="text-xs text-neutral-500">
                    {player.id === gameState.players[0].id ? 'Host' : 'Investitore'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)] animate-pulse" />
                <span className="text-xs text-green-500 font-bold tracking-wider">PRONTO</span>
              </div>
            </div>
          ))}

          {/* Empty Slots */}
          {Array.from({ length: Math.max(0, 8 - gameState.players.length) }).map((_, i) => (
            <div key={`empty-${i}`} className="flex items-center p-4 rounded-lg border border-dashed border-neutral-800 bg-neutral-950/30 opacity-50">
              <div className="w-10 h-10 rounded-full bg-neutral-900/50 flex items-center justify-center mr-4">
                <span className="text-neutral-700 text-lg">+</span>
              </div>
              <span className="text-neutral-600 text-sm italic">In attesa...</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-4">
          {isHost ? (
            <button
              onClick={onStartGame}
              disabled={gameState.players.length < 2}
              className={`w-full py-4 rounded-lg font-black text-lg uppercase tracking-widest transition-all ${
                gameState.players.length >= 2
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-black shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(245,158,11,0.6)]'
                  : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
              }`}
            >
              {gameState.players.length < 2 ? 'Attesa Giocatori...' : 'Avvia Mercato'}
            </button>
          ) : (
            <div className="w-full py-4 rounded-lg bg-neutral-800 text-center font-bold text-neutral-400 uppercase tracking-widest border border-neutral-700">
              In attesa dell'Host...
            </div>
          )}
          
          <div className="text-center">
             <span className="text-xs text-neutral-600">
                {isHost ? 'Tu sei il CEO della Lobby.' : 'Attendi che il CEO avvii la sessione.'}
             </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
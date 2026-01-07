import React, { useState, useEffect } from 'react';
import Board from './components/Board';
import Controls from './components/Controls';
import Home from './components/Home';
import PurchaseModal from './components/PurchaseModal';
import AuctionModal from './components/AuctionModal';
import CardModal from './components/CardModal';
import StartAnimation from './components/StartAnimation';
import { GameState, ClientAction, PlayerConfig } from './types';
import { multiplayerService } from './services/multiplayerService';
import { getTurnCommentary } from './services/geminiService';
import { IconOracle } from './components/Icons';

import GameLayout from './components/GameLayout';
import PlayerHUD from './components/PlayerHUD';
import DebugPanel from './components/DebugPanel';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [showDebug, setShowDebug] = useState(false);
  const [connected, setConnected] = useState(false);
  const [gameId, setGameId] = useState<string | null>(null);
  const [playerId, setPlayerId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // UI State
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showStartAnimation, setShowStartAnimation] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [dismissedCardId, setDismissedCardId] = useState<string | null>(null);

  useEffect(() => {
    multiplayerService.connect();
    
    multiplayerService.onGameStateUpdate((newState) => {
      setGameState(newState);
      setLoading(false);
    });

    multiplayerService.onGameError((err) => {
      setError(err.message);
      setLoading(false);
      setTimeout(() => setError(null), 5000);
    });

    multiplayerService.onLobbyJoined((data) => {
       setGameId(data.gameId);
       setPlayerId(data.playerId);
       setConnected(true);
       setShowStartAnimation(true);
       setTimeout(() => setShowStartAnimation(false), 4000);
    });

    return () => {
      multiplayerService.disconnect();
    };
  }, []);

  const handleCreateGame = async (players: PlayerConfig[]) => {
    setLoading(true);
    try {
      const data = await multiplayerService.createLobby(players);
      setGameId(data.gameId);
      setPlayerId(data.playerId);
      setConnected(true);
    } catch (e: any) {
      setError(e.toString());
      setLoading(false);
    }
  };

  const handleJoinGame = async (gId: string, playerName: string) => {
    setLoading(true);
    try {
      const data = await multiplayerService.joinLobby(gId, playerName);
      setGameId(data.gameId);
      setPlayerId(data.playerId);
      setConnected(true);
    } catch (e: any) {
      setError(e.toString());
      setLoading(false);
    }
  };

  const sendAction = (type: ClientAction['type'], payload?: any) => {
    if (!gameId) return;
    setLoading(true);
    multiplayerService.sendAction(gameId, { type, payload });
  };

  if (!gameState) {
    return (
      <>
        {error && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-lg shadow-[0_0_20px_rgba(220,38,38,0.5)] z-[200] animate-bounce font-bold border border-red-400">
            ⚠️ {error}
          </div>
        )}
        <Home onCreateGame={handleCreateGame} onJoinGame={handleJoinGame} isLoading={loading} error={error} />
      </>
    );
  }

  if (gameState.gameStatus === 'LOBBY') {
    return (
      <Lobby
        gameState={gameState}
        playerId={playerId || -1}
        onStartGame={() => sendAction('START_GAME')}
        onCopyInvite={() => {
          if (gameId) {
            navigator.clipboard.writeText(gameId).then(() => {
               // Optional: Toast feedback handled by button or parent
               alert(`Codice Lobby copiato: ${gameId}`);
            });
          }
        }}
      />
    );
  }

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const isMyTurn = currentPlayer?.id === playerId;
  const currentTile = gameState.tiles[currentPlayer.position];

  const handleDebugAction = (action: string) => {
    if (!gameState) return;
    const newState = JSON.parse(JSON.stringify(gameState));
    const pIdx = newState.currentPlayerIndex;
    const player = newState.players[pIdx];

    switch(action) {
        case 'move_1': player.position = (player.position + 1) % 60; break;
        case 'move_5': player.position = (player.position + 5) % 60; break;
        case 'move_random': player.position = Math.floor(Math.random() * 60); break;
        case 'teleport_jail': player.position = 15; break;
        case 'money_add': player.money += 100; break;
        case 'money_sub': player.money -= 100; break;
        case 'modal_purchase': setShowPurchaseModal(true); break;
        case 'modal_auction': 
             newState.auctionState = { isActive: true, propertyId: 1, currentBid: 50, highestBidderId: player.id, activeBidders: [player.id], timeLeft: 30 };
             break;
        case 'toast_error': setError("Simulation Error: Connection Lost"); break;
    }
    setGameState(newState);
  };

  return (
    <>
      {/* Error Toast */}
      {error && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded shadow-xl z-[200] animate-bounce">
          {error}
        </div>
      )}

      <GameLayout
        gameInfo={
            <PlayerHUD gameState={gameState} playerId={playerId || -1} />
        }
        board={
            <Board 
              gameState={gameState} 
              onTileClick={() => {}} 
              onManualStep={() => {}}
            />
        }
        controls={
            <Controls 
              gameState={gameState}
              playerId={playerId || -1}
              loading={loading}
              onRoll={() => sendAction('ROLL_DICE')}
              onBuy={() => setShowPurchaseModal(true)}
              onEndTurn={() => {
                sendAction('END_TURN');
                setAiAdvice(null);
              }}
              onAiConsult={async () => {
                 if (!gameState || !playerId) return;
                 const player = gameState.players.find(p => p.id === playerId);
                 if (!player) return;
                 
                 setLoading(true);
                 try {
                   const currentTile = gameState.tiles[player.position];
                   const advice = await getTurnCommentary(player, "CONSULTATION", currentTile, gameState);
    
                   setAiAdvice(advice);
                 } catch(e) {
                   console.error(e);
                   setAiAdvice("Errore nella connessione con l'Oracle.");
                 } finally {
                   setLoading(false);
                 }
              }} 
            />
        }
        aiAdvice={
            aiAdvice && (
                <div className="fixed bottom-32 left-1/2 -translate-x-1/2 w-[90%] max-w-lg bg-black/90 border border-gold-500/50 p-6 rounded-lg shadow-2xl z-[100] animate-slide-up">
                   <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-black/55 flex items-center justify-center border border-gold-500/35">
                         <IconOracle className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                         <h3 className="text-gold-300 font-black uppercase tracking-[0.35em] text-xs mb-2">Oracle</h3>
                         <p className="text-sm text-slate-300 font-mono leading-relaxed">{aiAdvice}</p>
                      </div>
                      <button onClick={() => setAiAdvice(null)} className="text-slate-500 hover:text-white">✕</button>
                   </div>
                </div>
            )
        }
        modals={
            <>
                {/* Purchase Modal */}
                {showPurchaseModal && isMyTurn && currentTile && (
                    <PurchaseModal 
                    tile={currentTile}
                    player={currentPlayer}
                    onBuy={() => {
                        sendAction('BUY_PROPERTY');
                        setShowPurchaseModal(false);
                    }}
                    onAuction={() => {
                        sendAction('START_AUCTION'); 
                        setShowPurchaseModal(false);
                    }}
                    onPass={() => {
                        sendAction('DECLINE_PROPERTY');
                        setShowPurchaseModal(false);
                    }}
                    onClose={() => setShowPurchaseModal(false)}
                    />
                )}
        
                {/* Auction Modal */}
                {gameState.auctionState && gameState.auctionState.isActive && (
                    <AuctionModal
                    property={gameState.tiles.find(t => t.id === gameState.auctionState.propertyId)!}
                    currentBid={gameState.auctionState.currentBid}
                    highestBidderId={gameState.auctionState.highestBidderId}
                    activeBidders={gameState.auctionState.activeBidders.map(id => gameState.players.find(p => p.id === id)!)}
                    allPlayers={gameState.players}
                    myPlayerId={playerId || 0}
                    onBid={(_, amount) => sendAction('BID_AUCTION', { amount: gameState.auctionState!.currentBid + amount })}
                    onFold={(_) => sendAction('BID_AUCTION', { fold: true })}
                    />
                )}
        
                {/* Card Modal */}
                {gameState.currentCard && gameState.currentCard.id !== dismissedCardId && (
                    <CardModal 
                    card={gameState.currentCard}
                    onConfirm={() => {
                        setDismissedCardId(gameState.currentCard?.id || null);
                    }}
                    />
                )}
                
                {showStartAnimation && <StartAnimation />}
            </>
        }
      />
      
      <DebugPanel 
        isVisible={showDebug} 
        onToggle={() => setShowDebug(!showDebug)} 
        onAction={handleDebugAction} 
      />
    </>
  );
};

export default App;

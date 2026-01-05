import React, { useState, useEffect } from 'react';
import Board from './components/Board';
import Controls from './components/Controls';
import Home from './components/Home';
import PurchaseModal from './components/PurchaseModal';
import AuctionModal from './components/AuctionModal';
import CardModal from './components/CardModal';
import StartAnimation from './components/StartAnimation';
import { GameState, ClientAction } from './types';
import { multiplayerService } from './services/multiplayerService';
import { getTurnCommentary } from './services/geminiService';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
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

  const handleCreateGame = async (playerName: string) => {
    setLoading(true);
    try {
      const data = await multiplayerService.createLobby(playerName);
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
    return <Home onCreateGame={handleCreateGame} onJoinGame={handleJoinGame} isLoading={loading} />;
  }

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const isMyTurn = currentPlayer?.id === playerId;
  const currentTile = gameState.tiles[currentPlayer.position];

  return (
    <div className="relative w-full h-screen bg-[#0a0a0a] overflow-hidden text-white font-sans selection:bg-gold-500 selection:text-black">
      {/* Error Toast */}
      {error && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded shadow-xl z-50 animate-bounce">
          {error}
        </div>
      )}

      {/* Game Info Overlay */}
      <div className="absolute top-4 left-4 z-50 bg-black/50 backdrop-blur px-4 py-2 rounded border border-white/10">
        <div className="text-[10px] text-slate-400 uppercase tracking-widest">Lobby ID</div>
        <div className="text-xl font-mono font-bold text-gold-500">{gameId}</div>
      </div>

      <div className="w-full h-full flex flex-col">
        {/* Main Board Area */}
        <div className="flex-1 relative overflow-hidden flex items-center justify-center p-4 md:p-8 perspective-1000">
         <div className="transform scale-[0.6] md:scale-[0.85] lg:scale-100 transition-transform duration-500">
            <Board 
              gameState={gameState} 
              onTileClick={() => {}} 
              onManualStep={() => {}}
            />
          </div>
        </div>

        {/* Controls */}
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
               const advice = await getTurnCommentary(player, gameId, gameState, gameState.tiles);

               setAiAdvice(advice);
             } catch(e) {
               console.error(e);
               setAiAdvice("Errore nella connessione con l'Oracle.");
             } finally {
               setLoading(false);
             }
          }} 
        />
      </div>

      {/* AI Advice Toast */}
      {aiAdvice && (
        <div className="fixed bottom-32 left-1/2 -translate-x-1/2 w-[90%] max-w-lg bg-black/90 border border-gold-500/50 p-6 rounded-lg shadow-2xl z-[100] animate-slide-up">
           <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center border border-gold-500/30">
                 <span className="text-2xl">🤖</span>
              </div>
              <div className="flex-1">
                 <h3 className="text-gold-500 font-black uppercase tracking-widest text-xs mb-2">The Oracle Says:</h3>
                 <p className="text-sm text-slate-300 font-mono leading-relaxed">{aiAdvice}</p>
              </div>
              <button onClick={() => setAiAdvice(null)} className="text-slate-500 hover:text-white">✕</button>
           </div>
        </div>
      )}

      {/* Modals */}
      
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
            sendAction('START_AUCTION'); // Or DECLINE_PROPERTY which starts auction
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
             // Just close local modal. The user must click "End Turn" in controls.
             setDismissedCardId(gameState.currentCard?.id || null);
          }}
        />
      )}
      
      {showStartAnimation && <StartAnimation />}
    </div>
  );
};

export default App;

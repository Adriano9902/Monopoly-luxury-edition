import React from 'react';
import { GameState } from '../types';

interface DebugPanelProps {
  onAction: (action: string) => void;
  isVisible: boolean;
  onToggle: () => void;
}

const DebugPanel: React.FC<DebugPanelProps> = ({ onAction, isVisible, onToggle }) => {
  if (!isVisible) {
    return (
      <button 
        onClick={onToggle}
        className="fixed bottom-4 left-4 z-[9999] bg-red-900/50 hover:bg-red-600 text-white text-xs px-2 py-1 rounded border border-red-400/30 backdrop-blur-sm transition-all"
      >
        🐛 DEBUG
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-[9999] bg-black/90 border border-red-500/50 rounded-lg p-4 w-64 shadow-[0_0_20px_rgba(220,38,38,0.3)] backdrop-blur-md animate-slide-up font-mono">
      <div className="flex justify-between items-center mb-4 border-b border-red-900/50 pb-2">
        <h3 className="text-red-400 font-bold text-xs uppercase tracking-widest">Debug Console</h3>
        <button onClick={onToggle} className="text-red-400 hover:text-white text-xs">[x]</button>
      </div>

      <div className="space-y-2">
        <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Movement</div>
        <div className="grid grid-cols-2 gap-2">
          <DebugBtn onClick={() => onAction('move_1')}>Step 1</DebugBtn>
          <DebugBtn onClick={() => onAction('move_5')}>Step 5</DebugBtn>
          <DebugBtn onClick={() => onAction('move_random')}>Rnd Pos</DebugBtn>
          <DebugBtn onClick={() => onAction('teleport_jail')}>Go Jail</DebugBtn>
        </div>

        <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 mt-3">Modals & UI</div>
        <div className="grid grid-cols-2 gap-2">
          <DebugBtn onClick={() => onAction('modal_purchase')}>Buy UI</DebugBtn>
          <DebugBtn onClick={() => onAction('modal_auction')}>Auction</DebugBtn>
          <DebugBtn onClick={() => onAction('modal_card')}>Card</DebugBtn>
          <DebugBtn onClick={() => onAction('toast_error')}>Error</DebugBtn>
        </div>

        <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 mt-3">Economy</div>
        <div className="grid grid-cols-2 gap-2">
          <DebugBtn onClick={() => onAction('money_add')}>+100M</DebugBtn>
          <DebugBtn onClick={() => onAction('money_sub')}>-100M</DebugBtn>
        </div>
      </div>
    </div>
  );
};

const DebugBtn: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
  <button 
    onClick={onClick}
    className="bg-red-950/30 hover:bg-red-600/50 border border-red-900/50 hover:border-red-400 text-red-200 text-[10px] py-1 px-2 rounded transition-all duration-200 text-center"
  >
    {children}
  </button>
);

export default DebugPanel;

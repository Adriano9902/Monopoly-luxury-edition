import React, { ReactNode, useEffect, useState, useRef } from 'react';

interface GameLayoutProps {
  board: ReactNode;
  controls: ReactNode;
  modals: ReactNode;
  gameInfo: ReactNode;
  aiAdvice: ReactNode;
}

const GameLayout: React.FC<GameLayoutProps> = ({ 
  board, 
  controls, 
  modals, 
  gameInfo, 
  aiAdvice 
}) => {
  const [boardScale, setBoardScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Smart Board Scaling
  useEffect(() => {
    const calculateScale = () => {
      if (!containerRef.current) return;
      
      const { width, height } = containerRef.current.getBoundingClientRect();
      // Reserve space for controls on mobile if they are not overlaying
      // But we want the board to be as big as possible.
      
      // The board is square. We want to fit it into the available area.
      // We leave some margin (safety zone).
      const margin = 16; 
      const availableSize = Math.min(width, height) - (margin * 2);
      
      // Base board size is usually considered 100% of container, 
      // but to scale it strictly without overflow:
      // We can just let the parent flex handle it, OR force a scale.
      // The previous implementation used scale-[0.6] etc.
      
      // Let's try to just let the board fill the container with aspect-ratio: 1/1
      // and use CSS 'contain' logic. 
      // Actually, standard transform scale is smoother for heavy DOM boards.
    };

    window.addEventListener('resize', calculateScale);
    calculateScale();
    return () => window.removeEventListener('resize', calculateScale);
  }, []);

  return (
    <div className="relative w-full h-[100dvh] bg-[#0a0a0a] overflow-hidden flex flex-col font-sans selection:bg-gold-500 selection:text-black">
      {/* Background Effects (Subtle) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1a1a1a] via-[#050505] to-black -z-10"></div>
      
      {/* Top Bar / Game Info (Absolute on Mobile, Relative on Desktop?) */}
      {/* User wants "Game Info" to not take vital space. */}
      <div className="absolute top-0 left-0 right-0 z-40 pointer-events-none p-4 flex justify-between items-start">
        {gameInfo}
      </div>

      {/* Main Board Area - Takes all available space */}
      <div 
        ref={containerRef}
        className="flex-1 relative flex items-center justify-center overflow-hidden w-full"
      >
        {/* The Board Wrapper */}
        {/* We use a container that maintains aspect ratio 1:1 and fits within the parent */}
        <div className="aspect-square w-[95vmin] md:w-[85vmin] max-w-[1000px] max-h-[1000px] relative shadow-2xl">
           {board}
        </div>
      </div>

      {/* Controls Area */}
      {/* Mobile: Fixed Bottom. Desktop: Bottom Flow */}
      <div className="z-50 w-full shrink-0 relative">
        {controls}
      </div>

      {/* Overlays */}
      {aiAdvice}
      {modals}
    </div>
  );
};

export default GameLayout;

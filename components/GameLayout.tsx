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
  const [boardSize, setBoardSize] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Smart Board Scaling
  useEffect(() => {
    const calculateScale = () => {
      if (!containerRef.current) return;
      
      const { width, height } = containerRef.current.getBoundingClientRect();
      // Calculate available space minus margins
      const margin = 16; 
      const availableSize = Math.min(width, height) - (margin * 2);
      
      setBoardSize(availableSize);
    };

    window.addEventListener('resize', calculateScale);
    // Initial calculation needs a small delay to ensure layout is ready
    setTimeout(calculateScale, 10);
    
    return () => window.removeEventListener('resize', calculateScale);
  }, []);

  return (
    <div className="relative w-full h-[100dvh] bg-luxury-black overflow-hidden flex flex-col font-sans selection:bg-gold-400/30 selection:text-gold-100">
      {/* --- ATMOSPHERE LAYERS --- */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-luxury-charcoal via-luxury-black to-black -z-10"></div>
      <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-overlay pointer-events-none -z-10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] pointer-events-none -z-10"></div>
      
      {/* Top Bar / Game Info */}
      <div className="absolute top-0 left-0 right-0 z-40 pointer-events-none p-2 md:p-6 flex justify-between items-start bg-gradient-to-b from-black/80 to-transparent">
        {gameInfo}
      </div>

      {/* Main Board Area - Takes all available space */}
      <div 
        ref={containerRef}
        className="flex-1 relative flex items-center justify-center w-full py-4 overflow-hidden"
      >
        {/* The Board Wrapper */}
        <div 
          className="relative shadow-2xl transition-all duration-300 ease-out"
          style={{ 
            width: boardSize ? `${boardSize}px` : '90vmin', 
            height: boardSize ? `${boardSize}px` : '90vmin',
            boxShadow: '0 0 50px -10px rgba(0,0,0,0.8)'
          }}
        >
           {/* Board Glow */}
           <div className="absolute -inset-4 bg-gold-500/5 blur-3xl rounded-full pointer-events-none"></div>
           {board}
        </div>
      </div>

      {/* Controls Area */}
      {/* Mobile: Fixed Bottom. Desktop: Bottom Flow */}
      <div className="z-50 w-full shrink-0 relative bg-gradient-to-t from-black via-black/90 to-transparent pb-safe-area-bottom">
        {controls}
      </div>

      {/* Overlays */}
      {aiAdvice}
      {modals}
    </div>
  );
};

export default GameLayout;


import React, { useEffect, useState, useRef } from 'react';
import { DiceType } from '../types';

interface DiceProps {
  value: number;
  isRolling: boolean;
  type?: DiceType;
}

const Dice: React.FC<DiceProps> = ({ value, isRolling, type = 'STANDARD' }) => {
  const [landed, setLanded] = useState(false);
  const [randomRot, setRandomRot] = useState({ x: 0, y: 0 });
  const prevRolling = useRef(isRolling);

  useEffect(() => {
    if (isRolling) {
      setLanded(false);
      // Visual tumble only - value is determined by server
      // Use a deterministic pseudo-random based on time for visual variation only
      const now = Date.now();
      setRandomRot({
        x: (now % 360) * 2, 
        y: ((now + 100) % 360) * 2
      });
    } else if (prevRolling.current && !isRolling) {
      setLanded(true);
      const timer = setTimeout(() => setLanded(false), 800);
      return () => clearTimeout(timer);
    }
    prevRolling.current = isRolling;
  }, [isRolling]);

  // Map dice value to 3D Rotation
  const getFinalRotation = () => {
    switch (value) {
      case 1: return 'rotateX(0deg) rotateY(0deg)';
      case 6: return 'rotateX(180deg) rotateY(0deg)';
      case 2: return 'rotateX(-90deg) rotateY(0deg)';
      case 5: return 'rotateX(90deg) rotateY(0deg)';
      case 3: return 'rotateX(0deg) rotateY(-90deg)';
      case 4: return 'rotateX(0deg) rotateY(90deg)';
      default: return 'rotateX(0deg) rotateY(0deg)';
    }
  };

  const getThemeStyles = () => {
    switch(type) {
      case 'TRUFFA': return {
        diceClass: 'dice-truffa',
        glowColor: 'rgba(168,85,247,0.6)',
        shadowColor: 'rgba(168,85,247,0.3)',
      };
      case 'BUSINESS': return {
        diceClass: 'dice-business',
        glowColor: 'rgba(56,189,248,0.6)',
        shadowColor: 'rgba(56,189,248,0.3)',
      };
      case 'CHAOS': return {
        diceClass: 'dice-chaos',
        glowColor: 'rgba(239,68,68,0.8)',
        shadowColor: 'rgba(239,68,68,0.4)',
      };
      default: return { // STANDARD (Luxury Gold)
        diceClass: 'dice-standard',
        glowColor: 'rgba(217,154,28,0.6)',
        shadowColor: 'rgba(217,154,28,0.2)',
      };
    }
  };

  const theme = getThemeStyles();

  // Component for the Pips (Dots) looking like embedded gems
  const Pip = () => <div className="pip"></div>;

  const renderFaceContent = (val: number) => {
    const gridStyle = "w-full h-full grid grid-cols-3 grid-rows-3 p-[18%] gap-[2px]";
    const place = "flex justify-center items-center";
    
    // Mapping logical positions to grid
    return (
      <div className={gridStyle}>
        {val % 2 === 1 && <div className={`${place} col-start-2 row-start-2`}><Pip /></div>}
        {val > 1 && <div className={`${place} col-start-1 row-start-1`}><Pip /></div>}
        {val > 1 && <div className={`${place} col-start-3 row-start-3`}><Pip /></div>}
        {val > 3 && <div className={`${place} col-start-1 row-start-3`}><Pip /></div>}
        {val > 3 && <div className={`${place} col-start-3 row-start-1`}><Pip /></div>}
        {val === 6 && <div className={`${place} col-start-1 row-start-2`}><Pip /></div>}
        {val === 6 && <div className={`${place} col-start-3 row-start-2`}><Pip /></div>}
      </div>
    );
  };

  return (
    <div className={`w-24 h-24 relative flex items-center justify-center perspective-1000 group transition-transform duration-500 ${isRolling ? 'scale-110' : 'scale-100'}`}>
      
      {/* Styles Injected Locally for high-fidelity gradients */}
      <style>{`
        /* --- STANDARD: Gold Bar Aesthetic --- */
        .dice-standard {
          background: radial-gradient(circle at 30% 30%, #ffd700, #b8860b);
          border: 1px solid rgba(255, 215, 0, 0.5);
          box-shadow: 
            inset 0 0 15px rgba(255, 255, 255, 0.4),
            0 0 20px rgba(218, 165, 32, 0.3);
        }
        .dice-standard .pip {
          background: radial-gradient(circle at 30% 30%, #000000, #333333);
          box-shadow: inset 0 0 2px rgba(255,255,255,0.5);
          width: 80%; height: 80%; border-radius: 50%;
        }

        /* --- TRUFFA: Neon Purple Cyberpunk --- */
        .dice-truffa {
          background: radial-gradient(circle at 30% 30%, #d8b4fe, #7e22ce);
          border: 1px solid rgba(168, 85, 247, 0.6);
          box-shadow: 0 0 25px rgba(168, 85, 247, 0.5);
        }
        .dice-truffa .pip {
          background: #ffffff;
          box-shadow: 0 0 5px #a855f7;
          width: 80%; height: 80%; border-radius: 50%;
        }

        /* --- BUSINESS: Corporate Blue Glass --- */
        .dice-business {
          background: radial-gradient(circle at 30% 30%, #e0f2fe, #0ea5e9);
          border: 1px solid rgba(14, 165, 233, 0.5);
        }
        .dice-business .pip {
          background: #0f172a;
          width: 80%; height: 80%; border-radius: 20%; /* Square pips */
        }

        .dice-standard .face {
          background: linear-gradient(135deg, #bf953f 0%, #fcf6ba 25%, #b38728 50%, #fbf5b7 75%, #aa771c 100%);
          border: 1px solid #aa771c;
          box-shadow: inset 0 0 15px rgba(0,0,0,0.5);
        }
        .dice-standard .pip {
          background: radial-gradient(circle at 30% 30%, #444, #000);
          box-shadow: inset 0 0 2px rgba(255,255,255,0.5), 0 1px 1px rgba(255,255,255,0.3);
          border-radius: 50%;
          width: 100%; height: 100%;
          border: 1px solid rgba(255,255,255,0.1);
        }

        /* --- TRUFFA: Cyberpunk Neon --- */
        .dice-truffa .face {
          background: linear-gradient(135deg, #2e1065 0%, #000 50%, #581c87 100%);
          border: 1px solid #a855f7;
          box-shadow: inset 0 0 10px #a855f7, 0 0 10px rgba(168,85,247,0.3);
        }
        .dice-truffa .pip {
          background: #d8b4fe;
          box-shadow: 0 0 8px #a855f7, inset 0 0 2px white;
          border-radius: 2px; /* Digital look */
          width: 80%; height: 80%;
        }

        /* --- BUSINESS: Platinum / Diamond --- */
        .dice-business .face {
          background: linear-gradient(135deg, #e2e8f0 0%, #94a3b8 50%, #cbd5e1 100%);
          border: 1px solid #fff;
          box-shadow: inset 0 0 20px rgba(255,255,255,0.5);
        }
        .dice-business .pip {
          background: radial-gradient(circle at 30% 30%, #0ea5e9, #0369a1);
          border-radius: 50%;
          width: 90%; height: 90%;
          box-shadow: inset 0 0 5px rgba(255,255,255,0.8);
        }

        /* --- CHAOS: Magma / Ember --- */
        .dice-chaos .face {
          background: linear-gradient(135deg, #450a0a 0%, #7f1d1d 50%, #b91c1c 100%);
          border: 1px solid #ef4444;
          box-shadow: inset 0 0 30px #000;
        }
        .dice-chaos .pip {
          background: radial-gradient(circle, #fcd34d 0%, #f59e0b 50%, #dc2626 100%);
          box-shadow: 0 0 10px #ef4444;
          border-radius: 50%;
          width: 100%; height: 100%;
          animation: glow 1s infinite alternate;
        }

        /* --- General Shine Overlay --- */
        .shine-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(45deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 60%, rgba(255,255,255,0) 100%);
          opacity: 0.7;
          pointer-events: none;
        }
      `}</style>

      {/* Shadow Base (dynamic) */}
      <div 
        className={`absolute bottom-[-30px] left-1/2 -translate-x-1/2 rounded-full blur-xl transition-all duration-300`}
        style={{
           backgroundColor: theme.shadowColor,
           width: isRolling ? '40px' : landed ? '80px' : '60px',
           height: isRolling ? '40px' : '20px',
           opacity: isRolling ? 0.2 : 0.6
        }}
      ></div>

      {/* Floating Container (Levitation) */}
      <div className={`${!isRolling ? 'animate-levitate' : ''}`}>
        
        {/* The 3D Cube */}
        <div 
            className={`relative w-16 h-16 preserve-3d transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${theme.diceClass} ${isRolling ? 'animate-tumble-3d' : ''}`}
            style={{
            transform: isRolling 
                ? `rotateX(${randomRot.x}deg) rotateY(${randomRot.y}deg) scale3d(1.2, 1.2, 1.2) translateZ(80px)` // Throw Upwards
                : `${getFinalRotation()} scale3d(1, 1, 1) translateZ(0)`
            }}
        >
            {/* Faces */}
            {[
            { id: 1, trans: 'translateZ(32px)' },
            { id: 6, trans: 'rotateY(180deg) translateZ(32px)' },
            { id: 2, trans: 'rotateX(90deg) translateZ(32px)' },
            { id: 5, trans: 'rotateX(-90deg) translateZ(32px)' },
            { id: 3, trans: 'rotateY(90deg) translateZ(32px)' },
            { id: 4, trans: 'rotateY(-90deg) translateZ(32px)' }
            ].map(face => (
            <div
                key={face.id}
                className={`face absolute inset-0 w-16 h-16 rounded-[4px] backface-visible flex items-center justify-center`}
                style={{ transform: face.trans }}
            >
                {/* Metallic Shine Overlay */}
                <div className="shine-overlay"></div>
                
                {/* Content */}
                <div className="relative z-10 w-full h-full">
                    {renderFaceContent(face.id)}
                </div>
            </div>
            ))}
        </div>
      </div>

      {/* Impact Shockwave */}
      {landed && (
          <div className="absolute inset-0 -m-8 border-2 rounded-full animate-shockwave pointer-events-none" style={{ borderColor: theme.glowColor }}></div>
      )}

      {/* Speed Trails */}
      {isRolling && (
          <div className="absolute inset-[-50px] pointer-events-none opacity-60">
             <div className="absolute top-1/2 left-1/2 w-[2px] h-24 bg-white/40 rotate-45 animate-speed-streak shadow-[0_0_10px_white]"></div>
             <div className="absolute top-1/2 left-1/2 w-[2px] h-24 bg-white/40 -rotate-45 animate-speed-streak" style={{ animationDelay: '0.1s' }}></div>
          </div>
      )}
    </div>
  );
};

export default Dice;

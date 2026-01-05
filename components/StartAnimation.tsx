
import React from 'react';

const StartAnimation: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in pointer-events-none">
      <div className="relative flex flex-col items-center justify-center w-full max-w-2xl p-8 overflow-hidden">
        
        {/* Background Burst Effect */}
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[500px] h-[500px] bg-gold-500/20 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute w-full h-full bg-[radial-gradient(circle_at_center,rgba(217,154,28,0.2)_0%,transparent_70%)] animate-spin-slow" style={{ animationDuration: '10s' }}></div>
        </div>

        {/* Logo Container with 3D animation */}
        <div className="relative z-10 mb-8 animate-dice-land">
             <div className="absolute -inset-10 bg-white/10 rounded-full blur-xl animate-pulse"></div>
             <img 
               src="/assets/monopoly_extreme_logo.png" 
               alt="Monopoly Extreme Logo" 
               className="w-64 md:w-96 h-auto drop-shadow-[0_0_50px_rgba(217,154,28,0.8)]"
               onError={(e) => {
                 e.currentTarget.style.display = 'none';
               }}
             />
        </div>

        {/* Text Content */}
        <div className="relative z-10 text-center space-y-4 animate-slide-up">
            <h1 className="text-4xl md:text-6xl font-display font-black text-transparent bg-clip-text bg-gradient-to-b from-gold-100 via-gold-400 to-gold-700 drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)] uppercase tracking-tighter">
                Bentornato,<br/>Magnate!
            </h1>
            <div className="inline-block bg-black/60 border border-gold-500/50 px-6 py-2 rounded-full backdrop-blur-xl">
                 <p className="text-xs md:text-sm font-black text-gold-300 uppercase tracking-[0.3em]">
                    Il tuo impero ti attende
                 </p>
            </div>
        </div>

        {/* Falling Particles / Money effect (CSS only for performance) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 15 }).map((_, i) => (
                <div 
                    key={i}
                    className="absolute text-2xl animate-float opacity-0"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 2}s`,
                        animationDuration: `${3 + Math.random() * 2}s`,
                        opacity: 0.6
                    }}
                >
                    {Math.random() > 0.5 ? '✨' : '💸'}
                </div>
            ))}
        </div>

      </div>
      
      <style>{`
        @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .animate-spin-slow {
            animation: spin-slow 20s linear infinite;
        }
        .animate-fade-in {
            animation: fadeIn 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default StartAnimation;

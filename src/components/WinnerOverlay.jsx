import React from 'react';
import { Trophy, Sparkles, Star, Home } from 'lucide-react';

// Pre-defined particle positions for consistent rendering
const PARTICLES = [
  { left: 15, top: 20, delay: 0, duration: 2 },
  { left: 85, top: 15, delay: 0.3, duration: 2.2 },
  { left: 25, top: 80, delay: 0.6, duration: 1.8 },
  { left: 75, top: 85, delay: 0.9, duration: 2.1 },
  { left: 10, top: 50, delay: 0.2, duration: 2.3 },
  { left: 90, top: 45, delay: 0.5, duration: 1.9 },
  { left: 50, top: 10, delay: 0.1, duration: 2.4 },
  { left: 45, top: 90, delay: 0.7, duration: 2 },
  { left: 30, top: 35, delay: 0.4, duration: 2.1 },
  { left: 70, top: 65, delay: 0.8, duration: 1.7 },
  { left: 20, top: 65, delay: 0.15, duration: 2.5 },
  { left: 80, top: 30, delay: 0.55, duration: 1.6 },
];

const WinnerOverlay = ({ winner, localPlayerColor, onBackToMenu, playerName, opponentName }) => {
  if (!winner) return null;

  const isDisconnected = winner === 'DISCONNECTED';
  const isPlayerWin = !isDisconnected && winner === localPlayerColor;

  return (
    <div className="fixed z-20 inset-0 bg-black/90 flex flex-col items-center justify-center rounded-xl z-20 backdrop-blur-md p-8 text-center ">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {PARTICLES.map((particle, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-yellow-400 rounded-full opacity-60 animate-pulse"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Main content container */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Trophy with glow effect */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-yellow-400/30 blur-2xl rounded-full animate-pulse" />
          <Trophy 
            className="relative text-yellow-400 animate-bounce drop-shadow-2xl" 
            size={80} 
            strokeWidth={2.5}
          />
          {/* Sparkles around trophy */}
          <Sparkles 
            className="absolute -top-2 -right-2 text-yellow-300 animate-pulse" 
            size={24}
          />
          <Sparkles 
            className="absolute -bottom-2 -left-2 text-yellow-300 animate-pulse" 
            size={20}
            style={{ animationDelay: '0.5s' }}
          />
        </div>

        {/* Winner / Disconnect text */}
        <div className="mb-2">
          <h2 className="text-5xl md:text-6xl font-black mb-3 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 bg-clip-text text-transparent animate-pulse drop-shadow-lg">
            {isDisconnected ? 'OPPONENT LEFT' : (isPlayerWin ? `${(playerName || 'You').toUpperCase()} WINS!` : `${(opponentName || 'Opponent').toUpperCase()} WINS!`)}
          </h2>
          <div className="flex items-center justify-center gap-2 text-yellow-400/80">
            {!isDisconnected && <Star className="w-5 h-5 fill-yellow-400 animate-spin" style={{ animationDuration: '3s' }} />}
            <span className="text-lg font-bold uppercase tracking-wider">
              {isDisconnected ? 'Your opponent disconnected' : (isPlayerWin ? `${playerName || 'Victory!'}` : `${opponentName || 'Game Over'}`)}
            </span>
            {!isDisconnected && <Star className="w-5 h-5 fill-yellow-400 animate-spin" style={{ animationDuration: '3s', animationDirection: 'reverse' }} />}
          </div>
          {isDisconnected && (
            <div className="text-sm text-neutral-300 mt-3">You have been returned to the menu. The game was ended because your opponent left.</div>
          )}
        </div>

        {/* Decorative line */}
        <div className="w-32 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mb-8 rounded-full" />

        {/* Action button */}
        <button
          onClick={onBackToMenu}
          className="group relative px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-2xl font-black text-white text-lg transition-all active:scale-95 shadow-2xl border-2 border-blue-400/50 overflow-hidden"
        >
          {/* Button shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          
          <div className="relative flex items-center gap-3">
            <Home size={20} className="group-hover:scale-110 transition-transform" />
            <span className="tracking-wide">Main Menu</span>
          </div>
        </button>

        {/* Celebration stars at bottom */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4 opacity-40">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 animate-pulse" style={{ animationDelay: '0s' }} />
          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 animate-pulse" style={{ animationDelay: '0.3s' }} />
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 animate-pulse" style={{ animationDelay: '0.6s' }} />
        </div>
      </div>
    </div>
  );
};

export default WinnerOverlay;


import React from 'react';
import { RotateCcw, Settings } from 'lucide-react';

const GameHeader = ({ gameMode, onBackToMenu, onResetBoard, onShowSettings }) => {
  return (
    <div className="max-w-lg w-full mb-6 mx-auto z-50">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBackToMenu}
          className="text-neutral-400 text-xs font-bold glass-pennal px-3 py-1 rounded-full hover:text-white flex items-center gap-2 uppercase tracking-wider transition-all active:scale-95"
        >
          Menu
        </button>
        <div className="flex items-center gap-2 glass-pennal px-3 py-1 rounded-full text-xs font-bold text-neutral-400">
          {gameMode === 'PvC' ? 'PLAYER VS CPU' : 'LOCAL 1v1'}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onShowSettings}
            className="p-2 glass-pennal hover:bg-neutral-700 rounded-full transition-colors"
            title="Settings"
          >
            <Settings size={18} />
          </button>
          <button
            onClick={onResetBoard}
            className="p-2 glass-pennal hover:bg-neutral-700 rounded-full transition-colors"
            title="Reset Board"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameHeader;


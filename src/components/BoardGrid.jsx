import React from 'react';

const BoardGrid = ({ board, selectedPiece, validMoves, onSquareClick, RED, playerColor, cpuColor, boardTheme }) => {
  // Board theme color mappings
  const getBoardColors = (theme) => {
    switch (theme) {
      case 'wood':
        return { dark: 'bg-amber-900', light: 'bg-amber-100', border: 'border-amber-800' };
      case 'midnight':
        return { dark: 'bg-slate-900', light: 'bg-slate-700', border: 'border-slate-800' };
      case 'ocean':
        return { dark: 'bg-blue-900', light: 'bg-blue-200', border: 'border-blue-800' };
      case 'forest':
        return { dark: 'bg-green-900', light: 'bg-green-100', border: 'border-green-800' };
      case 'sunset':
        return { dark: 'bg-orange-900', light: 'bg-orange-200', border: 'border-orange-800' };
      default: // classic
        return { dark: 'bg-neutral-700', light: 'bg-neutral-200', border: 'border-neutral-800' };
    }
  };

  const boardColors = getBoardColors(boardTheme);

  // Helper to determine if color is light (for border/icon contrast)
  const isLightColor = (color) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 155;
  };

  return (
    <div className={`${boardColors.border} p-2 rounded-xl border-4 shadow-2xl`} style={{ backgroundColor: boardTheme === 'classic' ? '#262626' : undefined }}>
      <div className={`grid grid-cols-8 border-2 ${boardColors.border} overflow-hidden rounded-sm`}>
        {board.map((row, rIdx) =>
          row.map((cell, cIdx) => {
            const isDark = (rIdx + cIdx) % 2 !== 0;
            const isSelected = selectedPiece?.r === rIdx && selectedPiece?.c === cIdx;
            const isValidMove = validMoves.some((m) => m.r === rIdx && m.c === cIdx);
            const pieceColor = cell?.player === RED ? cpuColor : playerColor;
            const borderColor = isLightColor(pieceColor) ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)';
            
            return (
              <div
                key={`${rIdx}-${cIdx}`}
                onClick={() => onSquareClick(rIdx, cIdx)}
                className={`w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center cursor-pointer transition-colors relative
                  ${isDark ? boardColors.dark : boardColors.light} ${isSelected ? 'bg-amber-400/40' : ''}`}
              >
                {isValidMove && (
                  <div className="w-3 h-3 bg-green-400/60 rounded-full z-0 animate-pulse"></div>
                )}
                {cell && (
                  <div
                    className="w-8 h-8 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-transform border-2 z-10 shadow-lg"
                    style={{
                      backgroundColor: pieceColor,
                      borderColor: borderColor,
                      transform: isSelected ? 'scale(1.1) translateY(-4px)' : 'scale(1)'
                    }}
                  >
                    {cell.isKing && (
                      <svg
                        viewBox="0 0 24 24"
                        width="20"
                        height="20"
                        className={isLightColor(pieceColor) ? 'text-black fill-black' : 'text-white fill-white'}
                      >
                        <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"></path>
                      </svg>
                    )}
                  </div>
                )}
              </div>
            );
          }),
        )}
      </div>
    </div>
  );
};

export default BoardGrid;


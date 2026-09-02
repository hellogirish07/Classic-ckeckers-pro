import React from 'react';

const ScoreBoard = ({ turn, score, gameMode, RED, BLUE, playerColor, cpuColor, localPlayerColor, playerName, opponentName }) => {
  const getLighterShade = (color) => {
    const hex = color.replace('#', '');
    const r = Math.min(255, parseInt(hex.substr(0, 2), 16) + 40);
    const g = Math.min(255, parseInt(hex.substr(2, 2), 16) + 40);
    const b = Math.min(255, parseInt(hex.substr(4, 2), 16) + 40);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const defaultPlayerLabel = localPlayerColor === BLUE ? 'You (White)' : 'You (Black)';
  const defaultOpponentLabel = localPlayerColor === BLUE ? 'Opponent (Black)' : 'Opponent (White)';
  const onlinePlayerName = playerName || defaultPlayerLabel;
  const onlineOpponentName = opponentName || defaultOpponentLabel;

  return (
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div
        className={`p-4 rounded-2xl flex items-center justify-between transition-all ${
          turn === BLUE ? 'ring-4 ring-white' : 'bg-neutral-800 glass-pennal opacity-60'
        }`}
        style={turn === BLUE ? { backgroundColor: playerColor } : {}}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full border-2"
            style={{
              backgroundColor: playerColor,
              borderColor: getLighterShade(playerColor)
            }}
          ></div>
          <span className="font-bold">{gameMode === 'Online' ? onlinePlayerName : 'Player'}</span>
        </div>
        <span className="text-xl font-black">{score[BLUE]}</span>
      </div>
      <div
        className={`p-4 rounded-2xl flex items-center justify-between transition-all ${
          turn === RED ? 'ring-4 ring-white' : 'bg-neutral-800 glass-pennal opacity-60'
        }`}
        style={turn === RED ? { backgroundColor: cpuColor } : {}}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full border-2"
            style={{
              backgroundColor: cpuColor,
              borderColor: getLighterShade(cpuColor)
            }}
          ></div>
          <span className="font-bold">{gameMode === 'PvC' ? 'CPU' : gameMode === 'Online' ? onlineOpponentName : 'Player 2'}</span>
        </div>
        <span className="text-xl font-black">{score[RED]}</span>
      </div>
    </div>
  );
};

export default ScoreBoard;


import React from 'react';
import { X, BookOpen } from 'lucide-react';

const Rules = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-neutral-900 rounded-2xl max-w-3xl w-full p-8 text-white shadow-2xl border-2 border-neutral-700 max-h-[90vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden max-h-[90vh]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <BookOpen size={24} />
            </div>
            <h2 className="text-3xl font-black">Checkers Rules</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-800 rounded-xl transition-all active:scale-95"
            aria-label="Close rules"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6 text-neutral-300">
          <section>
            <h3 className="text-xl font-bold text-blue-400 mb-3">Objective</h3>
            <p className="leading-relaxed">
              The goal of checkers is to capture all of your opponent's pieces or block them so they cannot make any moves.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-blue-400 mb-3">Setup</h3>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>The board is an 8x8 grid with 64 squares (alternating dark and light)</li>
              <li>Each player starts with 12 pieces placed on the dark squares</li>
              <li>Blue pieces start on the bottom three rows</li>
              <li>Red pieces start on the top three rows</li>
              <li>Pieces can only move on dark squares</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-blue-400 mb-3">Basic Movement</h3>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Regular pieces can only move diagonally forward (toward your opponent)</li>
              <li>Blue pieces move upward (toward row 0)</li>
              <li>Red pieces move downward (toward row 7)</li>
              <li>Pieces can move one square diagonally to an empty dark square</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-blue-400 mb-3">Capturing Pieces</h3>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>To capture an opponent's piece, jump over it diagonally to an empty square</li>
              <li>The captured piece is removed from the board</li>
              <li>If you can capture a piece, you must do so</li>
              <li>Multiple jumps in a single turn are allowed if available</li>
              <li>You must continue jumping if another capture is possible</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-blue-400 mb-3">Kings</h3>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>When a piece reaches the opposite end of the board (the "king row"), it becomes a king</li>
              <li>Blue pieces become kings when they reach row 0</li>
              <li>Red pieces become kings when they reach row 7</li>
              <li>Kings can move diagonally in any direction (forward and backward)</li>
              <li>Kings can also capture pieces in any diagonal direction</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-blue-400 mb-3">Winning the Game</h3>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>You win by capturing all of your opponent's pieces</li>
              <li>You also win if your opponent cannot make any legal moves</li>
              <li>The game ends immediately when a player has no pieces left or no valid moves</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-blue-400 mb-3">Important Rules</h3>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>You cannot move backward with regular pieces (only kings can)</li>
              <li>If a capture is available, you must take it</li>
              <li>If multiple captures are available, you can choose which one to take</li>
              <li>You must complete all possible jumps in a single turn</li>
              <li>Players alternate turns</li>
            </ul>
          </section>

          <section className="bg-blue-900 bg-opacity-30 p-4 rounded-xl border border-blue-700">
            <h3 className="text-xl font-bold text-blue-300 mb-2">💡 Tips for Beginners</h3>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Control the center of the board for better positioning</li>
              <li>Try to create multiple jump opportunities</li>
              <li>Protect your back row to prevent your opponent from getting kings</li>
              <li>Look ahead and plan your moves</li>
              <li>Prioritize capturing pieces when possible</li>
            </ul>
          </section>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-all active:scale-95"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

export default Rules;

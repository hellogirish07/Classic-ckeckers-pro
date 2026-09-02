import React, { useState } from 'react';
import { Palette, X, Check } from 'lucide-react';
import HelpPanel from './Help';

const SettingsPanel = ({ onClose, playerColor, cpuColor, boardTheme, setPlayerColor, setCpuColor, setBoardTheme, colorPalette }) => {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-xl">
      <div className="glass-pennal w-full max-w-xl rounded-2xl p-8 border border-neutral-800 shadow-2xl overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden max-h-[90vh]">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black flex items-center text-white gap-3">
            <Palette className="text-white" /> Settings
          </h2>
            <button onClick={onClose} className="p-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-2xl transition-all">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-8">
          {/* Player Color Selection */}
          <div>
            <label className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] block mb-4">Your Token Color</label>
            <div className="flex flex-wrap gap-3">
              {colorPalette.map(color => (
                <button
                  key={`p-${color}`}
                  onClick={() => setPlayerColor(color)}
                  className={`w-10 h-10 rounded-full border-4 transition-all flex items-center justify-center ${playerColor === color ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-60'}`}
                  style={{ backgroundColor: color }}
                >
                  {playerColor === color && <Check size={16} className={color === '#ffffff' ? 'text-black' : 'text-white'} />}
                </button>
              ))}
            </div>
          </div>

          {/* CPU Color Selection */}
          <div>
            <label className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] block mb-4">Opponent Token Color</label>
            <div className="flex flex-wrap gap-3">
              {colorPalette.map(color => (
                <button
                  key={`c-${color}`}
                  onClick={() => setCpuColor(color)}
                  className={`w-10 h-10 rounded-full border-4 transition-all flex items-center justify-center ${cpuColor === color ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-60'}`}
                  style={{ backgroundColor: color }}
                >
                  {cpuColor === color && <Check size={16} className={color === '#ffffff' ? 'text-black' : 'text-white'} />}
                </button>
              ))}
            </div>
          </div>

          {/* Board Theme */}
          <div>
            <label className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] block mb-4">Board Environment</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'classic', label: 'Dark', darkColor: 'bg-neutral-700', lightColor: 'bg-neutral-200' },
                { id: 'wood', label: 'Wood', darkColor: 'bg-amber-900', lightColor: 'bg-amber-100' },
                { id: 'midnight', label: 'Night', darkColor: 'bg-slate-900', lightColor: 'bg-slate-700' },
                { id: 'ocean', label: 'Ocean', darkColor: 'bg-blue-900', lightColor: 'bg-blue-200' },
                { id: 'forest', label: 'Forest', darkColor: 'bg-green-900', lightColor: 'bg-green-100' }
              ].map(t => (
                <button 
                  key={t.id}
                  onClick={() => setBoardTheme(t.id)}
                  className={`p-4 rounded-3xl border-2 transition-all flex flex-col items-center gap-2 ${boardTheme === t.id ? 'border-blue-500 bg-blue-500/10' : 'border-neutral-800 bg-neutral-900'}`}
                >
                  <div className="w-8 h-8 rounded-lg shadow-inner grid grid-cols-2 overflow-hidden">
                    <div className={t.darkColor}></div>
                    <div className={t.lightColor}></div>
                  </div>
                  <span className="text-[10px] text-white font-bold uppercase">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-full py-5 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold text-white text-sm tracking-widest uppercase mt-4 transition-all"
          >
            Apply Changes
          </button>

          {/* Help & Report */}
          <div>
            <label className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] block mb-4">Help & Report</label>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setShowHelp(true)}
                className="w-full py-3 bg-neutral-800 border border-neutral-600 hover:bg-neutral-700 rounded-2xl text-white font-bold"
              >
                Open Help & Report
              </button>
              <p className="text-sm text-neutral-400">Report bugs, contact support, or send feedback.</p>
            </div>
          </div>
        </div>
        {showHelp && <HelpPanel onClose={() => setShowHelp(false)} />}
      </div>
    </div>
  );
}

export default SettingsPanel;
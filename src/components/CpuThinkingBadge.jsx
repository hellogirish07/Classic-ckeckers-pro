import React from 'react';

const CpuThinkingBadge = () => {
  return (
    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-neutral-800 px-4 py-2 rounded-full border border-neutral-600 flex items-center gap-2 shadow-xl z-50">
      <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
      <span className="text-xs font-bold uppercase tracking-widest">CPU is thinking...</span>
    </div>
  );
};

export default CpuThinkingBadge;


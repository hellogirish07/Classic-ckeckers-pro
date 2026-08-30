import React from "react";
import { Cpu, ChevronRight, User, Users, Monitor, BookOpen, Settings, Globe,} from "lucide-react";
import '../App.css';

const StartScreen = ({
  onStartPvC,
  onStartPvP,
  onStartInviteFriends,
  onShowRules,
  onShowSettings,
}) => {
  return (
    <div className="min-h-screen bg-[#0f172a] bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.22),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.18),transparent_35%),radial-gradient(circle_at_50%_100%,rgba(245,158,11,0.08),transparent_30%)] text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-24 h-24 bg-blue-600 rounded-2xl rotate-12 flex items-center justify-center shadow-2xl mb-6 border-4 border-blue-400">
        <Monitor size={48} className="-rotate-12" />
      </div>

      <h1 className="text-4xl font-black mb-4 uppercase tracking-tighter">
        Classic Checkers{" "}
        {/* <span className="text-[#e8b904] inline-block " >Pro</span> */}
        <span className="m-2 inline-block px-3 py-2 rounded-lg text-sm font-black text-slate-950 bg-gradient-to-r from-yellow-400 to-amber-500 shadow-[0_0_18px_rgba(245,158,11,0.25)] -rotate-3"> PRO</span>
      </h1>
      
      <p className="text-neutral-400 mb-6 max-w-xs">
        Select your game mode to start playing.
      </p>

      <div className="flex flex-col gap-2 w-full max-w-xs">
        <div className="flex flex-row gap-2 w-full max-w-xs">
          <button
            onClick={onStartPvC}
            className="flex-1 flex glass-pennal items-center justify-center p-5 bg-neutral-800 rounded-2xl font-bold transition-all group active:scale-95"
          >
            <div className="flex flex-col items-center justify-center gap-3">
              <Cpu size={40} /> <span>vs Computer</span>
            </div>
            {/* <ChevronRight className="group-hover:translate-x-1 transition-transform" /> */}
          </button>
          <button
            onClick={onStartPvP}
            className="flex-1 flex glass-pennal items-center justify-center p-5 bg-neutral-800 rounded-2xl font-bold transition-all group active:scale-95"
          >
            <div className="flex flex-col items-center justify-center gap-3">
              <Users size={40} /> <span>Pass and Play</span>
            </div>
            {/* <ChevronRight className="group-hover:translate-x-1 transition-transform" /> */}
          </button>
        </div>

        <button
          onClick={onStartInviteFriends}
          className="flex items-center justify-between mt-2 p-5 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold transition-all group active:scale-95"
        >
          <div className="flex items-center gap-3">
            <Globe size={25} /> <span>Invite Friends</span>
          </div>
          <ChevronRight className="group-hover:translate-x-1 transition-transform" />
        </button>

        <div className="flex flex-row gap-2 w-full max-w-xs">
          <button
            onClick={onShowRules}
            className="flex flex-1 glass-pennal items-center justify-center gap-3 p-5 bg-neutral-800 rounded-2xl font-bold transition-all group active:scale-95 mt-2 border-2 border-neutral-700"
          >
            <BookOpen size={25} />
            <span>Rules</span>
          </button>

          <button
            onClick={onShowSettings}
            className="flex flex-2 glass-pennal items-center justify-center gap-3 p-5 bg-neutral-800 rounded-2xl font-bold transition-all group active:scale-95 mt-2 border-2 border-neutral-700"
          >
            <Settings size={25} />
            {/* <span>Settings</span> */}
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center absolute bottom-0 mb-4">
        <div className="text-neutral-400 text-sm">
          v{import.meta.env.PACKAGE_VERSION ?? "2.0.0"}
        </div>
        <div className="text-neutral-400 text-sm">made by @hellogirish07</div>
      </div>
    </div>
  );
};

export default StartScreen;

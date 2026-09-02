import React from 'react';
import { ArrowLeft, Copy, Globe, ShieldCheck, Users } from 'lucide-react';

const InviteFriendsScreen = ({
  view,
  onBack,
  onJoinRoom,
  onSelectCreate,
  onSelectJoin,
  roomCode,
  joinCode,
  setJoinCode,
  isLoading,
  error,
  statusMessage,
  copyRoomCode,
  copied,
  playerName,
  setPlayerName,
}) => {
  if (view === 'create') {
    return (
      // Create Room
      <div className="min-h-screen bg-[#0f172a] bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.22),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.18),transparent_35%),radial-gradient(circle_at_50%_100%,rgba(245,158,11,0.08),transparent_30%)] text-white flex items-center justify-center p-6">
        <div className="w-full max-w-md glass-pennal border border-neutral-700 rounded-3xl p-6 shadow-2xl">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-neutral-300 hover:text-white mb-5 transition"
          >
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>

          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 text-blue-400 font-bold uppercase tracking-[0.2em] text-xs mb-4">
              <Globe size={14} />
              Multiplayer
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight">Your room code</h2>
          </div>

          <div className="bg-neutral-800/50 border-2 border-blue-500/60 rounded-2xl p-6 text-center mb-5 shadow-lg shadow-blue-900/20">
            <div className="text-xs uppercase tracking-[0.3em] text-neutral-400 mb-3">Room</div>
            <div className="text-4xl font-black tracking-[0.3em] text-blue-400">{roomCode || '---'}</div>
          </div>

          <p className="text-center text-neutral-300 mb-5">Share this code with your friend</p>

          <button
            onClick={copyRoomCode}
            disabled={!roomCode || isLoading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed rounded-2xl p-4 font-bold transition-all"
          >
            <Copy size={18} />
            <span>{copied ? 'Code copied!' : 'Copy Code'}</span>
          </button>

          <div className="mt-6 rounded-2xl border border-neutral-700 bg-neutral-800/50 p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-blue-300 mb-2">
              <Users size={18} />
              <span className="font-bold">Waiting for player...</span>
            </div>
            <p className="text-sm text-neutral-300">{statusMessage || 'Waiting for your friend to join...'}</p>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'join') {
    return (
      // Join Room
      <div className="min-h-screen bg-[#0f172a] bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.22),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.18),transparent_35%),radial-gradient(circle_at_50%_100%,rgba(245,158,11,0.08),transparent_30%)] text-white flex items-center justify-center p-6">
        <div className="w-full max-w-md glass-pennal border border-neutral-700 rounded-3xl p-6 shadow-2xl">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-neutral-300 hover:text-white mb-5 transition"
          >
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>

          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 text-blue-400 font-bold uppercase tracking-[0.2em] text-xs mb-4">
              <ShieldCheck size={14} />
              Multiplayer
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight">Join room</h2>
          </div>

          <label className="block text-sm font-semibold text-neutral-300 mb-2">Enter Room Code</label>
          <input
            value={joinCode}
            onChange={(event) => setJoinCode(event.target.value.toUpperCase())}
            placeholder="Enter room code"
            maxLength={6}
            className="w-full bg-neutral-800/50 border border-neutral-700 rounded-2xl p-4 text-center text-xl font-bold tracking-[0.25em] text-white placeholder:text-neutral-500 outline-none focus:border-blue-500 mb-4"
          />

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/50 text-red-300 text-sm text-center">
              {error}
            </div>
          )}

          <button
            onClick={onJoinRoom}
            disabled={isLoading || !joinCode.trim()}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed rounded-2xl p-4 font-bold text-lg transition-all"
          >
            {isLoading ? 'Joining...' : 'Join Game'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.22),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.18),transparent_35%),radial-gradient(circle_at_50%_100%,rgba(245,158,11,0.08),transparent_30%)] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md glass-pennal border border-neutral-700 rounded-3xl p-6 shadow-2xl">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-neutral-300 hover:text-white mb-5 transition"
        >
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>

        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 text-blue-400 font-bold uppercase tracking-[0.2em] text-xs mb-4">
            <Users size={14} />
            Invite Friends
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight">Select room</h2>
        </div>

        {/* Ask for player's name before creating/joining a room */}
        <label className="block text-sm font-semibold text-neutral-300 mb-2">Your name</label>
        <input
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Your name"
          maxLength={20}
          className="w-full bg-neutral-800/50 border border-neutral-700 rounded-2xl p-3 text-center text-lg font-medium text-white placeholder:text-neutral-500 outline-none focus:border-blue-500 mb-4"
        />

        <div className="space-y-3">
          <button
            onClick={() => onSelectCreate()}
            className="w-full text-left bg-blue-600 hover:bg-blue-500 rounded-2xl p-5 font-bold transition-all"
            disabled={!playerName || playerName.trim().length === 0}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-xl">Create Room</div>
                <p className="text-sm text-blue-100/90 mt-1">Create a private room and invite your friend.</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => onSelectJoin()}
            className="w-full text-left glass-pennal rounded-2xl p-5 font-bold transition-all"
            disabled={!playerName || playerName.trim().length === 0}
          >
            <div>
              <div className="text-xl">Join Room</div>
              <p className="text-sm text-neutral-200 mt-1">Enter your friend&apos;s room code to join their game.</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InviteFriendsScreen;

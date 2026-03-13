interface LobbyActionsProps {
  isHost: boolean;
  canStart: boolean;
  onToggleReady: () => void;
  onStartGame: () => void;
}

export default function LobbyActions({ isHost, canStart, onToggleReady, onStartGame }: LobbyActionsProps) {
  return (
    <div className="flex gap-4">
      <button
        className="rounded-xl bg-white/10 px-6 py-2.5 font-semibold text-white transition hover:bg-white/20"
        onClick={onToggleReady}
      >
        Toggle Ready
      </button>
      {isHost && (
        <button
          className="rounded-xl bg-purple-600 px-6 py-2.5 font-bold text-white transition hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onStartGame}
          disabled={!canStart}
        >
          Start Game
        </button>
      )}
    </div>
  );
}

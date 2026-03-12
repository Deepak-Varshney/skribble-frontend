import { useGame } from "../GameContext";

export default function Lobby() {
  const { snapshot, isHost, toggleReady, startGame, roomId, playerId } = useGame();
  if (!snapshot) return null;

  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}?room=${roomId}`);
  };

  return (
    <div className="flex flex-col items-center gap-6 pt-6">
      {/* Header */}
      <div className="flex w-full max-w-2xl items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur-sm">
        <h2 className="text-lg font-bold text-white">
          Room: <span className="font-mono text-purple-300">{roomId}</span>
        </h2>
        <button
          className="rounded-lg bg-purple-600/80 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-purple-500"
          onClick={copyLink}
        >
          📋 Copy Invite
        </button>
      </div>

      <div className="grid w-full max-w-2xl grid-cols-1 gap-6 md:grid-cols-2">
        {/* Player list */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
          <h3 className="mb-3 font-bold text-white">
            Players ({snapshot.players.length}/{snapshot.settings.maxPlayers})
          </h3>
          <ul className="space-y-2">
            {snapshot.players.map(p => (
              <li
                key={p.id}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                  p.ready ? "bg-emerald-900/40 text-emerald-300" : "bg-white/5 text-gray-300"
                }`}
              >
                <span>{p.ready ? "✅" : "⬜"}</span>
                <span className="font-medium">
                  {p.name}
                  {p.id === snapshot.hostId && " 👑"}
                </span>
                {p.id === playerId && <span className="ml-auto text-xs text-purple-400">(you)</span>}
              </li>
            ))}
          </ul>
        </div>

        {/* Settings */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm text-sm text-gray-300 space-y-1">
          <h3 className="mb-3 font-bold text-white">Settings</h3>
          <p>Rounds: {snapshot.settings.rounds}</p>
          <p>Draw Time: {snapshot.settings.drawTime}s</p>
          <p>Word Choices: {snapshot.settings.wordChoices}</p>
          <p>Hints: {snapshot.settings.hintCount}</p>
          <p>Private: {snapshot.isPrivate ? "Yes" : "No"}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          className="rounded-xl bg-white/10 px-6 py-2.5 font-semibold text-white transition hover:bg-white/20"
          onClick={toggleReady}
        >
          Toggle Ready
        </button>
        {isHost && (
          <button
            className="rounded-xl bg-purple-600 px-6 py-2.5 font-bold text-white transition hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={startGame}
            disabled={snapshot.players.length < 2}
          >
            Start Game
          </button>
        )}
      </div>
    </div>
  );
}

import { useGame } from "../GameContext";

export default function PlayerList() {
  const { snapshot, playerId } = useGame();
  if (!snapshot) return null;

  const sorted = [...snapshot.players].sort((a, b) => b.score - a.score);

  return (
    <div>
      <h3 className="mb-3 font-bold text-white text-sm">Players</h3>
      <ul className="space-y-1.5">
        {sorted.map((p, i) => (
          <li
            key={p.id}
            className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs ${
              p.id === snapshot.drawerId
                ? "bg-amber-900/40 text-amber-300"
                : p.hasGuessed
                ? "bg-emerald-900/30 text-emerald-300"
                : "bg-white/5 text-gray-300"
            } ${p.id === playerId ? "ring-1 ring-purple-500" : ""}`}
          >
            <span className="font-bold text-gray-500 w-5">#{i + 1}</span>
            <span className="flex-1 font-medium truncate">
              {p.name}
              {p.id === snapshot.drawerId && " 🖌️"}
              {p.hasGuessed && " ✅"}
            </span>
            <span className="font-mono font-bold">{p.score}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

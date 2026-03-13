import type { RoomSnapshot } from "../../types";

interface PlayersCardProps {
  snapshot: RoomSnapshot;
  playerId: string;
}

export default function PlayersCard({ snapshot, playerId }: PlayersCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
      <h3 className="mb-3 font-bold text-white">
        Players ({snapshot.players.length}/{snapshot.settings.maxPlayers})
      </h3>
      <ul className="space-y-2">
        {snapshot.players.map((p) => (
          <li
            key={p.id}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
              p.ready ? "bg-emerald-900/40 text-emerald-300" : "bg-white/5 text-gray-300"
            }`}
          >
            <span>{p.ready ? "Ready" : "Waiting"}</span>
            <span className="font-medium">
              {p.name}
              {p.id === snapshot.hostId && " (Host)"}
            </span>
            {p.id === playerId && <span className="ml-auto text-xs text-purple-400">(you)</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

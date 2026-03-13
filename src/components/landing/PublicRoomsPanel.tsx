import { useState } from "react";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3001";

type PublicRoom = {
  id: string;
  host_name: string;
  settings?: {
    maxPlayers?: number;
  };
  expires_at: string;
};

interface PublicRoomsPanelProps {
  onJoinRoom: (roomId: string, playerName: string) => void;
}

export default function PublicRoomsPanel({ onJoinRoom }: PublicRoomsPanelProps) {
  const [playerName, setPlayerName] = useState("Player");
  const [rooms, setRooms] = useState<PublicRoom[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadPublicRooms() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${SERVER_URL}/api/rooms/public?limit=20`);
      if (!res.ok) throw new Error("Failed to fetch public rooms.");
      const data = (await res.json()) as { rooms?: PublicRoom[] };
      setRooms(data.rooms ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch public rooms.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-3xl rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
      <div className="flex flex-wrap items-end gap-3">
        <label className="min-w-56 flex-1 text-sm text-gray-300">
          Your Name
          <input
            className="mt-1 w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder-gray-400 outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            maxLength={24}
          />
        </label>

        <button
          className="rounded-xl bg-amber-500 px-4 py-2.5 font-semibold text-black transition hover:bg-amber-400 disabled:opacity-60"
          onClick={loadPublicRooms}
          disabled={loading}
        >
          {loading ? "Loading..." : "Show Public Rooms"}
        </button>
      </div>

      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

      <div className="mt-4 space-y-2">
        {rooms.length === 0 && !loading && (
          <p className="text-sm text-gray-400">No public rooms found.</p>
        )}

        {rooms.map((room) => {
          const maxPlayers = room.settings?.maxPlayers ?? "?";
          const expiresText = new Date(room.expires_at).toLocaleTimeString();
          const minsLeft = Math.max(0, Math.ceil((new Date(room.expires_at).getTime() - Date.now()) / 60000));

          return (
            <div
              key={room.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/20 px-3 py-2"
            >
              <div className="text-sm text-gray-200">
                <span className="font-bold text-white">{room.id}</span>
                <span className="ml-3">Host: {room.host_name || "Host"}</span>
                <span className="ml-3">Max: {maxPlayers}</span>
                <span className="ml-3">Left: {minsLeft} min</span>
                <span className="ml-3 text-gray-400">Expires: {expiresText}</span>
              </div>

              <button
                className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-500"
                onClick={() => onJoinRoom(room.id, playerName || "Player")}
              >
                Join
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

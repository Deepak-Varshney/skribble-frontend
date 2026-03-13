import { useState, type FormEvent } from "react";

interface JoinRoomFormProps {
  onJoinRoom: (roomId: string, playerName: string) => void;
}

export default function JoinRoomForm({ onJoinRoom }: JoinRoomFormProps) {
  const [joinName, setJoinName] = useState("Player");
  const [joinCode, setJoinCode] = useState("");

  const inputCls =
    "w-full mt-1 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder-gray-400 outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400";

  const handleJoin = (e: FormEvent) => {
    e.preventDefault();
    onJoinRoom(joinCode.trim().toUpperCase(), joinName);
  };

  return (
    <form className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm flex flex-col" onSubmit={handleJoin}>
      <h2 className="mb-4 text-xl font-bold text-white">Join Room</h2>

      <label className="block text-sm text-gray-300">
        Your Name
        <input
          className={inputCls}
          value={joinName}
          onChange={(e) => setJoinName(e.target.value)}
          maxLength={24}
          required
        />
      </label>
      <label className="mt-3 block text-sm text-gray-300">
        Room Code
        <input
          className={inputCls}
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value)}
          maxLength={6}
          placeholder="ABC123"
          required
        />
      </label>

      <button
        className="mt-auto w-full rounded-xl bg-emerald-600 py-2.5 font-bold text-white transition hover:bg-emerald-500"
        type="submit"
      >
        Join Room
      </button>
    </form>
  );
}

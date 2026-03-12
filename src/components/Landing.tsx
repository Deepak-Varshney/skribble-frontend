import { useState, type FormEvent } from "react";
import { useGame } from "../GameContext";

export default function Landing() {
  const { createRoom, joinRoom, error } = useGame();

  const [hostName, setHostName] = useState("Host");
  const [maxPlayers, setMaxPlayers] = useState(8);
  const [rounds, setRounds] = useState(3);
  const [drawTime, setDrawTime] = useState(80);
  const [wordChoices, setWordChoices] = useState(3);
  const [hintCount, setHintCount] = useState(2);
  const [isPrivate, setIsPrivate] = useState(true);

  const [joinName, setJoinName] = useState("Player");
  const [joinCode, setJoinCode] = useState("");

  const handleCreate = (e: FormEvent) => {
    e.preventDefault();
    createRoom(hostName, { maxPlayers, rounds, drawTime, wordChoices, hintCount, private: isPrivate });
  };

  const handleJoin = (e: FormEvent) => {
    e.preventDefault();
    joinRoom(joinCode.trim().toUpperCase(), joinName);
  };

  const inputCls = "w-full mt-1 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder-gray-400 outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400";

  return (
    <div className="flex flex-col items-center gap-6 pt-10">
      <h1 className="text-5xl font-extrabold tracking-tight bg-linear-to-r from-purple-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">
        🎨 Sketch&nbsp;Clash
      </h1>
      <p className="text-gray-400 -mt-2">Real-time multiplayer drawing &amp; guessing game</p>

      <div className="grid w-full max-w-3xl grid-cols-1 gap-6 md:grid-cols-2">
        {/* Create Room */}
        <form
          className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
          onSubmit={handleCreate}
        >
          <h2 className="mb-4 text-xl font-bold text-white">Create Room</h2>

          <label className="block text-sm text-gray-300">
            Your Name
            <input className={inputCls} value={hostName} onChange={e => setHostName(e.target.value)} maxLength={24} required />
          </label>
          <label className="mt-3 block text-sm text-gray-300">
            Max Players
            <input className={inputCls} type="number" min={2} max={20} value={maxPlayers} onChange={e => setMaxPlayers(+e.target.value)} />
          </label>
          <label className="mt-3 block text-sm text-gray-300">
            Rounds
            <input className={inputCls} type="number" min={1} max={10} value={rounds} onChange={e => setRounds(+e.target.value)} />
          </label>
          <label className="mt-3 block text-sm text-gray-300">
            Draw Time (sec)
            <input className={inputCls} type="number" min={15} max={240} value={drawTime} onChange={e => setDrawTime(+e.target.value)} />
          </label>
          <label className="mt-3 block text-sm text-gray-300">
            Word Choices
            <input className={inputCls} type="number" min={1} max={5} value={wordChoices} onChange={e => setWordChoices(+e.target.value)} />
          </label>
          <label className="mt-3 block text-sm text-gray-300">
            Hint Count
            <input className={inputCls} type="number" min={0} max={5} value={hintCount} onChange={e => setHintCount(+e.target.value)} />
          </label>
          <label className="mt-3 flex items-center gap-2 text-sm text-gray-300">
            <input type="checkbox" className="accent-purple-500" checked={isPrivate} onChange={e => setIsPrivate(e.target.checked)} />
            Private Room
          </label>

          <button className="mt-5 w-full rounded-xl bg-purple-600 py-2.5 font-bold text-white transition hover:bg-purple-500" type="submit">
            Create Room
          </button>
        </form>

        {/* Join Room */}
        <form
          className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm flex flex-col"
          onSubmit={handleJoin}
        >
          <h2 className="mb-4 text-xl font-bold text-white">Join Room</h2>

          <label className="block text-sm text-gray-300">
            Your Name
            <input className={inputCls} value={joinName} onChange={e => setJoinName(e.target.value)} maxLength={24} required />
          </label>
          <label className="mt-3 block text-sm text-gray-300">
            Room Code
            <input className={inputCls} value={joinCode} onChange={e => setJoinCode(e.target.value)} maxLength={6} placeholder="ABC123" required />
          </label>

          <button className="mt-auto w-full rounded-xl bg-emerald-600 py-2.5 font-bold text-white transition hover:bg-emerald-500" type="submit">
            Join Room
          </button>
        </form>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  );
}

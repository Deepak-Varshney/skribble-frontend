import { useState, type FormEvent } from "react";

interface CreateRoomFormProps {
  onCreateRoom: (hostName: string, settings: Record<string, unknown>) => void;
}

export default function CreateRoomForm({ onCreateRoom }: CreateRoomFormProps) {
  const [hostName, setHostName] = useState("Host");
  const [maxPlayers, setMaxPlayers] = useState(8);
  const [rounds, setRounds] = useState(3);
  const [drawTime, setDrawTime] = useState(80);
  const [wordChoices, setWordChoices] = useState(3);
  const [hintCount, setHintCount] = useState(2);
  const [isPrivate, setIsPrivate] = useState(true);

  const inputCls =
    "w-full mt-1 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder-gray-400 outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400";

  const handleCreate = (e: FormEvent) => {
    e.preventDefault();
    onCreateRoom(hostName, {
      maxPlayers,
      rounds,
      drawTime,
      wordChoices,
      hintCount,
      private: isPrivate,
    });
  };

  return (
    <form className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm" onSubmit={handleCreate}>
      <h2 className="mb-4 text-xl font-bold text-white">Create Room</h2>

      <label className="block text-sm text-gray-300">
        Your Name
        <input
          className={inputCls}
          value={hostName}
          onChange={(e) => setHostName(e.target.value)}
          maxLength={24}
          required
        />
      </label>
      <label className="mt-3 block text-sm text-gray-300">
        Max Players
        <input
          className={inputCls}
          type="number"
          min={2}
          max={20}
          value={maxPlayers}
          onChange={(e) => setMaxPlayers(Number(e.target.value))}
        />
      </label>
      <label className="mt-3 block text-sm text-gray-300">
        Rounds
        <input
          className={inputCls}
          type="number"
          min={1}
          max={10}
          value={rounds}
          onChange={(e) => setRounds(Number(e.target.value))}
        />
      </label>
      <label className="mt-3 block text-sm text-gray-300">
        Draw Time (sec)
        <input
          className={inputCls}
          type="number"
          min={15}
          max={240}
          value={drawTime}
          onChange={(e) => setDrawTime(Number(e.target.value))}
        />
      </label>
      <label className="mt-3 block text-sm text-gray-300">
        Word Choices
        <input
          className={inputCls}
          type="number"
          min={1}
          max={5}
          value={wordChoices}
          onChange={(e) => setWordChoices(Number(e.target.value))}
        />
      </label>
      <label className="mt-3 block text-sm text-gray-300">
        Hint Count
        <input
          className={inputCls}
          type="number"
          min={0}
          max={5}
          value={hintCount}
          onChange={(e) => setHintCount(Number(e.target.value))}
        />
      </label>
      <label className="mt-3 flex items-center gap-2 text-sm text-gray-300">
        <input
          type="checkbox"
          className="accent-purple-500"
          checked={isPrivate}
          onChange={(e) => setIsPrivate(e.target.checked)}
        />
        Private Room
      </label>

      <button
        className="mt-5 w-full rounded-xl bg-purple-600 py-2.5 font-bold text-white transition hover:bg-purple-500"
        type="submit"
      >
        Create Room
      </button>
    </form>
  );
}

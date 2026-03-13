import { useGame } from "../GameContext";
import CreateRoomForm from "./landing/CreateRoomForm";
import JoinRoomForm from "./landing/JoinRoomForm";

export default function Landing() {
  const { createRoom, joinRoom, error } = useGame();

  return (
    <div className="flex flex-col items-center gap-6 pt-10">
      <h1 className="text-5xl font-extrabold tracking-tight bg-linear-to-r from-purple-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">
        🎨 Sketch&nbsp;Clash
      </h1>
      <p className="text-gray-400 -mt-2">Real-time multiplayer drawing &amp; guessing game</p>

      <div className="grid w-full max-w-3xl grid-cols-1 gap-6 md:grid-cols-2">
        <CreateRoomForm onCreateRoom={createRoom} />
        <JoinRoomForm onJoinRoom={joinRoom} />
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  );
}

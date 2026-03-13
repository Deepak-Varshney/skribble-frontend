import { useGame } from "../GameContext";
import RoomHeader from "./lobby/RoomHeader";
import PlayersCard from "./lobby/PlayersCard";
import SettingsCard from "./lobby/SettingsCard";
import LobbyActions from "./lobby/LobbyActions";

export default function Lobby() {
  const { snapshot, isHost, toggleReady, startGame, deleteRoom, leaveRoom, roomId, playerId } = useGame();
  if (!snapshot) return null;

  const minsLeft = Math.max(0, Math.ceil((snapshot.expiresAt - Date.now()) / 60000));

  return (
    <div className="flex flex-col items-center gap-6 pt-6">
      <RoomHeader roomId={roomId} />
      <p className="-mt-4 text-sm text-gray-400">Room expires in about {minsLeft} min</p>

      <div className="grid w-full max-w-2xl grid-cols-1 gap-6 md:grid-cols-2">
        <PlayersCard snapshot={snapshot} playerId={playerId} />
        <SettingsCard snapshot={snapshot} />
      </div>

      <LobbyActions
        isHost={isHost}
        canStart={snapshot.players.length >= 2}
        canDeleteRoom={snapshot.isPrivate}
        onToggleReady={toggleReady}
        onStartGame={startGame}
        onDeleteRoom={deleteRoom}
        onLeaveRoom={leaveRoom}
      />
    </div>
  );
}

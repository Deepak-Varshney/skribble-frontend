import { useGame } from "../GameContext";
import RoomHeader from "./lobby/RoomHeader";
import PlayersCard from "./lobby/PlayersCard";
import SettingsCard from "./lobby/SettingsCard";
import LobbyActions from "./lobby/LobbyActions";

export default function Lobby() {
  const { snapshot, isHost, toggleReady, startGame, roomId, playerId } = useGame();
  if (!snapshot) return null;

  return (
    <div className="flex flex-col items-center gap-6 pt-6">
      <RoomHeader roomId={roomId} />

      <div className="grid w-full max-w-2xl grid-cols-1 gap-6 md:grid-cols-2">
        <PlayersCard snapshot={snapshot} playerId={playerId} />
        <SettingsCard snapshot={snapshot} />
      </div>

      <LobbyActions
        isHost={isHost}
        canStart={snapshot.players.length >= 2}
        onToggleReady={toggleReady}
        onStartGame={startGame}
      />
    </div>
  );
}

import { useGame } from "./GameContext";
import Landing from "./components/Landing";
import Lobby from "./components/Lobby";
import GameScreen from "./components/GameScreen";
import GameOver from "./components/GameOver";

export default function App() {
  const { screen } = useGame();

  return (
    <div className="mx-auto max-w-7xl px-2 py-4">
      {screen === "landing" && <Landing />}
      {screen === "lobby" && <Lobby />}
      {screen === "game" && <GameScreen />}
      {screen === "gameover" && <GameOver />}
    </div>
  );
}

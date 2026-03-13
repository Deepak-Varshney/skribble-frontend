import { useGame } from "./GameContext";
import Landing from "./components/Landing";
import Lobby from "./components/Lobby";
import GameScreen from "./components/GameScreen";
import GameOver from "./components/GameOver";

export default function App() {
  const { screen } = useGame();

  let content = <Landing />;
  if (screen === "lobby") content = <Lobby />;
  if (screen === "game") content = <GameScreen />;
  if (screen === "gameover") content = <GameOver />;

  return (
    <div className="mx-auto max-w-7xl px-2 py-4">
      {content}
    </div>
  );
}

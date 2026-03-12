import { useGame } from "../GameContext";

export default function GameOver() {
  const { gameOverData, goLanding } = useGame();
  if (!gameOverData) return null;

  const { winner, leaderboard } = gameOverData;

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm">
        <h1 className="text-4xl font-extrabold text-white">🏆 Game Over!</h1>

        {winner && (
          <h2 className="mt-3 text-xl font-bold text-amber-300">
            {winner.name} wins with {winner.score} pts!
          </h2>
        )}

        <table className="mx-auto mt-6 w-full text-sm text-gray-200">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase text-gray-500">
              <th className="py-2 text-left">#</th>
              <th className="py-2 text-left">Player</th>
              <th className="py-2 text-right">Score</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((p, i) => (
              <tr
                key={p.id}
                className={`border-b border-white/5 ${i === 0 ? "text-amber-300 font-bold" : ""}`}
              >
                <td className="py-2">{i + 1}</td>
                <td className="py-2">{p.name}</td>
                <td className="py-2 text-right font-mono">{p.score}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          className="mt-6 w-full rounded-xl bg-purple-600 py-3 font-bold text-white transition hover:bg-purple-500"
          onClick={goLanding}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

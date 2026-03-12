import { useGame } from "../GameContext";

export default function WordChooser() {
  const { wordOptions, chooseWord, isDrawer } = useGame();

  if (!isDrawer || wordOptions.length === 0) return null;

  return (
    <div className="mb-3 rounded-xl border border-amber-500/30 bg-amber-900/20 p-4 text-center">
      <p className="mb-3 text-sm font-semibold text-amber-200">Pick a word to draw:</p>
      <div className="flex flex-wrap justify-center gap-3">
        {wordOptions.map((w) => (
          <button
            key={w}
            className="rounded-lg bg-amber-600 px-5 py-2 font-bold text-white capitalize transition hover:bg-amber-500"
            onClick={() => chooseWord(w)}
          >
            {w}
          </button>
        ))}
      </div>
    </div>
  );
}

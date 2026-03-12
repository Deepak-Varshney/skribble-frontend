import { useGame } from "../GameContext";
import DrawingCanvas from "./DrawingCanvas";
import PlayerList from "./PlayerList";
import ChatPanel from "./ChatPanel";
import WordChooser from "./WordChooser";

export default function GameScreen() {
  const { snapshot, isDrawer, timer, drawerWord, roundEndData, roomId } = useGame();
  if (!snapshot) return null;

  const phase = snapshot.phase;

  return (
    <div className="flex flex-col gap-3">
      {/* Top bar */}
      <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-4 text-sm text-gray-300">
          <span>
            Room: <strong className="font-mono text-purple-300">{roomId}</strong>
          </span>
          <span>Round {snapshot.round}/{snapshot.settings.rounds}</span>
          <span>Turn {snapshot.turn}/{snapshot.totalTurns}</span>
        </div>

        <div className="flex-1 text-center">
          {phase === "word_select" && isDrawer && (
            <span className="text-amber-300 font-semibold animate-pulse">Pick a word!</span>
          )}
          {phase === "word_select" && !isDrawer && (
            <span className="text-gray-400">{snapshot.drawerName} is picking a word...</span>
          )}
          {phase === "drawing" && (
            <span className="font-mono text-2xl font-bold tracking-[0.3em] text-white">
              {isDrawer ? drawerWord : snapshot.maskedWord}
            </span>
          )}
          {phase === "round_end" && roundEndData && (
            <span className="text-emerald-300">
              The word was: <strong>{roundEndData.word}</strong>
            </span>
          )}
        </div>

        <div className="text-lg font-bold tabular-nums text-white">
          ⏱ {timer}s
        </div>
      </header>

      {/* Main three-column layout */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[220px_1fr_260px]">
        {/* Left sidebar — players */}
        <aside className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
          <PlayerList />
        </aside>

        {/* Center — canvas */}
        <main className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
          <WordChooser />
          <DrawingCanvas />
        </main>

        {/* Right sidebar — chat */}
        <aside className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
          <ChatPanel />
        </aside>
      </div>

      {/* Round end overlay */}
      {phase === "round_end" && roundEndData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="rounded-2xl border border-white/20 bg-slate-900 p-8 text-center shadow-2xl">
            <h2 className="text-2xl font-bold text-white">Round Over!</h2>
            <p className="mt-2 text-emerald-300">
              The word was: <strong className="text-white">{roundEndData.word}</strong>
            </p>
            <p className="mt-3 text-sm text-gray-400">Next round starting soon...</p>
          </div>
        </div>
      )}
    </div>
  );
}

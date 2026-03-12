import { useState, useRef, useEffect, type FormEvent } from "react";
import { useGame } from "../GameContext";

export default function ChatPanel() {
  const { chatLog, sendGuess, isDrawer, snapshot } = useGame();
  const [text, setText] = useState("");
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logRef.current?.scrollTo(0, logRef.current.scrollHeight);
  }, [chatLog]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    sendGuess(trimmed);
    setText("");
  };

  const isGuessing = snapshot?.phase === "drawing" && !isDrawer;

  return (
    <div className="flex h-full flex-col">
      <h3 className="mb-2 text-sm font-bold text-white">Chat</h3>
      <div
        ref={logRef}
        className="flex-1 overflow-y-auto rounded-lg border border-white/10 bg-black/30 p-2 space-y-1 text-xs"
        style={{ minHeight: 200 }}
      >
        {chatLog.map((msg, i) => (
          <p key={i} className={msg.system ? "italic text-purple-300" : "text-gray-300"}>
            {msg.system ? (
              msg.text
            ) : (
              <><span className="font-bold text-white">{msg.playerName}:</span> {msg.text}</>
            )}
          </p>
        ))}
      </div>

      <form className="mt-2 flex gap-2" onSubmit={handleSubmit}>
        <input
          className="flex-1 rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-sm text-white placeholder-gray-500 outline-none focus:border-purple-400"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder={isGuessing ? "Type your guess..." : "Chat..."}
          maxLength={120}
          disabled={isDrawer && snapshot?.phase === "drawing"}
        />
        <button className="rounded-lg bg-purple-600 px-4 py-1.5 text-sm font-bold text-white transition hover:bg-purple-500" type="submit">
          Send
        </button>
      </form>
    </div>
  );
}

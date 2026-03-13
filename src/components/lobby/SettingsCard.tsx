import type { RoomSnapshot } from "../../types";

interface SettingsCardProps {
  snapshot: RoomSnapshot;
}

export default function SettingsCard({ snapshot }: SettingsCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm text-sm text-gray-300 space-y-1">
      <h3 className="mb-3 font-bold text-white">Settings</h3>
      <p>Rounds: {snapshot.settings.rounds}</p>
      <p>Draw Time: {snapshot.settings.drawTime}s</p>
      <p>Word Choices: {snapshot.settings.wordChoices}</p>
      <p>Hints: {snapshot.settings.hintCount}</p>
      <p>Private: {snapshot.isPrivate ? "Yes" : "No"}</p>
    </div>
  );
}

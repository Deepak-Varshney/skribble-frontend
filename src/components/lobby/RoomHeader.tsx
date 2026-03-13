interface RoomHeaderProps {
  roomId: string;
}

export default function RoomHeader({ roomId }: RoomHeaderProps) {
  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}?room=${roomId}`);
  };

  return (
    <div className="flex w-full max-w-2xl items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur-sm">
      <h2 className="text-lg font-bold text-white">
        Room: <span className="font-mono text-purple-300">{roomId}</span>
      </h2>
      <button
        className="rounded-lg bg-purple-600/80 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-purple-500"
        onClick={copyLink}
      >
        Copy Invite
      </button>
    </div>
  );
}

/* ── Shared types for the Skribbl clone ─── */

export interface PlayerInfo {
  id: string;
  name: string;
  score: number;
  ready: boolean;
  hasGuessed: boolean;
}

export interface StrokeData {
  color: string;
  size: number;
  points: { x: number; y: number }[];
}

export interface RoomSettings {
  maxPlayers: number;
  rounds: number;
  drawTime: number;
  wordChoices: number;
  hintCount: number;
}

export interface RoomSnapshot {
  roomId: string;
  hostId: string;
  isPrivate: boolean;
  settings: RoomSettings;
  phase: "lobby" | "word_select" | "drawing" | "round_end" | "game_over" | "starting";
  players: PlayerInfo[];
  drawerId: string | null;
  drawerName: string;
  round: number;
  turn: number;
  totalTurns: number;
  expiresAt: number;
  maskedWord: string;
  strokes: StrokeData[];
}

export interface ChatMsg {
  system?: boolean;
  playerId?: string;
  playerName?: string;
  text: string;
}

export interface GuessResult {
  correct: boolean;
  playerId: string;
  playerName: string;
  points: number;
}

export interface RoundEndPayload {
  reason: string;
  word: string;
  scores: PlayerInfo[];
}

export interface GameOverPayload {
  winner: PlayerInfo | null;
  leaderboard: PlayerInfo[];
}

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { getSocket } from "./socket";
import type {
  RoomSnapshot,
  ChatMsg,
  GuessResult,
  RoundEndPayload,
  GameOverPayload,
  PlayerInfo,
} from "./types";

/* ── State shape ──────────────────────────────────── */

interface GameState {
  screen: "landing" | "lobby" | "game" | "gameover";
  playerId: string;
  roomId: string;
  snapshot: RoomSnapshot | null;
  chatLog: ChatMsg[];
  wordOptions: string[];
  drawerWord: string;
  roundEndData: RoundEndPayload | null;
  gameOverData: GameOverPayload | null;
  error: string;
  timer: number;
}

const initial: GameState = {
  screen: "landing",
  playerId: "",
  roomId: "",
  snapshot: null,
  chatLog: [],
  wordOptions: [],
  drawerWord: "",
  roundEndData: null,
  gameOverData: null,
  error: "",
  timer: 0,
};

/* ── Actions ──────────────────────────────────────── */

type Action =
  | { type: "ROOM_CREATED"; roomId: string; playerId: string }
  | { type: "JOINED_ROOM"; roomId: string; playerId: string }
  | { type: "LOBBY_UPDATE"; snapshot: RoomSnapshot }
  | { type: "GAME_STATE"; snapshot: RoomSnapshot }
  | { type: "CHAT"; msg: ChatMsg }
  | { type: "GUESS_RESULT"; result: GuessResult }
  | { type: "WORD_OPTIONS"; options: string[] }
  | { type: "DRAWER_WORD"; word: string }
  | { type: "WORD_CHOSEN"; maskedWord: string; drawTime: number }
  | { type: "HINT_UPDATE"; maskedWord: string }
  | { type: "ROUND_START" }
  | { type: "ROUND_END"; data: RoundEndPayload }
  | { type: "GAME_OVER"; data: GameOverPayload }
  | { type: "ERROR"; message: string }
  | { type: "TICK" }
  | { type: "GO_LANDING" };

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "ROOM_CREATED":
      return { ...state, roomId: action.roomId, playerId: action.playerId, screen: "lobby", error: "" };
    case "JOINED_ROOM":
      return { ...state, roomId: action.roomId, playerId: action.playerId, screen: "lobby", error: "" };
    case "LOBBY_UPDATE":
      return {
        ...state,
        snapshot: action.snapshot,
        screen: action.snapshot.phase === "lobby" ? "lobby" : state.screen,
      };
    case "GAME_STATE": {
      const s = action.snapshot;
      const screen =
        s.phase === "lobby" ? "lobby"
        : s.phase === "game_over" ? "gameover"
        : "game";
      return { ...state, snapshot: s, screen };
    }
    case "CHAT":
      return { ...state, chatLog: [...state.chatLog, action.msg] };
    case "GUESS_RESULT":
      return {
        ...state,
        chatLog: [
          ...state.chatLog,
          { system: true, text: `🎉 ${action.result.playerName} guessed it! (+${action.result.points})` },
        ],
      };
    case "WORD_OPTIONS":
      return { ...state, wordOptions: action.options, drawerWord: "" };
    case "DRAWER_WORD":
      return { ...state, drawerWord: action.word };
    case "WORD_CHOSEN":
      return {
        ...state,
        wordOptions: [],
        timer: action.drawTime,
        snapshot: state.snapshot ? { ...state.snapshot, maskedWord: action.maskedWord, phase: "drawing" } : state.snapshot,
      };
    case "HINT_UPDATE":
      return { ...state, snapshot: state.snapshot ? { ...state.snapshot, maskedWord: action.maskedWord } : state.snapshot };
    case "ROUND_START":
      return { ...state, chatLog: [], roundEndData: null, drawerWord: "", screen: "game" };
    case "ROUND_END":
      return { ...state, roundEndData: action.data, chatLog: [...state.chatLog, { system: true, text: `Round over! The word was "${action.data.word}"` }] };
    case "GAME_OVER":
      return { ...state, gameOverData: action.data, screen: "gameover" };
    case "ERROR":
      return { ...state, error: action.message };
    case "TICK":
      return { ...state, timer: Math.max(0, state.timer - 1) };
    case "GO_LANDING":
      return { ...initial };
    default:
      return state;
  }
}

/* ── Context ──────────────────────────────────────── */

interface GameContextValue extends GameState {
  createRoom: (hostName: string, settings: Record<string, unknown>) => void;
  joinRoom: (roomId: string, playerName: string) => void;
  toggleReady: () => void;
  startGame: () => void;
  chooseWord: (word: string) => void;
  sendGuess: (text: string) => void;
  sendChat: (text: string) => void;
  goLanding: () => void;
  isDrawer: boolean;
  isHost: boolean;
}

const GameContext = createContext<GameContextValue>(null!);

export function useGame() {
  return useContext(GameContext);
}

/* ── Provider ─────────────────────────────────────── */

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);
  const socket = getSocket();

  /* Socket listeners */
  useEffect(() => {
    socket.on("room_created", (d: { roomId: string; playerId: string }) =>
      dispatch({ type: "ROOM_CREATED", roomId: d.roomId, playerId: d.playerId }));

    socket.on("joined_room", (d: { roomId: string; playerId: string }) =>
      dispatch({ type: "JOINED_ROOM", roomId: d.roomId, playerId: d.playerId }));

    socket.on("lobby_update", (s: RoomSnapshot) =>
      dispatch({ type: "LOBBY_UPDATE", snapshot: s }));

    socket.on("game_state", (s: RoomSnapshot) =>
      dispatch({ type: "GAME_STATE", snapshot: s }));

    socket.on("chat_message", (m: ChatMsg) =>
      dispatch({ type: "CHAT", msg: m }));

    socket.on("guess_result", (r: GuessResult) =>
      dispatch({ type: "GUESS_RESULT", result: r }));

    socket.on("word_options", (d: { options: string[] }) =>
      dispatch({ type: "WORD_OPTIONS", options: d.options }));

    socket.on("drawer_word", (d: { word: string }) =>
      dispatch({ type: "DRAWER_WORD", word: d.word }));

    socket.on("word_chosen", (d: { maskedWord: string; drawTime: number }) =>
      dispatch({ type: "WORD_CHOSEN", maskedWord: d.maskedWord, drawTime: d.drawTime }));

    socket.on("hint_update", (d: { maskedWord: string }) =>
      dispatch({ type: "HINT_UPDATE", maskedWord: d.maskedWord }));

    socket.on("round_start", () =>
      dispatch({ type: "ROUND_START" }));

    socket.on("round_end", (d: RoundEndPayload) =>
      dispatch({ type: "ROUND_END", data: d }));

    socket.on("game_over", (d: GameOverPayload) =>
      dispatch({ type: "GAME_OVER", data: d }));

    socket.on("error_msg", (d: { message: string }) =>
      dispatch({ type: "ERROR", message: d.message }));

    return () => { socket.removeAllListeners(); };
  }, [socket]);

  /* Timer tick */
  useEffect(() => {
    if (state.timer <= 0) return;
    const id = setInterval(() => dispatch({ type: "TICK" }), 1000);
    return () => clearInterval(id);
  }, [state.timer]);

  /* Actions */
  const createRoom = useCallback((hostName: string, settings: Record<string, unknown>) => {
    socket.emit("create_room", { hostName, settings });
  }, [socket]);

  const joinRoom = useCallback((roomId: string, playerName: string) => {
    socket.emit("join_room", { roomId, playerName });
  }, [socket]);

  const toggleReady = useCallback(() => {
    socket.emit("toggle_ready", { roomId: state.roomId });
  }, [socket, state.roomId]);

  const startGame = useCallback(() => {
    socket.emit("start_game", { roomId: state.roomId });
  }, [socket, state.roomId]);

  const chooseWord = useCallback((word: string) => {
    socket.emit("word_chosen", { roomId: state.roomId, word });
  }, [socket, state.roomId]);

  const sendGuess = useCallback((text: string) => {
    socket.emit("guess", { roomId: state.roomId, text });
  }, [socket, state.roomId]);

  const sendChat = useCallback((text: string) => {
    socket.emit("chat", { roomId: state.roomId, text });
  }, [socket, state.roomId]);

  const goLanding = useCallback(() => {
    dispatch({ type: "GO_LANDING" });
  }, []);

  const isDrawer = state.snapshot?.drawerId === state.playerId;
  const isHost = state.snapshot?.hostId === state.playerId;

  return (
    <GameContext.Provider value={{ ...state, createRoom, joinRoom, toggleReady, startGame, chooseWord, sendGuess, sendChat, goLanding, isDrawer, isHost }}>
      {children}
    </GameContext.Provider>
  );
}

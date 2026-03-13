import {
  createContext,
  useContext,
  useState,
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
} from "./types";

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

const initialState: GameState = {
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

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(initialState);
  const socket = getSocket();

  useEffect(() => {
    socket.on("room_created", (d: { roomId: string; playerId: string }) => {
      setState((prev) => ({
        ...prev,
        roomId: d.roomId,
        playerId: d.playerId,
        screen: "lobby",
        error: "",
      }));
    });

    socket.on("joined_room", (d: { roomId: string; playerId: string }) => {
      setState((prev) => ({
        ...prev,
        roomId: d.roomId,
        playerId: d.playerId,
        screen: "lobby",
        error: "",
      }));
    });

    socket.on("lobby_update", (snapshot: RoomSnapshot) => {
      setState((prev) => ({
        ...prev,
        snapshot,
        screen: snapshot.phase === "lobby" ? "lobby" : prev.screen,
      }));
    });

    socket.on("game_state", (snapshot: RoomSnapshot) => {
      let screen: GameState["screen"] = "game";
      if (snapshot.phase === "lobby") screen = "lobby";
      if (snapshot.phase === "game_over") screen = "gameover";

      setState((prev) => ({
        ...prev,
        snapshot,
        screen,
      }));
    });

    socket.on("chat_message", (msg: ChatMsg) => {
      setState((prev) => ({
        ...prev,
        chatLog: [...prev.chatLog, msg],
      }));
    });

    socket.on("guess_result", (result: GuessResult) => {
      const systemMsg: ChatMsg = {
        system: true,
        text: `${result.playerName} guessed it! (+${result.points})`,
      };

      setState((prev) => ({
        ...prev,
        chatLog: [...prev.chatLog, systemMsg],
      }));
    });

    socket.on("word_options", (d: { options: string[] }) => {
      setState((prev) => ({
        ...prev,
        wordOptions: d.options,
        drawerWord: "",
      }));
    });

    socket.on("drawer_word", (d: { word: string }) => {
      setState((prev) => ({ ...prev, drawerWord: d.word }));
    });

    socket.on("word_chosen", (d: { maskedWord: string; drawTime: number }) => {
      setState((prev) => ({
        ...prev,
        wordOptions: [],
        timer: d.drawTime,
        snapshot: prev.snapshot
          ? { ...prev.snapshot, maskedWord: d.maskedWord, phase: "drawing" }
          : prev.snapshot,
      }));
    });

    socket.on("hint_update", (d: { maskedWord: string }) => {
      setState((prev) => ({
        ...prev,
        snapshot: prev.snapshot ? { ...prev.snapshot, maskedWord: d.maskedWord } : prev.snapshot,
      }));
    });

    socket.on("round_start", () => {
      setState((prev) => ({
        ...prev,
        chatLog: [],
        roundEndData: null,
        drawerWord: "",
        screen: "game",
      }));
    });

    socket.on("round_end", (data: RoundEndPayload) => {
      setState((prev) => ({
        ...prev,
        roundEndData: data,
        chatLog: [...prev.chatLog, { system: true, text: `Round over! The word was "${data.word}"` }],
      }));
    });

    socket.on("game_over", (data: GameOverPayload) => {
      setState((prev) => ({
        ...prev,
        gameOverData: data,
        screen: "gameover",
      }));
    });

    socket.on("error_msg", (d: { message: string }) => {
      setState((prev) => ({ ...prev, error: d.message }));
    });

    return () => { socket.removeAllListeners(); };
  }, [socket]);

  useEffect(() => {
    if (state.timer <= 0) return;
    const id = setInterval(() => {
      setState((prev) => ({ ...prev, timer: Math.max(0, prev.timer - 1) }));
    }, 1000);
    return () => clearInterval(id);
  }, [state.timer]);

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
    setState(initialState);
  }, []);

  const isDrawer = state.snapshot?.drawerId === state.playerId;
  const isHost = state.snapshot?.hostId === state.playerId;

  return (
    <GameContext.Provider value={{ ...state, createRoom, joinRoom, toggleReady, startGame, chooseWord, sendGuess, sendChat, goLanding, isDrawer, isHost }}>
      {children}
    </GameContext.Provider>
  );
}

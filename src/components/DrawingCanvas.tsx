import { useEffect, useRef, useState, useCallback } from "react";
import { Canvas, PencilBrush } from "fabric";
import { getSocket } from "../socket";
import { useGame } from "../GameContext";
import type { StrokeData } from "../types";

const CANVAS_W = 900;
const CANVAS_H = 520;

export default function DrawingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<Canvas | null>(null);
  const { isDrawer, roomId, snapshot } = useGame();
  const socket = getSocket();

  const [brushColor, setBrushColor] = useState("#111111");
  const [brushSize, setBrushSize] = useState(4);

  /* ── Init fabric canvas ─────────────────────────── */
  useEffect(() => {
    if (!canvasRef.current) return;

    const fc = new Canvas(canvasRef.current, {
      width: CANVAS_W,
      height: CANVAS_H,
      isDrawingMode: false,
      backgroundColor: "#ffffff",
      selection: false,
    });

    fabricRef.current = fc;
    return () => { fc.dispose(); };
  }, []);

  /* ── Toggle drawing mode for drawer ─────────────── */
  useEffect(() => {
    const fc = fabricRef.current;
    if (!fc) return;

    fc.isDrawingMode = isDrawer;
    if (isDrawer) {
      const brush = new PencilBrush(fc);
      brush.color = brushColor;
      brush.width = brushSize;
      fc.freeDrawingBrush = brush;
    }
  }, [isDrawer, brushColor, brushSize]);

  /* ── Drawer: send completed stroke ──────────────── */
  useEffect(() => {
    const fc = fabricRef.current;
    if (!fc || !isDrawer) return;

    const onPathCreated = (e: { path?: unknown }) => {
      const pathObj = e.path as { path?: Array<Array<string | number>> } | undefined;
      if (!pathObj?.path) return;
      const points: { x: number; y: number }[] = [];
      for (const seg of pathObj.path) {
        if (seg[0] === "M" || seg[0] === "L") {
          points.push({ x: Number(seg[1]), y: Number(seg[2]) });
        } else if (seg[0] === "Q") {
          points.push({ x: Number(seg[1]), y: Number(seg[2]) });
          points.push({ x: Number(seg[3]), y: Number(seg[4]) });
        }
      }
      if (points.length >= 2) {
        const stroke: StrokeData = { color: brushColor, size: brushSize, points };
        socket.emit("draw_data", { roomId, stroke });
      }
    };

    fc.on("path:created", onPathCreated);
    return () => { fc.off("path:created", onPathCreated); };
  }, [isDrawer, brushColor, brushSize, roomId, socket]);

  /* ── Viewer: draw incoming strokes ──────────────── */
  const drawStroke = useCallback((stroke: StrokeData) => {
    const fc = fabricRef.current;
    if (!fc) return;

    const ctx = fc.getContext();
    ctx.beginPath();
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.size;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    for (let i = 0; i < stroke.points.length; i++) {
      const p = stroke.points[i];
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
  }, []);

  const redrawAll = useCallback((strokes: StrokeData[]) => {
    const fc = fabricRef.current;
    if (!fc) return;

    fc.clear();
    fc.backgroundColor = "#ffffff";
    fc.renderAll();

    for (const s of strokes) {
      drawStroke(s);
    }
  }, [drawStroke]);

  useEffect(() => {
    const onDrawData = ({ stroke }: { stroke: StrokeData }) => {
      if (!isDrawer) drawStroke(stroke);
    };

    const onCanvasState = ({ strokes }: { strokes: StrokeData[] }) => {
      redrawAll(strokes);
    };

    socket.on("draw_data", onDrawData);
    socket.on("canvas_state", onCanvasState);
    return () => { socket.off("draw_data", onDrawData); socket.off("canvas_state", onCanvasState); };
  }, [socket, isDrawer, drawStroke, redrawAll]);

  /* ── Redraw full canvas on round start ──────────── */
  useEffect(() => {
    if (snapshot?.strokes) {
      redrawAll(snapshot.strokes);
    }
  }, [snapshot?.phase, snapshot?.strokes, redrawAll]);

  /* ── Toolbar actions ────────────────────────────── */
  const handleUndo = () => socket.emit("draw_undo", { roomId });
  const handleClear = () => socket.emit("canvas_clear", { roomId });

  return (
    <div>
      <canvas ref={canvasRef} className="w-full rounded-xl border-2 border-white/20" />

      {isDrawer && (
        <div className="mt-3 flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-xs text-gray-300">
            Color
            <input
              type="color"
              value={brushColor}
              onChange={e => setBrushColor(e.target.value)}
              className="h-8 w-9 cursor-pointer rounded border border-white/20 bg-transparent"
            />
          </label>
          <label className="flex items-center gap-2 text-xs text-gray-300">
            Size ({brushSize})
            <input
              type="range"
              min={1}
              max={24}
              value={brushSize}
              onChange={e => setBrushSize(+e.target.value)}
              className="accent-purple-500"
            />
          </label>
          <button
            className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/20"
            onClick={handleUndo}
          >
            ↩ Undo
          </button>
          <button
            className="rounded-lg bg-red-600/80 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-500"
            onClick={handleClear}
          >
            🗑 Clear
          </button>
        </div>
      )}
    </div>
  );
}

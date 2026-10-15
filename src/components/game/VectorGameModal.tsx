import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { VectorRunnerEngine, GameTelemetry } from "./VectorRunnerEngine";
import { gameAudio } from "../../lib/game/gameAudio";
import { useModalScrollLock } from "../../hooks/useModalScrollLock";
import {
  X,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  Trophy,
  Zap,
  Activity,
  Layers,
  Sparkles,
  ShieldAlert,
  Terminal
} from "lucide-react";

interface VectorGameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VectorGameModal: React.FC<VectorGameModalProps> = ({ isOpen, onClose }) => {
  const [gameState, setGameState] = useState<"title" | "playing" | "gameover">("title");
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [highScore, setHighScore] = useState(0);

  const [telemetry, setTelemetry] = useState<GameTelemetry>({
    score: 0,
    vectorsIndexed: 0,
    latencyMs: 8.4,
    burstCharges: 3,
    health: 100,
    distance: 0,
  });

  useModalScrollLock(isOpen);

  useEffect(() => {
    const saved = localStorage.getItem("rag_vector_runner_highscore");
    if (saved) {
      setHighScore(parseInt(saved, 10));
    }
  }, []);

  const handleStartGame = () => {
    setGameState("playing");
    setIsPaused(false);
    setTelemetry({
      score: 0,
      vectorsIndexed: 0,
      latencyMs: 8.4,
      burstCharges: 3,
      health: 100,
      distance: 0,
    });
  };

  const handleGameOver = (finalStats: GameTelemetry) => {
    setGameState("gameover");
    setTelemetry(finalStats);
    if (finalStats.score > highScore) {
      setHighScore(finalStats.score);
      localStorage.setItem("rag_vector_runner_highscore", finalStats.score.toString());
    }
  };

  const handleToggleMute = () => {
    gameAudio.isMuted = !isMuted;
    setIsMuted(!isMuted);
  };

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="game-title"
    >
      <div
        className="relative w-full max-w-5xl h-[92vh] max-h-[820px] bg-[#050A06] border border-[#166534] dark:border-[#22C55E] flex flex-col shadow-2xl overflow-hidden font-mono"
        data-lenis-prevent
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#0A140C] border-b border-[#1B3022] text-xs z-30">
          <div className="flex items-center gap-2 text-white">
            <div className="p-1 bg-[#166534] text-white">
              <Terminal className="w-3.5 h-3.5 text-[#22C55E]" />
            </div>
            <div>
              <span id="game-title" className="font-bold uppercase tracking-wider text-white">
                Vector Runner: RAG Pipeline Defender
              </span>
              <span className="hidden sm:inline-block text-[#A7B0AA] text-[10px] ml-2">
                Qdrant Index Simulator · IIITG Systems Lab
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleMute}
              className="p-1.5 border border-[#1B3022] hover:border-[#22C55E] text-[#A7B0AA] hover:text-white transition-colors"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-[#22C55E]" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 border border-[#1B3022] hover:border-[#22C55E] text-[#A7B0AA] hover:text-white transition-colors"
              title="Exit Game"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3D Game Playfield Area */}
        <div className="relative flex-1 w-full h-full overflow-hidden bg-[#050A06]">
          <VectorRunnerEngine
            isPlaying={gameState === "playing"}
            isPaused={isPaused}
            onGameOver={handleGameOver}
            onUpdateTelemetry={setTelemetry}
          />

          {/* In-Game Lightweight Telemetry HUD (Unobtrusive <15% footprint) */}
          {gameState === "playing" && (
            <div className="absolute top-4 inset-x-4 flex justify-between items-start pointer-events-none z-20">
              <div className="flex flex-wrap gap-2">
                <div className="px-3 py-1.5 bg-black/80 border border-[#1B3022] text-[11px] text-white">
                  <div className="text-[9px] uppercase tracking-wider text-[#A7B0AA]">Score</div>
                  <div className="font-bold text-sm text-[#22C55E] tabular-nums">{telemetry.score}</div>
                </div>

                <div className="px-3 py-1.5 bg-black/80 border border-[#1B3022] text-[11px] text-white">
                  <div className="text-[9px] uppercase tracking-wider text-[#A7B0AA]">Dense Nodes</div>
                  <div className="font-bold text-sm tabular-nums text-white">{telemetry.vectorsIndexed}</div>
                </div>

                <div className="hidden sm:block px-3 py-1.5 bg-black/80 border border-[#1B3022] text-[11px] text-white">
                  <div className="text-[9px] uppercase tracking-wider text-[#A7B0AA]">P99 Latency</div>
                  <div className="font-bold text-sm tabular-nums text-[#38BDF8]">{telemetry.latencyMs}ms</div>
                </div>
              </div>

              <div className="flex gap-2">
                <div className="px-3 py-1.5 bg-black/80 border border-[#1B3022] text-[11px] text-white">
                  <div className="text-[9px] uppercase tracking-wider text-[#A7B0AA]">Integrity</div>
                  <div
                    className={`font-bold text-sm tabular-nums ${
                      telemetry.health > 50 ? "text-[#22C55E]" : telemetry.health > 25 ? "text-amber-400" : "text-red-500 animate-pulse"
                    }`}
                  >
                    {telemetry.health}%
                  </div>
                </div>

                <div className="px-3 py-1.5 bg-black/80 border border-[#166534] text-[11px] text-white">
                  <div className="text-[9px] uppercase tracking-wider text-[#22C55E]">Cosine Bursts</div>
                  <div className="font-bold text-sm tabular-nums text-white">
                    {telemetry.burstCharges} <span className="text-[9px] text-[#A7B0AA]">(Space / W)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Title Screen Overlay */}
          {gameState === "title" && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-30">
              <div className="max-w-md space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#22C55E]/40 bg-[#0F2414] text-[11px] text-[#22C55E] uppercase tracking-widest">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Interactive Systems Simulation</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white uppercase">
                  Vector Runner
                </h2>

                <p className="text-xs text-[#A7B0AA] leading-relaxed">
                  Pilot Abhas Sen's Query Embedding Probe down an infinite vector ingestion highway. Ingest 768-dim vector embeddings, collect Cross-Encoder rerank boosts, and blast corrupted token noise with Cosine Similarity Bursts.
                </p>

                {/* Key Controls Guide */}
                <div className="p-3 bg-[#0A140C] border border-[#1B3022] text-left text-xs space-y-1.5">
                  <div className="text-[10px] text-[#22C55E] uppercase tracking-wider font-bold">
                    Controls
                  </div>
                  <div className="flex justify-between text-[#A7B0AA]">
                    <span>Steer Lanes</span>
                    <span className="text-white font-bold">A / D or ← / →</span>
                  </div>
                  <div className="flex justify-between text-[#A7B0AA]">
                    <span>Cosine Similarity Burst</span>
                    <span className="text-white font-bold">Space / W / ↑</span>
                  </div>
                  <div className="flex justify-between text-[#A7B0AA]">
                    <span>Best High Score</span>
                    <span className="text-[#22C55E] font-bold">{highScore} PTS</span>
                  </div>
                </div>

                <button
                  onClick={handleStartGame}
                  className="w-full py-3 px-6 bg-[#166534] hover:bg-[#14532D] text-white font-bold uppercase tracking-wider text-xs border border-[#22C55E] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Start Pipeline Simulation</span>
                </button>
              </div>
            </div>
          )}

          {/* Game Over Screen Overlay */}
          {gameState === "gameover" && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30">
              <div className="max-w-md w-full space-y-5 bg-[#0A140C] border border-[#1B3022] p-6 shadow-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 border border-red-500/40 bg-red-950/40 text-[11px] text-red-400 uppercase tracking-widest">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Pipeline Buffer Overflow</span>
                </div>

                <h3 className="text-2xl font-bold uppercase tracking-tight text-white">
                  Simulation Ended
                </h3>

                {/* Score Summary Metrics */}
                <div className="grid grid-cols-2 gap-3 p-3 bg-black/60 border border-[#1B3022] text-xs">
                  <div>
                    <div className="text-[10px] text-[#A7B0AA] uppercase">Final Score</div>
                    <div className="text-lg font-bold text-[#22C55E]">{telemetry.score}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#A7B0AA] uppercase">High Score</div>
                    <div className="text-lg font-bold text-white flex items-center justify-center gap-1">
                      <Trophy className="w-4 h-4 text-amber-400" />
                      <span>{Math.max(highScore, telemetry.score)}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#A7B0AA] uppercase">Dense Nodes Indexed</div>
                    <div className="text-base font-bold text-white">{telemetry.vectorsIndexed}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#A7B0AA] uppercase">Pipeline Distance</div>
                    <div className="text-base font-bold text-white">{telemetry.distance}m</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleStartGame}
                    className="flex-1 py-2.5 px-4 bg-[#166534] hover:bg-[#14532D] text-white font-bold uppercase tracking-wider text-xs border border-[#22C55E] transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Run Ingestion Again</span>
                  </button>

                  <button
                    onClick={onClose}
                    className="py-2.5 px-4 bg-transparent border border-[#1B3022] text-[#A7B0AA] hover:text-white uppercase tracking-wider text-xs transition-colors cursor-pointer"
                  >
                    Exit
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

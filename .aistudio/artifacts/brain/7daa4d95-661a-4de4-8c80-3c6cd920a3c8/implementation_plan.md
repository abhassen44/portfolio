# Vector Runner: RAG Pipeline Defender (3D Interactive Game)

## User Review & Critical Decisions

> [!IMPORTANT]
> Both questions from Phase 1 have been confirmed:
> 1. **Concept**: **RAG Pipeline & Vector Search Runner**, directly tied to Abhas Sen's real portfolio work on hybrid dense/sparse semantic retrieval, Qdrant vector indexing, and embedding pipelines.
> 2. **Integration Mode**: **Modal overlay dialog with high-score tracking** and dedicated trigger in the Navbar ("Vector Game" / terminal icon) and Hero section.

---

## 1. Overview & Core Concept

### What It Does
*Vector Runner: RAG Pipeline Defender* is a fast-paced, hardware-accelerated 3D systems runner built with **Three.js**.
The player pilots a high-speed **Query Embedding Probe** down an infinite vector space pipeline (representing a high-throughput Qdrant & Celery ingestion stream).
- **Collect**: Dense Vector Embeddings (768-dim green nodes), BM25 Sparse Index Packets, and Cross-Encoder Rerank Powerups.
- **Dodge / Blast**: Out-of-Distribution Noise, Corrupted Tokens, and Memory Leaks.
- **Mechanics**:
  - `A` / `D` or `ArrowLeft` / `ArrowRight` (or touch swipe on mobile): Lateral lane switching across 5 vector lanes.
  - `Space` or `W` / `ArrowUp` (or tap Action button): Execute Cosine Similarity Burst to clear noisy token obstacles.
  - Multiplier builds up as you maintain sub-10ms retrieval latency without cache misses.
- **Audio & Game Feel**: Built-in Web Audio API synthesizer for procedural laser pings, node pickup chimes, error rumble, and hitstop visual shake.
- **Persistence**: High score and longest latency streak saved in `localStorage`.

---

## 2. Visual Identity & Game Shell

- **Aesthetic**: Retro-futuristic cyberpunk terminal aesthetics matched to Abhas's green-accented systems engineer portfolio (`#050805`, `#166534`, `#22C55E`, `#0D1711`).
- **Low-Occlusion UI (<15% footprint)**:
  - Header telemetry HUD: `Cosine Precision %`, `Latency (ms)`, `Score`, `High Score`.
  - Title Screen with inline SVG vector crest and controls guide (`WASD / Arrows · Space Burst · Esc Exit`).
  - Victory / Game Over summary screen with replay CTA and performance telemetry (total vectors indexed, tokens purged, best streak).
- **Procedural 3D Subjects (Three.js)**:
  - **Player Probe**: Composite 5-part vessel (core geometric fuselage, floating vector wings, glowing cyan/green ion thruster).
  - **Environment**: Infinite grid tunnel with pulsating coordinate markers, floating vector point clouds, and directional lights.
  - **Collectibles**: Faceted floating icosahedrons rotating with gentle hover bobbing.
  - **Obstacles**: Jagged corrupted octahedron glitch cubes with pulsing emissive warning colors.

---

## 3. Technical Architecture & Component Flow

```
┌────────────────────────────────────────────────────────┐
│                   Portfolio App Root                   │
│   Navbar / Hero [Play Vector Runner] button            │
│                       │                                │
│                       ▼                                │
│     ┌────────────────────────────────────┐             │
│     │     VectorGameModal (Portal z-100) │             │
│     │  - useModalScrollLock(isOpen)      │             │
│     │  - High score in localStorage      │             │
│     └─────────────────┬──────────────────┘             │
│                       │                                │
│                       ▼                                │
│     ┌────────────────────────────────────┐             │
│     │     VectorRunnerEngine (Three.js)  │             │
│     │  - Isolated canvas ref (60 FPS loop│             │
│     │  - Web Audio API Sound Synth       │             │
│     │  - Procedural 3D models & lanes    │             │
│     │  - Collision detection & particles │             │
│     └────────────────────────────────────┘             │
└────────────────────────────────────────────────────────┘
```

---

## 4. Implementation Steps

1. **Procedural Web Audio Synth (`src/lib/game/gameAudio.ts`)**:
   - Zero-external asset Web Audio synthesizer for laser zaps, collect chimes, hit sounds, and game over noise.
2. **Three.js Game Engine (`src/components/game/VectorRunnerEngine.tsx`)**:
   - Canvas mount with `PerspectiveCamera`, `WebGLRenderer` (ACESFilmicToneMapping), directional + hemisphere lighting.
   - 5-lane procedural lane runner with smoothly damped camera follow.
   - Vector token spawning, hit tests, particle bursts, and collision resolution.
3. **Game Modal Shell & HUD (`src/components/game/VectorGameModal.tsx`)**:
   - Full-screen or large viewport modal portaled to `document.body` with `z-[100]`.
   - Title screen, play HUD, pause menu, and game over screen with high-score storage.
   - Mobile touch controls (virtual left/right/action pads for phones/tablets).
4. **Trigger Integration (`Navbar.tsx` & `Hero.tsx`)**:
   - Add a "Vector Game" terminal launcher button in the Navbar and Hero action row.
5. **Lint & Build Verification**:
   - Verify complete TypeScript compilation and run tests to ensure 60fps responsiveness.

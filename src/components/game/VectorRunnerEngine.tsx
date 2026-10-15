import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { gameAudio } from "../../lib/game/gameAudio";

export interface GameTelemetry {
  score: number;
  vectorsIndexed: number;
  latencyMs: number;
  burstCharges: number;
  health: number;
  distance: number;
}

interface VectorRunnerEngineProps {
  isPlaying: boolean;
  isPaused: boolean;
  onGameOver: (finalStats: GameTelemetry) => void;
  onUpdateTelemetry: (stats: GameTelemetry) => void;
}

export const VectorRunnerEngine: React.FC<VectorRunnerEngineProps> = ({
  isPlaying,
  isPaused,
  onGameOver,
  onUpdateTelemetry,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({
    currentLane: 2, // 0 to 4 (5 lanes: -4, -2, 0, 2, 4)
    targetLaneX: 0,
    burstAvailable: 3,
    health: 100,
    score: 0,
    vectorsIndexed: 0,
    latencyMs: 8.4,
    speed: 34,
    distance: 0,
    hitStopUntil: 0,
  });

  // Track key actions
  useEffect(() => {
    if (!isPlaying || isPaused) return;

    const lanePositions = [-4.4, -2.2, 0, 2.2, 4.4];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") {
        e.preventDefault();
        stateRef.current.currentLane = Math.max(0, stateRef.current.currentLane - 1);
        stateRef.current.targetLaneX = lanePositions[stateRef.current.currentLane];
      } else if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") {
        e.preventDefault();
        stateRef.current.currentLane = Math.min(4, stateRef.current.currentLane + 1);
        stateRef.current.targetLaneX = lanePositions[stateRef.current.currentLane];
      } else if (e.key === " " || e.key === "ArrowUp" || e.key.toLowerCase() === "w") {
        e.preventDefault();
        triggerBurst();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, isPaused]);

  // Handle Burst Action (Public trigger for mobile or desktop button)
  const triggerBurst = () => {
    if (stateRef.current.burstAvailable > 0) {
      stateRef.current.burstAvailable--;
      gameAudio.playLaser();
      // Clear nearby obstacles within forward range
      if (obstaclePoolRef.current) {
        obstaclePoolRef.current.forEach((obs) => {
          if (obs.active && obs.mesh.position.z > -40 && obs.mesh.position.z < 10) {
            obs.active = false;
            obs.mesh.visible = false;
            createExplosion(obs.mesh.position.x, obs.mesh.position.y, obs.mesh.position.z, 0xff3b30);
            stateRef.current.score += 75;
          }
        });
      }
    }
  };

  const obstaclePoolRef = useRef<Array<{ mesh: THREE.Group; active: boolean; lane: number }>>([]);
  const tokenPoolRef = useRef<Array<{ mesh: THREE.Mesh; active: boolean; lane: number; type: "dense" | "rerank" }>>([]);
  const explosionPoolRef = useRef<Array<{ points: THREE.Points; life: number; maxLife: number; active: boolean }>>([]);

  const createExplosion = (x: number, y: number, z: number, color: number) => {
    const explosion = explosionPoolRef.current.find((e) => !e.active);
    if (!explosion) return;

    explosion.active = true;
    explosion.life = 0;
    explosion.points.position.set(x, y, z);
    explosion.points.visible = true;
    const material = explosion.points.material as THREE.PointsMaterial;
    material.color.setHex(color);
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, WebGLRenderer Setup
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050a06);
    scene.fog = new THREE.FogExp2(0x050a06, 0.022);

    const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 200);
    camera.position.set(0, 3.2, 7.5);
    camera.lookAt(0, 1.2, -10);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // 2. Lighting Rig
    const hemiLight = new THREE.HemisphereLight(0x22c55e, 0x051008, 0.7);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(10, 20, 10);
    scene.add(dirLight);

    const probeLight = new THREE.PointLight(0x22c55e, 2.5, 12);
    scene.add(probeLight);

    // 3. Grid Vector Highway
    const gridHelper = new THREE.GridHelper(160, 40, 0x22c55e, 0x0d2814);
    gridHelper.position.set(0, 0, -40);
    scene.add(gridHelper);

    // Lateral Highway Rails (5 lanes)
    const laneX = [-4.4, -2.2, 0, 2.2, 4.4];
    const railMat = new THREE.LineBasicMaterial({ color: 0x166534, transparent: true, opacity: 0.6 });
    laneX.forEach((lx) => {
      const railGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(lx, 0.05, 10),
        new THREE.Vector3(lx, 0.05, -120),
      ]);
      const line = new THREE.Line(railGeo, railMat);
      scene.add(line);
    });

    // 4. Player Probe Model (Composite 5-part procedural Three.Group)
    const playerGroup = new THREE.Group();

    // Fuselage (Angular core)
    const bodyGeo = new THREE.ConeGeometry(0.55, 1.8, 4);
    bodyGeo.rotateX(-Math.PI / 2);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x0f1711,
      roughness: 0.3,
      metalness: 0.85,
    });
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    playerGroup.add(bodyMesh);

    // Vector Wings
    const wingGeo = new THREE.BoxGeometry(2.1, 0.08, 0.65);
    const wingMat = new THREE.MeshStandardMaterial({
      color: 0x166534,
      roughness: 0.2,
      metalness: 0.9,
    });
    const wingsMesh = new THREE.Mesh(wingGeo, wingMat);
    wingsMesh.position.set(0, 0, 0.2);
    playerGroup.add(wingsMesh);

    // Wingtips (Neon telemetry sensors)
    const tipMat = new THREE.MeshBasicMaterial({ color: 0x22c55e });
    const tipGeo = new THREE.BoxGeometry(0.12, 0.12, 0.4);
    const leftTip = new THREE.Mesh(tipGeo, tipMat);
    leftTip.position.set(-1.05, 0.05, 0.2);
    const rightTip = new THREE.Mesh(tipGeo, tipMat);
    rightTip.position.set(1.05, 0.05, 0.2);
    playerGroup.add(leftTip, rightTip);

    // Thruster Core
    const thrusterGeo = new THREE.CylinderGeometry(0.2, 0.3, 0.35, 8);
    thrusterGeo.rotateX(Math.PI / 2);
    const thrusterMat = new THREE.MeshBasicMaterial({ color: 0x4ade80 });
    const thrusterMesh = new THREE.Mesh(thrusterGeo, thrusterMat);
    thrusterMesh.position.set(0, 0, 0.95);
    playerGroup.add(thrusterMesh);

    playerGroup.position.set(0, 0.8, 3.5);
    scene.add(playerGroup);

    // 5. Build Pools for Collectibles & Obstacles
    const tokenGeo = new THREE.IcosahedronGeometry(0.42, 1);
    const tokenMat = new THREE.MeshStandardMaterial({
      color: 0x22c55e,
      emissive: 0x166534,
      roughness: 0.15,
      metalness: 0.9,
    });
    const rerankMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      roughness: 0.1,
      metalness: 0.95,
    });

    const tokenPool: Array<{ mesh: THREE.Mesh; active: boolean; lane: number; type: "dense" | "rerank" }> = [];
    for (let i = 0; i < 16; i++) {
      const mesh = new THREE.Mesh(tokenGeo, i % 4 === 0 ? rerankMat : tokenMat);
      mesh.visible = false;
      scene.add(mesh);
      tokenPool.push({ mesh, active: false, lane: 2, type: i % 4 === 0 ? "rerank" : "dense" });
    }
    tokenPoolRef.current = tokenPool;

    // Obstacle Pool (Corrupted token clusters)
    const obsGeo = new THREE.OctahedronGeometry(0.65, 0);
    const obsMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0x7f1d1d,
      roughness: 0.4,
      metalness: 0.7,
      wireframe: false,
    });
    const obstaclePool: Array<{ mesh: THREE.Group; active: boolean; lane: number }> = [];
    for (let i = 0; i < 14; i++) {
      const obsGroup = new THREE.Group();
      const core = new THREE.Mesh(obsGeo, obsMat);
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.85, 0.05, 6, 16),
        new THREE.MeshBasicMaterial({ color: 0xff6b6b })
      );
      ring.rotateX(Math.PI / 4);
      obsGroup.add(core, ring);
      obsGroup.visible = false;
      scene.add(obsGroup);
      obstaclePool.push({ mesh: obsGroup, active: false, lane: 2 });
    }
    obstaclePoolRef.current = obstaclePool;

    // Particle Burst Pool
    const explosionPool: Array<{ points: THREE.Points; life: number; maxLife: number; active: boolean }> = [];
    const pCount = 36;
    for (let i = 0; i < 6; i++) {
      const pGeo = new THREE.BufferGeometry();
      const positions = new Float32Array(pCount * 3);
      const velocities = new Float32Array(pCount * 3);
      for (let p = 0; p < pCount; p++) {
        positions[p * 3] = 0;
        positions[p * 3 + 1] = 0;
        positions[p * 3 + 2] = 0;
        velocities[p * 3] = (Math.random() - 0.5) * 6;
        velocities[p * 3 + 1] = (Math.random() - 0.5) * 6;
        velocities[p * 3 + 2] = (Math.random() - 0.5) * 6;
      }
      pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      (pGeo as any).userData = { velocities };
      const pMat = new THREE.PointsMaterial({ size: 0.16, color: 0x22c55e, transparent: true, opacity: 1 });
      const points = new THREE.Points(pGeo, pMat);
      points.visible = false;
      scene.add(points);
      explosionPool.push({ points, life: 0, maxLife: 0.4, active: false });
    }
    explosionPoolRef.current = explosionPool;

    // 6. Spawn Orchestration Variables
    let lastSpawnZ = -30;
    let clock = new THREE.Clock();
    let animId: number;

    const spawnPattern = () => {
      const lanePositions = [-4.4, -2.2, 0, 2.2, 4.4];
      const targetZ = -95;

      // Pick 1-2 obstacle lanes
      const obsLane1 = Math.floor(Math.random() * 5);
      const obsItem = obstaclePool.find((o) => !o.active);
      if (obsItem) {
        obsItem.active = true;
        obsItem.lane = obsLane1;
        obsItem.mesh.position.set(lanePositions[obsLane1], 0.8, targetZ);
        obsItem.mesh.visible = true;
      }

      // Pick 1-2 token lanes (distinct from obstacle)
      let tokenLane = Math.floor(Math.random() * 5);
      if (tokenLane === obsLane1) {
        tokenLane = (tokenLane + 1) % 5;
      }
      const tokItem = tokenPool.find((t) => !t.active);
      if (tokItem) {
        tokItem.active = true;
        tokItem.lane = tokenLane;
        tokItem.mesh.position.set(lanePositions[tokenLane], 0.75, targetZ + (Math.random() * 6 - 3));
        tokItem.mesh.visible = true;
      }
    };

    // 7. Render & Simulation Loop
    const tick = () => {
      animId = requestAnimationFrame(tick);

      const rawDt = clock.getDelta();
      const dt = Math.min(rawDt, 0.05);

      if (!isPlaying || isPaused) {
        // Idle turntable rotation when paused or in title screen
        playerGroup.rotation.y += 0.01;
        renderer.render(scene, camera);
        return;
      }

      const state = stateRef.current;
      const now = performance.now();

      // Check Hitstop duration
      if (now < state.hitStopUntil) {
        renderer.render(scene, camera);
        return;
      }

      state.distance += state.speed * dt;
      state.score += Math.round(state.speed * dt * 2.5);

      // Smoothly damp player toward target lane X
      const laneDiff = state.targetLaneX - playerGroup.position.x;
      playerGroup.position.x += laneDiff * (1 - Math.exp(-14 * dt));

      // Dynamic banking/tilting during lane shift
      playerGroup.rotation.z = -laneDiff * 0.28;
      playerGroup.rotation.y = laneDiff * 0.12;

      // Sync probe light with player
      probeLight.position.set(playerGroup.position.x, 1.8, playerGroup.position.z);

      // Scroll Highway Grid forward
      gridHelper.position.z = ((state.distance * 1.2) % 4) - 40;

      // Spawn items down pipeline
      if (state.distance - lastSpawnZ > 24) {
        lastSpawnZ = state.distance;
        spawnPattern();
      }

      // Update Collectibles
      tokenPool.forEach((tok) => {
        if (!tok.active) return;
        tok.mesh.position.z += state.speed * dt;
        tok.mesh.rotation.y += 2.8 * dt;
        tok.mesh.rotation.x += 1.4 * dt;

        // Collision Check with Player
        const pDist = tok.mesh.position.distanceTo(playerGroup.position);
        if (pDist < 1.15) {
          tok.active = false;
          tok.mesh.visible = false;
          if (tok.type === "dense") {
            state.vectorsIndexed += 1;
            state.score += 150;
            state.latencyMs = Math.max(3.2, +(state.latencyMs - 0.2).toFixed(1));
            gameAudio.playCollect(659.25);
            createExplosion(tok.mesh.position.x, tok.mesh.position.y, tok.mesh.position.z, 0x22c55e);
          } else {
            // Rerank / Burst recharger
            state.burstAvailable = Math.min(5, state.burstAvailable + 1);
            state.score += 300;
            gameAudio.playCollect(880);
            createExplosion(tok.mesh.position.x, tok.mesh.position.y, tok.mesh.position.z, 0x38bdf8);
          }
        } else if (tok.mesh.position.z > 12) {
          tok.active = false;
          tok.mesh.visible = false;
        }
      });

      // Update Obstacles
      obstaclePool.forEach((obs) => {
        if (!obs.active) return;
        obs.mesh.position.z += state.speed * dt;
        obs.mesh.rotation.x += 1.8 * dt;
        obs.mesh.rotation.y += 2.2 * dt;

        // Collision Check with Player
        const pDist = obs.mesh.position.distanceTo(playerGroup.position);
        if (pDist < 1.25) {
          obs.active = false;
          obs.mesh.visible = false;
          state.health -= 25;
          state.latencyMs = +(state.latencyMs + 2.8).toFixed(1);
          state.hitStopUntil = performance.now() + 65; // 65ms hitstop feedback
          gameAudio.playHit();
          createExplosion(obs.mesh.position.x, obs.mesh.position.y, obs.mesh.position.z, 0xef4444);

          // Camera shake impulse
          camera.position.x = (Math.random() - 0.5) * 0.45;
          camera.position.y = 3.2 + (Math.random() - 0.5) * 0.35;

          if (state.health <= 0) {
            gameAudio.playGameOver();
            onGameOver({
              score: state.score,
              vectorsIndexed: state.vectorsIndexed,
              latencyMs: state.latencyMs,
              burstCharges: state.burstAvailable,
              health: 0,
              distance: Math.round(state.distance),
            });
          }
        } else if (obs.mesh.position.z > 12) {
          obs.active = false;
          obs.mesh.visible = false;
        }
      });

      // Camera smoothly restores from shake
      camera.position.x += (0 - camera.position.x) * 0.15;
      camera.position.y += (3.2 - camera.position.y) * 0.15;

      // Update Particle Explosions
      explosionPool.forEach((exp) => {
        if (!exp.active) return;
        exp.life += dt;
        const progress = exp.life / exp.maxLife;
        if (progress >= 1) {
          exp.active = false;
          exp.points.visible = false;
        } else {
          const positions = exp.points.geometry.attributes.position.array as Float32Array;
          const velocities = (exp.points.geometry as any).userData.velocities as Float32Array;
          for (let p = 0; p < pCount; p++) {
            positions[p * 3] += velocities[p * 3] * dt;
            positions[p * 3 + 1] += velocities[p * 3 + 1] * dt;
            positions[p * 3 + 2] += velocities[p * 3 + 2] * dt;
          }
          exp.points.geometry.attributes.position.needsUpdate = true;
          (exp.points.material as THREE.PointsMaterial).opacity = 1 - progress;
        }
      });

      // Transmit Telemetry every few frames
      onUpdateTelemetry({
        score: state.score,
        vectorsIndexed: state.vectorsIndexed,
        latencyMs: state.latencyMs,
        burstCharges: state.burstAvailable,
        health: state.health,
        distance: Math.round(state.distance),
      });

      renderer.render(scene, camera);
    };

    tick();

    // Resize Observer
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [isPlaying, isPaused]);

  return (
    <div className="relative w-full h-full select-none">
      <div ref={mountRef} className="w-full h-full" />

      {/* On-screen Mobile Controls (Visible on touch devices) */}
      {isPlaying && !isPaused && (
        <div className="sm:hidden absolute bottom-6 inset-x-4 flex items-center justify-between pointer-events-auto z-20">
          <div className="flex gap-2">
            <button
              onClick={() => {
                const lanePositions = [-4.4, -2.2, 0, 2.2, 4.4];
                stateRef.current.currentLane = Math.max(0, stateRef.current.currentLane - 1);
                stateRef.current.targetLaneX = lanePositions[stateRef.current.currentLane];
              }}
              className="w-14 h-14 bg-black/70 border border-[#22C55E]/60 text-[#22C55E] flex items-center justify-center font-mono font-bold text-lg active:scale-95"
            >
              ←
            </button>
            <button
              onClick={() => {
                const lanePositions = [-4.4, -2.2, 0, 2.2, 4.4];
                stateRef.current.currentLane = Math.min(4, stateRef.current.currentLane + 1);
                stateRef.current.targetLaneX = lanePositions[stateRef.current.currentLane];
              }}
              className="w-14 h-14 bg-black/70 border border-[#22C55E]/60 text-[#22C55E] flex items-center justify-center font-mono font-bold text-lg active:scale-95"
            >
              →
            </button>
          </div>

          <button
            onClick={triggerBurst}
            className="px-5 h-14 bg-[#166534] border border-[#22C55E] text-white flex items-center justify-center font-mono font-bold text-xs uppercase tracking-wider active:scale-95 shadow-lg"
          >
            Burst ({stateRef.current.burstAvailable})
          </button>
        </div>
      )}
    </div>
  );
};

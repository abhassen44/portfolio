import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface HeroSceneProps {
  isDark: boolean;
}

export const HeroScene: React.FC<HeroSceneProps> = ({ isDark }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 500;
    const isMobile = window.innerWidth < 768;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 18;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      powerPreference: "low-power",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 2));
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // 2. Nodes Setup (Solid colors based on theme)
    // Dark: Primary Green #22C55E, Accent lines #14532D
    // Light: Dark Green #166534, Accent lines #DDE8E1 / #166534
    const nodeColor = isDark ? 0x22c55e : 0x166534;
    const lineColor = isDark ? 0x1b3022 : 0xc7d6ce;
    const pulseColor = isDark ? 0x34d399 : 0x14532d;

    const nodeCount = isMobile ? 24 : 52;
    const nodes: THREE.Vector3[] = [];
    const nodeVelocities: THREE.Vector3[] = [];

    // Distribute nodes in a clean architectural 3D volume
    const boundX = isMobile ? 5 : 9;
    const boundY = 4.5;
    const boundZ = 4;

    for (let i = 0; i < nodeCount; i++) {
      const pos = new THREE.Vector3(
        (Math.random() - 0.5) * boundX * 2,
        (Math.random() - 0.5) * boundY * 2,
        (Math.random() - 0.5) * boundZ * 2
      );
      nodes.push(pos);
      nodeVelocities.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 0.005,
          (Math.random() - 0.5) * 0.005,
          (Math.random() - 0.5) * 0.005
        )
      );
    }

    // Geometry for node points
    const pointsGeometry = new THREE.BufferGeometry();
    const positionsArray = new Float32Array(nodeCount * 3);
    for (let i = 0; i < nodeCount; i++) {
      positionsArray[i * 3] = nodes[i].x;
      positionsArray[i * 3 + 1] = nodes[i].y;
      positionsArray[i * 3 + 2] = nodes[i].z;
    }
    pointsGeometry.setAttribute("position", new THREE.BufferAttribute(positionsArray, 3));

    // Solid Points Material (NO GRADIENTS)
    const pointsMaterial = new THREE.PointsMaterial({
      color: nodeColor,
      size: isMobile ? 0.22 : 0.28,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.9,
    });
    const pointsMesh = new THREE.Points(pointsGeometry, pointsMaterial);
    scene.add(pointsMesh);

    // Dynamic Connections (Lines)
    const maxLineConnections = nodeCount * 4;
    const linePositions = new Float32Array(maxLineConnections * 6);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      color: lineColor,
      transparent: true,
      opacity: isDark ? 0.65 : 0.45,
    });
    const lineMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lineMesh);

    // Few key pulsing data-flow nodes (Solid spheres)
    const pulseSpheres: THREE.Mesh[] = [];
    const sphereGeo = new THREE.SphereGeometry(0.18, 12, 12);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: pulseColor,
      wireframe: false,
    });

    const activeNodeCount = isMobile ? 3 : 6;
    for (let i = 0; i < activeNodeCount; i++) {
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      scene.add(sphere);
      pulseSpheres.push(sphere);
    }

    // 3. Mouse & Scroll Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let scrollY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const handleScroll = () => {
      scrollY = window.scrollY;
    };

    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    // 4. Animation Loop
    let clockTime = 0;
    const maxDistance = isMobile ? 3.0 : 3.8;

    const animate = () => {
      animFrameId.current = requestAnimationFrame(animate);

      if (!prefersReducedMotion) {
        clockTime += 0.01;
      }

      // Smooth mouse tracking interpolation
      targetX += (mouseX * 0.8 - targetX) * 0.05;
      targetY += (mouseY * 0.5 - targetY) * 0.05;

      // Scroll offset tilt
      const scrollRotation = scrollY * 0.0006;

      scene.rotation.y = targetX * 0.4 + scrollRotation * 0.5;
      scene.rotation.x = -targetY * 0.3;

      // Subtle node drift
      if (!prefersReducedMotion) {
        const positions = pointsGeometry.attributes.position.array as Float32Array;

        for (let i = 0; i < nodeCount; i++) {
          nodes[i].add(nodeVelocities[i]);

          // Bound reflection
          if (Math.abs(nodes[i].x) > boundX) nodeVelocities[i].x *= -1;
          if (Math.abs(nodes[i].y) > boundY) nodeVelocities[i].y *= -1;
          if (Math.abs(nodes[i].z) > boundZ) nodeVelocities[i].z *= -1;

          positions[i * 3] = nodes[i].x;
          positions[i * 3 + 1] = nodes[i].y;
          positions[i * 3 + 2] = nodes[i].z;
        }
        pointsGeometry.attributes.position.needsUpdate = true;

        // Update connection lines
        let lineIndex = 0;
        for (let i = 0; i < nodeCount; i++) {
          for (let j = i + 1; j < nodeCount; j++) {
            const dist = nodes[i].distanceTo(nodes[j]);
            if (dist < maxDistance && lineIndex < maxLineConnections * 6) {
              linePositions[lineIndex++] = nodes[i].x;
              linePositions[lineIndex++] = nodes[i].y;
              linePositions[lineIndex++] = nodes[i].z;

              linePositions[lineIndex++] = nodes[j].x;
              linePositions[lineIndex++] = nodes[j].y;
              linePositions[lineIndex++] = nodes[j].z;
            }
          }
        }
        // Zero out unused line segments
        for (let k = lineIndex; k < linePositions.length; k++) {
          linePositions[k] = 0;
        }
        lineGeometry.attributes.position.needsUpdate = true;

        // Position pulse spheres along node positions
        for (let s = 0; s < pulseSpheres.length; s++) {
          const targetNode = nodes[(s * 7) % nodeCount];
          pulseSpheres[s].position.copy(targetNode);
          const scale = 1 + Math.sin(clockTime * 2 + s) * 0.25;
          pulseSpheres[s].scale.set(scale, scale, scale);
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // 5. Cleanup
    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);

      pointsGeometry.dispose();
      pointsMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      sphereGeo.dispose();
      sphereMat.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isDark]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none select-none z-0"
      aria-hidden="true"
    />
  );
};

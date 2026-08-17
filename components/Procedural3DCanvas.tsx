"use client";

import { useEffect, useRef } from "react";
import { useAppStore } from "@/store/useAppStore";

export function Procedural3DCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvas3DMode = useAppStore((state) => state.canvas3DMode);
  const motionMode = useAppStore((state) => state.motionMode);
  const palette = useAppStore((state) => state.palette);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || motionMode === "minimal") return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", onResize);

    let mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
    };
    window.addEventListener("mousemove", onMouseMove);

    // Color palette resolution
    const getThemeColors = () => {
      switch (palette) {
        case "tokyo":
          return ["#FF3388", "#9A86FF", "#00F0FF", "#FFFFFF"];
        case "swiss":
          return ["#FFFFFF", "#FF2A2A", "#DDDDDD", "#999999"];
        case "kyoto":
          return ["#9BC53D", "#F5EBE0", "#5BC0BE", "#FFFFFF"];
        case "solar":
          return ["#FFA500", "#FF5722", "#FFD700", "#FFFFFF"];
        case "rexer":
        default:
          return ["#CFFF2E", "#38BDF8", "#FF6846", "#9A86FF", "#FFFFFF"];
      }
    };

    let colors = getThemeColors();

    // 1. Polyhedron 3D Geometry Initialization
    const phi = (1 + Math.sqrt(5)) / 2;
    const rawVertices: Array<[number, number, number]> = [
      [-1, phi, 0],
      [1, phi, 0],
      [-1, -phi, 0],
      [1, -phi, 0],
      [0, -1, phi],
      [0, 1, phi],
      [0, -1, -phi],
      [0, 1, -phi],
      [phi, 0, -1],
      [phi, 0, 1],
      [-phi, 0, -1],
      [-phi, 0, 1],
    ];

    // Normalize & scale vertices
    const vertices = rawVertices.map(([x, y, z]) => {
      const len = Math.sqrt(x * x + y * y + z * z);
      return [(x / len) * 160, (y / len) * 160, (z / len) * 160];
    });

    const edges: Array<[number, number]> = [];
    for (let i = 0; i < vertices.length; i++) {
      for (let j = i + 1; j < vertices.length; j++) {
        const dx = vertices[i][0] - vertices[j][0];
        const dy = vertices[i][1] - vertices[j][1];
        const dz = vertices[i][2] - vertices[j][2];
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (d < 175) {
          edges.push([i, j]);
        }
      }
    }

    let rotX = 0;
    let rotY = 0;

    // 2. Particle Constellation Mesh Initialization
    const particleCount = 45;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 2 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    // 3. Holographic Waves Initialization
    let waveTime = 0;

    // 4. Matrix Stream Initialization
    const streamCount = 28;
    const streams = Array.from({ length: streamCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      speed: Math.random() * 2.5 + 1,
      length: Math.floor(Math.random() * 12 + 6),
      color: colors[0],
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      colors = getThemeColors();

      if (canvas3DMode === "polyhedron") {
        // --- Procedural 3D Icosahedron Wireframe ---
        const mouseNormX = (mouse.x / width - 0.5) * 2;
        const mouseNormY = (mouse.y / height - 0.5) * 2;
        rotX += 0.005 + mouseNormY * 0.015;
        rotY += 0.008 + mouseNormX * 0.015;

        const centerX = width > 1024 ? width * 0.72 : width * 0.5;
        const centerY = height * 0.48;

        const cosX = Math.cos(rotX);
        const sinX = Math.sin(rotX);
        const cosY = Math.cos(rotY);
        const sinY = Math.sin(rotY);

        const projected = vertices.map(([x, y, z]) => {
          // Rotate around Y
          const x1 = x * cosY + z * sinY;
          const z1 = -x * sinY + z * cosY;
          // Rotate around X
          const y2 = y * cosX - z1 * sinX;
          const z2 = y * sinX + z1 * cosX;

          const fov = 420;
          const scale = fov / (fov + z2);
          return {
            x: centerX + x1 * scale,
            y: centerY + y2 * scale,
            z: z2,
            scale,
          };
        });

        // Draw edges
        edges.forEach(([i, j]) => {
          const p1 = projected[i];
          const p2 = projected[j];
          const avgZ = (p1.z + p2.z) / 2;
          const alpha = Math.max(0.08, Math.min(0.65, (avgZ + 160) / 320));

          ctx.strokeStyle = colors[0];
          ctx.globalAlpha = alpha;
          ctx.lineWidth = alpha * 1.8;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        });

        // Draw vertex nodes
        projected.forEach((p, idx) => {
          ctx.globalAlpha = Math.max(0.2, (p.z + 160) / 320);
          ctx.fillStyle = colors[idx % colors.length];
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.scale * 3.5, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 1;
      } else if (canvas3DMode === "mesh") {
        // --- 3D Particle Constellation Mesh ---
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 120) {
              ctx.strokeStyle = colors[0];
              ctx.globalAlpha = (1 - dist / 120) * 0.22;
              ctx.lineWidth = 0.8;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }

        particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            const force = (150 - dist) / 150;
            p.x += (dx / dist) * force * 2;
            p.y += (dy / dist) * force * 2;
          }

          ctx.globalAlpha = 0.85;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 1;
      } else if (canvas3DMode === "waves") {
        // --- Parametric Holographic Waves ---
        waveTime += 0.015;
        const waveCount = 5;

        for (let w = 0; w < waveCount; w++) {
          ctx.beginPath();
          ctx.strokeStyle = colors[w % colors.length];
          ctx.lineWidth = 1.2;
          ctx.globalAlpha = 0.25 - w * 0.03;

          for (let x = 0; x < width; x += 15) {
            const y =
              height * 0.5 +
              Math.sin(x * 0.005 + waveTime + w * 0.7) * 45 +
              Math.cos(x * 0.003 - waveTime * 0.8) * 35 +
              (mouse.y - height / 2) * 0.15;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      } else if (canvas3DMode === "matrix") {
        // --- Cybernetic Matrix Streams ---
        streams.forEach((s) => {
          s.y += s.speed;
          if (s.y > height + 50) {
            s.y = -50;
            s.x = Math.random() * width;
          }

          for (let i = 0; i < s.length; i++) {
            const yPos = s.y - i * 14;
            if (yPos > 0 && yPos < height) {
              ctx.fillStyle = i === 0 ? "#FFFFFF" : colors[0];
              ctx.globalAlpha = Math.max(0.05, 1 - i / s.length);
              ctx.font = '10px "Geist Mono", monospace';
              const char = String.fromCharCode(33 + ((s.x + i * 7) % 60));
              ctx.fillText(char, s.x, yPos);
            }
          }
        });
        ctx.globalAlpha = 1;
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animId);
    };
  }, [canvas3DMode, motionMode, palette]);

  if (motionMode === "minimal") return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-[2] h-full w-full opacity-70"
    />
  );
}

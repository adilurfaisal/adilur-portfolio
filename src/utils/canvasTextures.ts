import * as THREE from "three";

function makeCanvas(size = 256): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2D context unavailable");
  return { canvas, ctx };
}

export function createCircuitTexture(): THREE.CanvasTexture {
  const { canvas, ctx } = makeCanvas(256);
  ctx.fillStyle = "#0b0f1a";
  ctx.fillRect(0, 0, 256, 256);

  ctx.strokeStyle = "rgba(139, 92, 246, 0.55)";
  ctx.lineWidth = 2;

  const steps = 7;
  for (let i = 0; i < steps; i++) {
    const y = (i + 0.5) * (256 / steps);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(256, y);
    ctx.stroke();
  }
  for (let i = 0; i < steps; i++) {
    const x = (i + 0.5) * (256 / steps);
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 256);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(56, 189, 248, 0.85)";
  for (let i = 0; i < 26; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    const r = Math.random() * 2.5 + 1.5;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createCodeTexture(): THREE.CanvasTexture {
  const { canvas, ctx } = makeCanvas(256);
  ctx.fillStyle = "#0d1120";
  ctx.fillRect(0, 0, 256, 256);

  ctx.fillStyle = "#1a2033";
  ctx.fillRect(0, 0, 256, 22);
  ["#38BDF8", "#8B5CF6", "#94A3B8"].forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(14 + i * 16, 11, 5, 0, Math.PI * 2);
    ctx.fill();
  });

  const palette = ["#8B5CF6", "#38BDF8", "#F8FAFC", "#94A3B8"];
  let y = 40;
  let seed = 1;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  while (y < 246) {
    const indent = Math.floor(rand() * 4) * 14 + 14;
    const width = 40 + rand() * 150;
    ctx.fillStyle = palette[Math.floor(rand() * palette.length)];
    ctx.globalAlpha = 0.75;
    ctx.fillRect(indent, y, width, 8);
    ctx.globalAlpha = 1;
    y += 18;
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

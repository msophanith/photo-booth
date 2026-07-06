import type { StickerPlacement } from "./stickers";
import { getStickerEmoji } from "./stickers";
import { formatCoupleNames, formatFooter, getGridLayout, type PhotoCount } from "./gridLayout";

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export async function exportPhotoStrip(options: {
  photos: string[];
  photoCount: PhotoCount;
  name1: string;
  name2: string;
  stickersByPhoto: StickerPlacement[][];
}): Promise<string> {
  const { photos, photoCount, name1, name2, stickersByPhoto } = options;
  const { cols, rows } = getGridLayout(photoCount);

  const canvas = document.createElement("canvas");
  const w = 1200;
  const h = 1800;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = "#ffb7c5";
  ctx.lineWidth = 12;
  ctx.strokeRect(24, 24, w - 48, h - 48);

  const pad = 64;
  const headerH = 100;
  const footerH = 48;
  const gridTop = pad + headerH;
  const gridW = w - pad * 2;
  const gridH = h - gridTop - pad - footerH;
  const gap = photoCount === 6 ? 14 : 20;
  const cellW = (gridW - gap * (cols - 1)) / cols;
  const cellH = (gridH - gap * (rows - 1)) / rows;

  const title = formatCoupleNames(name1, name2);
  ctx.fillStyle = "#ff8fab";
  ctx.font = "48px Pacifico, cursive";
  ctx.textAlign = "center";
  ctx.fillText(title, w / 2, pad + 60);

  ctx.strokeStyle = "#ffb7c5";
  ctx.setLineDash([8, 8]);
  ctx.beginPath();
  ctx.moveTo(pad, pad + headerH - 10);
  ctx.lineTo(w - pad, pad + headerH - 10);
  ctx.stroke();
  ctx.setLineDash([]);

  for (let i = 0; i < photos.length; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = pad + col * (cellW + gap);
    const y = gridTop + row * (cellH + gap);

    const img = await loadImage(photos[i]);
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(x, y, cellW, cellH, 20);
    ctx.clip();

    const imgRatio = img.width / img.height;
    const cellRatio = cellW / cellH;
    let drawW = cellW;
    let drawH = cellH;
    let drawX = x;
    let drawY = y;

    if (imgRatio > cellRatio) {
      drawW = cellH * imgRatio;
      drawX = x - (drawW - cellW) / 2;
    } else {
      drawH = cellW / imgRatio;
      drawY = y - (drawH - cellH) / 2;
    }

    ctx.drawImage(img, drawX, drawY, drawW, drawH);

    const stickers = stickersByPhoto[i] ?? [];
    for (const sticker of stickers) {
      const sx = x + (sticker.x / 100) * cellW;
      const sy = y + (sticker.y / 100) * cellH;
      const size = 48 * sticker.scale * (photoCount === 6 ? 0.85 : 1);
      ctx.font = `${size}px serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(getStickerEmoji(sticker.stickerId), sx, sy);
    }

    ctx.restore();
  }

  ctx.fillStyle = "#5c3d4e66";
  ctx.font = "600 20px Nunito, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(formatFooter(name1, name2), w / 2, h - 32);

  return canvas.toDataURL("image/png");
}

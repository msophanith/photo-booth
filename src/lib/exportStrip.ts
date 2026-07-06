import type { StickerPlacement } from "./stickers";
import { getStickerEmoji } from "./stickers";
import { formatCoupleNames, formatFooter, getGridLayout, type PhotoCount } from "./gridLayout";
import { THEMES, FILTERS, type ThemeId, type FilterId } from "./customization";

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
  theme?: ThemeId;
  filter?: FilterId;
  showDate?: boolean;
}): Promise<string> {
  const {
    photos,
    photoCount,
    name1,
    name2,
    stickersByPhoto,
    theme = "pink",
    filter = "none",
    showDate = false,
  } = options;

  const { cols, rows } = getGridLayout(photoCount);
  const themeConfig = THEMES[theme];
  const filterConfig = FILTERS[filter];

  const canvas = document.createElement("canvas");
  const w = 1200;
  const h = 1800;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  // Background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);

  // Border (themed)
  ctx.strokeStyle = themeConfig.canvasBorder;
  ctx.lineWidth = 12;
  ctx.strokeRect(24, 24, w - 48, h - 48);

  const pad = 64;
  const headerH = 100;
  const footerH = showDate ? 80 : 48;
  const gridTop = pad + headerH;
  const gridW = w - pad * 2;
  const gridH = h - gridTop - pad - footerH;
  const gap = photoCount === 6 ? 14 : 20;
  const cellW = (gridW - gap * (cols - 1)) / cols;
  const cellH = (gridH - gap * (rows - 1)) / rows;

  // Header text (themed)
  const title = formatCoupleNames(name1, name2);
  ctx.fillStyle = themeConfig.canvasText;
  ctx.font = "48px Pacifico, cursive";
  ctx.textAlign = "center";
  ctx.fillText(title, w / 2, pad + 60);

  // Dashed separator (themed)
  ctx.strokeStyle = themeConfig.canvasBorder;
  ctx.setLineDash([8, 8]);
  ctx.beginPath();
  ctx.moveTo(pad, pad + headerH - 10);
  ctx.lineTo(w - pad, pad + headerH - 10);
  ctx.stroke();
  ctx.setLineDash([]);

  // Photo grid
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

    // Apply filter
    if (filterConfig.canvas !== "none") {
      ctx.filter = filterConfig.canvas;
    }

    // Aspect-ratio-preserving draw (object-fit: cover)
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

    // Reset filter before drawing stickers
    ctx.filter = "none";

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

  // Footer text (themed)
  ctx.fillStyle = themeConfig.canvasFooter;
  ctx.font = "600 20px Nunito, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(formatFooter(name1, name2), w / 2, h - (showDate ? 54 : 32));

  // Optional date
  if (showDate) {
    const dateStr = new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    ctx.fillStyle = themeConfig.canvasFooter;
    ctx.font = "500 18px Nunito, sans-serif";
    ctx.fillText(dateStr, w / 2, h - 28);
  }

  return canvas.toDataURL("image/png");
}

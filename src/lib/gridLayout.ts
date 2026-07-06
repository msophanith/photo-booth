export type PhotoCount = 4 | 6;

export function getGridLayout(count: PhotoCount) {
  if (count === 4) {
    return { cols: 2, rows: 2 };
  }
  return { cols: 2, rows: 3 };
}

export function formatCoupleNames(name1: string, name2: string): string {
  const a = name1.trim();
  const b = name2.trim();
  if (a && b) return `${a} & ${b}`;
  if (a) return a;
  if (b) return b;
  return "Sweet Snap";
}

export function formatFooter(name1: string, name2: string): string {
  const couple = formatCoupleNames(name1, name2);
  if (couple === "Sweet Snap") {
    return `Our love story · ${new Date().getFullYear()}`;
  }
  return `${couple} · ${new Date().getFullYear()}`;
}

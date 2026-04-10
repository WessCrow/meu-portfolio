export const COLS = 12
export const ROW_H = 80   // px per row unit
export const GAP = 12     // px gap between cells
export const PAD = 24     // canvas padding

export function cellW(containerWidth: number): number {
  return Math.max(10, (containerWidth - PAD * 2 - GAP * (COLS - 1)) / COLS)
}

export function itemLeft(x: number, cw: number): number {
  return PAD + x * (cw + GAP)
}

export function itemTop(y: number): number {
  return PAD + y * (ROW_H + GAP)
}

export function itemWidth(w: number, cw: number): number {
  return w * cw + (w - 1) * GAP
}

export function itemHeight(h: number): number {
  return h * ROW_H + (h - 1) * GAP
}

export function snapCol(pixelX: number, cw: number, span: number): number {
  const col = Math.round((pixelX - PAD) / (cw + GAP))
  return Math.max(0, Math.min(COLS - span, col))
}

export function snapRow(pixelY: number): number {
  const row = Math.round((pixelY - PAD) / (ROW_H + GAP))
  return Math.max(0, row)
}

export function snapDeltaCol(dx: number, cw: number): number {
  return Math.round(dx / (cw + GAP))
}

export function snapDeltaRow(dy: number): number {
  return Math.round(dy / (ROW_H + GAP))
}

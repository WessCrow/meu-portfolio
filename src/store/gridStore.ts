import { create } from 'zustand'

interface BlobGridState {
  activeCells: Set<string>;
  isDrawing: boolean;
  drawMode: 'paint' | 'erase' | null;
  radius: number;
  fgColor: string;
  bgColor: string;
}

interface BlobGridActions {
  setActive: (x: number, y: number, state: boolean) => void;
  toggleCell: (x: number, y: number) => void;
  startDrawing: (x: number, y: number, forceMode: 'paint' | 'erase') => void;
  stopDrawing: () => void;
  continueDrawing: (x: number, y: number) => void;
  clearGrid: () => void;
  setRadius: (r: number) => void;
  setFgColor: (c: string) => void;
  setBgColor: (c: string) => void;
}

export const useBlobStore = create<BlobGridState & BlobGridActions>((set, get) => ({
  activeCells: new Set<string>(),
  isDrawing: false,
  drawMode: null,
  radius: 0,
  fgColor: '#000000',
  bgColor: '#ffffff',

  setActive: (x, y, state) => {
    const key = `${x},${y}`
    set((prev) => {
      const next = new Set(prev.activeCells);
      if (state) next.add(key)
      else next.delete(key)
      return { activeCells: next };
    })
  },

  toggleCell: (x, y) => {
    const key = `${x},${y}`
    set((prev) => {
      const next = new Set(prev.activeCells);
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return { activeCells: next };
    })
  },

  startDrawing: (x, y, forceMode) => {
    set({ isDrawing: true, drawMode: forceMode });
    get().continueDrawing(x, y);
  },

  stopDrawing: () => {
    set({ isDrawing: false, drawMode: null });
  },

  continueDrawing: (x, y) => {
    const { isDrawing, drawMode, activeCells } = get();
    if (!isDrawing || !drawMode) return;

    const key = `${x},${y}`;
    if (drawMode === 'paint' && !activeCells.has(key)) {
      get().setActive(x, y, true);
    } else if (drawMode === 'erase' && activeCells.has(key)) {
      get().setActive(x, y, false);
    }
  },

  clearGrid: () => set({ activeCells: new Set<string>() }),
  setRadius: (r) => set({ radius: r }),
  setFgColor: (c) => set({ fgColor: c }),
  setBgColor: (c) => set({ bgColor: c }),
}))

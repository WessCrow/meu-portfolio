// PRD definition
export interface Cell {
  x: number;
  y: number;
  active: boolean;
}

// Key string format "x,y"
export type CellKey = `${number},${number}`;

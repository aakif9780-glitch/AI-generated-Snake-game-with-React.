export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  cover: string;
  duration: number;
}

export type GameStatus = 'idle' | 'playing' | 'paused' | 'gameover';

export interface Point {
  x: number;
  y: number;
}

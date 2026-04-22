import { Track } from './types';

export const TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Drift',
    artist: 'AI Synthwave',
    url: 'https://cdn.pixabay.com/audio/2022/03/15/audio_731557077a.mp3', // Generic synth track
    cover: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=200&h=200&auto=format&fit=crop',
    duration: 145,
  },
  {
    id: '2',
    title: 'Cyber Pulse',
    artist: 'AI Electro',
    url: 'https://cdn.pixabay.com/audio/2021/11/23/audio_0ed2fa68f4.mp3', // Generic electro track
    cover: 'https://images.unsplash.com/photo-1633167606207-d840b5070fc2?q=80&w=200&h=200&auto=format&fit=crop',
    duration: 182,
  },
  {
    id: '3',
    title: 'Midnight Grid',
    artist: 'AI Retrowave',
    url: 'https://cdn.pixabay.com/audio/2022/01/18/audio_d0a13f69d2.mp3', // Generic retro track
    cover: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=200&h=200&auto=format&fit=crop',
    duration: 160,
  },
];

export const GRID_SIZE = 20;
export const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
export const INITIAL_DIRECTION = { x: 0, y: -1 };
export const GAME_SPEED = 100; // ms

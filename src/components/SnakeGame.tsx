import { useState, useEffect, useRef, useCallback } from 'react';
import { Point, GameStatus } from '../types';
import { GRID_SIZE, INITIAL_SNAKE, INITIAL_DIRECTION, GAME_SPEED } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RefreshCw, Play } from 'lucide-react';

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [status, setStatus] = useState<GameStatus>('idle');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(seg => seg.x === newFood.x && seg.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setFood(generateFood(INITIAL_SNAKE));
    setStatus('playing');
  };

  const moveSnake = useCallback(() => {
    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prevSnake.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
        setStatus('gameover');
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];
      
      // Check food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => {
          const newScore = s + 10;
          if (newScore > highScore) setHighScore(newScore);
          return newScore;
        });
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }
      return newSnake;
    });
  }, [direction, food, generateFood, highScore]);

  const gameLoop = useCallback((timestamp: number) => {
    if (status !== 'playing') return;

    if (timestamp - lastUpdateRef.current > GAME_SPEED) {
      moveSnake();
      lastUpdateRef.current = timestamp;
    }
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [moveSnake, status]);

  useEffect(() => {
    if (status === 'playing') {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [status, gameLoop]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  // Draw logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid
    ctx.strokeStyle = '#1e1e1e';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Food
    ctx.fillStyle = '#ff00ff';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ff00ff';
    ctx.beginPath();
    ctx.arc(
      food.x * cellSize + cellSize / 2,
      food.y * cellSize + cellSize / 2,
      cellSize / 2.5,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Snake
    snake.forEach((seg, i) => {
      const isHead = i === 0;
      ctx.fillStyle = isHead ? '#00f3ff' : '#00b8c4';
      ctx.shadowBlur = isHead ? 15 : 5;
      ctx.shadowColor = '#00f3ff';
      
      const padding = 2;
      ctx.roundRect(
        seg.x * cellSize + padding,
        seg.y * cellSize + padding,
        cellSize - padding * 2,
        cellSize - padding * 2,
        4
      );
      ctx.fill();
    });
    ctx.shadowBlur = 0;

  }, [snake, food]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex justify-between w-full max-w-[400px] mb-2 px-4">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-widest text-white/40 font-mono">Score</span>
          <span className="text-2xl font-mono text-neon-cyan neon-text-cyan">{score.toString().padStart(4, '0')}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase tracking-widest text-white/40 font-mono">High Score</span>
          <div className="flex items-center gap-2">
            <Trophy size={14} className="text-neon-magenta" />
            <span className="text-2xl font-mono text-neon-magenta neon-text-magenta">{highScore.toString().padStart(4, '0')}</span>
          </div>
        </div>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="rounded-lg border-2 border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
        />
        
        <AnimatePresence>
          {status !== 'playing' && (
            <motion.div
              initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              animate={{ opacity: 1, backdropFilter: 'blur(8px)' }}
              exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg"
            >
              <div className="text-center p-8 glass-panel rounded-2xl border-neon-cyan/30 border">
                {status === 'idle' && (
                  <div className="flex flex-col items-center gap-4">
                    <h2 className="text-3xl font-sans font-bold text-neon-cyan neon-text-cyan italic">NEON SNAKE</h2>
                    <p className="text-white/60 text-sm mb-4">Use arrow keys to move</p>
                    <button
                      onClick={resetGame}
                      className="flex items-center gap-2 bg-neon-cyan text-black px-8 py-3 rounded-full font-bold hover:scale-110 transition-transform shadow-[0_0_20px_rgba(0,243,255,0.4)]"
                    >
                      <Play size={20} fill="black" />
                      START MISSION
                    </button>
                  </div>
                )}
                {status === 'gameover' && (
                  <div className="flex flex-col items-center gap-4">
                    <h2 className="text-3xl font-sans font-bold text-red-500 italic drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">GRID FAILURE</h2>
                    <p className="text-white/60 text-sm">Final Connectivity: {score}</p>
                    <button
                      onClick={resetGame}
                      className="flex items-center gap-2 bg-neon-magenta text-white px-8 py-3 rounded-full font-bold hover:scale-110 transition-transform shadow-[0_0_20px_rgba(255,0,255,0.4)]"
                    >
                      <RefreshCw size={20} />
                      REBOOT SYSTEM
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

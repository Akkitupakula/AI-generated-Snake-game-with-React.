import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const GAME_SPEED = 100;

const generateFood = (snake: { x: number; y: number }[]) => {
  let newFood;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    // eslint-disable-next-line no-loop-func
    if (!snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)) {
      break;
    }
  }
  return newFood;
};

export default function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  
  const directionRef = useRef(direction);
  directionRef.current = direction;

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    setGameOver(false);
    setScore(0);
    setHasStarted(true);
    setIsPaused(false);
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'w', 'a', 's', 'd'].includes(e.key)) {
      e.preventDefault();
    }

    if (e.key === ' ' && hasStarted && !gameOver) {
      setIsPaused((p) => !p);
      return;
    }

    if (!hasStarted || isPaused || gameOver) return;

    const currentDir = directionRef.current;
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        if (currentDir.y !== 1) setDirection({ x: 0, y: -1 });
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        if (currentDir.y !== -1) setDirection({ x: 0, y: 1 });
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        if (currentDir.x !== 1) setDirection({ x: -1, y: 0 });
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        if (currentDir.x !== -1) setDirection({ x: 1, y: 0 });
        break;
    }
  }, [hasStarted, isPaused, gameOver]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (!hasStarted || isPaused || gameOver) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        // Check collision with walls
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Check collision with self
        if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => s + 16); // Hex-like score increment
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(intervalId);
  }, [hasStarted, isPaused, gameOver, food]);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto p-6 bg-[#050505] border-4 border-[#ff00ff] shadow-[8px_8px_0px_#00ffff]">
      <div className="flex justify-between w-full mb-4 px-2 border-b-2 border-[#00ffff] pb-2">
        <div className="text-[#00ffff] font-mono text-sm md:text-lg uppercase">
          DATA_HARVESTED: <span className="text-[#ff00ff]">0x{score.toString(16).toUpperCase().padStart(4, '0')}</span>
        </div>
        <div 
          className={`font-mono text-sm md:text-lg uppercase ${gameOver ? 'text-[#ff00ff] glitch-text' : 'text-[#00ffff]'}`} 
          data-text={gameOver ? 'CRITICAL_FAILURE' : isPaused ? 'SUSPENDED' : 'EXECUTING'}
        >
          {gameOver ? 'CRITICAL_FAILURE' : isPaused ? 'SUSPENDED' : 'EXECUTING'}
        </div>
      </div>

      <div 
        className="relative bg-black border-2 border-[#00ffff] w-full aspect-square"
        style={{ maxWidth: '500px' }}
      >
        {/* Grid Background */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'linear-gradient(to right, #ff00ff 1px, transparent 1px), linear-gradient(to bottom, #ff00ff 1px, transparent 1px)',
            backgroundSize: `${100 / GRID_SIZE}% ${100 / GRID_SIZE}%`
          }}
        />

        {/* Snake */}
        {snake.map((segment, index) => (
          <div
            key={`${segment.x}-${segment.y}-${index}`}
            className="absolute"
            style={{
              left: `${(segment.x / GRID_SIZE) * 100}%`,
              top: `${(segment.y / GRID_SIZE) * 100}%`,
              width: `${100 / GRID_SIZE}%`,
              height: `${100 / GRID_SIZE}%`,
              backgroundColor: index === 0 ? '#ffffff' : '#00ffff',
              border: '1px solid #ff00ff',
              zIndex: 10,
            }}
          />
        ))}

        {/* Food */}
        <div
          className="absolute"
          style={{
            left: `${(food.x / GRID_SIZE) * 100}%`,
            top: `${(food.y / GRID_SIZE) * 100}%`,
            width: `${100 / GRID_SIZE}%`,
            height: `${100 / GRID_SIZE}%`,
            backgroundColor: '#ff00ff',
            zIndex: 5,
            animation: 'flicker 0.2s infinite',
          }}
        />

        {/* Overlays */}
        {(!hasStarted || gameOver) && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/80">
            <button
              onClick={resetGame}
              className="px-6 py-4 bg-[#00ffff] text-black font-mono text-sm md:text-xl uppercase border-4 border-[#ff00ff] hover:bg-[#ff00ff] hover:text-[#00ffff] hover:border-[#00ffff] transition-none"
            >
              {gameOver ? 'REBOOT_SYSTEM' : 'INIT_SEQUENCE'}
            </button>
          </div>
        )}
      </div>
      
      <div className="mt-6 text-[#ff00ff] font-mono text-xs md:text-sm text-center uppercase tracking-widest">
        INPUT: [W A S D] || [ARROWS]<br/>
        INTERRUPT: [SPACE]
      </div>
    </div>
  );
}

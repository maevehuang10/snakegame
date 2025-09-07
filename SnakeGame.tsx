import React, { useState, useEffect, useRef } from 'react';
import './SnakeGame.css';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };

const BOARD_SIZE = 20;

function getRandomPosition(): Position {
  return {
    x: Math.floor(Math.random() * BOARD_SIZE),
    y: Math.floor(Math.random() * BOARD_SIZE),
  };
}

function isEqual(a: Position, b: Position) {
  return a.x === b.x && a.y === b.y;
}

const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Position[]>([
    { x: 8, y: 10 },
    { x: 7, y: 10 },
    { x: 6, y: 10 },
  ]);
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [food, setFood] = useState<Position>(getRandomPosition());
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const moveRef = useRef(direction);

  useEffect(() => {
    moveRef.current = direction;
  }, [direction]);

  useEffect(() => {
    if (gameOver) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (moveRef.current !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
          if (moveRef.current !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
          if (moveRef.current !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
          if (moveRef.current !== 'LEFT') setDirection('RIGHT');
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver) return;
    const timer = setInterval(() => {
      setSnake(prev => {
        const head = prev[0];
        let newHead: Position = { ...head };
        switch (moveRef.current) {
          case 'UP': newHead.y -= 1; break;
          case 'DOWN': newHead.y += 1; break;
          case 'LEFT': newHead.x -= 1; break;
          case 'RIGHT': newHead.x += 1; break;
        }
        // 撞墙或撞自己
        if (
          newHead.x < 0 || newHead.x >= BOARD_SIZE ||
          newHead.y < 0 || newHead.y >= BOARD_SIZE ||
          prev.some(seg => isEqual(seg, newHead))
        ) {
          setGameOver(true);
          return prev;
        }
        let newSnake = [newHead, ...prev];
        if (isEqual(newHead, food)) {
          setFood(getRandomPosition());
          setScore(s => s + 1);
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    }, 100);
    return () => clearInterval(timer);
  }, [food, gameOver]);

  const handleRestart = () => {
    setSnake([
      { x: 8, y: 10 },
      { x: 7, y: 10 },
      { x: 6, y: 10 },
    ]);
    setDirection('RIGHT');
    setFood(getRandomPosition());
    setGameOver(false);
    setScore(0);
  };

  return (
    <div className="snake-ui-bg">
      <div className="snake-card">
        <div className="snake-header">
          <span role="img" aria-label="snake" className="snake-logo">🐍</span>
          <span className="snake-title">贪吃蛇游戏</span>
        </div>
        <div className="snake-score">
          分数：<span className="score-num">{score}</span>
        </div>
        <div className="board">
          {Array.from({ length: BOARD_SIZE }).map((_, y) =>
            <div className="row" key={y}>
              {Array.from({ length: BOARD_SIZE }).map((_, x) => {
                const pos = { x, y };
                let className = '';
                if (isEqual(pos, food)) className = 'food';
                else if (snake.some(seg => isEqual(seg, pos))) className = 'snake';
                return <div className={`cell ${className}`} key={x}></div>;
              })}
            </div>
          )}
        </div>
        {gameOver && (
          <div className="game-over">
            <span>游戏结束！</span>
            <button className="restart-btn" onClick={handleRestart}>重新开始</button>
          </div>
        )}
        <div className="tips">使用方向键控制蛇移动</div>
      </div>
      <div className="snake-footer">
        <span>© 2024 贪吃蛇 by GitHub Copilot</span>
      </div>
    </div>
  );
};

export default SnakeGame;

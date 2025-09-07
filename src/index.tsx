import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";

// 游戏配置
const BOARD_SIZE = 20;
const INIT_SNAKE = [
  { x: 8, y: 10 },
  { x: 7, y: 10 },
];
const INIT_DIRECTION = { x: 1, y: 0 };

function getRandomFood(snake: { x: number; y: number }[]) {
  while (true) {
    const x = Math.floor(Math.random() * BOARD_SIZE);
    const y = Math.floor(Math.random() * BOARD_SIZE);
    if (!snake.some(seg => seg.x === x && seg.y === y)) {
      return { x, y };
    }
  }
}

const App = () => {
  const [snake, setSnake] = useState(INIT_SNAKE);
  const [direction, setDirection] = useState(INIT_DIRECTION);
  const [food, setFood] = useState(getRandomFood(INIT_SNAKE));
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const moveRef = useRef(direction);

  // 监听键盘
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;
      let newDir = moveRef.current;
      if (e.key === "ArrowUp" && moveRef.current.y !== 1) newDir = { x: 0, y: -1 };
      else if (e.key === "ArrowDown" && moveRef.current.y !== -1) newDir = { x: 0, y: 1 };
      else if (e.key === "ArrowLeft" && moveRef.current.x !== 1) newDir = { x: -1, y: 0 };
      else if (e.key === "ArrowRight" && moveRef.current.x !== -1) newDir = { x: 1, y: 0 };
      moveRef.current = newDir;
      setDirection(newDir);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameOver]);

  // 移动蛇
  useEffect(() => {
    if (gameOver) return;
    const timer = setInterval(() => {
      setSnake(prev => {
        const head = { x: prev[0].x + moveRef.current.x, y: prev[0].y + moveRef.current.y };
        // 撞墙或撞自己
        if (
          head.x < 0 || head.x >= BOARD_SIZE ||
          head.y < 0 || head.y >= BOARD_SIZE ||
          prev.some(seg => seg.x === head.x && seg.y === head.y)
        ) {
          setGameOver(true);
          return prev;
        }
        let newSnake = [head, ...prev];
        // 吃到食物
        if (head.x === food.x && head.y === food.y) {
          setFood(getRandomFood(newSnake));
          setScore(s => s + 1);
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    }, 120);
    return () => clearInterval(timer);
  }, [food, gameOver]);

  // 重新开始
  const handleRestart = () => {
    setSnake(INIT_SNAKE);
    setDirection(INIT_DIRECTION);
    moveRef.current = INIT_DIRECTION;
    setFood(getRandomFood(INIT_SNAKE));
    setGameOver(false);
    setScore(0);
  };

  // 渲染棋盘
  return (
    <div style={{ textAlign: "center", marginTop: 30 }}>
      <h2>贪吃蛇小游戏</h2>
      <div>得分：{score}</div>
      <div
        style={{
          display: "inline-block",
          background: "#eee",
          border: "2px solid #333",
          marginTop: 10,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateRows: `repeat(${BOARD_SIZE}, 20px)`,
            gridTemplateColumns: `repeat(${BOARD_SIZE}, 20px)`,
            gap: 1,
          }}
        >
          {[...Array(BOARD_SIZE * BOARD_SIZE)].map((_, idx) => {
            const x = idx % BOARD_SIZE;
            const y = Math.floor(idx / BOARD_SIZE);
            const isSnake = snake.some(seg => seg.x === x && seg.y === y);
            const isHead = snake[0].x === x && snake[0].y === y;
            const isFood = food.x === x && food.y === y;
            return (
              <div
                key={idx}
                style={{
                  width: 20,
                  height: 20,
                  background: isHead
                    ? "#2ecc40"
                    : isSnake
                    ? "#39cccc"
                    : isFood
                    ? "#ff4136"
                    : "#fff",
                  borderRadius: isFood ? "50%" : 3,
                  border: "1px solid #ccc",
                }}
              />
            );
          })}
        </div>
      </div>
      {gameOver && (
        <div style={{ marginTop: 20 }}>
          <h3 style={{ color: "red" }}>游戏结束！</h3>
          <button onClick={handleRestart}>重新开始</button>
        </div>
      )}
      <div style={{ marginTop: 20, color: "#888" }}>
        使用方向键控制蛇移动
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(<App />);
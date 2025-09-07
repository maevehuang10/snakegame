import React from "react";
import { createRoot } from "react-dom/client";

const App = () => <h1>贪吃蛇游戏已启动！</h1>;

const root = createRoot(document.getElementById("root"));
root.render(<App />);
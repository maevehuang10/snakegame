import React from 'react';
import { createRoot } from 'react-dom/client';
import SnakeGame from './SnakeGame';




const root = createRoot(document.getElementById('root')!);
root.render(<SnakeGame />);

import React, { useState } from 'react';
import GameBoard from './GameBoard';
import './App.css';
import { a } from 'framer-motion/client';

function App() {
  return (
    <div className="App">
      <h1>Kuhn Poker Demo</h1>
      <GameBoard />
    </div>
  );
}

export default App;

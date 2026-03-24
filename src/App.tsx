/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#00ffff] flex flex-col items-center justify-center p-4 overflow-hidden relative font-sans crt-flicker">
      <div className="scanlines" />
      <div className="noise-bg" />

      <div className="z-10 w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-start justify-center gap-12 mt-8">
        <div className="w-full lg:w-2/3 flex flex-col items-center screen-tear">
          <h1 
            className="text-2xl md:text-4xl font-mono mb-8 glitch-text uppercase tracking-widest text-center" 
            data-text="SYS.INIT: OROBOROS_PROTOCOL"
          >
            SYS.INIT: OROBOROS_PROTOCOL
          </h1>
          <SnakeGame />
        </div>
        
        <div className="w-full lg:w-1/3 flex flex-col items-center justify-start mt-4 lg:mt-20">
          <MusicPlayer />
        </div>
      </div>
      
      <div className="absolute bottom-4 left-4 font-mono text-xs text-[#ff00ff] opacity-70">
        TERMINAL_ID: 0x8F9A // CONNECTION_SECURE: FALSE
      </div>
    </div>
  );
}

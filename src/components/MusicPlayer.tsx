import React, { useState, useRef, useEffect } from 'react';

const TRACKS = [
  { id: 1, title: 'STREAM_0x01: NOISE', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'STREAM_0x02: PULSE', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'STREAM_0x03: DECAY', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    } else if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };
  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const percentage = x / bounds.width;
      audioRef.current.currentTime = percentage * audioRef.current.duration;
      setProgress(percentage * 100);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-[#050505] border-4 border-[#00ffff] p-6 shadow-[-8px_8px_0px_#ff00ff] font-mono">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextTrack}
      />
      
      <div className="mb-6 border-b-2 border-[#ff00ff] pb-4">
        <h3 className="text-[#00ffff] text-lg uppercase tracking-widest mb-2 glitch-text" data-text="AUDIO_SUBSYSTEM">
          AUDIO_SUBSYSTEM
        </h3>
        <div className="flex justify-between items-end">
          <div className="text-[#ff00ff] text-sm truncate w-48">
            &gt; {currentTrack.title}
          </div>
          <div className="text-[#00ffff] text-xs">
            SEQ: 0{currentTrackIndex + 1}/0{TRACKS.length}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div 
        className="h-4 w-full bg-[#050505] border-2 border-[#00ffff] mb-6 cursor-pointer relative"
        onClick={handleProgressClick}
      >
        <div 
          className="h-full bg-[#ff00ff] transition-all duration-75"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <button 
          onClick={toggleMute}
          className="text-[#00ffff] hover:text-[#ff00ff] hover:bg-[#00ffff] px-2 py-1 border border-transparent hover:border-[#ff00ff] transition-none text-sm"
        >
          {isMuted ? '[MUTED]' : '[VOL:ON]'}
        </button>

        <div className="flex space-x-4">
          <button 
            onClick={prevTrack}
            className="text-[#ff00ff] hover:bg-[#ff00ff] hover:text-[#050505] px-3 py-1 border-2 border-[#ff00ff] transition-none"
          >
            &lt;&lt;
          </button>
          
          <button 
            onClick={togglePlay}
            className="text-[#050505] bg-[#00ffff] hover:bg-[#ff00ff] hover:text-[#00ffff] px-4 py-1 border-2 border-[#00ffff] hover:border-[#ff00ff] transition-none font-bold"
          >
            {isPlaying ? 'HALT' : 'EXEC'}
          </button>
          
          <button 
            onClick={nextTrack}
            className="text-[#ff00ff] hover:bg-[#ff00ff] hover:text-[#050505] px-3 py-1 border-2 border-[#ff00ff] transition-none"
          >
            &gt;&gt;
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';

type Props = {
  src: string;
  title: string;
};

export function AudioPlayer({ src, title }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      
      const audio = audioRef.current;
      
      const updateProgress = () => {
        const currentProgress = (audio.currentTime / audio.duration) * 100;
        setProgress(currentProgress);
      };

      audio.addEventListener('timeupdate', updateProgress);
      audio.addEventListener('play', () => setIsPlaying(true));
      audio.addEventListener('pause', () => setIsPlaying(false));

      return () => {
        audio.removeEventListener('timeupdate', updateProgress);
        audio.removeEventListener('play', () => setIsPlaying(true));
        audio.removeEventListener('pause', () => setIsPlaying(false));
      };
    }
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-black/90 backdrop-blur-sm flex items-center px-4 gap-4">
      <button 
        onClick={togglePlay}
        className="w-8 h-8 flex items-center justify-center"
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        <div className={`w-4 h-4 rounded-full ${isPlaying ? 'border-2 border-white' : 'bg-white'}`} />
      </button>
      
      <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className="h-full bg-white transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      <audio
        ref={audioRef}
        className="hidden"
        title={title}
      >
        <source src={src} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
} 
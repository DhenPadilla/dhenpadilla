'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type Props = {
  src: string;
  title: string;
  audioTitle: string;
};

export function AudioPlayer({ src, title, audioTitle }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.loop = true;
      
      const audio = audioRef.current;
      
      const updateProgress = () => {
        if (audio.duration) {
          const currentProgress = (audio.currentTime / audio.duration) * 100;
          setProgress(currentProgress);
        }
      };

      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      const handleEnded = () => setIsPlaying(false);

      audio.addEventListener('timeupdate', updateProgress);
      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);
      audio.addEventListener('ended', handleEnded);

      return () => {
        audio.removeEventListener('timeupdate', updateProgress);
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, []);

  const togglePlay = useCallback(async () => {
    if (audioRef.current) {
      // Mark that user has interacted
      if (!hasInteracted) {
        setHasInteracted(true);
      }

      try {
        if (isPlaying) {
          audioRef.current.pause();
        } else {
          // For mobile compatibility, ensure audio context is resumed
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            await playPromise;
          }
        }
      } catch (error) {
        console.warn('Audio play failed:', error);
        setIsPlaying(false);
      }
    }
  }, [isPlaying, hasInteracted]);

  // Handle initial user interaction for mobile
  const handleInitialPlay = useCallback(async () => {
    if (!hasInteracted && audioRef.current) {
      setHasInteracted(true);
      try {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          await playPromise;
        }
      } catch (error) {
        console.warn('Initial audio play failed:', error);
      }
    }
  }, [hasInteracted]);

  return (
    <div className="fixed bottom-0 left-0 right-0 h-2 flex flex-col w-full items-center justify-end">
      <div className="flex flex-row w-full justify-start items-center p-3 max-md:bg-gradient-to-t max-md:from-white max-md:via-white/80 max-md:via-80% max-md:to-transparent">
        <button 
          onClick={hasInteracted ? togglePlay : handleInitialPlay}
          className={`w-4 h-4 flex items-center justify-center p-[1px] ml-3 rounded-full border-2 ${isPlaying ? 'border-gray-500' : 'border-gray-300'}`}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          <div className={`w-full h-full rounded-full bg-gray-400`} />
        </button>
        <span className="text-xs ml-2 italic text-gray-500">{audioTitle}</span>
      </div>
      <div className="flex flex-row w-full justify-start items-center">
        <div className="flex-row h-1 w-full bg-gray-300 overflow-hidden">
          <div 
            className="h-full bg-gray-600 transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <audio
        ref={audioRef}
        className="hidden"
        title={title}
        preload="auto"
        loop={true}
      >
        <source src={src} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}
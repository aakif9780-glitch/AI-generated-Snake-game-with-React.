import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music } from 'lucide-react';
import { Track } from '../types';
import { TRACKS } from '../constants';
import { motion, AnimatePresence } from 'motion/react';

interface MusicPlayerProps {
  onTrackChange?: (track: Track) => void;
}

export default function MusicPlayer({ onTrackChange }: MusicPlayerProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (onTrackChange) onTrackChange(currentTrack);
  }, [currentTrack, onTrackChange]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSkip = (direction: 'next' | 'prev') => {
    let nextIndex = currentTrackIndex;
    if (direction === 'next') {
      nextIndex = (currentTrackIndex + 1) % TRACKS.length;
    } else {
      nextIndex = (currentTrackIndex - 1 + TRACKS.length) % TRACKS.length;
    }
    setCurrentTrackIndex(nextIndex);
    setIsPlaying(true);
    // Audio source update will trigger playback if isPlaying is true via useEffect if handled that way, 
    // but here we can just wait for the ref to update or handle in useEffect
  };

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.error("Playback failed", e));
    }
  }, [currentTrackIndex, isPlaying]);

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (currentTime / (currentTrack.duration || 1)) * 100;

  return (
    <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4 w-80">
      <div className="relative aspect-square rounded-lg overflow-hidden group">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentTrack.id}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            src={currentTrack.cover}
            alt={currentTrack.title}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Music className="text-neon-cyan w-12 h-12" />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="font-sans font-semibold text-lg truncate text-neon-cyan neon-text-cyan">
          {currentTrack.title}
        </h3>
        <p className="font-sans text-sm text-white/60 truncate">
          {currentTrack.artist}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-neon-cyan"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-mono text-white/40">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(currentTrack.duration)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between px-2">
        <button
          onClick={() => handleSkip('prev')}
          className="text-white/80 hover:text-neon-cyan transition-colors"
        >
          <SkipBack size={24} />
        </button>
        
        <button
          onClick={togglePlay}
          className="w-12 h-12 rounded-full bg-neon-cyan flex items-center justify-center text-black shadow-[0_0_15px_rgba(0,243,255,0.5)] hover:scale-105 active:scale-95 transition-all"
        >
          {isPlaying ? <Pause fill="currentColor" /> : <Play fill="currentColor" className="ml-1" />}
        </button>

        <button
          onClick={() => handleSkip('next')}
          className="text-white/80 hover:text-neon-cyan transition-colors"
        >
          <SkipForward size={24} />
        </button>
      </div>

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={onTimeUpdate}
        onEnded={() => handleSkip('next')}
      />
    </div>
  );
}

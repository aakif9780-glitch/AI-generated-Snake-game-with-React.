import { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Track } from './types';
import { Music, Gamepad2, Github } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);

  return (
    <div className="min-h-screen w-full flex flex-col relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-cyan/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-magenta/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
      </div>

      {/* Header */}
      <header className="z-10 px-8 py-6 flex items-center justify-between glass-panel border-b border-white/5 border-t-0 border-x-0 rounded-none bg-black/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-neon-cyan/20 flex items-center justify-center border border-neon-cyan/40">
            <Gamepad2 className="text-neon-cyan" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-sans tracking-tight text-white/90">NEON<span className="text-neon-cyan">SNAKE</span></h1>
            <p className="text-[10px] uppercase tracking-widest text-white/40 font-mono leading-none">Terminal v2.0.42</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center gap-6 text-sm font-medium text-white/60">
            <a href="#" className="hover:text-neon-cyan transition-colors">SYSTEM</a>
            <a href="#" className="hover:text-neon-cyan transition-colors">ARCHIVE</a>
            <a href="#" className="hover:text-neon-cyan transition-colors">MODS</a>
          </nav>
          <div className="h-6 w-px bg-white/10" />
          <button className="text-white/40 hover:text-white transition-colors">
            <Github size={20} />
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <main className="z-10 flex-1 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 p-8 max-w-7xl mx-auto w-full items-start">
        {/* Game Area */}
        <section className="flex flex-col items-center justify-center min-h-[500px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full"
          >
            <SnakeGame />
          </motion.div>
        </section>

        {/* Sidebar / Player Area */}
        <aside className="flex flex-col gap-6 w-full lg:w-auto items-center lg:items-start lg:sticky lg:top-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <div className="flex items-center gap-2 mb-4 px-2">
              <Music size={16} className="text-neon-magenta" />
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-white/40">Neural Link Audio</span>
            </div>
            <MusicPlayer onTrackChange={setCurrentTrack} />
            
            {/* Visualizer Mock */}
            <div className="mt-8 glass-panel rounded-2xl p-6 flex flex-col gap-4">
              <span className="text-[10px] uppercase font-mono text-white/40 tracking-widest">Signal Spectrum</span>
              <div className="flex items-end gap-1 h-12">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      height: [
                        '20%', '60%', '30%', '90%', '40%', '70%', '50%', '85%', '35%'
                      ][(i + (currentTrack?.id ? parseInt(currentTrack.id) : 0)) % 9]
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.5 + Math.random() * 0.5,
                      ease: "easeInOut"
                    }}
                    className="flex-1 bg-neon-cyan/40 rounded-t-sm"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </aside>
      </main>

      {/* Footer / Status Bar */}
      <footer className="z-10 px-8 py-3 glass-panel border-t border-white/5 border-b-0 border-x-0 rounded-none bg-black/60 flex justify-between items-center text-[10px] font-mono text-white/30 uppercase tracking-[0.3em]">
        <div className="flex gap-6">
          <span>COORDS: 42.12 / -88.94</span>
          <span className="text-neon-cyan animate-pulse">CONNECTION: STABLE</span>
        </div>
        <div className="flex gap-6">
          <span>FPS: 60.0</span>
          <span>MEM: 12.4GB</span>
        </div>
      </footer>
    </div>
  );
}


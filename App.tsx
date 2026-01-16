
import React, { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Button } from './components/ui';
import { encodeToEmoji, generateLoader, formatFileSize } from './utils';
import { EMOJI_SET, B64_CHARS } from './constants';

// Cast to any to bypass environment-specific Framer Motion type resolution issues
const MotionDiv = motion.div as any;

const TruncatedPreview: React.FC<{ 
  content: string; 
  limit?: number; 
  onCopy: () => void;
  onDownload: () => void;
  title: string;
  type?: 'text' | 'code' | 'emoji';
}> = ({ content, limit = 500, onCopy, onDownload, title, type = 'text' }) => {
  const isTruncated = content.length > limit;
  const preview = useMemo(() => isTruncated ? content.slice(0, limit) + '...' : content, [content, limit, isTruncated]);

  return (
    <div className="relative group">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-500">{title}</span>
        <span className="text-[10px] mono text-zinc-600">
          {isTruncated ? `Showing first ${limit} of ${content.length} chars` : `${content.length} chars`}
        </span>
      </div>
      <div className={`p-4 bg-black/40 rounded-xl border border-white/5 min-h-[120px] max-h-[250px] overflow-hidden mono text-xs leading-relaxed select-all ${type === 'emoji' ? 'text-lg tracking-widest' : 'text-zinc-400'}`}>
        {preview}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none rounded-xl opacity-60" />
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 flex gap-2 w-max">
        <Button variant="secondary" onClick={onCopy} className="scale-90 bg-zinc-900/90 backdrop-blur-md whitespace-nowrap">
          Copy Full
        </Button>
        <Button variant="secondary" onClick={onDownload} className="scale-90 bg-zinc-900/90 backdrop-blur-md">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
        </Button>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{ emoji: string; loader: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copying, setCopying] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setInput(ev.target?.result as string);
      reader.readAsText(file);
    }
  };

  const handleProcess = () => {
    if (!input.trim() || isProcessing) return;
    setIsProcessing(true);
    
    requestAnimationFrame(() => {
      setTimeout(() => {
        try {
          const emojiStr = encodeToEmoji(input);
          setResult({
            emoji: emojiStr,
            loader: generateLoader(emojiStr)
          });
        } finally {
          setIsProcessing(false);
        }
      }, 50);
    });
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopying(id);
    setTimeout(() => setCopying(null), 1500);
  };

  const handleDownload = (content: string, filename: string) => {
    const blob = new Blob(["\ufeff", content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleServiceRedirect = () => {
    setIsRedirecting(true);
    setTimeout(() => {
      window.location.href = "https://exe2ps1.vercel.app";
    }, 1000);
  };

  const reset = () => {
    setInput('');
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-[#030303] text-[#fafafa] selection:bg-blue-500/30 selection:text-blue-200 overflow-x-hidden">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 w-full bg-[#030303]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
             <span className="text-lg">⚡</span>
             <span className="font-bold tracking-tighter text-sm uppercase">EmojiCrypt</span>
          </div>
          <Button 
            variant="secondary" 
            onClick={handleServiceRedirect} 
            className="text-[10px] uppercase tracking-widest px-4 py-2 border-white/5 hover:border-blue-500/50 group"
          >
            Try our other services
            <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">⚡</span>
          </Button>
        </div>
      </nav>

      {/* Lightning Bolt Redirection Overlay */}
      <AnimatePresence>
        {isRedirecting && (
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#030303]/95 backdrop-blur-md"
          >
            <MotionDiv
              initial={{ scale: 0.2, opacity: 0, y: 100 }}
              animate={{ 
                scale: [0.2, 1.5, 1.2], 
                opacity: 1,
                y: 0,
                filter: [
                  "drop-shadow(0 0 0px #3b82f6)", 
                  "drop-shadow(0 0 60px #3b82f6)", 
                  "drop-shadow(0 0 30px #3b82f6)"
                ]
              }}
              transition={{ duration: 0.8, ease: "backOut" }}
              className="text-[150px] relative"
            >
              <div className="relative z-10">⚡</div>
              {/* Flicker effect behind bolt */}
              <MotionDiv
                animate={{ opacity: [0, 1, 0, 0.8, 0] }}
                transition={{ repeat: Infinity, duration: 0.2 }}
                className="absolute inset-0 bg-blue-500 blur-[80px] rounded-full opacity-50"
              />
            </MotionDiv>
          </MotionDiv>
        )}
      </AnimatePresence>

      <div className="p-6 md:p-12 max-w-5xl mx-auto">
        <MotionDiv 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 mb-6 group hover:scale-110 transition-transform cursor-default">
            <span className="text-3xl grayscale group-hover:grayscale-0 transition-all duration-500">⚡</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-white mb-4">
            Emoji<span className="text-blue-500">Script</span>
          </h1>
          <p className="text-zinc-500 max-w-md mx-auto text-sm leading-relaxed">
            PS1 File encrypter, Made by Wizkna.
          </p>
        </MotionDiv>

        <div className="grid grid-cols-1 gap-12">
          <MotionDiv 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <Card className="p-1">
              <div className="flex items-center justify-between px-5 py-3 bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${isProcessing ? 'bg-yellow-500 animate-pulse' : 'bg-blue-500'}`} />
                  <span className="text-xs font-bold text-zinc-400 tracking-widest uppercase">
                    {isProcessing ? 'Processing...' : 'Input Terminal'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".ps1,.txt" className="hidden" />
                  <button onClick={() => fileInputRef.current?.click()} className="text-[10px] text-zinc-500 hover:text-white transition-colors mono uppercase font-bold tracking-tighter">
                    Load File
                  </button>
                  {input && (
                    <button onClick={reset} className="text-[10px] text-red-500 hover:text-red-400 transition-colors mono uppercase font-bold tracking-tighter">
                      Reset
                    </button>
                  )}
                </div>
              </div>
              <div className="relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Paste your script here..."
                  disabled={isProcessing}
                  className="w-full h-48 p-6 bg-transparent text-blue-50/70 mono text-sm focus:outline-none resize-none placeholder:text-zinc-800 leading-relaxed disabled:opacity-50"
                />
                <div className="absolute bottom-4 right-6 pointer-events-none">
                   <span className="text-[10px] mono text-zinc-700">{formatFileSize(new Blob([input]).size)}</span>
                </div>
              </div>
            </Card>

            <Button 
              className={`w-full py-5 text-lg shadow-xl ${isProcessing ? 'opacity-70' : ''}`} 
              onClick={handleProcess}
              disabled={!input.trim() || isProcessing}
            >
              {isProcessing ? 'Optimizing Map...' : 'Encrypt Instantly'}
            </Button>
          </MotionDiv>

          <AnimatePresence mode="wait">
            {result && (
              <MotionDiv 
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <TruncatedPreview 
                    title="Emoji Map" 
                    content={result.emoji} 
                    type="emoji"
                    onCopy={() => handleCopy(result.emoji, 'emoji')}
                    onDownload={() => handleDownload(result.emoji, 'encoded.txt')}
                  />
                  <TruncatedPreview 
                    title="PS1 Loader (Optimized)" 
                    content={result.loader} 
                    type="code"
                    onCopy={() => handleCopy(result.loader, 'loader')}
                    onDownload={() => handleDownload(result.loader, 'loader.ps1')}
                  />
                </div>

                <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-500/5 to-indigo-500/5 border border-blue-500/10 text-center">
                  <h3 className="text-blue-400 text-sm font-bold mb-3 uppercase tracking-widest">Speed Optimized</h3>
                  <p className="text-zinc-500 text-xs leading-relaxed max-w-sm mx-auto">
                    The loader now uses <span className="text-white">System.Text.StringBuilder</span>. Even with 10MB+ scripts, execution will be near-instant.
                  </p>
                </div>
              </MotionDiv>
            )}
          </AnimatePresence>
        </div>

        <section className="mt-24">
          <h2 className="text-xs font-bold text-zinc-500 tracking-[0.2em] uppercase text-center mb-8">Character Dictionary</h2>
          <div className="flex flex-wrap justify-center gap-3 opacity-50">
            {B64_CHARS.split('').slice(0, 30).map((char, i) => (
              <div key={i} className="w-10 h-14 flex flex-col items-center justify-center rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-base mb-1">{EMOJI_SET[i]}</span>
                <span className="text-[9px] mono text-zinc-600 font-bold">{char}</span>
              </div>
            ))}
          </div>
        </section>

        <footer className="mt-32 pb-12 text-center border-t border-white/5 pt-12">
          <p className="text-zinc-700 text-[10px] uppercase font-bold tracking-[0.3em]">
            EmojiScript Pro &copy; {new Date().getFullYear()}
          </p>
        </footer>

        {copying && (
          <MotionDiv 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-blue-600 text-white rounded-full font-bold shadow-2xl z-50 text-sm pointer-events-none"
          >
            Copied to clipboard
          </MotionDiv>
        )}
      </div>
    </div>
  );
};

export default App;

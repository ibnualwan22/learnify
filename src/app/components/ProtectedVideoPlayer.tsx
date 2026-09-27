"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, RotateCw, Maximize, Minimize } from "lucide-react";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function ProtectedVideoPlayer({ videoId }: { videoId: string }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Auto extract ID if user inputs a full URL
  let finalVideoId = videoId;
  try {
    if (videoId.includes("youtube.com") || videoId.includes("youtu.be")) {
      const url = new URL(videoId);
      if (videoId.includes("youtu.be")) {
        finalVideoId = url.pathname.slice(1);
      } else {
        finalVideoId = url.searchParams.get("v") || videoId;
      }
    }
  } catch (e) {
    // Keep as is if invalid URL
  }

  useEffect(() => {
    // Load YouTube IFrame API script if not already loaded
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        initializePlayer();
      };
    } else {
      initializePlayer();
    }

    function initializePlayer() {
      if (!containerRef.current) return;
      
      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId: finalVideoId,
        playerVars: {
          modestbranding: 1,
          controls: 0,
          rel: 0,
          disablekb: 1,
          fs: 0,
          playsinline: 1,
        },
        events: {
          onReady: (event: any) => {
            setIsReady(true);
            setDuration(event.target.getDuration());
          },
          onStateChange: (event: any) => {
            if (event.data === 1) { // PLAYING
              setIsPlaying(true);
            } else if (event.data === 2 || event.data === 0) { // PAUSED or ENDED
              setIsPlaying(false);
            }
          },
        },
      });
    }

    return () => {
      // Cleanup player if component unmounts
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalVideoId]);

  // Track progress bar
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && isReady) {
      interval = setInterval(() => {
        if (playerRef.current && playerRef.current.getCurrentTime) {
          setCurrentTime(playerRef.current.getCurrentTime());
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isReady]);

  // Handle Fullscreen tracking
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const togglePlay = () => {
    if (!playerRef.current || !isReady) return;
    
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const skip = (seconds: number) => {
    if (!playerRef.current || !isReady) return;
    const current = playerRef.current.getCurrentTime();
    playerRef.current.seekTo(current + seconds, true);
    setCurrentTime(current + seconds);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!playerRef.current || !isReady) return;
    const time = Number(e.target.value);
    playerRef.current.seekTo(time, true);
    setCurrentTime(time);
  };

  const toggleFullscreen = async () => {
    if (!wrapperRef.current) return;

    if (!document.fullscreenElement) {
      try {
        await wrapperRef.current.requestFullscreen();
      } catch (err) {
        console.error("Gagal fullscreen:", err);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Format second to MM:SS
  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      ref={wrapperRef}
      className={`flex flex-col w-full max-w-4xl mx-auto ${isFullscreen ? 'bg-black h-screen justify-center p-4' : 'gap-4'}`}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Video Container 16:9 */}
      <div className={`relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-xl ring-1 ring-slate-900/10 select-none ${isFullscreen ? 'max-h-[80vh]' : ''}`}>
        {/* The actual YouTube iframe will be mounted here. We apply pointer-events-none as a safety measure */}
        <div ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-none"></div>
        
        {/* Transparent Overlay to block ALL clicks from reaching the iframe */}
        <div 
          className="absolute inset-0 z-10 bg-transparent w-full h-full cursor-pointer"
          onClick={togglePlay}
          title="Klik untuk Play/Pause"
        ></div>
      </div>

      {/* Custom Controls UI */}
      <div className={`flex flex-col gap-3 bg-white border border-slate-200 p-4 rounded-2xl shadow-sm ${isFullscreen ? 'mx-auto w-full max-w-3xl' : ''}`}>
        
        {/* Progress Bar Area */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-slate-500 w-10 text-right">{formatTime(currentTime)}</span>
          <input 
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            disabled={!isReady}
            className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600 outline-none"
          />
          <span className="text-xs font-medium text-slate-500 w-10">{formatTime(duration)}</span>
        </div>

        {/* Buttons Area */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => skip(-10)}
              disabled={!isReady}
              title="Mundur 10 detik"
              className="p-2.5 text-slate-600 hover:text-brand-600 hover:bg-brand-50 disabled:opacity-50 disabled:hover:bg-transparent rounded-xl transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              onClick={togglePlay}
              disabled={!isReady}
              className="flex items-center justify-center w-12 h-12 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white rounded-full transition-all shadow-[0_4px_14px_0_rgba(59,130,246,0.39)] active:scale-95"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>

            <button
              onClick={() => skip(10)}
              disabled={!isReady}
              title="Maju 10 detik"
              className="p-2.5 text-slate-600 hover:text-brand-600 hover:bg-brand-50 disabled:opacity-50 disabled:hover:bg-transparent rounded-xl transition-colors"
            >
              <RotateCw className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? "Keluar Fullscreen" : "Fullscreen"}
            className="p-2.5 text-slate-600 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-colors"
          >
            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </button>
        </div>

      </div>
    </div>
  );
}

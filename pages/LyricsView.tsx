import React, { useEffect, useRef, useState } from 'react';
import { useMusic } from '../contexts/MusicContext';
import { MusicIcon } from '../components/Icons';

declare const ColorThief: any;

const LyricsView: React.FC = () => {
  const { currentSong, currentTime, syncedLyrics, unsyncedLyrics, loadingLyrics } = useMusic();
  const activeLineRef = useRef<HTMLParagraphElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [bgColor, setBgColor] = useState<string>('#121212');
  
  useEffect(() => {
    if (currentSong?.coverArt) {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = currentSong.coverArt;
      img.onload = () => {
        try {
          const colorThief = new ColorThief();
          const dominantColor = colorThief.getColor(img);
          setBgColor(`rgb(${dominantColor.join(',')})`);
        } catch (e) {
          console.error("Error getting color from image", e);
          setBgColor('#121212');
        }
      };
      img.onerror = () => setBgColor('#121212');
    } else {
      setBgColor('#121212');
    }
  }, [currentSong?.coverArt]);
  
  useEffect(() => {
      if(activeLineRef.current) {
          activeLineRef.current.scrollIntoView({
              behavior: 'smooth',
              block: 'center'
          });
      }
  }, [currentTime]);

  if (!currentSong) {
    return (
      <div className="h-full flex items-center justify-center text-zinc-400 text-lg">
        No song is currently playing.
      </div>
    );
  }

  const renderLyrics = () => {
    if (loadingLyrics) {
      return <p className="text-4xl font-bold text-zinc-500 animate-pulse">Loading lyrics...</p>;
    }

    if (syncedLyrics && syncedLyrics.length > 0) {
      const currentLineIndex = syncedLyrics.findIndex((line, index) => {
        const nextLine = syncedLyrics[index + 1];
        const startTimeInSeconds = line.startTime / 1000;
        const endTimeInSeconds = nextLine ? nextLine.startTime / 1000 : currentSong.duration;
        return currentTime >= startTimeInSeconds && currentTime < endTimeInSeconds;
      });

      return (
        <div className="space-y-8 text-center">
          {syncedLyrics.map((line, index) => {
             const isActive = index === currentLineIndex;
             return (
                 <p 
                    key={`${line.startTime}-${index}`}
                    ref={isActive ? activeLineRef : null}
                    className={`transition-all duration-300 text-4xl font-bold tracking-tight py-2 ${isActive ? 'text-white scale-100' : 'text-zinc-500 scale-95 opacity-80'}`}
                 >
                    {line.text || '\u00A0'}
                 </p>
             )
          })}
        </div>
      );
    }
    
    if (unsyncedLyrics) {
        return (
             <div className="whitespace-pre-wrap text-2xl font-semibold leading-loose text-zinc-300 text-center">
                {unsyncedLyrics.split('\n').map((line, index) => (
                    <p key={index}>{line || '\u00A0'}</p> 
                ))}
            </div>
        )
    }

    return <p className="text-4xl font-bold text-zinc-500 text-center">No lyrics found for this song.</p>;
  };

  return (
    <div 
        ref={containerRef} 
        className="h-full w-full relative overflow-y-auto transition-colors duration-1000"
        style={{
             background: `linear-gradient(to bottom, ${bgColor} 0%, #121212 500px)`
        }}
    >
        <div className="relative z-10 p-8 flex flex-col h-full">
            <div className="flex-shrink-0 flex items-center gap-4 mb-12">
                 {currentSong.coverArt ? (
                    <img src={currentSong.coverArt} alt={currentSong.album} className="w-20 h-20 rounded-lg shadow-2xl" />
                    ) : (
                    <div className="w-20 h-20 rounded-lg bg-zinc-800 flex items-center justify-center shadow-2xl">
                        <MusicIcon size={40} className="text-zinc-500" />
                    </div>
                )}
                <div>
                    <h2 className="text-3xl font-bold text-white">{currentSong.title}</h2>
                    <p className="text-lg text-zinc-300">{currentSong.artist}</p>
                </div>
            </div>

            <div className="flex-grow flex items-center justify-center">
                <div className="w-full max-w-4xl">
                     {renderLyrics()}
                </div>
            </div>
        </div>
    </div>
  );
};

export default LyricsView;
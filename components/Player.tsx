import React from 'react';
import { useMusic } from '../contexts/MusicContext';
import {
  PlayIcon, PauseIcon, SkipBackIcon, SkipForwardIcon, ShuffleIcon,
  RepeatIcon, Repeat1Icon, Volume1Icon, Volume2Icon, VolumeXIcon,
  HeartIcon, MusicIcon, MicIcon, QueueIcon,
} from './Icons';
import { formatTime } from '../lib/utils';
import { Link } from 'react-router-dom';

const Player: React.FC = () => {
  const {
    currentSong, isPlaying, togglePlay, playNext, playPrev, seek,
    currentTime, duration, volume, setVolume, isShuffle, toggleShuffle,
    repeatMode, toggleRepeat, likedSongs, toggleLikeSong,
    syncedLyrics, unsyncedLyrics, isQueueVisible, toggleQueueVisibility
  } = useMusic();

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    seek(Number(e.target.value));
  };
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(e.target.value));
  };
  
  const VolumeIcon = volume === 0 ? VolumeXIcon : volume < 0.5 ? Volume1Icon : Volume2Icon;
  const hasLyrics = !!syncedLyrics || !!unsyncedLyrics;

  if (!currentSong) {
    return (
      <footer className="h-24 bg-black rounded-lg flex items-center justify-center text-zinc-500">
        <p>Select a song to play</p>
      </footer>
    );
  }

  const isLiked = likedSongs.has(currentSong.id);

  return (
    <footer className="h-24 bg-black rounded-lg p-4 flex items-center justify-between">
      {/* Current Song Info */}
      <div className="w-1/4 flex items-center gap-4">
        {currentSong.coverArt ? (
          <img src={currentSong.coverArt} alt={currentSong.album} className="w-14 h-14 rounded" />
        ) : (
          <div className="w-14 h-14 rounded bg-zinc-800 flex items-center justify-center">
            <MusicIcon className="text-zinc-400" />
          </div>
        )}
        <div>
          <div className="flex items-center gap-2">
            <p className="font-semibold text-white truncate hover:underline cursor-pointer">{currentSong.title}</p>
            {currentSong.isExplicit && <span className="flex-shrink-0 bg-zinc-600 text-zinc-200 text-[10px] font-bold rounded-sm px-1 py-0.5 leading-none">E</span>}
          </div>
          <p className="text-sm text-zinc-400 truncate hover:underline cursor-pointer">{currentSong.artist}</p>
        </div>
        <button onClick={() => toggleLikeSong(currentSong.id)} className={`transition-colors ${isLiked ? 'text-green-500' : 'text-zinc-400 hover:text-white'}`}>
            <HeartIcon fill={isLiked ? 'currentColor' : 'none'} size={20}/>
        </button>
      </div>

      {/* Player Controls */}
      <div className="w-1/2 flex flex-col items-center gap-2">
        <div className="flex items-center gap-4">
          <button onClick={toggleShuffle} className={`group relative transition-colors ${isShuffle ? 'text-green-500' : 'text-zinc-400 hover:text-white'}`}>
            <ShuffleIcon size={20} />
            {isShuffle && <div className="h-1 w-1 bg-green-500 rounded-full absolute -bottom-1.5 left-1/2 -translate-x-1/2"></div>}
          </button>
          <button onClick={playPrev} className="text-zinc-400 hover:text-white transition-colors">
            <SkipBackIcon size={28} />
          </button>
          <button onClick={togglePlay} className="bg-white text-black rounded-full p-2 hover:scale-105 transition-transform">
            {isPlaying ? <PauseIcon size={28} /> : <PlayIcon size={28} style={{ transform: 'translateX(2px)' }}/>}
          </button>
          <button onClick={playNext} className="text-zinc-400 hover:text-white transition-colors">
            <SkipForwardIcon size={28} />
          </button>
          <button onClick={toggleRepeat} className={`group relative transition-colors ${repeatMode !== 'none' ? 'text-green-500' : 'text-zinc-400 hover:text-white'}`}>
            {repeatMode === 'one' ? <Repeat1Icon size={20} /> : <RepeatIcon size={20} />}
            {repeatMode !== 'none' && <div className="h-1 w-1 bg-green-500 rounded-full absolute -bottom-1.5 left-1/2 -translate-x-1/2"></div>}
          </button>
        </div>
        <div className="w-full flex items-center gap-2 text-xs text-zinc-400">
          <span>{formatTime(currentTime)}</span>
           <div className="w-full h-3 flex items-center group relative">
                <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-full custom-range"
                />
                <div 
                    className="absolute top-1/2 left-0 -translate-y-1/2 h-1 rounded-full bg-zinc-200 group-hover:bg-green-500 pointer-events-none" 
                    style={{width: `${(currentTime / (duration || 1)) * 100}%`}}>
                </div>
           </div>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume & Other Controls */}
      <div className="w-1/4 flex items-center justify-end gap-4">
        <Link to="/lyrics" className={`transition-colors ${hasLyrics ? 'text-white' : 'text-zinc-500 hover:text-white'}`}>
          <MicIcon size={20} />
        </Link>
        <button onClick={toggleQueueVisibility} className={`transition-colors ${isQueueVisible ? 'text-green-500' : 'text-zinc-400 hover:text-white'}`}>
          <QueueIcon size={20} />
        </button>
        <div className="flex items-center gap-2 w-32 group">
            <button className="text-zinc-400 hover:text-white">
                <VolumeIcon size={20} />
            </button>
             <div className="w-full h-3 flex items-center group relative">
                 <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-full h-full custom-range"
                />
                 <div 
                    className="absolute top-1/2 left-0 -translate-y-1/2 h-1 rounded-full bg-zinc-200 group-hover:bg-green-500 pointer-events-none" 
                    style={{width: `${volume * 100}%`}}>
                </div>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Player;
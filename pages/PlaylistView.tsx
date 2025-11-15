

import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useMusic } from '../contexts/MusicContext';
import { HeartIcon, LibraryIcon } from '../components/Icons';
import { SongList } from '../components/SongList';
import type { Song, SmartPlaylist } from '../types';

declare const ColorThief: any;

const PlaylistView: React.FC = () => {
  const { playlistId } = useParams<{ playlistId: string }>();
  const { state } = useLocation();
  const { playlists, songs, likedSongs, playSong } = useMusic();
  const [bgColor, setBgColor] = useState<string>('#1a1a1a');

  const isSmartPlaylist = !!state;

  let title: string;
  let playlistSongs: Song[];
  let description: string;
  let smartPlaylist: SmartPlaylist | null = null;
  const isLikedSongs = !isSmartPlaylist && playlistId === 'liked';

  if (isSmartPlaylist) {
    title = state.name;
    playlistSongs = state.songs;
    description = state.description;
    smartPlaylist = state as SmartPlaylist;
  } else if (isLikedSongs) {
    title = 'Liked Songs';
    playlistSongs = songs.filter(s => likedSongs.has(s.id));
    description = `${playlistSongs.length} songs`;
  } else {
    const playlist = playlists.find(p => p.id === playlistId);
    if(playlist) {
      title = playlist.name;
      playlistSongs = songs.filter(s => playlist.songs.includes(s.id));
      description = `Your custom playlist &middot; ${playlistSongs.length} songs`;
    } else {
       return <div className="p-8 text-center">Playlist not found.</div>;
    }
  }
  
  const playlistCover = !isLikedSongs && !isSmartPlaylist ? playlistSongs[0]?.coverArt : undefined;

  useEffect(() => {
    if (smartPlaylist?.gradient) {
        // Extract the 'from' color for the top gradient
        const fromColorMatch = /from-([^ ]+)/.exec(smartPlaylist.gradient);
        if (fromColorMatch) {
            // This is a simplification. Real implementation would map Tailwind colors to RGB.
            const colorMap: Record<string, string> = {
                'pink-500': '#ec4899', 'blue-500': '#3b82f6', 'red-500': '#ef4444',
                'gray-700': '#374151', 'yellow-400': '#facc15', 'indigo-500': '#6366f1',
                'teal-400': '#2dd4bf', 'green-600': '#16a34a', 'gray-800': '#1f2937', 'amber-500': '#f59e0b'
            };
            setBgColor(colorMap[fromColorMatch[1]] || '#1a1a1a');
        } else {
            setBgColor('#1a1a1a');
        }
    } else if (playlistCover) {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = playlistCover;
        const handleLoad = () => {
            try {
                const colorThief = new ColorThief();
                const dominantColor = colorThief.getColor(img);
                setBgColor(`rgb(${dominantColor.join(',')})`);
            } catch (e) {
                console.error("Error getting color from image", e);
                setBgColor('#1a1a1a');
            }
        };
        if (img.complete) handleLoad();
        else img.addEventListener('load', handleLoad);
        return () => img.removeEventListener('load', handleLoad);
    } else {
        setBgColor(isLikedSongs ? '#400868' : '#1a1a1a');
    }
  }, [playlistCover, isLikedSongs, smartPlaylist]);


  const handlePlayPlaylist = () => {
      if(playlistSongs.length > 0) {
          playSong(playlistSongs[0], playlistSongs);
      }
  }

  const Icon = isLikedSongs ? (
    <div className="w-48 h-48 bg-gradient-to-br from-purple-700 to-blue-400 flex items-center justify-center rounded-md shadow-2xl">
      <HeartIcon className="text-white" size={64} />
    </div>
  ) : isSmartPlaylist ? (
    <div className={`w-48 h-48 bg-gradient-to-br ${smartPlaylist?.gradient} flex items-center justify-center rounded-md shadow-2xl p-4`}>
        <h2 className="text-white text-3xl font-bold text-center break-words">{title}</h2>
    </div>
  ) : (
    playlistSongs[0]?.coverArt ? (
        <img src={playlistSongs[0].coverArt} alt={title} className="w-48 h-48 rounded-md shadow-2xl" />
    ) : (
        <div className="w-48 h-48 bg-zinc-800 flex items-center justify-center rounded-md shadow-2xl">
            <LibraryIcon className="text-zinc-400" size={64} />
        </div>
    )
  );

  return (
    <div>
      <div className="p-8 pt-20 relative transition-colors duration-500" style={{
            background: `linear-gradient(to bottom, ${bgColor} 0%, #121212 300px)`
        }}>
        <div className="flex items-end gap-6 mb-8">
          {Icon}
          <div>
            <p className="text-sm font-bold uppercase text-zinc-300">Playlist</p>
            <h1 className="text-6xl font-extrabold text-white tracking-tighter">{title}</h1>
            <p className="mt-2 text-zinc-300">{description}</p>
          </div>
        </div>
      </div>
      <div className="p-8 bg-gradient-to-b from-black/20 to-[#121212]">
        <div className="mb-8">
          <button 
            onClick={handlePlayPlaylist}
            className="bg-green-500 text-black text-2xl rounded-full p-4 hover:scale-105 transition-transform disabled:bg-green-800 disabled:cursor-not-allowed"
            disabled={playlistSongs.length === 0}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          </button>
        </div>

        <SongList songs={playlistSongs} />
      </div>
    </div>
  );
};

export default PlaylistView;
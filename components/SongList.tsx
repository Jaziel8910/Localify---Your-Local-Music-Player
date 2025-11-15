import React, { useState } from 'react';
import type { Song } from '../types';
import { useMusic } from '../contexts/MusicContext';
import { formatTime } from '../lib/utils';
import { HeartIcon, MusicIcon, PlayIcon, MoreHorizontalIcon } from './Icons';
import { ContextMenu, ContextMenuItem } from './ContextMenu';
import { Link } from 'react-router-dom';


interface SongListProps {
  songs: Song[];
  showHeader?: boolean;
}

interface ContextMenuState {
  x: number;
  y: number;
  song: Song;
}

export const SongList: React.FC<SongListProps> = ({ songs, showHeader = true }) => {
  const { playSong, currentSong, isPlaying, likedSongs, toggleLikeSong, playlists, addSongToPlaylist } = useMusic();
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

  const handleContextMenu = (event: React.MouseEvent, song: Song) => {
    event.preventDefault();
    setContextMenu({ x: event.clientX, y: event.clientY, song });
  };
  
  const closeContextMenu = () => setContextMenu(null);

  const getContextMenuItems = (song: Song): ContextMenuItem[] => {
    const playlistItems: ContextMenuItem[] = playlists.map(p => ({
        label: p.name,
        action: () => {
            addSongToPlaylist(p.id, song.id)
            closeContextMenu();
        }
    }));

    return [
        {
            label: 'Add to playlist',
            submenu: playlistItems.length > 0 ? playlistItems : [{ label: 'No playlists yet', action: () => {} }]
        },
        {
            label: 'Go to Album',
            action: () => closeContextMenu(), // Navigation handled by Link
            link: `/album/${song.album}-${song.artist}`
        },
        {
            label: 'Go to Artist',
            action: () => closeContextMenu(), // Navigation handled by Link
            link: `/artist/${encodeURIComponent(song.artist)}`
        },
    ];
  }

  return (
    <div className="px-6 relative">
      {showHeader && (
        <div className="grid grid-cols-[2rem_1fr_1fr_5rem_4rem] gap-4 text-zinc-400 uppercase text-xs border-b border-zinc-700 p-2 mb-2">
          <span className="text-center">#</span>
          <span>Title</span>
          <span>Album</span>
          <span className="text-right">Duration</span>
          <span></span>
        </div>
      )}
      <div>
        {songs.map((song, index) => {
          const isCurrent = currentSong?.id === song.id;
          const isLiked = likedSongs.has(song.id);

          return (
            <div
              key={song.id}
              className="grid grid-cols-[2rem_1fr_1fr_5rem_4rem] gap-4 items-center p-2 rounded-md hover:bg-zinc-800/50 group"
              onDoubleClick={() => playSong(song, songs)}
              onContextMenu={(e) => handleContextMenu(e, song)}
            >
              <div className="flex items-center justify-center text-zinc-400">
                <span className="group-hover:hidden">{isCurrent && isPlaying ? <MusicIcon className="text-green-500 animate-pulse" size={16}/> : index + 1}</span>
                <button onClick={() => playSong(song, songs)} className="hidden group-hover:block">
                  <PlayIcon size={16} className="text-white" />
                </button>
              </div>
              <div className="flex items-center gap-3">
                {song.coverArt ? (
                   <img src={song.coverArt} alt={song.title} className="w-10 h-10 rounded-sm" />
                ): (
                   <div className="w-10 h-10 rounded-sm bg-zinc-700 flex items-center justify-center"><MusicIcon size={20}/></div>
                )}
                <div>
                  <p className={`font-medium truncate ${isCurrent ? 'text-green-500' : 'text-white'}`}>{song.title}</p>
                  <div className="flex items-center gap-2">
                    {song.isExplicit && <span className="bg-zinc-600 text-zinc-200 text-[10px] font-bold rounded-sm px-1 py-0.5 leading-none">E</span>}
                    <p className="text-sm text-zinc-400 truncate">{song.artist}</p>
                  </div>
                </div>
              </div>
              <Link to={`/album/${song.album}-${song.artist}`} className="text-zinc-400 truncate hover:underline">{song.album}</Link>
              <span className="text-zinc-400 text-right">{formatTime(song.duration)}</span>
              <div className="flex justify-center items-center gap-2">
                <button onClick={() => toggleLikeSong(song.id)} className={`transition-colors opacity-0 group-hover:opacity-100 ${isLiked ? 'text-green-500 opacity-100' : 'text-zinc-400 hover:text-white'}`}>
                  <HeartIcon fill={isLiked ? 'currentColor' : 'none'} size={18}/>
                </button>
                 <button onClick={(e) => handleContextMenu(e, song)} className="transition-colors text-zinc-400 hover:text-white opacity-0 group-hover:opacity-100">
                  <MoreHorizontalIcon size={18}/>
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={closeContextMenu}
          items={getContextMenuItems(contextMenu.song)}
        />
      )}
    </div>
  );
};
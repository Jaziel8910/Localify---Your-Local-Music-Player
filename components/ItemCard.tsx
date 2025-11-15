import React from 'react';
import { Link } from 'react-router-dom';
import { useMusic } from '../contexts/MusicContext';
import type { LibraryItem, Album, Artist, Playlist, LibraryItemType } from '../types';
import { MusicIcon, PlayIcon, PinIcon } from './Icons';

interface ItemCardProps {
    item: LibraryItem;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
    const { playSong, songs, pinnedItems, togglePinItem } = useMusic();

    // FIX: Use 'albums' in item as a type guard for Artist, as 'name' is present in all LibraryItem types.
    const getItemId = (item: LibraryItem) => 'albums' in item ? item.name : item.id;
    const getItemType = (item: LibraryItem): LibraryItemType => {
        if ('songs' in item && 'type' in item) return 'album';
        if ('albums' in item) return 'artist';
        return 'playlist';
    }
    const getItemCover = (item: LibraryItem) => 'coverArt' in item ? item.coverArt : undefined;
    const getItemName = (item: LibraryItem) => item.name;
    const getItemSubtext = (item: LibraryItem) => {
        const type = getItemType(item);
        if (type === 'artist') return 'Artist';
        if (type === 'album') return `${(item as Album).type} \u00B7 ${(item as Album).artist}`;
        if (type === 'playlist') {
            const playlist = item as Playlist;
            return `Playlist \u00B7 ${playlist.songs.length} songs`;
        }
        return '';
    }
    const getItemLink = (item: LibraryItem) => {
        const type = getItemType(item);
        const id = getItemId(item);
        if (type === 'album') return `/album/${id}`;
        if (type === 'artist') return `/artist/${encodeURIComponent(id)}`;
        if (type === 'playlist') return `/playlist/${id}`;
        return '/library';
    };

    const handlePlay = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        let songsToPlay: import('../types').Song[] = [];

        const type = getItemType(item);
        if (type === 'album') {
            songsToPlay = (item as Album).songs;
        } else if (type === 'artist') {
            songsToPlay = (item as Artist).songs;
        } else if (type === 'playlist') {
            const playlistSongs = (item as Playlist).songs;
            songsToPlay = songs.filter(s => playlistSongs.includes(s.id));
        }

        if (songsToPlay.length > 0) {
            playSong(songsToPlay[0], songsToPlay);
        }
    };
    
    const handlePin = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        togglePinItem(getItemId(item), getItemType(item));
    }
    
    const isPinned = pinnedItems.has(getItemId(item));

    return (
        <Link to={getItemLink(item)} className="block p-4 rounded-lg bg-[#181818] hover:bg-[#282828] transition-colors duration-300 group relative">
            <div className="relative mb-4">
                {getItemCover(item) ? (
                    <img src={getItemCover(item)} alt={getItemName(item)} className={`w-full aspect-square shadow-lg ${getItemType(item) === 'artist' ? 'rounded-full' : 'rounded-md'}`} />
                ) : (
                    <div className={`w-full aspect-square bg-zinc-800 flex items-center justify-center ${getItemType(item) === 'artist' ? 'rounded-full' : 'rounded-md'}`}>
                        <MusicIcon size={48} className="text-zinc-500" />
                    </div>
                )}
                 <button 
                    onClick={handlePlay} 
                    className="absolute bottom-2 right-2 bg-green-500 text-black rounded-full p-3 shadow-lg opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-in-out hover:!scale-105"
                    aria-label={`Play ${getItemName(item)}`}
                >
                    <PlayIcon size={24} />
                </button>
            </div>
            <h3 className="text-white font-bold truncate">{getItemName(item)}</h3>
            <p className="text-zinc-400 text-sm truncate">{getItemSubtext(item)}</p>

            <button onClick={handlePin} title={isPinned ? 'Unpin' : 'Pin'} className={`absolute top-2 right-2 text-zinc-400 hover:text-white p-1 rounded-full hover:bg-black/50 transition-opacity ${isPinned ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                <PinIcon size={20} className={isPinned ? 'text-green-500' : ''}/>
            </button>
        </Link>
    );
};
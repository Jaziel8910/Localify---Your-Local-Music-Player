

import React, { useState, useMemo } from 'react';
import { useMusic } from '../contexts/MusicContext';
import type { Album, Artist, Playlist, LibraryItem, LibraryItemType } from '../types';
import { ItemCard } from '../components/ItemCard';
import { MusicIcon } from '../components/Icons';

const Library: React.FC = () => {
    const { playlists, albums, artists, loading, songs, pinnedItems } = useMusic();
    const [filter, setFilter] = useState<LibraryItemType | 'all'>('all');

    const allLibraryItems: LibraryItem[] = useMemo(() => {
        return [...playlists, ...albums, ...artists];
    }, [playlists, albums, artists]);

    const filteredItems = useMemo(() => {
        let items: LibraryItem[] = [];
        if (filter === 'all') {
            items = allLibraryItems;
        } else if (filter === 'playlist') {
            items = playlists;
        } else if (filter === 'artist') {
            items = artists;
        } else if (filter === 'album') {
            items = albums;
        }
        
        const pinned = items.filter(item => pinnedItems.has('albums' in item ? item.name : item.id));
        const unpinned = items.filter(item => !pinnedItems.has('albums' in item ? item.name : item.id));

        return [...pinned, ...unpinned];
    }, [filter, allLibraryItems, pinnedItems, playlists, artists, albums]);


    if (loading) {
        return <div className="p-8 text-center">Loading your music library...</div>;
    }

    if (songs.length === 0) {
        return (
            <div className="p-8 text-center flex flex-col items-center justify-center h-full">
                <MusicIcon size={64} className="text-zinc-600 mb-4" />
                <h1 className="text-3xl font-bold mb-2">Your Library is Empty</h1>
                <p className="text-zinc-400">Add music files from the sidebar to get started.</p>
            </div>
        );
    }
    
     return (
        <div className="p-6 pt-20">
            <div className="flex gap-2 mb-6">
                {(['all', 'Playlists', 'Artists', 'Albums'] as const).map(f => {
                    const filterType = f === 'all' ? 'all' : f.slice(0, -1).toLowerCase() as LibraryItemType;
                    return (
                        <button key={f} onClick={() => setFilter(filterType)} className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${filter === filterType ? 'bg-white text-black' : 'bg-zinc-800 hover:bg-zinc-700 text-white'}`}>
                            {f === 'all' ? 'All' : f}
                        </button>
                    );
                })}
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {filteredItems.map(item => (
                    <ItemCard key={'id' in item ? item.id : item.name} item={item} />
                ))}
            </div>
        </div>
    );
};

export default Library;
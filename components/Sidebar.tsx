import React, { useRef, useState, useMemo } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { HomeIcon, HomeActiveIcon, LibraryIcon, LibraryActiveIcon, PlusIcon, HeartIcon, SearchIcon, PinIcon, MusicIcon } from './Icons';
import { useMusic } from '../contexts/MusicContext';
import type { Album, Artist, Playlist, LibraryItemType, LibraryItem } from '../types';

const Sidebar: React.FC = () => {
    const { playlists, albums, artists, likedSongs, loadFiles, pinnedItems } = useMusic();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [filter, setFilter] = useState<LibraryItemType | 'all'>('all');
    
    const handleAddFilesClick = () => {
        fileInputRef.current?.click();
    };

    const handleFilesSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            loadFiles(event.target.files);
        }
    };

    const navLinkClass = "flex items-center gap-4 px-4 py-2 rounded transition-colors duration-200 font-bold";
    const activeNavLinkClass = "text-white";
    const inactiveNavLinkClass = "text-zinc-400 hover:text-white";

    const allLibraryItems: (Album | Artist | Playlist)[] = useMemo(() => {
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
        
        // FIX: Use 'albums' in item as a type guard for Artist, as 'name' is present in all LibraryItem types.
        const pinned = items.filter(item => pinnedItems.has('albums' in item ? item.name : item.id));
        const unpinned = items.filter(item => !pinnedItems.has('albums' in item ? item.name : item.id));

        return [...pinned, ...unpinned];
    }, [filter, allLibraryItems, pinnedItems, playlists, artists, albums]);
    
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
        if (type === 'album') return `Album \u00B7 ${(item as Album).artist}`;
        if (type === 'playlist') return `Playlist \u00B7 You`;
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


    return (
        <aside className="w-80 flex-shrink-0 flex flex-col gap-2">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                onChange={handleFilesSelected}
                accept="audio/flac,audio/mpeg,audio/wav,audio/ogg,audio/mp4,audio/aac,audio/opus,audio/webm"
            />
            <div className="bg-[#121212] rounded-lg p-2">
                <nav>
                    <NavLink to="/home" className={({isActive}) => `${navLinkClass} ${isActive ? activeNavLinkClass : inactiveNavLinkClass}`}>
                        {({isActive}) => isActive ? <HomeActiveIcon /> : <HomeIcon />}
                        <span>Home</span>
                    </NavLink>
                    <NavLink to="/search" className={({isActive}) => `${navLinkClass} ${isActive ? activeNavLinkClass : inactiveNavLinkClass}`}>
                        <SearchIcon />
                        <span>Search</span>
                    </NavLink>
                </nav>
            </div>
            <div className="bg-[#121212] rounded-lg p-2 flex-grow flex flex-col">
                <div className="flex justify-between items-center p-4">
                    <div className="flex items-center gap-2 text-zinc-400 font-bold">
                        <LibraryIcon />
                        <span>Your Library</span>
                    </div>
                    <div>
                        <button onClick={handleAddFilesClick} className="text-zinc-400 hover:text-white transition-colors" title="Add music files">
                            <PlusIcon />
                        </button>
                    </div>
                </div>

                <div className="px-3 pb-2">
                    <div className="flex gap-2">
                        { (['all', 'Playlists', 'Artists', 'Albums'] as const).map(f => {
                            const filterType = f === 'all' ? 'all' : f.slice(0, -1).toLowerCase() as LibraryItemType;
                            return (
                                <button key={f} onClick={() => setFilter(filterType)} className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${filter === filterType ? 'bg-white text-black' : 'bg-zinc-800 hover:bg-zinc-700 text-white'}`}>
                                    {f === 'all' ? 'All' : f}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="flex-grow overflow-y-auto px-2">
                    <Link to="/playlist/liked" className="flex items-center gap-4 px-2 py-2 rounded transition-colors duration-200 text-zinc-300 hover:bg-zinc-800">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-700 to-blue-400 flex items-center justify-center rounded">
                           <HeartIcon className="text-white" />
                        </div>
                        <div>
                            <p className="font-semibold text-white">Liked Songs</p>
                            <div className="flex items-center gap-2">
                               {pinnedItems.has('liked') && <PinIcon size={14} className="text-green-500"/>}
                               <p className="text-sm text-zinc-400">Playlist &middot; {likedSongs.size} songs</p>
                            </div>
                        </div>
                    </Link>

                    {filteredItems.map(item => (
                        <Link key={getItemId(item)} to={getItemLink(item)} className="flex items-center gap-4 px-2 py-2 rounded transition-colors duration-200 text-zinc-300 hover:bg-zinc-800">
                           { getItemCover(item) ? (
                                <img src={getItemCover(item)} alt={getItemName(item)} className={`w-12 h-12 object-cover ${getItemType(item) === 'artist' ? 'rounded-full' : 'rounded'}`}/>
                            ) : (
                                <div className={`w-12 h-12 bg-zinc-800 flex items-center justify-center ${getItemType(item) === 'artist' ? 'rounded-full' : 'rounded'}`}>
                                   <MusicIcon className="text-zinc-400" />
                                </div>
                            )}
                            <div>
                                <p className="font-semibold text-white">{getItemName(item)}</p>
                                <div className="flex items-center gap-2">
                                    {pinnedItems.has(getItemId(item)) && <PinIcon size={14} className="text-green-500"/>}
                                    <p className="text-sm text-zinc-400">{getItemSubtext(item)}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
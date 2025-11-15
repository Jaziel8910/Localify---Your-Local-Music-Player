

import React, { useState, useEffect, useMemo } from 'react';
import { useMusic } from '../contexts/MusicContext';
import { Link, useNavigate } from 'react-router-dom';
import type { LibraryItem, SmartPlaylist } from '../types';
import { ItemCard } from '../components/ItemCard';
import { MusicIcon, PlayIcon } from '../components/Icons';

declare const ColorThief: any;

const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
};

const QuickLinkCard: React.FC<{ item: LibraryItem }> = ({ item }) => {
    const { playSong, songs } = useMusic();
    const getItemCover = (item: LibraryItem) => 'coverArt' in item ? item.coverArt : undefined;
    const getItemName = (item: LibraryItem) => item.name;
    const getItemId = (item: LibraryItem) => 'albums' in item ? item.name : item.id;

    const getItemLink = (item: LibraryItem) => {
        const type = 'type' in item ? 'album' : 'albums' in item ? 'artist' : 'playlist';
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

        const type = 'type' in item ? 'album' : 'albums' in item ? 'artist' : 'playlist';
        if (type === 'album') {
            songsToPlay = (item as import('../types').Album).songs;
        } else if (type === 'artist') {
            songsToPlay = (item as import('../types').Artist).songs;
        } else if (type === 'playlist') {
            const playlistSongs = (item as import('../types').Playlist).songs;
            songsToPlay = songs.filter(s => playlistSongs.includes(s.id));
        }

        if (songsToPlay.length > 0) {
            playSong(songsToPlay[0], songsToPlay);
        }
    };


    return (
        <div className="bg-white/10 hover:bg-white/20 rounded-md transition-colors overflow-hidden group relative">
             <Link to={getItemLink(item)} className="flex items-center">
                {getItemCover(item) ? (
                    <img src={getItemCover(item)} alt={getItemName(item)} className="w-20 h-20 object-cover shadow-lg" />
                ) : (
                    <div className="w-20 h-20 bg-zinc-800 flex items-center justify-center flex-shrink-0">
                        <MusicIcon className="text-zinc-400" />
                    </div>
                )}
                <h3 className="text-white font-bold ml-4 pr-4">{getItemName(item)}</h3>
             </Link>
             <button 
                onClick={handlePlay} 
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-green-500 text-black rounded-full p-3 shadow-lg opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-in-out hover:scale-105"
                aria-label={`Play ${getItemName(item)}`}
            >
                <PlayIcon size={24} />
            </button>
        </div>
    );
};

const SmartPlaylistCard: React.FC<{ playlist: SmartPlaylist }> = ({ playlist }) => {
    const navigate = useNavigate();
    const { playSong } = useMusic();

    const handleNavigate = () => {
        navigate(`/playlist/${playlist.id}`, { 
            state: { 
                songs: playlist.songs, 
                name: playlist.name,
                description: playlist.description,
                gradient: playlist.gradient,
            } 
        });
    };

    const handlePlay = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (playlist.songs.length > 0) {
            playSong(playlist.songs[0], playlist.songs);
        }
    };

    return (
         <div onClick={handleNavigate} className="block p-4 rounded-lg bg-[#181818] hover:bg-[#282828] transition-colors duration-300 group relative cursor-pointer">
            <div className={`w-full aspect-square shadow-lg rounded-md mb-4 bg-gradient-to-br ${playlist.gradient || 'from-zinc-700 to-zinc-800'} flex items-center justify-center p-4`}>
                 <h3 className="text-white text-2xl font-bold text-center">{playlist.name}</h3>
            </div>
            <p className="text-zinc-400 text-sm truncate">{playlist.description}</p>
             <button 
                onClick={handlePlay} 
                className="absolute top-[calc(50%-2.5rem)] right-6 bg-green-500 text-black rounded-full p-3 shadow-lg opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-in-out hover:!scale-105"
                aria-label={`Play ${playlist.name}`}
            >
                <PlayIcon size={24} />
            </button>
        </div>
    )
}

const Home: React.FC = () => {
    const { recentItems, getItemById, artists, songs, currentSong, getSmartPlaylists, isAIEnabled, toggleAI } = useMusic();
    const [bgColor, setBgColor] = useState('#121212');

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


    if (songs.length === 0) {
        return (
            <div className="p-8 text-center flex flex-col items-center justify-center h-full">
                <MusicIcon size={64} className="text-zinc-600 mb-4" />
                <h1 className="text-3xl font-bold mb-2">Welcome to Localify</h1>
                <p className="text-zinc-400">Add music files from the sidebar to get started.</p>
            </div>
        );
    }
    
    const recentLibraryItems = recentItems
        .map(item => getItemById(item.type, item.id))
        .filter((item): item is LibraryItem => item !== undefined);
    
    const smartPlaylists = useMemo(() => getSmartPlaylists(), [songs, artists, isAIEnabled]);


    return (
        <div className="relative">
            <div 
                className="absolute top-0 left-0 right-0 h-[330px] transition-colors duration-1000 -z-10"
                style={{
                    background: `linear-gradient(to bottom, ${bgColor} 0%, #121212 100%)`,
                }}
            />
            <div className="p-6 pt-20 space-y-12">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-white">{getGreeting()}</h1>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-zinc-300">AI Features</span>
                         <button onClick={toggleAI} className={`w-12 h-6 rounded-full p-1 transition-colors ${isAIEnabled ? 'bg-green-500' : 'bg-zinc-700'}`}>
                            <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${isAIEnabled ? 'translate-x-6' : ''}`} />
                        </button>
                    </div>
                </div>
                
                {recentLibraryItems.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {recentLibraryItems.slice(0, 6).map(item => {
                            const id = 'id' in item ? item.id : item.name;
                            return <QuickLinkCard key={id} item={item} />
                        })}
                    </div>
                )}
                
                {isAIEnabled && smartPlaylists.length > 0 && (
                     <div>
                        <h2 className="text-2xl font-bold text-white mb-4">Made for You</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                            {smartPlaylists.map(playlist => (
                                <SmartPlaylistCard key={playlist.id} playlist={playlist} />
                            ))}
                        </div>
                    </div>
                )}

                <div>
                    <h2 className="text-2xl font-bold text-white mb-4">Your Top Artists</h2>
                    <p className="text-zinc-400 mb-4">The artists you've had on repeat recently.</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                        {[...artists].sort((a,b) => b.playCount - a.playCount).slice(0, 6).map(artist => (
                            <ItemCard key={artist.name} item={artist} />
                        ))}
                    </div>
                </div>
                
            </div>
        </div>
    );
};

export default Home;
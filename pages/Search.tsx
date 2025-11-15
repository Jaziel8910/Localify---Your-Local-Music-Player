import React, { useState, useMemo } from 'react';
import { useMusic } from '../contexts/MusicContext';
import { SearchIcon } from '../components/Icons';
import { SongList } from '../components/SongList';
import { ItemCard } from '../components/ItemCard';

const Search: React.FC = () => {
    const { songs, albums, artists, playlists } = useMusic();
    const [query, setQuery] = useState('');

    const results = useMemo(() => {
        if (!query) {
            return null;
        }

        const lowerCaseQuery = query.toLowerCase();
        
        const filteredSongs = songs.filter(s => 
            s.title.toLowerCase().includes(lowerCaseQuery) ||
            s.artist.toLowerCase().includes(lowerCaseQuery) ||
            s.album.toLowerCase().includes(lowerCaseQuery)
        );

        const filteredAlbums = albums.filter(a => 
            a.name.toLowerCase().includes(lowerCaseQuery) ||
            a.artist.toLowerCase().includes(lowerCaseQuery)
        );

        const filteredArtists = artists.filter(a => 
            a.name.toLowerCase().includes(lowerCaseQuery)
        );

        const filteredPlaylists = playlists.filter(p => 
            p.name.toLowerCase().includes(lowerCaseQuery)
        );
        
        return {
            songs: filteredSongs,
            albums: filteredAlbums,
            artists: filteredArtists,
            playlists: filteredPlaylists,
        };
    }, [query, songs, albums, artists, playlists]);
    
    const topResult = useMemo(() => {
        if (!results) return null;
        if (results.artists.length > 0) return results.artists[0];
        if (results.albums.length > 0) return results.albums[0];
        if (results.playlists.length > 0) return results.playlists[0];
        if (results.songs.length > 0) return null; // Don't show song as top result card
        return null;
    }, [results]);

    const topSongResults = results?.songs.slice(0, 4) ?? [];

    return (
        <div className="p-6 pt-20">
            <div className="sticky top-[72px] z-10 -mx-6 px-6 pb-4 bg-[#121212] bg-opacity-80 backdrop-blur-sm">
                <div className="relative max-w-sm">
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={24}/>
                    <input
                        type="text"
                        placeholder="What do you want to listen to?"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full bg-zinc-800 text-white rounded-full py-3 pl-12 pr-4 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-white"
                        autoFocus
                    />
                </div>
            </div>

            {query && !results && <p className="text-zinc-400">Searching...</p>}
            
            {query && results && (topResult || topSongResults.length > 0) ? (
                 <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-8 mb-8">
                     {topResult && (
                         <div>
                            <h2 className="text-2xl font-bold text-white mb-4">Top result</h2>
                            <ItemCard item={topResult} />
                         </div>
                     )}
                     {topSongResults.length > 0 && (
                         <div className={!topResult ? 'lg:col-span-2' : ''}>
                            <h2 className="text-2xl font-bold text-white mb-4">Songs</h2>
                            <SongList songs={topSongResults} showHeader={false} />
                         </div>
                     )}
                 </div>
            ) : query && <p className="text-center text-zinc-400 mt-8">No results found for "{query}".</p>}

            {!query && (
                 <div>
                    <h2 className="text-2xl font-bold text-white mb-4">Browse all</h2>
                     <p className="text-zinc-400">Start typing to search for songs, artists, albums, or playlists.</p>
                 </div>
            )}
            
            {results && (
                 <div className="space-y-8">
                    {results.songs.length > 4 && (
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-4">More Songs</h2>
                            <SongList songs={results.songs.slice(4)} />
                        </div>
                    )}
                    {results.artists.length > (topResult && topResult.hasOwnProperty('albums') ? 1 : 0) && (
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-4">Artists</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                                {results.artists.filter(a => topResult && 'name' in topResult ? a.name !== topResult.name : true).map(item => <ItemCard key={item.name} item={item} />)}
                            </div>
                        </div>
                    )}
                     {results.albums.length > (topResult && topResult.hasOwnProperty('type') ? 1 : 0) && (
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-4">Albums</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                                {results.albums.filter(a => topResult && 'id' in topResult ? a.id !== topResult.id : true).map(item => <ItemCard key={item.id} item={item} />)}
                            </div>
                        </div>
                    )}
                     {results.playlists.length > (topResult && !topResult.hasOwnProperty('type') && !topResult.hasOwnProperty('albums') ? 1 : 0) && (
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-4">Playlists</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                                {results.playlists.filter(p => topResult && 'id' in topResult ? p.id !== topResult.id : true).map(item => <ItemCard key={item.id} item={item} />)}
                            </div>
                        </div>
                    )}
                 </div>
            )}
        </div>
    );
};

export default Search;

import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useMusic } from '../contexts/MusicContext';
import { PlayIcon } from '../components/Icons';
import { SongList } from '../components/SongList';
import { ItemCard } from '../components/ItemCard';

const VerifiedIcon: React.FC = () => (
    <svg height="24" width="24" viewBox="0 0 24" fill="#3d91f4" className="inline-block">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>
    </svg>
);


const ArtistView: React.FC = () => {
  const { artistName } = useParams<{ artistName: string }>();
  const { artists, playSong } = useMusic();

  if (!artistName) {
    return <Navigate to="/home" replace />;
  }
  
  const artist = artists.find(a => a.name === decodeURIComponent(artistName));

  if (!artist) {
    return <div className="p-8 text-center">Artist not found.</div>;
  }
  
  const handlePlayArtist = () => {
    if(artist.songs.length > 0) {
        playSong(artist.songs[0], artist.songs);
    }
  }

  const topSongs = artist.songs.slice(0, 5);
  const albumsOnly = artist.albums.filter(a => a.type === 'Album' || a.type === 'Mixtape');
  const singlesAndEps = artist.albums.filter(a => a.type === 'Single' || a.type === 'EP');

  return (
    <div>
        <div className="pt-20 relative w-full h-[400px] overflow-hidden">
            {artist.coverArt && (
                <>
                    <div
                        className="absolute inset-0 bg-cover bg-center z-0 scale-110"
                        style={{ backgroundImage: `url(${artist.coverArt})` }}
                    />
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-xl z-10" />
                </>
            )}
            <div 
                className="absolute inset-0 z-10"
                style={{ background: `linear-gradient(to top, #121212 0%, transparent 50%)`}}
            />

            <div className="relative z-20 p-8 h-full flex flex-col justify-end text-white">
                <div>
                    <p className="text-sm font-bold flex items-center gap-2"><VerifiedIcon /> Verified Artist</p>
                    <h1 className="text-8xl font-extrabold tracking-tighter mt-2" style={{ textShadow: '2px 4px 12px rgba(0,0,0,0.7)' }}>{artist.name}</h1>
                    <p className="mt-4 text-zinc-300">{artist.albums.length} Releases &middot; {artist.songs.length} Songs</p>
                </div>
            </div>
      </div>
      
      <div className="p-8 bg-[#121212] space-y-10">
        <div className="flex items-center gap-6">
            <button 
                onClick={handlePlayArtist}
                className="bg-green-500 text-black rounded-full p-4 hover:scale-105 transition-transform"
                aria-label={`Play music from ${artist.name}`}
                >
                <PlayIcon size={32} />
            </button>
            <button className="border border-zinc-400 rounded-full px-6 py-2 text-white font-bold text-sm hover:border-white transition-colors">
                Follow
            </button>
        </div>

        <div>
            <h2 className="text-2xl font-bold text-white mb-4">Popular</h2>
            <SongList songs={topSongs} showHeader={false} />
        </div>
        
        {albumsOnly.length > 0 && (
            <div>
                 <h2 className="text-2xl font-bold text-white mt-8 mb-4">Albums</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    {albumsOnly.map(album => (
                        <ItemCard key={album.id} item={album} />
                    ))}
                </div>
            </div>
        )}
        
        {singlesAndEps.length > 0 && (
            <div>
                 <h2 className="text-2xl font-bold text-white mt-8 mb-4">Singles & EPs</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    {singlesAndEps.map(album => (
                        <ItemCard key={album.id} item={album} />
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default ArtistView;
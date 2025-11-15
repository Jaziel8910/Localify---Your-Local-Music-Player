import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMusic } from '../contexts/MusicContext';
import { MusicIcon } from '../components/Icons';
import { SongList } from '../components/SongList';

declare const ColorThief: any;

const AlbumView: React.FC = () => {
  const { albumId } = useParams<{ albumId: string }>();
  const { albums, playSong } = useMusic();
  const album = albums.find(a => a.id === albumId);
  const [bgColor, setBgColor] = useState<string>('#1a1a1a');
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (album?.coverArt && imgRef.current) {
        const img = imgRef.current;
        img.crossOrigin = 'Anonymous';
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
        if (img.complete) {
            handleLoad();
        } else {
            img.addEventListener('load', handleLoad);
        }
        return () => img.removeEventListener('load', handleLoad);
    }
  }, [album?.coverArt]);


  if (!album) {
    return <div className="p-8 text-center">Album not found.</div>;
  }
  
  const handlePlayAlbum = () => {
    if(album.songs.length > 0) {
        playSong(album.songs[0], album.songs);
    }
  }

  return (
    <div>
        <div className="p-8 pt-20 relative transition-colors duration-500" style={{
            background: `linear-gradient(to bottom, ${bgColor} 0%, #121212 300px)`
        }}>
            <div className="flex items-end gap-6 mb-8">
                {album.coverArt ? (
                <img ref={imgRef} src={album.coverArt} alt={album.name} className="w-48 h-48 rounded-md shadow-2xl" />
                ) : (
                <div className="w-48 h-48 rounded-md bg-zinc-800 flex items-center justify-center shadow-2xl">
                    <MusicIcon size={64} className="text-zinc-500" />
                </div>
                )}
                <div>
                <p className="text-sm font-bold uppercase text-zinc-300">{album.type}</p>
                <h1 className="text-6xl font-extrabold text-white tracking-tighter" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.5)' }}>{album.name}</h1>
                <p className="mt-2 text-zinc-300">
                    <Link to={`/artist/${encodeURIComponent(album.artist)}`} className="font-bold hover:underline">{album.artist}</Link> &middot; {album.songs.length} songs
                </p>
                </div>
            </div>
      </div>
      
      <div className="p-8 bg-gradient-to-b from-black/20 to-[#121212]">
        <div className="mb-8">
            <button 
            onClick={handlePlayAlbum}
            className="bg-green-500 text-black text-2xl rounded-full p-4 hover:scale-105 transition-transform"
            >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            </button>
        </div>

        <SongList songs={album.songs} />
      </div>
    </div>
  );
};

export default AlbumView;
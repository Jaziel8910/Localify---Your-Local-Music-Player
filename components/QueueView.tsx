import React, { useState, useRef } from 'react';
import { useMusic } from '../contexts/MusicContext';
import { MusicIcon, XIcon } from './Icons';

export const QueueView: React.FC = () => {
    const { playQueue, currentSong, updateQueue, removeSongFromQueue, playSong } = useMusic();
    const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
    const dragOverItemIndex = useRef<number | null>(null);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        setDraggedItemIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    };
    
    const handleDragEnter = (index: number) => {
        dragOverItemIndex.current = index;
    };

    const handleDragEnd = () => {
        if (draggedItemIndex !== null && dragOverItemIndex.current !== null) {
            const newQueue = [...playQueue];
            const draggedItem = newQueue.splice(draggedItemIndex, 1)[0];
            newQueue.splice(dragOverItemIndex.current, 0, draggedItem);
            updateQueue(newQueue);
        }
        setDraggedItemIndex(null);
        dragOverItemIndex.current = null;
    };
    
    return (
        <aside className="w-96 bg-[#121212] rounded-lg p-4 flex flex-col animate-[slide-in_0.3s_ease-out]">
            <style>{`
                @keyframes slide-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
            <h2 className="text-xl font-bold mb-4 text-white">Queue</h2>
            
            <div className="overflow-y-auto flex-grow">
                <div>
                    <h3 className="text-sm font-semibold text-zinc-400 mb-2">Now Playing</h3>
                    {currentSong && (
                        <div className="flex items-center gap-3 p-2 rounded-md bg-green-500/20">
                           <img src={currentSong.coverArt} alt={currentSong.title} className="w-10 h-10 rounded-sm" />
                            <div>
                                <p className="font-medium truncate text-green-400">{currentSong.title}</p>
                                <p className="text-sm text-zinc-300 truncate">{currentSong.artist}</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-4">
                    <h3 className="text-sm font-semibold text-zinc-400 mb-2">Next Up</h3>
                    {playQueue.filter(s => s.id !== currentSong?.id).map((song, index) => (
                         <div
                            key={song.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, playQueue.indexOf(song))}
                            onDragEnter={() => handleDragEnter(playQueue.indexOf(song))}
                            onDragEnd={handleDragEnd}
                            onDragOver={(e) => e.preventDefault()}
                            className="flex items-center gap-3 p-2 rounded-md hover:bg-zinc-800/80 group cursor-grab"
                            onDoubleClick={() => playSong(song, playQueue)}
                         >
                            {song.coverArt ? (
                                <img src={song.coverArt} alt={song.title} className="w-10 h-10 rounded-sm" />
                            ): (
                                <div className="w-10 h-10 rounded-sm bg-zinc-700 flex items-center justify-center"><MusicIcon size={20}/></div>
                            )}
                            <div className="flex-grow">
                                <p className="font-medium truncate text-white">{song.title}</p>

                                <p className="text-sm text-zinc-400 truncate">{song.artist}</p>
                            </div>
                            <button 
                                onClick={() => removeSongFromQueue(song.id)}
                                className="text-zinc-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <XIcon size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
};

export default QueueView;
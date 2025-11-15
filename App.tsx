import React, { useState, useCallback, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MusicProvider, useMusic } from './contexts/MusicContext';
import Sidebar from './components/Sidebar';
import Player from './components/Player';
import Library from './pages/Library';
import AlbumView from './pages/AlbumView';
import ArtistView from './pages/ArtistView';
import PlaylistView from './pages/PlaylistView';
import LyricsView from './pages/LyricsView';
import Home from './pages/Home';
import Header from './components/Header';
import Search from './pages/Search';
import QueueView from './components/QueueView';
import { UploadCloudIcon } from './components/Icons';

const MIN_SIDEBAR_WIDTH = 288; // 18rem
const MAX_SIDEBAR_WIDTH = 480; // 30rem

const DragDropOverlay: React.FC = () => (
    <div className="absolute inset-2 z-50 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center border-2 border-dashed border-zinc-500 rounded-lg pointer-events-none">
        <UploadCloudIcon size={80} className="text-zinc-400 mb-4" />
        <p className="text-2xl font-bold text-zinc-300">Drop your music here</p>
    </div>
);

function AppLayout() {
  const { isQueueVisible, loadFiles } = useMusic();
  const [isResizing, setIsResizing] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const dragCounter = useRef(0);

  const handleMouseDown = useCallback(() => {
    setIsResizing(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isResizing) {
      const newWidth = Math.max(MIN_SIDEBAR_WIDTH, Math.min(e.clientX, MAX_SIDEBAR_WIDTH));
      document.documentElement.style.setProperty('--sidebar-width', `${newWidth}px`);
    }
  }, [isResizing]);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    const handleDragEnter = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current++;
        if (e.dataTransfer?.items && e.dataTransfer.items.length > 0) {
            setIsDraggingOver(true);
        }
    };
    const handleDragLeave = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current--;
        if (dragCounter.current === 0) {
            setIsDraggingOver(false);
        }
    };
    const handleDragOver = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };
    const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingOver(false);
        dragCounter.current = 0;
        if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
            loadFiles(e.dataTransfer.files);
        }
    };

    window.addEventListener('dragenter', handleDragEnter);
    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('drop', handleDrop);

    return () => {
        window.removeEventListener('dragenter', handleDragEnter);
        window.removeEventListener('dragover', handleDragOver);
        window.removeEventListener('dragleave', handleDragLeave);
        window.removeEventListener('drop', handleDrop);
    };
  }, [loadFiles]);

  return (
    <div className="h-screen w-screen grid grid-rows-[1fr_auto] p-2 gap-2 bg-black">
      {isDraggingOver && <DragDropOverlay />}
      <div 
        className={`grid ${isQueueVisible ? 'grid-cols-[var(--sidebar-width)_1fr_24rem]' : 'grid-cols-[var(--sidebar-width)_1fr]'} gap-2 overflow-hidden transition-[grid-template-columns] duration-300 ease-in-out`}
      >
        <Sidebar />
        <div 
          onMouseDown={handleMouseDown}
          className="absolute top-2 bottom-[7.5rem] z-20 w-1.5 cursor-col-resize"
          style={{ left: 'calc(var(--sidebar-width) - 2px)'}}
        />
        <main className="bg-[#121212] rounded-lg overflow-y-auto relative">
          <Header />
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/library" element={<Library />} />
            <Route path="/album/:albumId" element={<AlbumView />} />
            <Route path="/artist/:artistName" element={<ArtistView />} />
            <Route path="/playlist/:playlistId" element={<PlaylistView />} />
            <Route path="/lyrics" element={<LyricsView />} />
          </Routes>
        </main>
        {isQueueVisible && <QueueView />}
      </div>
      <Player />
    </div>
  );
}


function App() {
  return (
    <MusicProvider>
      <HashRouter>
        <AppLayout />
      </HashRouter>
    </MusicProvider>
  );
}

export default App;
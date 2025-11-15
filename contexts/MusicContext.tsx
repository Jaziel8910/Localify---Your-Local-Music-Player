import React, { createContext, useContext, useState, useRef, useEffect, useCallback, ReactNode, useMemo } from 'react';
import type { Song, Album, Artist, Playlist, LibraryItem, SyncedLyricLine, SmartPlaylist } from '../types';
import { readMetadata } from '../services/metadataReader';
import { fetchLyrics } from '../services/lyricsService';
import { getLyricsFromCache, setLyricsInCache, LyricsData } from '../services/lyricsCache';
import { analyzeAndTagSong } from '../services/aiService';

interface RecentItem {
  type: 'album' | 'artist' | 'playlist';
  id: string;
}

interface History {
    playCount: number;
    lastPlayed?: number;
}

interface MusicContextType {
  songs: Song[];
  albums: Album[];
  artists: Artist[];
  playlists: Playlist[];
  likedSongs: Set<string>;
  pinnedItems: Set<string>;
  recentItems: RecentItem[];
  loadFiles: (files: FileList) => Promise<void>;
  loading: boolean;
  
  currentSong: Song | null;
  isPlaying: boolean;
  playSong: (song: Song, queue?: Song[]) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrev: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  currentTime: number;
  duration: number;
  volume: number;
  isShuffle: boolean;
  toggleShuffle: () => void;
  repeatMode: 'none' | 'one' | 'all';
  toggleRepeat: () => void;
  
  toggleLikeSong: (songId: string) => void;
  createPlaylist: (name: string) => void;
  addSongToPlaylist: (playlistId: string, songId: string) => void;

  togglePinItem: (itemId: string, type: 'album' | 'artist' | 'playlist') => void;
  getItemById: (type: 'album' | 'artist' | 'playlist', id: string) => LibraryItem | undefined;

  // Lyrics
  unsyncedLyrics: string | null;
  syncedLyrics: SyncedLyricLine[] | null;
  loadingLyrics: boolean;

  // Queue
  playQueue: Song[];
  isQueueVisible: boolean;
  toggleQueueVisibility: () => void;
  updateQueue: (newQueue: Song[]) => void;
  removeSongFromQueue: (songId: string) => void;

  // AI Features
  isAIEnabled: boolean;
  toggleAI: () => void;
  getSmartPlaylists: () => SmartPlaylist[];
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [rawSongs, setRawSongs] = useState<Song[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [likedSongs, setLikedSongs] = useState<Set<string>>(new Set());
  const [pinnedItems, setPinnedItems] = useState<Set<string>>(new Set());
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
  const [loading, setLoading] = useState(false);

  // History State
  const [songHistory, setSongHistory] = useState<Record<string, History>>({});
  const [albumHistory, setAlbumHistory] = useState<Record<string, History>>({});
  const [artistHistory, setArtistHistory] = useState<Record<string, History>>({});

  // AI State
  const [isAIEnabled, setIsAIEnabled] = useState(true);

  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [playQueue, setPlayQueue] = useState<Song[]>([]);
  const [shuffledQueue, setShuffledQueue] = useState<Song[]>([]);
  const [originalQueue, setOriginalQueue] = useState<Song[]>([]);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'none' | 'one' | 'all'>('none');
  const [isQueueVisible, setIsQueueVisible] = useState(false);

  const [unsyncedLyrics, setUnsyncedLyrics] = useState<string | null>(null);
  const [syncedLyrics, setSyncedLyrics] = useState<SyncedLyricLine[] | null>(null);
  const [loadingLyrics, setLoadingLyrics] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(new Audio());

  // Load from localStorage
  useEffect(() => {
    const savedPlaylists = localStorage.getItem('localify-playlists');
    if (savedPlaylists) setPlaylists(JSON.parse(savedPlaylists));
    const savedLikedSongs = localStorage.getItem('localify-likedSongs');
    if (savedLikedSongs) setLikedSongs(new Set(JSON.parse(savedLikedSongs)));
    const savedPinnedItems = localStorage.getItem('localify-pinnedItems');
    if (savedPinnedItems) setPinnedItems(new Set(JSON.parse(savedPinnedItems)));
    const savedRecentItems = localStorage.getItem('localify-recentItems');
    if (savedRecentItems) setRecentItems(JSON.parse(savedRecentItems));
    const savedSongHistory = localStorage.getItem('localify-songHistory');
    if (savedSongHistory) setSongHistory(JSON.parse(savedSongHistory));
    const savedAlbumHistory = localStorage.getItem('localify-albumHistory');
    if (savedAlbumHistory) setAlbumHistory(JSON.parse(savedAlbumHistory));
    const savedArtistHistory = localStorage.getItem('localify-artistHistory');
    if (savedArtistHistory) setArtistHistory(JSON.parse(savedArtistHistory));
    const savedAIEnabled = localStorage.getItem('localify-isAIEnabled');
    if(savedAIEnabled) setIsAIEnabled(JSON.parse(savedAIEnabled));
  }, []);
  
  // Save to localStorage
  useEffect(() => localStorage.setItem('localify-playlists', JSON.stringify(playlists)), [playlists]);
  useEffect(() => localStorage.setItem('localify-likedSongs', JSON.stringify(Array.from(likedSongs))), [likedSongs]);
  useEffect(() => localStorage.setItem('localify-pinnedItems', JSON.stringify(Array.from(pinnedItems))), [pinnedItems]);
  useEffect(() => localStorage.setItem('localify-recentItems', JSON.stringify(recentItems)), [recentItems]);
  useEffect(() => localStorage.setItem('localify-songHistory', JSON.stringify(songHistory)), [songHistory]);
  useEffect(() => localStorage.setItem('localify-albumHistory', JSON.stringify(albumHistory)), [albumHistory]);
  useEffect(() => localStorage.setItem('localify-artistHistory', JSON.stringify(artistHistory)), [artistHistory]);
  useEffect(() => localStorage.setItem('localify-isAIEnabled', JSON.stringify(isAIEnabled)), [isAIEnabled]);

  const toggleAI = () => setIsAIEnabled(prev => !prev);
  
  const songs = useMemo(() => rawSongs.map(s => ({
      ...s,
      playCount: songHistory[s.id]?.playCount || s.playCount,
      lastPlayed: songHistory[s.id]?.lastPlayed,
  })).sort((a,b) => a.dateAdded - b.dateAdded), [rawSongs, songHistory]);
  
  const albums = useMemo(() => {
    const albumsMap = new Map<string, Album>();
    for (const song of songs) {
      const albumId = `${song.album}-${song.artist}`;
      if (!albumsMap.has(albumId)) {
        albumsMap.set(albumId, { id: albumId, name: song.album, artist: song.artist, songs: [], coverArt: song.coverArt, type: 'Album', playCount: 0 });
      }
      albumsMap.get(albumId)!.songs.push(song);
    }
    albumsMap.forEach(album => {
        album.songs.sort((a, b) => (a.trackNumber || Infinity) - (b.trackNumber || Infinity));
        if (album.songs.length === 1) album.type = 'Single';
        else if (album.songs.length > 1 && album.songs.length <= 4) album.type = 'EP';
        else album.type = 'Album';
        
        const history = albumHistory[album.id];
        if(history) {
            album.playCount = history.playCount;
            album.lastPlayed = history.lastPlayed;
        }
    });
    return Array.from(albumsMap.values());
  }, [songs, albumHistory]);

  const artists = useMemo(() => {
      const artistsMap = new Map<string, Artist>();
       for (const song of songs) {
        if (!artistsMap.has(song.artist)) {
            artistsMap.set(song.artist, { name: song.artist, albums: [], songs: [], playCount: 0 });
        }
        artistsMap.get(song.artist)!.songs.push(song);
    }
    artistsMap.forEach(artist => {
        artist.albums = albums.filter(album => album.artist === artist.name);
        artist.coverArt = artist.albums[0]?.coverArt;
        const history = artistHistory[artist.name];
        if(history) {
            artist.playCount = history.playCount;
            artist.lastPlayed = history.lastPlayed;
        }
    });
    return Array.from(artistsMap.values());
  }, [songs, albums, artistHistory]);
  

  const addRecentItem = useCallback((type: 'album' | 'artist' | 'playlist', id: string) => {
    setRecentItems(prev => {
        const newRecent = { type, id };
        const filtered = prev.filter(item => item.id !== id);
        return [newRecent, ...filtered].slice(0, 20);
    });
  }, []);

  const loadFiles = async (files: FileList) => {
    setLoading(true);
    const newSongs: Song[] = [];
    for (const file of Array.from(files)) {
      if (file.type.startsWith('audio/')) {
        try {
          const metadata = await readMetadata(file);
          const song: Song = {
            id: `${file.name}-${file.size}`,
            filePath: URL.createObjectURL(file),
            title: metadata.title || 'Unknown Title',
            artist: metadata.artist || 'Unknown Artist',
            album: metadata.album || 'Unknown Album',
            duration: metadata.duration || 0,
            coverArt: metadata.coverArt,
            lyrics: metadata.lyrics,
            trackNumber: metadata.trackNumber,
            playCount: 0,
            dateAdded: Date.now(),
          };
          newSongs.push(song);
        } catch (error) {
          console.error(`Failed to process file ${file.name}:`, error);
        }
      }
    }
    setRawSongs(prev => [...prev, ...newSongs]);
    setLoading(false);
  };
  
  // Background AI Tagging Effect
  useEffect(() => {
    if (!isAIEnabled) return;
    
    const untaggedSong = songs.find(s => s.tags === undefined);

    if (untaggedSong) {
        (async () => {
            const tags = await analyzeAndTagSong(untaggedSong);
            setRawSongs(prevSongs => prevSongs.map(s => 
                s.id === untaggedSong.id ? { ...s, tags: tags || {} } : s
            ));
        })();
    }
  }, [songs, isAIEnabled]);


  const playSong = useCallback(async (song: Song, queue: Song[] = []) => {
    setCurrentSong(song);
    audioRef.current.src = song.filePath;
    audioRef.current.play().then(() => setIsPlaying(true));
    
    const now = Date.now();
    const songId = song.id;
    const albumId = `${song.album}-${song.artist}`;
    const artistId = song.artist;

    setSongHistory(prev => ({ ...prev, [songId]: { playCount: (prev[songId]?.playCount || 0) + 1, lastPlayed: now }}));
    setAlbumHistory(prev => ({ ...prev, [albumId]: { playCount: (prev[albumId]?.playCount || 0) + 1, lastPlayed: now }}));
    setArtistHistory(prev => ({ ...prev, [artistId]: { playCount: (prev[artistId]?.playCount || 0) + 1, lastPlayed: now }}));


    const newQueue = queue.length > 0 ? queue : songs;
    setOriginalQueue(newQueue);

    if (isShuffle) {
      const shuffled = [...newQueue].sort(() => Math.random() - 0.5);
      setShuffledQueue(shuffled);
      setPlayQueue(shuffled);
    } else {
      setPlayQueue(newQueue);
    }
    addRecentItem('album', albumId);
    setLoadingLyrics(true);
    setUnsyncedLyrics(song.lyrics || null);
    setSyncedLyrics(song.syncedLyrics || null);

    const updateSongWithLyrics = (lyricsData: LyricsData) => {
        const updatedSong = { ...song, lyrics: lyricsData.plainLyrics ?? undefined, syncedLyrics: lyricsData.syncedLyrics ?? undefined, isExplicit: lyricsData.isExplicit };
        setRawSongs(prev => prev.map(s => s.id === song.id ? updatedSong : s));
        setCurrentSong(updatedSong);
        setSyncedLyrics(updatedSong.syncedLyrics || null);
        setUnsyncedLyrics(updatedSong.lyrics || null);
    };

    if (typeof song.isExplicit !== 'undefined') { setLoadingLyrics(false); return; }
    const cachedLyrics = getLyricsFromCache(song.id);
    if (cachedLyrics) { updateSongWithLyrics(cachedLyrics); setLoadingLyrics(false); return; }
    
    try {
        const lyricsData = await fetchLyrics(song);
        if (lyricsData) { setLyricsInCache(song.id, lyricsData); updateSongWithLyrics(lyricsData); } 
        else { updateSongWithLyrics({ plainLyrics: null, syncedLyrics: null, isExplicit: false }); }
    } catch (error) { console.error("Failed to fetch lyrics:", error); } 
    finally { setLoadingLyrics(false); }
  }, [isShuffle, songs, addRecentItem]);

  const findNextSongIndex = useCallback(() => currentSong ? playQueue.findIndex(s => s.id === currentSong.id) : -1, [currentSong, playQueue]);

  const playNext = useCallback(() => {
    const currentIndex = findNextSongIndex();
    if (currentIndex === -1) return;
    let nextIndex = currentIndex + 1;
    if (nextIndex >= playQueue.length) {
      if (repeatMode === 'all') { nextIndex = 0; } 
      else { setIsPlaying(false); return; }
    }
    playSong(playQueue[nextIndex], originalQueue);
  }, [findNextSongIndex, playQueue, originalQueue, repeatMode, playSong]);

  const playPrev = useCallback(() => {
    const currentIndex = findNextSongIndex();
    if (currentIndex === -1) return;
    if(audioRef.current.currentTime > 3) { audioRef.current.currentTime = 0; return; }
    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) {
      if(repeatMode === 'all'){ prevIndex = playQueue.length - 1; } 
      else { return; }
    }
    playSong(playQueue[prevIndex], originalQueue);
  }, [findNextSongIndex, playQueue, originalQueue, repeatMode, playSong]);

  const togglePlay = () => { if (isPlaying) { audioRef.current.pause(); } else { if(currentSong) audioRef.current.play(); } setIsPlaying(!isPlaying); };
  const seek = (time: number) => { audioRef.current.currentTime = time; setCurrentTime(time); };
  const setVolume = (volume: number) => { audioRef.current.volume = volume; setVolumeState(volume); };
  
  const toggleShuffle = () => setIsShuffle(prev => {
    const newState = !prev;
    if(newState) { const shuffled = [...originalQueue].sort(() => Math.random() - 0.5); setShuffledQueue(shuffled); setPlayQueue(shuffled); } 
    else { setPlayQueue(originalQueue); }
    return newState;
  });

  const toggleRepeat = () => setRepeatMode(prev => prev === 'none' ? 'all' : prev === 'all' ? 'one' : 'none');
  const handleTimeUpdate = () => setCurrentTime(audioRef.current.currentTime);
  const handleDurationChange = () => setDuration(audioRef.current.duration);
  const handleSongEnd = useCallback(() => { if (repeatMode === 'one') { audioRef.current.currentTime = 0; audioRef.current.play(); } else { playNext(); } }, [repeatMode, playNext]);

  useEffect(() => {
    const audio = audioRef.current;
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleSongEnd);
    audio.addEventListener('play', () => setIsPlaying(true));
    audio.addEventListener('pause', () => setIsPlaying(false));
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleSongEnd);
      audio.removeEventListener('play', () => setIsPlaying(true));
      audio.removeEventListener('pause', () => setIsPlaying(false));
    };
  }, [handleSongEnd]);
  
  const toggleLikeSong = (songId: string) => setLikedSongs(prev => { const newSet = new Set(prev); if (newSet.has(songId)) { newSet.delete(songId); } else { newSet.add(songId); } return newSet; });
  const createPlaylist = (name: string) => setPlaylists(prev => [...prev, { id: `playlist-${Date.now()}`, name, songs: [] }]);
  const addSongToPlaylist = (playlistId: string, songId: string) => setPlaylists(prev => prev.map(pl => pl.id === playlistId && !pl.songs.includes(songId) ? {...pl, songs: [...pl.songs, songId]} : pl));
  const togglePinItem = (itemId: string, type: 'album' | 'artist' | 'playlist') => setPinnedItems(prev => { const newSet = new Set(prev); if (newSet.has(itemId)) { newSet.delete(itemId); } else { newSet.add(itemId); } return newSet; });
  
  const getItemById = useCallback((type: 'album' | 'artist' | 'playlist', id: string): LibraryItem | undefined => {
    if (type === 'album') return albums.find(a => a.id === id);
    if (type === 'artist') return artists.find(a => a.name === id);
    if (type === 'playlist') {
        if (id === 'liked') { return { id: 'liked', name: 'Liked Songs', songs: songs.filter(s => likedSongs.has(s.id)).map(s => s.id) }; }
        return playlists.find(p => p.id === id);
    }
  }, [albums, artists, playlists, likedSongs, songs]);
  
  const toggleQueueVisibility = () => setIsQueueVisible(prev => !prev);
  const updateQueue = (newQueue: Song[]) => { setPlayQueue(newQueue); setOriginalQueue(newQueue); if(isShuffle) { setShuffledQueue(newQueue); } };
  const removeSongFromQueue = (songId: string) => { if(currentSong?.id === songId) return; updateQueue(playQueue.filter(s => s.id !== songId)); }

  // Smart Playlists Logic
  const getSmartPlaylists = useCallback((): SmartPlaylist[] => {
      if (songs.length === 0 || !isAIEnabled) return [];
      const shuffle = (arr: Song[]) => [...arr].sort(() => 0.5 - Math.random());
      const now = Date.now();
      const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
      const oneMonthAgo = now - 30 * 24 * 60 * 60 * 1000;

      const getMoodieMix = (): SmartPlaylist => {
          const hour = new Date().getHours();
          let mood, name;
          if (hour < 12) { name = "Morning Boost"; mood = "energetic"; }
          else if (hour < 18) { name = "Afternoon Focus"; mood = "focus"; }
          else if (hour < 22) { name = "Evening Chill"; mood = "calm"; }
          else { name = "Late Night Vibes"; mood = "late night"; }
          return { id: 'moodie-mix', name, description: `A mix for your ${name.split(' ')[0].toLowerCase()}, based on your listening habits.`, songs: shuffle(songs.filter(s => s.tags && 'moods' in s.tags && s.tags.moods?.includes(mood))).slice(0, 30), gradient: 'from-pink-500 to-purple-600' };
      };

      const smartPlaylists: (() => SmartPlaylist | null)[] = [
          () => getMoodieMix(),
          () => ({ id: 'daily-drive', name: 'Daily Drive Mix', description: 'Your favorite tracks and new discoveries.', songs: shuffle([...songs.filter(s => s.playCount > 5), ...songs.filter(s => (s.lastPlayed || 0) < oneMonthAgo)]).slice(0, 50), gradient: 'from-blue-500 to-green-400'}),
          () => ({ id: 'workout-mix', name: 'Workout Mix', description: 'High-energy tracks to keep you moving.', songs: shuffle(songs.filter(s => s.tags && 'moods' in s.tags && s.tags.moods?.includes('workout'))).slice(0, 50), gradient: 'from-red-500 to-orange-400' }),
          () => ({ id: 'focus-flow', name: 'Focus Flow', description: 'Instrumental and ambient music for concentration.', songs: shuffle(songs.filter(s => s.tags && 'moods' in s.tags && s.tags.moods?.includes('focus'))).slice(0, 50), gradient: 'from-gray-700 to-blue-900' }),
          () => ({ id: 'on-repeat', name: 'On Repeat', description: 'Songs you\'ve had on repeat recently.', songs: [...songs].filter(s => (s.lastPlayed || 0) > oneWeekAgo).sort((a,b) => b.playCount - a.playCount).slice(0, 30), gradient: 'from-yellow-400 to-red-500' }),
          () => ({ id: 'throwback-jams', name: 'Throwback Jams', description: 'Rediscover tracks you haven\'t heard in a while.', songs: shuffle(songs.filter(s => (s.lastPlayed || 0) < oneMonthAgo && s.playCount > 2)).slice(0, 40), gradient: 'from-indigo-500 to-purple-500' }),
          () => ({ id: 'new-arrivals', name: 'New Arrivals', description: 'Your most recently added tracks.', songs: [...songs].sort((a,b) => b.dateAdded - a.dateAdded).slice(0, 30), gradient: 'from-teal-400 to-cyan-500' }),
          () => {
              const topArtist = artists.sort((a,b) => b.playCount - a.playCount)[0];
              if(!topArtist) return null;
              return { id: 'artist-spotlight', name: `Artist Spotlight: ${topArtist.name}`, description: `A deep dive into ${topArtist.name}'s music.`, songs: shuffle(topArtist.songs).slice(0, 40), gradient: 'from-green-600 to-lime-400' };
          },
          () => ({ id: 'after-dark', name: 'After Dark', description: 'Chill tracks for late-night listening.', songs: shuffle(songs.filter(s => s.tags && 'moods' in s.tags && s.tags.moods?.includes('late night'))).slice(0, 40), gradient: 'from-gray-800 to-indigo-900' }),
          () => {
              const genreCounts: Record<string, number> = {};
              songs.forEach(s => s.tags && 'genres' in s.tags && s.tags.genres?.forEach(g => { genreCounts[g] = (genreCounts[g] || 0) + 1; }));
              const topGenre = Object.entries(genreCounts).sort((a,b) => b[1] - a[1])[0]?.[0];
              if(!topGenre) return null;
              return { id: 'genre-explorer', name: `Genre Explorer: ${topGenre}`, description: `Explore your favorite genre: ${topGenre}.`, songs: shuffle(songs.filter(s => s.tags && 'genres' in s.tags && s.tags.genres?.includes(topGenre))).slice(0, 50), gradient: 'from-amber-500 to-orange-600' };
          }
      ];

      return smartPlaylists.map(fn => fn()).filter((p): p is SmartPlaylist => p !== null && p.songs.length > 5);

  }, [songs, artists, isAIEnabled]);


  const value = {
    songs, albums, artists, playlists, likedSongs, pinnedItems, recentItems, loadFiles, loading,
    currentSong, isPlaying, playSong, togglePlay, playNext, playPrev, seek, setVolume,
    currentTime, duration, volume, isShuffle, toggleShuffle, repeatMode, toggleRepeat,
    toggleLikeSong, createPlaylist, addSongToPlaylist, togglePinItem, getItemById,
    unsyncedLyrics, syncedLyrics, loadingLyrics,
    playQueue, isQueueVisible, toggleQueueVisibility, updateQueue, removeSongFromQueue,
    isAIEnabled, toggleAI, getSmartPlaylists,
  };

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};
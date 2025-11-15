export interface SyncedLyricLine {
  text: string;
  startTime: number; // in milliseconds
}

export interface SongTags {
  genres?: string[];
  moods?: string[];
  styles?: string[];
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  filePath: string;
  trackNumber?: number;
  coverArt?: string; // Base64 encoded image
  lyrics?: string; // unsynced
  syncedLyrics?: SyncedLyricLine[];
  isExplicit?: boolean;
  
  // New properties
  tags?: SongTags | {}; // Can be an empty object if analysis fails
  playCount: number;
  lastPlayed?: number; // timestamp
  dateAdded: number; // timestamp
}

export interface Album {
  id: string;
  name: string;
  artist: string;
  coverArt?: string;
  songs: Song[];
  type: 'Album' | 'EP' | 'Single' | 'Mixtape';
  
  // New properties
  playCount: number;
  lastPlayed?: number; // timestamp
}

export interface Artist {
  name: string;
  albums: Album[];
  songs: Song[];
  coverArt?: string; // Use the first album's cover art

  // New properties
  playCount: number;
  lastPlayed?: number; // timestamp
}

export interface Playlist {
  id: string;
  name: string;
  songs: string[]; // array of song ids
}

// Smart Playlist type for dynamic generation
export interface SmartPlaylist {
    id: string;
    name: string;
    description: string;
    songs: Song[];
    gradient?: string;
}

export type LibraryItem = Album | Artist | Playlist;
export type LibraryItemType = 'album' | 'artist' | 'playlist';
import type { Song } from '../types';
import { arrayBufferToBase64 } from '../lib/utils';

declare global {
  interface Window {
    jsmediatags: any;
  }
}

export const readMetadata = (file: File): Promise<Partial<Song>> => {
  return new Promise((resolve, reject) => {
    window.jsmediatags.read(file, {
      onSuccess: (tag: any) => {
        const { title, artist, album, picture, lyrics, track } = tag.tags;
        let coverArt;
        if (picture) {
          const base64String = arrayBufferToBase64(new Uint8Array(picture.data).buffer);
          coverArt = `data:${picture.format};base64,${base64String}`;
        }
        
        let trackNumber;
        if (track) {
            const parsedTrack = parseInt(String(track).split('/')[0], 10);
            if (!isNaN(parsedTrack)) {
                trackNumber = parsedTrack;
            }
        }

        const audio = new Audio(URL.createObjectURL(file));
        audio.addEventListener('loadedmetadata', () => {
             resolve({
                title: title || file.name.replace(/\.[^/.]+$/, ""),
                artist: artist || 'Unknown Artist',
                album: album || 'Unknown Album',
                coverArt,
                duration: audio.duration,
                lyrics: lyrics?.lyrics,
                trackNumber,
                playCount: 0,
                dateAdded: Date.now(),
             });
             URL.revokeObjectURL(audio.src);
        });
        audio.addEventListener('error', () => {
            reject(new Error('Failed to load audio duration'));
            URL.revokeObjectURL(audio.src);
        });
      },
      onError: (error: any) => {
        // Fallback for files with no tags
        const audio = new Audio(URL.createObjectURL(file));
        audio.addEventListener('loadedmetadata', () => {
             resolve({
                title: file.name.replace(/\.[^/.]+$/, ""),
                artist: 'Unknown Artist',
                album: 'Unknown Album',
                duration: audio.duration,
                playCount: 0,
                dateAdded: Date.now(),
             });
             URL.revokeObjectURL(audio.src);
        });
         audio.addEventListener('error', () => {
            reject(new Error('Failed to read media tags and load duration.'));
            URL.revokeObjectURL(audio.src);
        });
      },
    });
  });
};
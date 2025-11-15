import type { Song, SyncedLyricLine } from '../types';
import type { LyricsData } from './lyricsCache';
import { fetchLyricsWithAI } from './aiService';

const parseSyncedLyrics = (syncedLyricsText: string | null): SyncedLyricLine[] | null => {
  if (!syncedLyricsText) return null;

  const lines = syncedLyricsText.split('\n');
  const regex = /\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/;
  
  const parsedLines = lines
    .map(line => {
      const match = line.match(regex);
      if (!match) return null;
      
      const [, min, sec, ms, text] = match;
      const startTime = parseInt(min, 10) * 60000 + parseInt(sec, 10) * 1000 + parseInt(ms.padEnd(3, '0'), 10);
      
      return { startTime, text: text.trim() };
    })
    .filter((line): line is SyncedLyricLine => line !== null);

  return parsedLines.length > 0 ? parsedLines : null;
};


export const fetchLyrics = async (song: Pick<Song, 'title' | 'artist' | 'album' | 'duration'>): Promise<LyricsData | null> => {
    try {
        const aiResponse = await fetchLyricsWithAI(song);

        if (aiResponse) {
             return {
                plainLyrics: aiResponse.plainLyrics || null,
                syncedLyrics: parseSyncedLyrics(aiResponse.syncedLyrics),
                isExplicit: aiResponse.isExplicit === true,
            }
        }
        return null;
    } catch (error) {
        console.error('Failed to fetch lyrics using AI', error);
        return null;
    }
};
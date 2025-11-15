import type { SyncedLyricLine } from '../types';

export interface LyricsData {
    plainLyrics: string | null;
    syncedLyrics: SyncedLyricLine[] | null;
    isExplicit: boolean;
}

const LYRICS_CACHE_KEY = 'localify-lyrics-cache';

const getCache = (): Record<string, LyricsData> => {
    try {
        const cached = localStorage.getItem(LYRICS_CACHE_KEY);
        return cached ? JSON.parse(cached) : {};
    } catch (e) {
        console.warn("Could not read lyrics cache from localStorage", e);
        return {};
    }
};

export const getLyricsFromCache = (songId: string): LyricsData | null => {
    return getCache()[songId] || null;
};

export const setLyricsInCache = (songId: string, data: LyricsData): void => {
    const cache = getCache();
    cache[songId] = data;
    try {
        localStorage.setItem(LYRICS_CACHE_KEY, JSON.stringify(cache));
    } catch (e) {
        console.error('Failed to save lyrics to cache', e);
        // Here we could implement a cache eviction strategy if we are over quota
    }
};

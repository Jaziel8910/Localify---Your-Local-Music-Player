import { GoogleGenAI, Type } from "@google/genai";
import type { Song, SongTags } from '../types';

let ai: GoogleGenAI;

const getAI = () => {
    if (!ai) {
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    }
    return ai;
}

const tagSchema = {
    type: Type.OBJECT,
    properties: {
        genres: {
            type: Type.ARRAY,
            description: "A list of musical genres for this song (e.g., 'Pop', 'Indie Rock', 'Synthwave').",
            items: { type: Type.STRING }
        },
        moods: {
            type: Type.ARRAY,
            description: "A list of moods or feelings this song evokes (e.g., 'energetic', 'calm', 'workout', 'focus', 'late night', 'upbeat', 'sad', 'happy').",
            items: { type: Type.STRING }
        },
        styles: {
            type: Type.ARRAY,
            description: "A list of musical styles or characteristics (e.g., 'acoustic', 'electronic', 'instrumental', 'lo-fi').",
            items: { type: Type.STRING }
        }
    },
    required: ["genres", "moods"]
};


export const analyzeAndTagSong = async (song: Pick<Song, 'title' | 'artist' | 'album'>): Promise<SongTags | null> => {
    try {
        const ai = getAI();
        const prompt = `Analyze the song "${song.title}" by "${song.artist}" from the album "${song.album}". Based on this information, provide relevant tags for genre, mood, and style.`;

        const response = await ai.models.generateContent({
            model: 'gemini-flash-lite-latest',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: tagSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);
        
        if (parsedJson && Array.isArray(parsedJson.genres) && Array.isArray(parsedJson.moods)) {
            return parsedJson as SongTags;
        }

        return null;

    } catch (error) {
        console.error(`[AI Service] Failed to generate tags for "${song.title}":`, error);
        return null;
    }
};

const lyricsSchema = {
    type: Type.OBJECT,
    properties: {
        plainLyrics: {
            type: Type.STRING,
            description: "The full, unsynchronized lyrics of the song as a single string with newline characters."
        },
        syncedLyrics: {
            type: Type.STRING,
            description: "The synchronized lyrics in LRC format (e.g., [mm:ss.xx]Lyric line). If not available, this should be an empty string."
        },
        isExplicit: {
            type: Type.BOOLEAN,
            description: "Whether the song contains explicit content."
        }
    },
     required: ["plainLyrics", "syncedLyrics", "isExplicit"]
};

export const fetchLyricsWithAI = async (song: Pick<Song, 'title' | 'artist'>): Promise<{ plainLyrics: string; syncedLyrics: string; isExplicit: boolean; } | null> => {
    try {
        const ai = getAI();
        const prompt = `Find lyrics for the song "${song.title}" by "${song.artist}". Provide plain lyrics, LRC formatted synced lyrics if available, and determine if it's explicit.`;

        const response = await ai.models.generateContent({
            model: 'gemini-flash-lite-latest',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: lyricsSchema,
            }
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error(`[AI Service] Failed to fetch lyrics for "${song.title}":`, error);
        return null;
    }
}


import { GoogleGenAI } from "@google/genai";
import type { ChatHistoryEntry } from '../types.ts';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateResponse = async (history: ChatHistoryEntry[], systemInstruction: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: history,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error generating response from Gemini:", error);
        throw new Error("Failed to get response from AI.");
    }
};

export const summarizeText = async (textToSummarize: string, languageName: string): Promise<string> => {
    const prompt = `Please summarize the following text in about one or two simple sentences, in the ${languageName} language:\n\n---\n\n${textToSummarize}`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ parts: [{ text: prompt }] }],
            config: {
                temperature: 0.5
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error summarizing text with Gemini:", error);
        throw new Error("Failed to summarize text.");
    }
};

export const getSuggestions = async (history: ChatHistoryEntry[], languageName: string): Promise<string[]> => {
    const conversationContext = history.map(msg => `${msg.role}: ${msg.parts[0].text}`).join('\n');
    const prompt = `Based on this conversation, suggest three relevant, short follow-up questions a user might ask. The user is speaking ${languageName}, so provide the suggestions in that language. Return ONLY a JSON array of strings, like ["question 1", "question 2", "question 3"].\n\nConversation:\n${conversationContext}`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ parts: [{ text: prompt }] }],
            config: {
                temperature: 0.8,
                responseMimeType: "application/json",
            }
        });
        const jsonText = response.text.trim();
        const suggestionsArray = JSON.parse(jsonText || "[]");
        return suggestionsArray;
    } catch (error) {
        console.error("Error getting suggestions from Gemini:", error);
        throw new Error("Failed to get suggestions.");
    }
};
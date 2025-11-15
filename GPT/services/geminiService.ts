import { GoogleGenAI, Type, Chat, GenerateContentRequest } from "@google/genai";
import type { ChatMessage } from '../types';

const getGoogleGenAI = (apiKey: string) => new GoogleGenAI({ apiKey });

const getSystemInstruction = (languageName: string): GenerateContentRequest['systemInstruction'] => ({
    parts: [{ text: `You are "GramGPT", an expert AI assistant for rural India. Your primary goal is to provide clear, concise, and actionable information.
The user is communicating in ${languageName}.
You MUST respond fluently and accurately in ${languageName}.
Your knowledge base includes: Indian government schemes, modern agricultural practices, legal rights, job opportunities, common pest/disease diagnosis for crops, step-by-step guides for applying for government documents, and fertilizer calculation estimates based on crop and area.
Keep your answers simple, easy to understand for a non-technical audience, and use bullet points or numbered lists for clarity where possible. Use markdown for formatting, for example **bold** for important terms.
When providing pest/disease advice or fertilizer calculations, **always include a disclaimer** to consult local authorities or experts for confirmation.
If you don't know an answer, say so honestly in ${languageName} and suggest where they might find the information.
Do not mention that you are a language model. Just be the helpful assistant, GramGPT.`}]
});

export const startChat = (apiKey: string, languageName: string, history: ChatMessage[]): Chat => {
    const ai = getGoogleGenAI(apiKey);
    return ai.chats.create({
        model: 'gemini-2.5-flash',
        history: history,
        config: {
            systemInstruction: getSystemInstruction(languageName),
            temperature: 0.7,
            topK: 40,
            topP: 0.95
        }
    });
};

export const generateSummary = async (apiKey: string, textToSummarize: string, languageName: string): Promise<string> => {
    const ai = getGoogleGenAI(apiKey);
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
        console.error("Gemini API call failed in generateSummary:", error);
        throw error;
    }
};

export const generateSuggestions = async (apiKey: string, history: ChatMessage[], languageName: string): Promise<string[]> => {
    const ai = getGoogleGenAI(apiKey);
    const conversationContext = history.map(msg => `${msg.role}: ${msg.parts[0].text}`).join('\n');
    const prompt = `Based on this conversation, suggest three relevant, short follow-up questions a user might ask. The user is speaking ${languageName}, so provide the suggestions in that language. Return ONLY a JSON array of strings, like ["question 1", "question 2", "question 3"].\n\nConversation:\n${conversationContext}`;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ parts: [{ text: prompt }] }],
            config: {
                temperature: 0.8,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.STRING
                    }
                }
            }
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Gemini API call failed in generateSuggestions:", error);
        throw error;
    }
};

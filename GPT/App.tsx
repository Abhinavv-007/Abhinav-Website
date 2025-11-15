import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { ChatWindow } from './components/ChatWindow';
import { Toast } from './components/Toast';
import { startChat, generateSummary, generateSuggestions } from './services/geminiService';
import type { Message, ChatMessage } from './types';
import { LANGUAGES } from './constants';
import { Chat } from '@google/genai';

const App: React.FC = () => {
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
    const [language, setLanguage] = useState('en-IN');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [view, setView] = useState('home');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [toast, setToast] = useState({ show: false, message: '' });
    const [stopGenerating, setStopGenerating] = useState<() => void>(() => () => {});
    const chatRef = useRef<Chat | null>(null);

    const getInitialMessage = (): Message => ({
        role: 'model',
        text: 'Hello! I am GramGPT. I can help you with information on government schemes, farming, legal rights, and jobs. How can I assist you today?',
    });

    useEffect(() => {
        const initialBotMessage = getInitialMessage();
        setMessages([initialBotMessage]);
        const selectedLanguageName = LANGUAGES[language as keyof typeof LANGUAGES];
        chatRef.current = startChat(selectedLanguageName, [
            { role: 'user', parts: [{ text: "Initial Greeting" }] },
            { role: 'model', parts: [{ text: initialBotMessage.text }] }
        ]);
    }, [language]);

    const showToast = (message: string) => {
        setToast({ show: true, message });
    };

    const dismissToast = () => {
        setToast({ show: false, message: '' });
    };

    const handleCategorySelect = (categoryTitle: string) => {
        setView('chat');
        const topic = categoryTitle.split(' ').slice(1).join(' ');

        let greetingText = '';
        if (language === 'hi-IN') {
            greetingText = `नमस्ते! मैं ${topic} के बारे में आपकी मदद कर सकता हूँ। आप क्या जानना चाहेंगे?`;
        } else {
            greetingText = `Hi! I can help you with ${topic}. What would you like to know?`;
        }

        const initialBotMessage = getInitialMessage();
        const categoryGreetingMessage: Message = { role: 'model', text: greetingText };

        setMessages([initialBotMessage, categoryGreetingMessage]);
        
        const history: ChatMessage[] = [
            { role: 'user', parts: [{ text: "Initial Greeting" }] }, 
            { role: 'model', parts: [{ text: initialBotMessage.text }] },
            { role: 'user', parts: [{ text: `I have a question about ${topic}.` }] },
            { role: 'model', parts: [{ text: categoryGreetingMessage.text }] }
        ];

        const selectedLanguageName = LANGUAGES[language as keyof typeof LANGUAGES];
        chatRef.current = startChat(selectedLanguageName, history);
    };
    
    const handleGoHome = () => {
         setView('home');
    };

    const handleClearChat = () => {
        const initialBotMessage = getInitialMessage();
        setMessages([initialBotMessage]);
        setSuggestions([]);
        const selectedLanguageName = LANGUAGES[language as keyof typeof LANGUAGES];
        chatRef.current = startChat(selectedLanguageName, [
             { role: 'user', parts: [{ text: "Initial Greeting" }] }, 
             { role: 'model', parts: [{ text: initialBotMessage.text }] }
        ]);
    };

    const handleCopy = (textToCopy: string) => {
         navigator.clipboard.writeText(textToCopy).then(() => {
            showToast("Copied to clipboard!");
         }).catch(err => {
             console.error('Failed to copy text: ', err);
             showToast("Failed to copy.");
         });
    };
    
    const handleSummarize = async (textToSummarize: string) => {
        setIsLoading(true);
        const selectedLanguageName = LANGUAGES[language as keyof typeof LANGUAGES];
        
        try {
            const summaryText = await generateSummary(textToSummarize, selectedLanguageName);
            const summaryMessage: Message = { role: 'model', text: `**Summary:** ${summaryText}` };
            setMessages(prev => [...prev, summaryMessage]);
        } catch (error) {
            console.error("Summarize API call failed:", error);
            const errorMessage: Message = { role: 'model', text: `Sorry, I couldn't summarize that. Please try again.` };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGetSuggestions = async () => {
        if (!chatRef.current) return;
        setIsLoading(true);
        setSuggestions([]);
        const selectedLanguageName = LANGUAGES[language as keyof typeof LANGUAGES];
        
        try {
            const history = await chatRef.current.getHistory();
            const suggestionsArray = await generateSuggestions(history, selectedLanguageName);
            setSuggestions(suggestionsArray);
        } catch (error) {
            console.error("Suggestions API call failed:", error);
            showToast("Could not get suggestions.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleRegenerate = async () => {
        if (isLoading) return;

        let lastUserMessage: Message | null = null;
        let lastUserMessageIndex = -1;

        for (let i = messages.length - 1; i >= 0; i--) {
            if (messages[i].role === 'user') {
                lastUserMessage = messages[i];
                lastUserMessageIndex = i;
                break;
            }
        }

        if (lastUserMessage) {
            // Remove all model messages after the last user message
            setMessages(prev => prev.slice(0, lastUserMessageIndex + 1));
            
            // This is a simplified history management for regeneration.
            // For a more robust solution, you'd manage history in state.
            const selectedLanguageName = LANGUAGES[language as keyof typeof LANGUAGES];
            const history = await chatRef.current?.getHistory() ?? [];
            const userHistory = history.filter(m => m.role === 'user');
            // Re-create chat with history up to the last user message
            chatRef.current = startChat(selectedLanguageName, history.slice(0, userHistory.length * 2 - 1));

            await handleSendMessage(lastUserMessage.text, true);
        } else {
            showToast("Could not find a previous message to regenerate.");
        }
    };

    const handleFeedback = () => {
        showToast("Thank you for your feedback!");
    };


    const handleSendMessage = async (userInput: string, isRegenerating = false) => {
        if (isLoading || !chatRef.current) return;
        setSuggestions([]);

        if (!isRegenerating) {
            const userMessage: Message = { role: 'user', text: userInput };
            setMessages(prev => [...prev, userMessage]);
        }
        
        const botMessagePlaceholder: Message = { role: 'model', text: '' };
        setMessages(prev => [...prev, botMessagePlaceholder]);
        setIsLoading(true);

        let fullBotResponse = '';
        let stop = false;

        try {
            const stream = await chatRef.current.sendMessageStream({ message: userInput });
            
            const stopStream = () => {
                stop = true;
                console.log("Stopping generation.");
                setIsLoading(false);
                setStopGenerating(() => () => {});
            };

            setStopGenerating(() => stopStream);

            for await (const chunk of stream) {
                if(stop) break;
                fullBotResponse += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = { ...newMessages[newMessages.length - 1], text: fullBotResponse };
                    return newMessages;
                });
            }
        } catch (error) {
            console.error("Failed to fetch from Gemini API:", error);
            const errorMessage: Message = { role: 'model', text: `Sorry, something went wrong. Please check your connection and try again.` };
            setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = errorMessage;
                return newMessages;
            });
        } finally {
            if (!stop) {
                setIsLoading(false);
                setStopGenerating(() => () => {});
            }
        }
    };

    const handleSpeak = (text: string) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = language;
            const voices = window.speechSynthesis.getVoices();
            utterance.voice = voices.find(voice => voice.lang === language) || voices.find(voice => voice.lang.startsWith(language.split('-')[0])) || null;
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(utterance);
        } else {
            showToast("Sorry, your browser doesn't support text-to-speech.");
        }
    };
    
    useEffect(() => {
         if ('speechSynthesis' in window && window.speechSynthesis.getVoices().length === 0) {
             window.speechSynthesis.onvoiceschanged = () => {
                 // Voices are loaded, no action needed here, just ensures they are loaded for handleSpeak
             };
         }
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            <Header 
                theme={theme} 
                setTheme={setTheme} 
                language={language} 
                setLanguage={setLanguage}
                onHomeClick={handleGoHome}
            />
            <main className="flex-grow flex flex-col">
                {view === 'home' && <HomePage onCategorySelect={handleCategorySelect} language={language} />}
                {view === 'chat' && (
                    <ChatWindow 
                        messages={messages}
                        onSendMessage={handleSendMessage}
                        language={language}
                        onSpeak={handleSpeak}
                        isLoading={isLoading}
                        onClearChat={handleClearChat}
                        onCopy={handleCopy}
                        onSummarize={handleSummarize}
                        onGetSuggestions={handleGetSuggestions}
                        suggestions={suggestions}
                        showToast={showToast}
                        onStopGenerating={stopGenerating}
                        onRegenerate={handleRegenerate}
                        onFeedback={handleFeedback}
                    />
                )}
            </main>
            <Footer />
            <Toast message={toast.message} show={toast.show} onDismiss={dismissToast} />
        </div>
    );
}

export default App;
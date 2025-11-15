
import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';
import HomePage from './components/HomePage.tsx';
import ChatWindow from './components/ChatWindow.tsx';
import Toast from './components/Toast.tsx';
import { LANGUAGES } from './constants.ts';
import * as geminiService from './services/geminiService.ts';
import type { Message, ChatHistoryEntry } from './types.ts';

const App: React.FC = () => {
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
    const [language, setLanguage] = useState('en-IN');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [view, setView] = useState('home');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [toast, setToast] = useState({ show: false, message: '' });
    const chatHistoryRef = useRef<ChatHistoryEntry[]>([]);

    const getInitialMessage = (): Message => ({
        role: 'model',
        text: 'Hello! I am GramGPT. I can help you with information on government schemes, farming, legal rights, and jobs. How can I assist you today?',
    });

    useEffect(() => {
        const initialBotMessage = getInitialMessage();
        setMessages([initialBotMessage]);
        chatHistoryRef.current = [
            { role: 'user', parts: [{ text: "Initial Greeting" }] }, 
            { role: 'model', parts: [{ text: initialBotMessage.text }] }
        ];
    }, []);
    
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
        
        chatHistoryRef.current = [
            { role: 'user', parts: [{ text: "Initial Greeting" }] }, 
            { role: 'model', parts: [{ text: initialBotMessage.text }] },
            { role: 'user', parts: [{ text: `I have a question about ${topic}.` }] },
            { role: 'model', parts: [{ text: categoryGreetingMessage.text }] }
        ];
    };
    
    const handleGoHome = () => {
         setView('home');
    };

    const handleClearChat = () => {
        const initialBotMessage = getInitialMessage();
        setMessages([initialBotMessage]);
        setSuggestions([]);
        chatHistoryRef.current = [
            { role: 'user', parts: [{ text: "Initial Greeting" }] }, 
            { role: 'model', parts: [{ text: initialBotMessage.text }] }
        ];
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
        const selectedLanguageName = LANGUAGES[language];
        
        try {
            const summaryText = await geminiService.summarizeText(textToSummarize, selectedLanguageName);
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
        setIsLoading(true);
        setSuggestions([]);
        const selectedLanguageName = LANGUAGES[language];

        try {
            const suggestionsArray = await geminiService.getSuggestions(chatHistoryRef.current, selectedLanguageName);
            setSuggestions(suggestionsArray);
        } catch (error) {
            console.error("Suggestions API call failed:", error);
            showToast("Could not get suggestions.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = async (userInput: string) => {
        if (isLoading) return;
        setSuggestions([]);

        const userMessage: Message = { role: 'user', text: userInput };
        
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        const selectedLanguageName = LANGUAGES[language];
        const systemPrompt = `You are "GramGPT", an expert AI assistant for rural India. Your primary goal is to provide clear, concise, and actionable information. The user is communicating in ${selectedLanguageName}. You MUST respond fluently and accurately in ${selectedLanguageName}. Your knowledge base includes: Indian government schemes, modern agricultural practices, legal rights, job opportunities, common pest/disease diagnosis for crops, step-by-step guides for applying for government documents, and fertilizer calculation estimates based on crop and area. Keep your answers simple, easy to understand for a non-technical audience, and use bullet points or numbered lists for clarity where possible. Use markdown for formatting, for example **bold** for important terms. When providing pest/disease advice or fertilizer calculations, **always include a disclaimer** to consult local authorities or experts for confirmation. If you don't know an answer, say so honestly in ${selectedLanguageName} and suggest where they might find the information. Do not mention that you are a language model. Just be the helpful assistant, GramGPT.`;

        chatHistoryRef.current.push({ role: 'user', parts: [{ text: userInput }] });

        try {
            const botResponseText = await geminiService.generateResponse(chatHistoryRef.current, systemPrompt);
            
            chatHistoryRef.current.push({ role: 'model', parts: [{ text: botResponseText }] });
            const botMessage: Message = { role: 'model', text: botResponseText };
            
            setMessages(prev => [...prev, botMessage]);

        } catch (error) {
            console.error("Failed to fetch from Gemini API:", error);
            const errorMessage: Message = { role: 'model', text: `Sorry, something went wrong. Please check your connection and try again.` };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
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
         if ('speechSynthesis' in window) {
             window.speechSynthesis.onvoiceschanged = () => {
                 window.speechSynthesis.getVoices();
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
                    />
                )}
            </main>
            <Footer />
            <Toast message={toast.message} show={toast.show} onDismiss={dismissToast} />
        </div>
    );
};

export default App;
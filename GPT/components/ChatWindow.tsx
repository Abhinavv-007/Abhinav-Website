// Fix for SpeechRecognition API not being in standard TS lib
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Message as MessageComponent } from './Message';
import { TypingIndicator } from './TypingIndicator';
import type { Message } from '../types';

interface ChatWindowProps {
    messages: Message[];
    onSendMessage: (input: string) => void;
    language: string;
    onSpeak: (text: string) => void;
    isLoading: boolean;
    onClearChat: () => void;
    onCopy: (text: string) => void;
    onSummarize: (text: string) => void;
    onGetSuggestions: () => void;
    suggestions: string[];
    showToast: (message: string) => void;
    onStopGenerating: () => void;
    onRegenerate: () => void;
    onFeedback: (feedback: 'up' | 'down') => void;
}

const ChatIntro: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full text-center p-4 animate-fade-up">
        <div className="text-6xl mb-4">
             <span className="text-slate-800 dark:text-white filter drop-shadow-lg">Gram</span>
             <span className="gradient-text">GPT</span>
        </div>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md">
            Your AI assistant for rural India. Select a category from the home page or ask me a question to get started.
        </p>
    </div>
);

export const ChatWindow: React.FC<ChatWindowProps> = ({
    messages, onSendMessage, language, onSpeak, isLoading, onClearChat, onCopy, onSummarize, onGetSuggestions, suggestions, showToast, onStopGenerating, onRegenerate, onFeedback
}) => {
    const [input, setInput] = useState('');
    const [isListening, setIsListening] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<any | null>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);
    
    const handleSend = () => {
        if (input.trim() && !isLoading) {
            onSendMessage(input.trim());
            setInput('');
        }
    };

    const handleVoiceInput = useCallback(() => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            showToast("Sorry, your browser doesn't support speech recognition.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = language;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        recognitionRef.current = recognition;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
        };

        recognition.onresult = (event: any) => {
            const speechResult = event.results[0][0].transcript;
            setInput(prev => prev ? `${prev} ${speechResult}` : speechResult);
        };

        recognition.start();
    }, [isListening, language, showToast]);

    return (
        <div className="flex flex-col flex-grow relative">
            <div className="flex-grow p-4 sm:p-6 space-y-6 overflow-y-auto">
                {messages.length <= 1 ? <ChatIntro /> : (
                <>
                    <div className="flex justify-center sticky top-2 z-10">
                        <button 
                            onClick={onClearChat}
                            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl text-sm font-semibold text-slate-700 dark:text-slate-300 py-2 px-5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300 shadow-lg border border-slate-200/50 dark:border-slate-700/50 hover:border-red-300 dark:hover:border-red-500/50 hover:scale-105"
                        >
                            🗑️ Clear Chat
                        </button>
                    </div>
                    {messages.map((msg, index) => (
                        <MessageComponent 
                            key={index} 
                            message={msg} 
                            onSpeak={onSpeak} 
                            onCopy={onCopy} 
                            onSummarize={onSummarize} 
                            isStreaming={index === messages.length - 1 && isLoading && msg.role === 'model'}
                            onRegenerate={onRegenerate}
                            onFeedback={onFeedback}
                            isLastMessage={index === messages.length - 1}
                        />
                    ))}
                </>
                )}
                
                {isLoading && messages[messages.length - 1]?.text === '' && <TypingIndicator />}
                
                {!isLoading && messages.length > 2 && (
                    <div className="flex justify-center animate-fade-up">
                         <button 
                            onClick={onGetSuggestions} 
                            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-bold py-3 px-6 rounded-2xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 flex items-center gap-2 shadow-xl hover:shadow-emerald-500/50 hover:scale-105 border border-emerald-400/50"
                         >
                             <span className="text-xl">✨</span>
                             Smart Suggestions
                         </button>
                    </div>
                )}

                {suggestions.length > 0 && !isLoading &&(
                    <div className="flex flex-col items-center gap-3 py-2">
                        {suggestions.map((s, i) => (
                            <button 
                                key={i} 
                                onClick={() => onSendMessage(s)}
                                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl w-full max-w-2xl text-left p-4 rounded-2xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-700 dark:hover:text-emerald-300 transition-all duration-300 shadow-lg border border-slate-200/50 dark:border-slate-700/50 hover:border-emerald-300 dark:hover:border-emerald-500/50 hover:scale-[1.02] opacity-0 animate-slide-in-right"
                                style={{ animationDelay: `${i * 100}ms` }}
                            >
                                💬 {s}
                            </button>
                        ))}
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            <div className="sticky bottom-0 p-4 sm:p-6 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-800/50">
                <div className="max-w-4xl mx-auto">
                     {isLoading && (
                        <div className="flex justify-center mb-3">
                            <button
                                onClick={onStopGenerating}
                                className="animate-fade-in flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 dark:text-red-400 bg-red-100/80 dark:bg-red-900/80 backdrop-blur-sm rounded-full shadow-lg border border-red-300/50 dark:border-red-500/50 hover:bg-red-200/80 dark:hover:bg-red-800/80 transition-all duration-300"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 9a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
                                </svg>
                                Stop Generating
                            </button>
                        </div>
                    )}
                    <div className={`flex items-end space-x-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl shadow-2xl p-3 border-2 transition-all duration-300 ${isLoading ? 'border-slate-300/50 dark:border-slate-700/50' : 'border-emerald-200/50 dark:border-emerald-500/30 focus-within:border-emerald-400 dark:focus-within:border-emerald-400 focus-within:shadow-emerald-500/30'}`}>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                            placeholder={isLoading ? "Waiting for response..." : "Type your message..."}
                            className="flex-grow p-3 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none resize-none font-medium text-base"
                            rows={1}
                            style={{ maxHeight: '120px' }}
                            disabled={isLoading}
                        />
                        <button
                            onClick={handleVoiceInput}
                            className={`flex-shrink-0 p-3 sm:p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300 shadow-lg hover:scale-110 ${
                                isListening 
                                    ? 'bg-gradient-to-br from-red-500 to-pink-600 text-white animate-glow-pulse' 
                                    : 'bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 text-slate-700 dark:text-slate-300 hover:from-emerald-400 hover:to-teal-500 hover:text-white'
                            }`}
                            aria-label={isListening ? 'Stop listening' : 'Start voice input'}
                            disabled={isLoading}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-7 sm:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                        </button>
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isLoading}
                            className="flex-shrink-0 p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300 shadow-lg hover:shadow-emerald-500/50 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            aria-label="Send message"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-7 sm:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
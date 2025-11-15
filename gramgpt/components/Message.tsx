
import React from 'react';
import type { Message as MessageType } from '../types.ts';

interface MessageProps {
    message: MessageType;
    onSpeak: (text: string) => void;
    onCopy: (text: string) => void;
    onSummarize: (text: string) => void;
}

const parseSimpleMarkdown = (text: string = ''): string => {
    let html = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-emerald-700 dark:text-emerald-300">$1</strong>');
    html = html.replace(/(?<!\*)\*(.*?)\*(?!\*)/g, '<em class="italic">$1</em>');
    return html;
};

const Message: React.FC<MessageProps> = ({ message, onSpeak, onCopy, onSummarize }) => {
    const isUser = message.role === 'user';
    const plainTextForSpeechAndCopy = message.text.replace(/\*\*/g, '').replace(/\*/g, '');

    return (
        <div className={`group flex items-end gap-3 message-enter ${isUser ? 'justify-end' : 'justify-start'}`}>
            {!isUser && (
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold shadow-lg">
                    AI
                </div>
            )}
            <div className={`max-w-xs sm:max-w-md lg:max-w-2xl px-5 py-4 rounded-3xl shadow-xl backdrop-blur-xl border transition-all duration-300 ${
                isUser 
                    ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-br-md border-emerald-400/50' 
                    : 'bg-white/90 dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 rounded-bl-md border-slate-200/50 dark:border-slate-700/50'
            }`}>
                <div
                    className="whitespace-pre-wrap leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: parseSimpleMarkdown(message.text) }}
                />
            </div>
            {!isUser && (
                <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <button
                        onClick={() => onSpeak(plainTextForSpeechAndCopy)}
                        className="p-2 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 focus:outline-none shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 hover:scale-110 border border-emerald-200/50 dark:border-emerald-500/30"
                        aria-label="Read message aloud"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.858 17.142a5.001 5.001 0 010-7.072m2.828 9.9a9 9 0 010-12.728M12 12h.01" /></svg>
                    </button>
                    <button
                        onClick={() => onCopy(plainTextForSpeechAndCopy)}
                        className="p-2 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 focus:outline-none shadow-lg hover:shadow-blue-500/30 transition-all duration-300 hover:scale-110 border border-blue-200/50 dark:border-blue-500/30"
                        aria-label="Copy message"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    </button>
                    <button
                        onClick={() => onSummarize(message.text)}
                        className="p-2 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 focus:outline-none shadow-lg hover:shadow-purple-500/30 transition-all duration-300 hover:scale-110 border border-purple-200/50 dark:border-purple-500/30"
                        aria-label="Summarize message"
                    >
                        <span className="font-bold text-lg">✨</span>
                    </button>
                </div>
            )}
            {isUser && (
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                    U
                </div>
            )}
        </div>
    );
};

export default Message;
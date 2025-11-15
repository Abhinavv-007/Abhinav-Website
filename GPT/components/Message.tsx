import React from 'react';
import type { Message as MessageType } from '../types';

interface MessageProps {
    message: MessageType;
    onSpeak: (text: string) => void;
    onCopy: (text: string) => void;
    onSummarize: (text: string) => void;
    isStreaming: boolean;
    onRegenerate: () => void;
    onFeedback: (feedback: 'up' | 'down') => void;
    isLastMessage: boolean;
}

const parseSimpleMarkdown = (text: string = ''): string => {
    let html = text
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-emerald-700 dark:text-emerald-300">$1</strong>')
        .replace(/(?<!\*)\*(.*?)\*(?!\*)/g, '<em class="italic">$1</em>')
        .replace(/^- (.*$)/gm, '<ul class="list-disc list-inside ml-4"><li>$1</li></ul>')
        .replace(/<\/ul>\s?<ul>/g, '');
    return html;
};

const UserAvatar: React.FC = () => (
    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
    </div>
);

const AiAvatar: React.FC = () => (
    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L10 12l-2.293-2.293a1 1 0 010-1.414L10 6m5 4l2.293 2.293a1 1 0 010 1.414L12 18l-2.293-2.293a1 1 0 010-1.414L12 12m-3 8l2.293-2.293a1 1 0 011.414 0L17 18m-3-4l2.293-2.293a1 1 0 011.414 0L21 14" />
        </svg>
    </div>
);

const ActionButton: React.FC<{ onClick: () => void, label: string, children: React.ReactNode }> = ({ onClick, label, children }) => (
    <div className="relative action-button">
        <button
            onClick={onClick}
            className="p-2 rounded-full bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 hover:text-emerald-600 dark:hover:text-emerald-400 focus:outline-none transition-all duration-200 hover:scale-110"
            aria-label={label}
        >
            {children}
        </button>
        <div className="tooltip absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-white text-xs font-semibold rounded-md shadow-lg whitespace-nowrap">
            {label}
        </div>
    </div>
);

export const Message: React.FC<MessageProps> = ({ message, onSpeak, onCopy, onSummarize, isStreaming, onRegenerate, onFeedback, isLastMessage }) => {
    const isUser = message.role === 'user';
    const plainTextForSpeechAndCopy = message.text.replace(/\*\*/g, '').replace(/\*/g, '');

    const showToolbar = !isUser && !isStreaming && message.text;
    const toolbarClasses = `transition-opacity duration-300 ${
        isLastMessage ? 'opacity-100 animate-toolbar-fade-in' : 'opacity-0 group-hover:opacity-100'
    }`;

    return (
        <div className="flex flex-col group">
            <div className={`flex items-end gap-3 message-enter ${isUser ? 'self-end' : 'self-start'}`}>
                {!isUser && <AiAvatar />}
                <div className={`max-w-xs sm:max-w-md lg:max-w-2xl px-5 py-4 rounded-3xl shadow-xl backdrop-blur-xl border transition-all duration-300 ${
                    isUser 
                        ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-br-md border-emerald-400/50' 
                        : 'bg-white/90 dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 rounded-bl-md border-slate-200/50 dark:border-slate-700/50'
                }`}>
                    <div className="whitespace-pre-wrap leading-relaxed">
                        <span dangerouslySetInnerHTML={{ __html: parseSimpleMarkdown(message.text) }} />
                        {isStreaming && <span className="typing-cursor"></span>}
                    </div>
                </div>
                {isUser && <UserAvatar />}
            </div>

            {showToolbar && (
                 <div className={`flex items-center gap-1 self-start ml-14 mt-2 p-1 bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg rounded-full border border-slate-200/50 dark:border-slate-700/50 shadow-md ${toolbarClasses}`}>
                    <ActionButton onClick={() => onSpeak(plainTextForSpeechAndCopy)} label="Speak">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.858 17.142a5.001 5.001 0 010-7.072m2.828 9.9a9 9 0 010-12.728M12 12h.01" /></svg>
                    </ActionButton>
                     <ActionButton onClick={() => onCopy(plainTextForSpeechAndCopy)} label="Copy">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    </ActionButton>
                    <ActionButton onClick={() => onSummarize(message.text)} label="Summarize">
                        <span className="font-bold text-base">✨</span>
                    </ActionButton>
                    {isLastMessage && (
                        <ActionButton onClick={onRegenerate} label="Regenerate">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 110 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                            </svg>
                        </ActionButton>
                    )}
                    <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>
                     <ActionButton onClick={() => onFeedback('up')} label="Good response">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                           <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333V17a1 1 0 001 1h6.758a1 1 0 00.97-1.22l-1.958-6.364a1 1 0 00-.97-.78h-3.55l.84-2.491a.5.5 0 00-.42-.742A.5.5 0 008 6.5v.5a.5.5 0 00.5.5h2.533l-1.22 3.864a.5.5 0 00.47.636h3.42a.5.5 0 00.47-.636L15.333 6.5a1 1 0 00-.97-1.22H9.5a.5.5 0 00-.42.223L7.758 8.42a.5.5 0 00.47.78h.585a.5.5 0 00.47-.636L9.22 7.758a.5.5 0 00-.47-.78H7.25a1 1 0 00-.97 1.22l.333 1.094a.5.5 0 00.47.363h.585a.5.5 0 00.47-.636L7.22 8.758a.5.5 0 00-.47-.78H6a1 1 0 00-.97 1.22l.333 1.094A1.5 1.5 0 006 10.333z" />
                        </svg>
                    </ActionButton>
                    <ActionButton onClick={() => onFeedback('down')} label="Bad response">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667V3a1 1 0 00-1-1H6.242a1 1 0 00-.97 1.22l1.958 6.364a1 1 0 00.97.78h3.55l-.84 2.491a.5.5 0 00.42.742.5.5 0 00.47-.223V13.5a.5.5 0 00-.5-.5h-2.533l1.22-3.864a.5.5 0 00-.47-.636H6.58a.5.5 0 00-.47.636L4.667 13.5a1 1 0 00.97 1.22H10.5a.5.5 0 00.42-.223l1.328-2.083a.5.5 0 00-.47-.78h-.585a.5.5 0 00-.47.636l.555 1.742a.5.5 0 00.47.363h1.47a1 1 0 00.97-1.22l-.333-1.094A1.5 1.5 0 0014 9.667z" />
                        </svg>
                    </ActionButton>
                </div>
            )}
        </div>
    );
};

import React from 'react';

const TypingIndicator: React.FC = () => (
    <div className="flex items-end gap-2 message-enter">
        <div className="flex items-center justify-center space-x-2 px-6 py-4 rounded-3xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-xl border border-emerald-200/30 dark:border-emerald-500/20 rounded-bl-md">
            <div className="typing-dot w-3 h-3 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full shadow-lg" />
            <div className="typing-dot w-3 h-3 bg-gradient-to-r from-teal-400 to-blue-500 rounded-full shadow-lg" />
            <div className="typing-dot w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full shadow-lg" />
        </div>
    </div>
);

export default TypingIndicator;

import React, { useState } from 'react';

interface ApiKeyModalProps {
    onSubmit: (apiKey: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onSubmit }) => {
    const [apiKey, setApiKey] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (apiKey.trim()) {
            onSubmit(apiKey.trim());
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md p-8 border border-emerald-500/30 animate-scale-in">
                <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                            Enter Your API Key
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400">
                            To use GramGPT, please provide your Google Gemini API key.
                        </p>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="apiKey" className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Gemini API Key
                        </label>
                        <input
                            id="apiKey"
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:border-emerald-500 focus:ring-emerald-500 focus:outline-none transition-colors duration-300 text-slate-900 dark:text-white"
                            placeholder="AIzaSy..."
                            required
                        />
                    </div>
                    <a
                        href="https://aistudio.google.com/app/apikey"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-center text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                        Get your API key from Google AI Studio
                    </a>
                    <button
                        type="submit"
                        disabled={!apiKey.trim()}
                        className="w-full p-3 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold text-lg hover:from-emerald-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 dark:focus:ring-offset-slate-900 transition-all duration-300 shadow-lg hover:shadow-emerald-500/50 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        Continue
                    </button>
                </form>
            </div>
        </div>
    );
};

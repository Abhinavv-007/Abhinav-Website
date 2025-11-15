
import React, { useState, useEffect } from 'react';
import { LANGUAGES } from '../constants';

interface HeaderProps {
    theme: string;
    setTheme: (theme: string) => void;
    language: string;
    setLanguage: (language: string) => void;
    onHomeClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, setTheme, language, setLanguage, onHomeClick }) => {
    const [scrolled, setScrolled] = useState(false);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [theme]);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`sticky top-0 z-50 transition-all duration-300 ${
            scrolled 
                ? 'bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-lg border-b border-emerald-100/20 dark:border-emerald-500/10' 
                : 'bg-white/50 dark:bg-slate-900/50 backdrop-blur-md'
        }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                <h1 
                    onClick={onHomeClick} 
                    className="text-2xl sm:text-3xl font-bold cursor-pointer select-none transition-all duration-300 hover:scale-105 flex items-center gap-2"
                >
                    <span className="text-slate-800 dark:text-white">Gram</span>
                    <span className="gradient-text">GPT</span>
                    <span className="text-2xl animate-bounce-subtle">✨</span>
                </h1>
                <div className="flex items-center space-x-2 sm:space-x-4">
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 border-emerald-200 dark:border-emerald-500/30 rounded-xl px-3 py-2 text-sm sm:text-base text-slate-800 dark:text-white font-medium shadow-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all duration-300 hover:border-emerald-400 dark:hover:border-emerald-400"
                    >
                        {Object.entries(LANGUAGES).map(([code, name]) => (
                            <option key={code} value={code}>{name}</option>
                        ))}
                    </select>
                    <button 
                        onClick={toggleTheme} 
                        className="p-2.5 sm:p-3 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white hover:from-emerald-500 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 shadow-lg hover:shadow-emerald-500/50 hover:scale-110"
                        aria-label="Toggle theme"
                    >
                        {theme === 'light' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
};

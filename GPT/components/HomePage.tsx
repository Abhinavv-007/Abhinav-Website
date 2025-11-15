
import React from 'react';
import { FloatingOrbs } from './FloatingOrbs';
import { CategoryCard } from './CategoryCard';
import { CATEGORIES } from '../constants';

interface HomePageProps {
    onCategorySelect: (categoryTitle: string) => void;
    language: string;
}

export const HomePage: React.FC<HomePageProps> = ({ onCategorySelect, language }) => {
    const currentCategories = CATEGORIES[language] || CATEGORIES['en-IN'];
    
    return (
        <div className="relative min-h-[calc(100vh-200px)]">
            <FloatingOrbs />
            
            <div className="relative z-10 text-center pt-12 sm:pt-20 pb-16 px-4">
                <div className="max-w-4xl mx-auto space-y-6">
                    <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-blue-600 dark:from-emerald-400 dark:via-teal-400 dark:to-blue-400 opacity-0 animate-scale-in mb-4" style={{ animationDelay: '100ms' }}>
                        Welcome to GramGPT! 🚀
                    </h2>
                    <p className="text-lg sm:text-xl lg:text-2xl text-slate-700 dark:text-slate-300 font-medium opacity-0 animate-fade-up leading-relaxed max-w-3xl mx-auto" style={{ animationDelay: '300ms' }}>
                        Your intelligent AI assistant for rural India. 
                        <br />
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Get instant, reliable information in your own language.</span>
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 opacity-0 animate-fade-up" style={{ animationDelay: '500ms' }}>
                        <div className="flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-emerald-200/50 dark:border-emerald-500/30">
                            <span className="text-2xl">🌍</span>
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Multi-Language</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-emerald-200/50 dark:border-emerald-500/30">
                            <span className="text-2xl">🎤</span>
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Voice Enabled</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-emerald-200/50 dark:border-emerald-500/30">
                            <span className="text-2xl">⚡</span>
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">AI Powered</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <h3 className="text-2xl sm:text-3xl font-bold text-center text-slate-800 dark:text-white mb-10 opacity-0 animate-fade-up" style={{ animationDelay: '600ms' }}>
                    Select a Category to Begin
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {currentCategories.map((cat, index) => (
                        <CategoryCard 
                            key={cat.title} 
                            title={cat.title} 
                            onClick={() => onCategorySelect(cat.title)} 
                            delay={700 + index * 80} 
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};


import React from 'react';

interface CategoryCardProps {
    title: string;
    onClick: () => void;
    delay: number;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, onClick, delay }) => {
    const emoji = title.split(' ')[0];
    const text = title.split(' ').slice(1).join(' ');

    return (
        <div
            onClick={onClick}
            className="card-3d hover-glow group relative bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl shadow-xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer border border-emerald-200/30 dark:border-emerald-500/20 opacity-0 animate-fade-up overflow-hidden"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/0 via-teal-400/0 to-blue-400/0 group-hover:from-emerald-400/10 group-hover:via-teal-400/10 group-hover:to-blue-400/10 transition-all duration-500 rounded-2xl" />
            <div className="relative z-10 text-5xl sm:text-6xl mb-4 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12 filter drop-shadow-lg">
                {emoji}
            </div>
            <h3 className="relative z-10 text-base sm:text-lg font-bold text-slate-800 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
                {text}
            </h3>
            <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
        </div>
    );
};

export default CategoryCard;


import React from 'react';

const Footer: React.FC = () => (
    <footer className="mt-auto border-t border-slate-200/50 dark:border-slate-800/50 bg-white/30 dark:bg-slate-900/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col items-center space-y-3">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Built with <span className="text-red-500 animate-pulse">❤️</span> by Abhinav
            </p>
            <a 
                href="https://www.linkedin.com/in/abhnv07" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Abhinav's LinkedIn Profile"
                className="group"
            >
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-7 w-7 text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all duration-300 group-hover:scale-110" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
            </a>
        </div>
    </footer>
);

export default Footer;

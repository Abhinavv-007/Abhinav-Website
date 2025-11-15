
import React, { useState, useEffect } from 'react';

export const FloatingOrbs: React.FC = () => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const handleVisibilityChange = () => {
            setIsVisible(!document.hidden);
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="orb w-96 h-96 bg-gradient-to-r from-emerald-400 to-teal-500 top-10 -left-20" style={{ animationDelay: '0s' }} />
            <div className="orb w-80 h-80 bg-gradient-to-r from-blue-400 to-purple-500 top-1/3 right-10" style={{ animationDelay: '5s' }} />
            <div className="orb w-72 h-72 bg-gradient-to-r from-pink-400 to-rose-500 bottom-20 left-1/4" style={{ animationDelay: '10s' }} />
        </div>
    );
};

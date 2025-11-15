import React, { useState, useEffect } from 'react';

const FloatingOrbs: React.FC = () => {
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
            <div className="orb w-96 h-96 bg-gradient-to-r from-green-200 to-blue-200 dark:from-green-900/70 dark:to-blue-900/70 top-10 -left-20" style={{ animation: 'orbDrift 20s ease-in-out infinite', animationDelay: '0s' }} />
            <div className="orb w-80 h-80 bg-gradient-to-r from-purple-200 to-pink-200 dark:from-purple-900/70 dark:to-pink-900/70 top-1/3 right-10" style={{ animation: 'orbDrift 20s ease-in-out infinite', animationDelay: '5s' }} />
            <div className="orb w-72 h-72 bg-gradient-to-r from-yellow-100 to-orange-200 dark:from-yellow-900/70 dark:to-orange-900/70 bottom-20 left-1/4" style={{ animation: 'orbDrift 20s ease-in-out infinite', animationDelay: '10s' }} />
        </div>
    );
};

export default FloatingOrbs;

import React, { useEffect } from 'react';

interface ToastProps {
    message: string;
    show: boolean;
    onDismiss: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, show, onDismiss }) => {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onDismiss();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [show, onDismiss]);

    if (!show) return null;

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-scale-in">
            <div className="bg-slate-900/95 dark:bg-white/95 backdrop-blur-xl text-white dark:text-slate-900 py-3 px-6 rounded-2xl shadow-2xl border border-emerald-500/30 flex items-center gap-3">
                <span className="text-2xl">✅</span>
                <span className="font-medium">{message}</span>
            </div>
        </div>
    );
};

export default Toast;

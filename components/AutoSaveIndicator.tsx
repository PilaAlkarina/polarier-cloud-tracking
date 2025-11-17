"use client";

import { useEffect, useState, useMemo } from "react";

interface AutoSaveIndicatorProps {
    hasUnsavedChanges: boolean;
    saveStatus: "idle" | "success" | "error" | "auto-saving";
    lastAutoSaveTime: number;
}

export default function AutoSaveIndicator({ hasUnsavedChanges, saveStatus, lastAutoSaveTime }: AutoSaveIndicatorProps) {
    const [currentTime, setCurrentTime] = useState(() => Date.now());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(Date.now());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const timeInfo = useMemo(() => {
        const elapsed = currentTime - lastAutoSaveTime;
        const seconds = Math.floor(elapsed / 1000);
        const minutes = Math.floor(seconds / 60);

        let timeAgo = "ahora";
        if (minutes > 0) {
            timeAgo = `hace ${minutes}m`;
        } else if (seconds > 0) {
            timeAgo = `hace ${seconds}s`;
        }

        // El auto-guardado se ejecuta cada 30 segundos
        const nextCheck = 30 - (seconds % 30);
        const nextAutoSaveIn = nextCheck > 0 ? nextCheck : 30;

        return { timeAgo, nextAutoSaveIn };
    }, [currentTime, lastAutoSaveTime]);

    const { timeAgo, nextAutoSaveIn } = timeInfo;

    if (saveStatus === "auto-saving") {
        return (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 rounded-lg text-xs">
                <div className="animate-spin rounded-full h-3 w-3 border-2 border-blue-500 border-t-transparent"></div>
                <span className="text-blue-600 font-medium">Auto-guardando...</span>
            </div>
        );
    }

    if (hasUnsavedChanges) {
        return (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/20 border border-orange-500/30 rounded-lg text-xs">
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                    <span className="text-orange-700 font-medium">Cambios sin guardar</span>
                </div>
                <span className="text-orange-600/70 text-xs">• Auto-guardado en {nextAutoSaveIn}s</span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 border border-green-500/30 rounded-lg text-xs">
            <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-700 font-medium">Todos los cambios guardados</span>
            </div>
            {timeAgo && <span className="text-green-600/70 text-xs">• {timeAgo}</span>}
        </div>
    );
}

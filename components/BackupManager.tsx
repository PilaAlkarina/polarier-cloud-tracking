"use client";

import { useState, useEffect, useMemo } from "react";

interface Backup {
    timestamp: number;
    date: string;
    data: unknown[];
}

interface BackupManagerProps {
    getBackups: () => Backup[];
    restoreFromBackup: (timestamp: number) => void;
}

export default function BackupManager({ getBackups, restoreFromBackup }: BackupManagerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState(() => Date.now());

    // Actualizar el tiempo cada segundo para refrescar "hace X tiempo"
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(Date.now());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Cargar backups solo cuando se abre el modal (usar memo para evitar re-cálculos)
    const backups = useMemo(() => {
        if (!isOpen) return [];
        return getBackups().sort((a, b) => b.timestamp - a.timestamp);
    }, [isOpen, getBackups]);

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    };

    const getTimeAgo = (timestamp: number) => {
        const seconds = Math.floor((currentTime - timestamp) / 1000);
        if (seconds < 60) return `hace ${seconds}s`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `hace ${minutes}m`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `hace ${hours}h`;
        const days = Math.floor(hours / 24);
        return `hace ${days}d`;
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="px-3 py-1.5 rounded-lg font-medium transition-colors bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border border-white/30 text-xs shadow-lg flex items-center gap-2"
                title="Ver versiones anteriores"
            >
                <span>📦</span>
                <span>Backups ({getBackups().length})</span>
            </button>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <span>📦</span>
                                Backups Automáticos
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Versiones guardadas automáticamente antes de cada cambio importante
                            </p>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {backups.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <svg
                                    className="w-16 h-16 mx-auto"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                                    />
                                </svg>
                            </div>
                            <p className="text-gray-500 font-medium">No hay backups disponibles</p>
                            <p className="text-gray-400 text-sm mt-2">
                                Los backups se crean automáticamente antes de resetear o guardar
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {backups.map((backup, index) => (
                                <div
                                    key={backup.timestamp}
                                    className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                {index === 0 && (
                                                    <span className="px-2 py-0.5 bg-blue-500 text-white text-xs font-medium rounded">
                                                        Más reciente
                                                    </span>
                                                )}
                                                <span className="text-sm font-medium text-gray-700">
                                                    {formatDate(backup.timestamp)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-gray-500">
                                                <span>{getTimeAgo(backup.timestamp)}</span>
                                                <span>•</span>
                                                <span>
                                                    {Array.isArray(backup.data) ? backup.data.length : 0} pantallas
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                if (
                                                    confirm(
                                                        `¿Restaurar este backup de ${formatDate(
                                                            backup.timestamp
                                                        )}?\n\nEsto reemplazará los datos actuales.`
                                                    )
                                                ) {
                                                    restoreFromBackup(backup.timestamp);
                                                    setIsOpen(false);
                                                }
                                            }}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                        >
                                            Restaurar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex items-start justify-between text-xs text-gray-600">
                        <div className="space-y-1">
                            <div>💡 Se mantienen las últimas 10 versiones</div>
                            <div className="text-gray-500">
                                ✓ Los backups se crean antes de guardar manualmente o resetear
                            </div>
                            <div className="text-gray-500">✓ NO se crean en auto-guardado para evitar saturación</div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors font-medium ml-4"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

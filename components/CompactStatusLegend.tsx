"use client";

import { useState } from "react";

export default function CompactStatusLegend() {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="px-4 py-2 rounded-lg font-medium transition-colors bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border border-white/30 text-sm shadow-lg flex items-center gap-2"
                title="Ver leyenda completa de estados"
            >
                📋 Leyenda
                <span className={`transform transition-transform ${isExpanded ? "rotate-180" : ""}`}>▼</span>
            </button>

            {isExpanded && (
                <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-2xl border border-gray-200 p-4 z-50 min-w-[600px]">
                    <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-200">
                        <h3 className="font-bold text-gray-800 text-sm">Leyenda de Estados y Propiedades</h3>
                        <button
                            onClick={() => setIsExpanded(false)}
                            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                        >
                            ×
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Columna 1: Estados Principales */}
                        <div>
                            <h4 className="font-semibold text-xs text-gray-600 mb-2 uppercase tracking-wide">
                                Estados Principales
                            </h4>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-400 text-sm">⏳</span>
                                    <span className="text-gray-700 text-xs">Pendiente</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-green-500 text-sm">✅</span>
                                    <span className="text-gray-700 text-xs">Importada (Completada)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-purple-500 text-sm">🔍</span>
                                    <span className="text-gray-700 text-xs">Verificada (Por Verificar)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-red-500 text-sm">🚨</span>
                                    <span className="text-gray-700 text-xs">Bloqueada</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-pink-500 text-sm">🎨</span>
                                    <span className="text-gray-700 text-xs">Revisión Estética</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-blue-500 text-sm">⚡</span>
                                    <span className="text-gray-700 text-xs">Revisión Fluidez</span>
                                </div>
                            </div>
                        </div>

                        {/* Columna 2: Propiedades Booleanas */}
                        <div>
                            <h4 className="font-semibold text-xs text-gray-600 mb-2 uppercase tracking-wide">
                                Propiedades y Marcadores
                            </h4>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center justify-center w-5 h-5 bg-amber-100 border border-amber-300 rounded text-xs">
                                        🚧
                                    </span>
                                    <span className="text-gray-700 text-xs">En Desarrollo</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center justify-center w-5 h-5 bg-red-100 border border-red-300 rounded text-xs">
                                        ⚠️
                                    </span>
                                    <span className="text-gray-700 text-xs">Con Errores</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-100 border border-blue-300 rounded text-xs">
                                        2️⃣
                                    </span>
                                    <span className="text-gray-700 text-xs">Segunda Revisión</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center justify-center w-5 h-5 bg-green-100 border border-green-300 rounded text-xs">
                                        ✓I
                                    </span>
                                    <span className="text-gray-700 text-xs">Check Isaac</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center justify-center w-5 h-5 bg-purple-100 border border-purple-300 rounded text-xs">
                                        ✓D
                                    </span>
                                    <span className="text-gray-700 text-xs">Check David</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center justify-center w-5 h-5 bg-indigo-100 border border-indigo-300 rounded text-xs">
                                        📌
                                    </span>
                                    <span className="text-gray-700 text-xs">En ClickUp</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center justify-center w-5 h-5 bg-pink-100 border border-pink-300 rounded text-xs">
                                        🎨
                                    </span>
                                    <span className="text-gray-700 text-xs">Revisión Estética Activa</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center justify-center w-5 h-5 bg-cyan-100 border border-cyan-300 rounded text-xs">
                                        ⚡
                                    </span>
                                    <span className="text-gray-700 text-xs">Revisión Fluidez Activa</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center justify-center w-5 h-5 bg-rose-100 border border-rose-300 rounded text-xs">
                                        ❌
                                    </span>
                                    <span className="text-gray-700 text-xs">Error Estético</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center justify-center w-5 h-5 bg-orange-100 border border-orange-300 rounded text-xs">
                                        ❌
                                    </span>
                                    <span className="text-gray-700 text-xs">Error Fluidez</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

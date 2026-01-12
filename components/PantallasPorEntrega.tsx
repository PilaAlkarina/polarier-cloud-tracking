"use client";

import { Pantalla, GrupoEntrega } from "@/types";
import { ENTREGAS_CONFIG, NOMBRES_GRUPOS } from "@/lib/entregas";
import { getColorEstado, getEstadoIcon } from "@/lib/data";

interface PantallasPorEntregaProps {
    pantallas: Pantalla[];
}

export default function PantallasPorEntrega({ pantallas }: PantallasPorEntregaProps) {
    // Agrupar pantallas por grupo de entrega
    const pantallasPorGrupo: Record<GrupoEntrega, Pantalla[]> = {
        RRHH: [],
        CONTROL_ECONOMICO: [],
        MANTENIMIENTO: [],
        PRODUCCION: [],
    };

    pantallas.forEach((pantalla) => {
        if (pantalla.grupoEntrega) {
            pantallasPorGrupo[pantalla.grupoEntrega].push(pantalla);
        }
    });

    // Ordenar grupos por orden de entrega
    const grupos = Object.keys(pantallasPorGrupo) as GrupoEntrega[];
    grupos.sort((a, b) => {
        const ordenA = ENTREGAS_CONFIG[a].orden;
        const ordenB = ENTREGAS_CONFIG[b].orden;
        return ordenA - ordenB;
    });

    return (
        <div className="space-y-4">
            <div className="text-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">📦 Plan de Entregas</h2>
                <p className="text-sm text-gray-600">Pantallas agrupadas por fecha de entrega y módulo</p>
            </div>

            {grupos.map((grupoKey) => {
                const pantallasGrupo = pantallasPorGrupo[grupoKey];
                if (pantallasGrupo.length === 0) return null;

                const config = ENTREGAS_CONFIG[grupoKey];
                const totalPantallas = pantallasGrupo.length;
                const completadas = pantallasGrupo.filter((p) => p.verificada).length;
                const importadas = pantallasGrupo.filter((p) => p.importada).length;
                const progreso = totalPantallas > 0 ? Math.round((completadas / totalPantallas) * 100) : 0;
                const progresoImportadas = totalPantallas > 0 ? Math.round((importadas / totalPantallas) * 100) : 0;

                return (
                    <div
                        key={grupoKey}
                        className="bg-white rounded-lg shadow-md border-2 border-gray-200 overflow-hidden"
                    >
                        {/* Header del grupo */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 text-white">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                                <div>
                                    <h3 className="text-lg font-bold mb-1">{NOMBRES_GRUPOS[grupoKey]}</h3>
                                    <div className="flex flex-wrap gap-2 text-xs">
                                        <div className="bg-white/20 px-3 py-1 rounded-full">
                                            📅 <strong>Fecha:</strong> {config.fecha}
                                        </div>
                                        <div className="bg-white/20 px-3 py-1 rounded-full">
                                            🎯 <strong>Entrega #{config.orden}</strong>
                                        </div>
                                        <div className="bg-white/20 px-3 py-1 rounded-full">
                                            📊 <strong>{totalPantallas}</strong> pantallas
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className="text-2xl font-bold">{progreso}%</div>
                                </div>
                            </div>

                            {/* Early Adopters */}
                            <div className="mt-2 pt-2 border-t border-white/20">
                                <div className="text-xs opacity-90 mb-1">👥 EA:</div>
                                <div className="flex flex-wrap gap-1">
                                    {config.earlyAdopters.map((adopter) => (
                                        <span
                                            key={adopter}
                                            className="bg-white/30 px-2 py-0.5 rounded-full text-xs font-medium"
                                        >
                                            {adopter}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Barra de progreso */}
                            <div className="mt-2">
                                <div className="flex justify-between text-xs mb-0.5">
                                    <span>
                                        Completadas {completadas}/{totalPantallas}
                                    </span>
                                    <span>
                                        Importadas {importadas}/{totalPantallas}
                                    </span>
                                </div>
                                <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                                    <div
                                        className="bg-green-400 h-full rounded-full transition-all duration-500"
                                        style={{ width: `${progreso}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        {/* Lista de pantallas */}
                        <div className="p-3">
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                                {pantallasGrupo.map((pantalla) => (
                                    <div
                                        key={pantalla.id}
                                        className={`p-2 rounded border transition-all hover:shadow-sm ${getColorEstado(
                                            pantalla.estado
                                        )}`}
                                        title={pantalla.nombre}
                                    >
                                        <div className="flex items-start gap-1">
                                            <span className="text-sm flex-shrink-0">
                                                {getEstadoIcon(pantalla.estado)}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium text-xs truncate">{pantalla.nombre}</div>
                                            </div>
                                        </div>
                                        {/* Indicadores de revisión */}
                                        <div className="flex gap-0.5 mt-1">
                                            {pantalla.revisionEstetica && <span className="text-xs">🎨</span>}
                                            {pantalla.revisionFluidez && <span className="text-xs">⚡</span>}
                                            {pantalla.revisionEsteticaGrupal && <span className="text-xs">🎨✓</span>}
                                            {pantalla.revisionFluidezGrupal && <span className="text-xs">⚡✓</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

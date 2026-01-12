"use client";

import { Pantalla, GrupoEntrega } from "@/types";
import { ENTREGAS_CONFIG, NOMBRES_GRUPOS } from "@/lib/entregas";

interface ResumenEntregasProps {
    pantallas: Pantalla[];
}

export default function ResumenEntregas({ pantallas }: ResumenEntregasProps) {
    // Calcular estadísticas por grupo
    const estadisticasPorGrupo = (Object.keys(ENTREGAS_CONFIG) as GrupoEntrega[]).map((grupo) => {
        const pantallasGrupo = pantallas.filter((p) => p.grupoEntrega === grupo);
        const total = pantallasGrupo.length;
        const completadas = pantallasGrupo.filter((p) => p.verificada).length;
        const importadas = pantallasGrupo.filter((p) => p.importada).length;
        const pendientes = total - importadas;
        const progreso = total > 0 ? Math.round((completadas / total) * 100) : 0;

        return {
            ...ENTREGAS_CONFIG[grupo],
            nombre: NOMBRES_GRUPOS[grupo],
            total,
            completadas,
            importadas,
            pendientes,
            progreso,
        };
    });

    // Ordenar por orden de entrega
    estadisticasPorGrupo.sort((a, b) => a.orden - b.orden);

    // Calcular totales
    const totalPantallas = pantallas.length;
    const totalCompletadas = pantallas.filter((p) => p.verificada).length;
    const progresoTotal = totalPantallas > 0 ? Math.round((totalCompletadas / totalPantallas) * 100) : 0;

    return (
        <div className="bg-white rounded-xl shadow-lg p-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">📊 Resumen de Entregas</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                {estadisticasPorGrupo.map((stat) => (
                    <div
                        key={stat.grupo}
                        className="border-2 border-gray-200 rounded-lg p-3 hover:border-blue-400 transition-colors"
                    >
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                                <h3 className="font-bold text-base text-gray-900 mb-0.5">{stat.nombre}</h3>
                                <div className="text-xs text-gray-500">📅 {stat.fecha}</div>
                            </div>
                            <div className="text-right">
                                <div
                                    className={`text-2xl font-bold ${
                                        stat.progreso === 100
                                            ? "text-green-600"
                                            : stat.progreso >= 50
                                            ? "text-blue-600"
                                            : "text-orange-600"
                                    }`}
                                >
                                    {stat.progreso}%
                                </div>
                            </div>
                        </div>

                        {/* Barra de progreso */}
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                            <div
                                className={`h-full rounded-full transition-all ${
                                    stat.progreso === 100
                                        ? "bg-green-500"
                                        : stat.progreso >= 50
                                        ? "bg-blue-500"
                                        : "bg-orange-500"
                                }`}
                                style={{ width: `${stat.progreso}%` }}
                            ></div>
                        </div>

                        {/* Estadísticas detalladas */}
                        <div className="space-y-0.5 text-xs">
                            <div className="flex justify-between text-gray-600">
                                <span>Total:</span>
                                <span className="font-medium">{stat.total}</span>
                            </div>
                            <div className="flex justify-between text-green-600">
                                <span>✅ Completadas:</span>
                                <span className="font-bold">{stat.completadas}</span>
                            </div>
                            <div className="flex justify-between text-blue-600">
                                <span>📥 Importadas:</span>
                                <span className="font-medium">{stat.importadas}</span>
                            </div>
                            <div className="flex justify-between text-orange-600">
                                <span>⏳ Pendientes:</span>
                                <span className="font-medium">{stat.pendientes}</span>
                            </div>
                        </div>

                        {/* Early Adopters */}
                        <div className="mt-2 pt-2 border-t border-gray-200">
                            <div className="text-xs text-gray-500 mb-1">👥 EA:</div>
                            <div className="flex flex-wrap gap-1">
                                {stat.earlyAdopters.map((adopter) => (
                                    <span
                                        key={adopter}
                                        className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full"
                                    >
                                        {adopter}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Resumen total */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border-2 border-blue-200">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h3 className="text-base font-bold text-gray-900">Progreso Total</h3>
                        <div className="text-sm text-gray-600">
                            {totalCompletadas}/{totalPantallas} pantallas
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">{progresoTotal}%</div>
                    </div>
                </div>
                <div className="w-full bg-white rounded-full h-2 mt-2">
                    <div
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all"
                        style={{ width: `${progresoTotal}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
}

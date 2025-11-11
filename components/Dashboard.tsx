"use client";

import { useMemo } from "react";
import { useTrackingData } from "@/hooks/useTrackingData";
import { calcularEstadisticasGlobales } from "@/lib/data";
import { getDiasRestantes } from "@/lib/planDeTrabajo";
import StatsCards from "@/components/StatsCards";
import ProgressChart from "@/components/ProgressChart";
import TasksLists from "./TasksLists";

export default function Dashboard() {
    const { pantallas, isLoading, error, resetData } = useTrackingData();
    const statsGlobales = useMemo(() => calcularEstadisticasGlobales(pantallas), [pantallas]);
    const diasRestantes = getDiasRestantes();

    // Log para debug
    console.log("🎯 Dashboard - Pantallas:", pantallas.length);
    console.log("📊 Dashboard - Stats:", statsGlobales);
    console.log("📅 Dashboard - Días restantes:", diasRestantes);

    // Mostrar pantalla de carga
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Cargando datos desde tracking.txt...</p>
                </div>
            </div>
        );
    }

    // Mostrar error si lo hay
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
                    <div className="text-red-600 text-center mb-4">
                        <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <h2 className="text-xl font-bold mb-2">Error al cargar datos</h2>
                        <p className="text-gray-600">{error}</p>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Recargar página
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                🚀 MyPolarier Migration
                            </h1>
                            <p className="text-xs text-gray-600">
                                Deadline: <span className="font-semibold text-red-600">20 Nov 2025</span> •
                                <span className="ml-2 font-semibold text-blue-600">{diasRestantes} días</span>
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => {
                                    if (
                                        confirm(
                                            "¿Seguro que quieres resetear todos los datos? Esta acción no se puede deshacer."
                                        )
                                    ) {
                                        resetData();
                                    }
                                }}
                                className="px-3 py-1.5 rounded-lg font-medium transition-colors bg-red-600 text-white hover:bg-red-700 text-xs shadow-sm"
                                title="Resetear datos al estado original"
                            >
                                🔄 Reset
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="space-y-4">
                    <StatsCards stats={statsGlobales} pantallas={pantallas} />
                    <ProgressChart pantallas={pantallas} />
                    <TasksLists pantallas={pantallas} />
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 mt-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <div className="text-center text-xs text-gray-500">
                        <p>📦 MyPolarier Migration Sprint • 141 pantallas • Generado: 11 Nov 2025</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

"use client";

import { useMemo } from "react";
import { useTrackingData } from "@/hooks/useTrackingData";
import { calcularEstadisticasGlobales } from "@/lib/data";
import { FECHA_DEADLINE } from "@/lib/planDeTrabajo";
import StatsCards from "@/components/StatsCards";
import ProgressChart from "@/components/ProgressChart";
import CountdownTimer from "@/components/CountdownTimer";
import TasksListsEditable from "./TasksListsEditable";
import CompactStatusLegend from "./CompactStatusLegend";
import AutoSaveIndicator from "./AutoSaveIndicator";
import BackupManager from "./BackupManager";

export default function Dashboard() {
    const {
        pantallas,
        isLoading,
        error,
        resetData,
        saveToGitHub,
        deletePantalla,
        updateFechaLimite,
        updateResponsable,
        reorderPantallas,
        updateEstado,
        updateConErrores,
        updateEnDesarrollo,
        isSaving,
        saveStatus,
        hasUnsavedChanges,
        lastAutoSaveTime,
        restoreFromBackup,
        getBackups,
    } = useTrackingData();
    const statsGlobales = useMemo(() => calcularEstadisticasGlobales(pantallas), [pantallas]);

    // Log para debug
    console.log("🎯 Dashboard - Pantallas:", pantallas.length);
    console.log("📊 Dashboard - Stats:", statsGlobales);

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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative">
            {/* Overlay de bloqueo durante guardado */}
            {isSaving && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4">
                        <div className="flex flex-col items-center gap-4">
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
                            <div className="text-center">
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Guardando cambios</h3>
                                <p className="text-gray-600">Por favor espera mientras se actualiza GitHub...</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Header con Cuenta Atrás */}
            <header className="bg-[#0E4174] border-b border-[#0a2f52] shadow-lg">
                <div className="w-[80%] mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex-1 flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
                            <div className="text-center sm:text-left">
                                <h1 className="text-2xl sm:text-3xl font-bold text-[#F1BE48] whitespace-nowrap">
                                    POLARIER CLOUD
                                </h1>
                                <div className="text-white/80 text-xs font-medium mt-1">📅 Deadline: 20 Nov 2025</div>
                            </div>
                            <CountdownTimer deadline={FECHA_DEADLINE} />
                        </div>
                        <div className="flex flex-col gap-2 items-end">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => {
                                        if (
                                            confirm(
                                                "¿Guardar cambios en GitHub? Esto actualizará el archivo tracking.json permanentemente."
                                            )
                                        ) {
                                            saveToGitHub();
                                        }
                                    }}
                                    disabled={isSaving}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all text-sm shadow-lg flex items-center gap-2 ${
                                        isSaving
                                            ? "bg-gray-400 text-white cursor-not-allowed"
                                            : saveStatus === "success"
                                            ? "bg-green-500 text-white hover:bg-green-600"
                                            : saveStatus === "error"
                                            ? "bg-red-500 text-white hover:bg-red-600"
                                            : saveStatus === "auto-saving"
                                            ? "bg-blue-500 text-white"
                                            : hasUnsavedChanges
                                            ? "bg-orange-500 text-white hover:bg-orange-600 animate-pulse"
                                            : "bg-[#F1BE48] text-[#0E4174] hover:bg-[#f1c95e] border border-[#0E4174]/20"
                                    }`}
                                    title={hasUnsavedChanges ? "Hay cambios sin guardar" : "Guardar cambios en GitHub"}
                                >
                                    {isSaving ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                            Guardando...
                                        </>
                                    ) : saveStatus === "success" ? (
                                        <>✅ Guardado</>
                                    ) : saveStatus === "error" ? (
                                        <>❌ Error</>
                                    ) : saveStatus === "auto-saving" ? (
                                        <>💾 Auto-guardando...</>
                                    ) : hasUnsavedChanges ? (
                                        <>💾 Guardar *</>
                                    ) : (
                                        <>💾 Guardar</>
                                    )}
                                </button>
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
                                    className="px-4 py-2 rounded-lg font-medium transition-colors bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border border-white/30 text-sm shadow-lg"
                                    title="Resetear datos al estado original"
                                >
                                    🔄 Reset
                                </button>
                                <BackupManager getBackups={getBackups} restoreFromBackup={restoreFromBackup} />
                                <CompactStatusLegend />
                            </div>
                            <AutoSaveIndicator
                                hasUnsavedChanges={hasUnsavedChanges}
                                saveStatus={saveStatus}
                                lastAutoSaveTime={lastAutoSaveTime}
                            />
                        </div>
                    </div>
                </div>
            </header>
            {/* Main Content */}
            <main className="w-[80%] mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="space-y-4">
                    <StatsCards stats={statsGlobales} pantallas={pantallas} />
                    <ProgressChart pantallas={pantallas} />
                    <TasksListsEditable
                        pantallas={pantallas}
                        onUpdateFecha={updateFechaLimite}
                        onUpdateResponsable={updateResponsable}
                        onDelete={deletePantalla}
                        onReorder={reorderPantallas}
                        onUpdateEstado={updateEstado}
                        onUpdateConErrores={updateConErrores}
                        onUpdateEnDesarrollo={updateEnDesarrollo}
                        onUpdateUsuarioPrepara={updateResponsable}
                    />
                </div>
            </main>{" "}
            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 mt-6">
                <div className="w-[80%] mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <div className="text-center text-xs text-gray-500">
                        <p>📦 MyPolarier Migration Sprint • 141 pantallas • Generado: 11 Nov 2025</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

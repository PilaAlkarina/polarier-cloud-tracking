"use client";

import { useState } from "react";
import { Pantalla } from "@/types";

interface ConflictInfo {
    id: number;
    denominacion: string;
    localVersion?: Pantalla;
    remoteVersion?: Pantalla;
}

interface ConflictResolverProps {
    conflicts: ConflictInfo[];
    localData: Pantalla[];
    remoteData: Pantalla[];
    onResolve: (strategy: "keep-local" | "keep-remote" | "cancel") => void;
}

export default function ConflictResolver({ conflicts, localData, remoteData, onResolve }: ConflictResolverProps) {
    const [selectedStrategy, setSelectedStrategy] = useState<"keep-local" | "keep-remote" | null>(null);

    const getConflictDetails = (conflict: ConflictInfo) => {
        const local = localData.find((p) => p.id === conflict.id);
        const remote = remoteData.find((p) => p.id === conflict.id);
        return { local, remote };
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="px-6 py-5 border-b border-red-200 bg-gradient-to-r from-red-50 to-orange-50">
                    <div className="flex items-center gap-3">
                        <div className="text-3xl">⚠️</div>
                        <div>
                            <h2 className="text-2xl font-bold text-red-800">Conflicto Detectado</h2>
                            <p className="text-sm text-red-600 mt-1">
                                {conflicts.length} {conflicts.length === 1 ? "tarea modificada" : "tareas modificadas"}{" "}
                                simultáneamente
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="mb-6">
                        <p className="text-gray-700 mb-4">
                            Otro usuario modificó las siguientes tareas mientras tú también las editabas. Elige qué
                            versión quieres conservar:
                        </p>

                        <div className="space-y-4">
                            {conflicts.map((conflict) => {
                                const { local, remote } = getConflictDetails(conflict);
                                return (
                                    <div key={conflict.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                            <span className="text-red-500">🔸</span>
                                            {conflict.denominacion}
                                        </h3>

                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            {/* Versión Local */}
                                            <div className="bg-blue-50 p-3 rounded border border-blue-200">
                                                <div className="font-medium text-blue-800 mb-2">
                                                    📱 Tu versión (local)
                                                </div>
                                                {local && (
                                                    <div className="space-y-1 text-gray-700">
                                                        <div>Estado: {local.estado}</div>
                                                        <div>Responsable: {local.responsable || "—"}</div>
                                                        <div>Fecha límite: {local.fechaLimite || "—"}</div>
                                                        <div>Progreso: {local.porcentaje || 0}%</div>
                                                        {local.conErrores && (
                                                            <div className="text-red-600">⚠️ Con errores</div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Versión Remota */}
                                            <div className="bg-green-50 p-3 rounded border border-green-200">
                                                <div className="font-medium text-green-800 mb-2">
                                                    🌐 Versión GitHub (remota)
                                                </div>
                                                {remote && (
                                                    <div className="space-y-1 text-gray-700">
                                                        <div>Estado: {remote.estado}</div>
                                                        <div>Responsable: {remote.responsable || "—"}</div>
                                                        <div>Fecha límite: {remote.fechaLimite || "—"}</div>
                                                        <div>Progreso: {remote.porcentaje || 0}%</div>
                                                        {remote.conErrores && (
                                                            <div className="text-red-600">⚠️ Con errores</div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Strategy Selection */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                        <h3 className="font-semibold text-yellow-800 mb-3">Elige una estrategia:</h3>
                        <div className="space-y-2">
                            <label className="flex items-start gap-3 p-3 bg-white rounded border border-gray-300 hover:border-blue-400 cursor-pointer">
                                <input
                                    type="radio"
                                    name="strategy"
                                    value="keep-local"
                                    checked={selectedStrategy === "keep-local"}
                                    onChange={() => setSelectedStrategy("keep-local")}
                                    className="mt-1"
                                />
                                <div>
                                    <div className="font-medium text-gray-800">Mantener mis cambios (sobrescribir)</div>
                                    <div className="text-sm text-gray-600">
                                        Tus cambios se guardarán y los cambios remotos se perderán
                                    </div>
                                </div>
                            </label>

                            <label className="flex items-start gap-3 p-3 bg-white rounded border border-gray-300 hover:border-green-400 cursor-pointer">
                                <input
                                    type="radio"
                                    name="strategy"
                                    value="keep-remote"
                                    checked={selectedStrategy === "keep-remote"}
                                    onChange={() => setSelectedStrategy("keep-remote")}
                                    className="mt-1"
                                />
                                <div>
                                    <div className="font-medium text-gray-800">Usar cambios de GitHub (recargar)</div>
                                    <div className="text-sm text-gray-600">
                                        Los cambios remotos se cargarán (tus cambios se guardarán como backup)
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
                    <button
                        onClick={() => onResolve("cancel")}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors font-medium text-gray-700"
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={() => {
                            if (selectedStrategy) {
                                onResolve(selectedStrategy);
                            }
                        }}
                        disabled={!selectedStrategy}
                        className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                            selectedStrategy
                                ? "bg-blue-600 hover:bg-blue-700 text-white"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                        {selectedStrategy === "keep-local" && "Sobrescribir con mis cambios"}
                        {selectedStrategy === "keep-remote" && "Recargar desde GitHub"}
                        {!selectedStrategy && "Selecciona una opción"}
                    </button>
                </div>
            </div>
        </div>
    );
}

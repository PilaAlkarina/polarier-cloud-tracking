"use client";

import { useMemo } from "react";
import type { Pantalla } from "@/types";
import TaskStatusIndicators from "./TaskStatusIndicators";
import { getColorPrioridad } from "@/lib/data";

interface TasksListsEditableProps {
    pantallas: Pantalla[];
    onDelete: (id: number) => void;
    onReorder: (startIndex: number, endIndex: number) => void;
    onUpdateRevisionEstetica: (id: number, value: boolean) => void;
    onUpdateRevisionFluidez: (id: number, value: boolean) => void;
    onUpdateRevisionEsteticaGrupal: (id: number, value: boolean) => void;
    onUpdateRevisionFluidezGrupal: (id: number, value: boolean) => void;
}

export default function TasksListsEditable({
    pantallas,
    onDelete,
    onReorder,
    onUpdateRevisionEstetica,
    onUpdateRevisionFluidez,
    onUpdateRevisionEsteticaGrupal,
    onUpdateRevisionFluidezGrupal,
}: TasksListsEditableProps) {
    const ordered = useMemo(() => {
        const copy = [...pantallas];
        copy.sort((a, b) => (a.prioridadNum ?? a.id) - (b.prioridadNum ?? b.id));
        return copy;
    }, [pantallas]);

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">🧾 Seguimiento</h2>
                <div className="text-sm text-gray-600">{ordered.length} items</div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                #
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Denominación
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Módulo
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Prioridad
                            </th>
                            <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                👥 🎨
                            </th>
                            <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Rev. 🎨
                            </th>
                            <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                👥 ⚡
                            </th>
                            <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Rev. ⚡
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {ordered.map((pantalla, index) => (
                            <tr key={pantalla.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 font-medium">
                                    {pantalla.prioridadNum ?? pantalla.id}
                                </td>
                                <td className="px-3 py-2 text-sm text-gray-900">
                                    <div className="flex items-center gap-2">
                                        <TaskStatusIndicators pantalla={pantalla} />
                                        <span className="font-medium" title={pantalla.nombre}>
                                            {pantalla.nombre}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">{pantalla.modulo}</td>
                                <td className="px-3 py-2 whitespace-nowrap">
                                    <span
                                        className={`px-2 py-1 text-xs font-semibold rounded-full border ${getColorPrioridad(
                                            pantalla.prioridad
                                        )}`}
                                    >
                                        {pantalla.prioridad}
                                    </span>
                                </td>
                                <td className="px-3 py-2 text-center">
                                    <input
                                        type="checkbox"
                                        checked={pantalla.revisionEsteticaGrupal}
                                        onChange={(e) => onUpdateRevisionEsteticaGrupal(pantalla.id, e.target.checked)}
                                        className="w-4 h-4 accent-purple-600"
                                        title="Revisión estética grupal"
                                    />
                                </td>
                                <td className="px-3 py-2 text-center">
                                    <input
                                        type="checkbox"
                                        checked={pantalla.revisionEstetica}
                                        onChange={(e) => onUpdateRevisionEstetica(pantalla.id, e.target.checked)}
                                        className="w-4 h-4"
                                    />
                                </td>
                                <td className="px-3 py-2 text-center">
                                    <input
                                        type="checkbox"
                                        checked={pantalla.revisionFluidezGrupal}
                                        onChange={(e) => onUpdateRevisionFluidezGrupal(pantalla.id, e.target.checked)}
                                        className="w-4 h-4 accent-indigo-600"
                                        title="Revisión fluidez grupal"
                                    />
                                </td>
                                <td className="px-3 py-2 text-center">
                                    <input
                                        type="checkbox"
                                        checked={pantalla.revisionFluidez}
                                        onChange={(e) => onUpdateRevisionFluidez(pantalla.id, e.target.checked)}
                                        className="w-4 h-4"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

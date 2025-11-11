"use client";

import { useState, useMemo, useEffect } from "react";
import { Pantalla } from "@/types";

interface ChecklistItem {
    id: number;
    text: string;
    isImport: boolean;
}

interface DiaChecklistData {
    dia: number;
    fecha: string;
    nombreDia: string;
    meta: number;
    items: ChecklistItem[];
}

interface ChecklistDiarioProps {
    pantallas: Pantalla[];
}

// Plan de trabajo de 7 días
// Total: 141 pantallas distribuidas entre el 12 y 20 de noviembre
// Promedio: ~20 pantallas/día
const planDeTrabajo = [
    { dia: 1, fecha: "12 Nov", nombreDia: "Martes", meta: 20 },
    { dia: 2, fecha: "13 Nov", nombreDia: "Miércoles", meta: 20 },
    { dia: 3, fecha: "14 Nov", nombreDia: "Jueves", meta: 20 },
    { dia: 4, fecha: "17 Nov", nombreDia: "Domingo", meta: 20 },
    { dia: 5, fecha: "18 Nov", nombreDia: "Lunes", meta: 20 },
    { dia: 6, fecha: "19 Nov", nombreDia: "Martes", meta: 20 },
    { dia: 7, fecha: "20 Nov", nombreDia: "Miércoles", meta: 21 },
];

const STORAGE_KEY = "mypolarier_checklist_completados";

export default function ChecklistDiario({ pantallas }: ChecklistDiarioProps) {
    const [completedItems, setCompletedItems] = useState<Set<number>>(new Set());
    const [diaActivo, setDiaActivo] = useState(1);

    // Cargar progreso del localStorage al montar
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setCompletedItems(new Set(parsed));
            } catch (e) {
                console.error("Error loading checklist progress:", e);
            }
        }
    }, []);

    // Guardar progreso en localStorage cuando cambie
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(completedItems)));
    }, [completedItems]);

    // Generar checklist por día basado en pantallas reales
    const checklistData: DiaChecklistData[] = useMemo(() => {
        // Ordenar pantallas por prioridad
        const prioridadOrden: Record<string, number> = {
            Crítico: 1,
            Alto: 2,
            "Medio-Alto": 3,
            Medio: 4,
            Media: 5,
            Bajo: 6,
        };

        const pantallasOrdenadas = [...pantallas].sort((a, b) => {
            const prioA = prioridadOrden[a.prioridad] || 99;
            const prioB = prioridadOrden[b.prioridad] || 99;
            if (prioA !== prioB) return prioA - prioB;
            return a.id - b.id;
        });

        // Distribuir pantallas por día
        const distribucion: DiaChecklistData[] = [];
        let indice = 0;

        planDeTrabajo.forEach((plan) => {
            const items: ChecklistItem[] = [];
            for (let i = 0; i < plan.meta && indice < pantallasOrdenadas.length; i++, indice++) {
                const pantalla = pantallasOrdenadas[indice];
                items.push({
                    id: pantalla.id,
                    text: pantalla.nombre,
                    isImport: !pantalla.importada, // Si no está importada, necesita importación
                });
            }

            distribucion.push({
                dia: plan.dia,
                fecha: plan.fecha,
                nombreDia: plan.nombreDia,
                meta: plan.meta,
                items,
            });
        });

        return distribucion;
    }, [pantallas]);

    const toggleItem = (id: number) => {
        setCompletedItems((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const diaData = checklistData.find((d) => d.dia === diaActivo) || checklistData[0];
    const completadosDelDia = diaData.items.filter((item) => completedItems.has(item.id)).length;
    const progresoDelDia = Math.round((completadosDelDia / diaData.meta) * 100);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                        ✅ Checklist Diario - MyPolarier
                    </h1>
                    <p className="text-gray-600">
                        Marca las tareas conforme las completes • Progreso guardado automáticamente
                    </p>
                </div>

                {/* Selector de Día */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Selecciona el día:</h2>
                    <div className="flex flex-wrap gap-2">
                        {checklistData.map((dia) => (
                            <button
                                key={dia.dia}
                                onClick={() => setDiaActivo(dia.dia)}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                    diaActivo === dia.dia
                                        ? "bg-blue-600 text-white shadow-lg scale-105"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                Día {dia.dia}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Checklist del Día */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Día {diaData.dia} - {diaData.nombreDia} ({diaData.fecha})
                                </h2>
                                <p className="text-sm text-gray-600 mt-1">Meta: {diaData.meta} pantallas</p>
                            </div>
                            <div className="text-right">
                                <p className="text-3xl font-bold text-blue-600">
                                    {completadosDelDia}/{diaData.meta}
                                </p>
                                <p className="text-sm text-gray-600">{progresoDelDia}% completado</p>
                            </div>
                        </div>

                        {/* Barra de progreso */}
                        <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                                style={{ width: `${progresoDelDia}%` }}
                            >
                                {progresoDelDia > 10 && (
                                    <span className="text-xs font-bold text-white">{progresoDelDia}%</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Lista de Items */}
                    <div className="space-y-2">
                        {diaData.items.map((item) => {
                            const isCompleted = completedItems.has(item.id);
                            return (
                                <div
                                    key={item.id}
                                    onClick={() => toggleItem(item.id)}
                                    className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                        isCompleted
                                            ? "bg-green-50 border-green-500 shadow-sm"
                                            : "bg-gray-50 border-gray-200 hover:border-gray-300 hover:bg-gray-100"
                                    }`}
                                >
                                    <div
                                        className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${
                                            isCompleted ? "bg-green-500 border-green-500" : "bg-white border-gray-300"
                                        }`}
                                    >
                                        {isCompleted && <span className="text-white text-sm">✓</span>}
                                    </div>
                                    <div className="flex-1">
                                        <p
                                            className={`font-medium ${
                                                isCompleted ? "text-gray-500 line-through" : "text-gray-900"
                                            }`}
                                        >
                                            {item.text}
                                        </p>
                                        {item.isImport && (
                                            <p className="text-xs text-orange-600 mt-1">📥 Importar + Verificar</p>
                                        )}
                                        {!item.isImport && (
                                            <p className="text-xs text-blue-600 mt-1">✓ Solo Verificar</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Mensaje de Completado */}
                    {completadosDelDia === diaData.meta && (
                        <div className="mt-6 p-4 bg-green-100 border-2 border-green-500 rounded-lg text-center">
                            <p className="text-lg font-bold text-green-800">
                                🎉 ¡Día {diaData.dia} completado! ¡Excelente trabajo!
                            </p>
                        </div>
                    )}
                </div>

                {/* Botones de Acción */}
                <div className="mt-6 flex gap-4">
                    <button
                        onClick={() => {
                            if (confirm("¿Seguro que quieres limpiar el progreso de este día?")) {
                                const newSet = new Set(completedItems);
                                diaData.items.forEach((item) => newSet.delete(item.id));
                                setCompletedItems(newSet);
                            }
                        }}
                        className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors shadow-md"
                    >
                        🔄 Resetear Día
                    </button>
                    <button
                        onClick={() => {
                            const newSet = new Set(completedItems);
                            diaData.items.forEach((item) => newSet.add(item.id));
                            setCompletedItems(newSet);
                        }}
                        className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors shadow-md"
                    >
                        ✅ Marcar Todo
                    </button>
                </div>
            </div>
        </div>
    );
}

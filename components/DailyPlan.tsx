import { Pantalla } from "@/types";
import { useMemo } from "react";

interface DailyPlanProps {
    pantallas: Pantalla[];
}

// Plan de trabajo de 7 días con distribución de pantallas
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

export default function DailyPlan({ pantallas }: DailyPlanProps) {
    // Generar tareas por día basadas en prioridad
    const tareasPorDia = useMemo(() => {
        // Ordenar pantallas por prioridad (Crítico > Alto > Medio-Alto > Medio > Bajo)
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

        // Distribuir pantallas por día según el plan
        const distribucion: Array<{
            dia: number;
            fecha: string;
            nombreDia: string;
            metaDelDia: number;
            modulos: string[];
            pantallas: string[];
            completadas: number;
            porcentaje: number;
        }> = [];

        let indice = 0;
        planDeTrabajo.forEach((plan) => {
            const pantallasDia: Pantalla[] = [];
            for (let i = 0; i < plan.meta && indice < pantallasOrdenadas.length; i++, indice++) {
                pantallasDia.push(pantallasOrdenadas[indice]);
            }

            const modulos = [...new Set(pantallasDia.map((p) => p.modulo))];
            const completadas = pantallasDia.filter((p) => p.importada).length;
            const porcentaje = pantallasDia.length > 0 ? Math.round((completadas / pantallasDia.length) * 100) : 0;

            distribucion.push({
                dia: plan.dia,
                fecha: plan.fecha,
                nombreDia: plan.nombreDia,
                metaDelDia: plan.meta,
                modulos,
                pantallas: pantallasDia.map((p) => (p.importada ? `✅ ${p.nombre}` : p.nombre)),
                completadas,
                porcentaje,
            });
        });

        return distribucion;
    }, [pantallas]);

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    📅 Plan de Trabajo - 7 Días Intensivos
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                    Del 12 al 20 de Noviembre de 2025 • Velocidad requerida: ~20 pantallas/día
                </p>

                <div className="space-y-4">
                    {tareasPorDia.map((tarea) => {
                        const esHoy = tarea.dia === 1; // Ajusta según la fecha actual

                        return (
                            <div
                                key={tarea.dia}
                                className={`border-2 rounded-xl p-6 transition-all ${
                                    esHoy
                                        ? "border-blue-500 bg-blue-50 shadow-lg"
                                        : "border-gray-200 bg-white hover:border-gray-300"
                                }`}
                            >
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                                                esHoy ? "bg-blue-600" : "bg-gray-400"
                                            }`}
                                        >
                                            {tarea.dia}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">
                                                Día {tarea.dia} - {tarea.nombreDia}
                                            </h3>
                                            <p className="text-sm text-gray-600">{tarea.fecha}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="text-center">
                                            <p className="text-sm text-gray-600">Meta del día</p>
                                            <p className="text-2xl font-bold text-blue-600">{tarea.metaDelDia}</p>
                                            <p className="text-xs text-gray-500">pantallas</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm text-gray-600">Completadas</p>
                                            <p className="text-2xl font-bold text-green-600">{tarea.completadas}</p>
                                            <p className="text-xs text-gray-500">{tarea.porcentaje}%</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <p className="text-sm font-medium text-gray-700 mb-2">
                                        📦 Módulos: {tarea.modulos.join(", ")}
                                    </p>
                                    <div className="bg-gray-200 rounded-full h-3">
                                        <div
                                            className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                                            style={{ width: `${tarea.porcentaje}%` }}
                                        />
                                    </div>
                                </div>{" "}
                                <div className="mt-4">
                                    <p className="text-sm font-semibold text-gray-700 mb-3">
                                        Pantallas del día ({tarea.pantallas.length}):
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                        {tarea.pantallas.slice(0, 12).map((pantalla, idx) => (
                                            <div
                                                key={idx}
                                                className={`px-3 py-2 rounded-lg text-sm ${
                                                    pantalla.includes("✓")
                                                        ? "bg-green-50 text-green-700 border border-green-200"
                                                        : "bg-gray-50 text-gray-700 border border-gray-200"
                                                }`}
                                            >
                                                {pantalla}
                                            </div>
                                        ))}
                                    </div>
                                    {tarea.pantallas.length > 12 && (
                                        <p className="mt-3 text-sm text-gray-500 italic">
                                            + {tarea.pantallas.length - 12} pantallas más...
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Resumen de Bloqueadores */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    🚨 Bloqueadores Conocidos
                </h3>
                <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-red-50 border-l-4 border-red-500 rounded">
                        <span className="text-red-600 font-bold">⚠️</span>
                        <div>
                            <p className="font-semibold text-red-900">LaundryDashboard</p>
                            <p className="text-sm text-red-700">
                                Sin acceso a BD - <span className="font-semibold">Impacto: Alto</span>
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-red-50 border-l-4 border-red-500 rounded">
                        <span className="text-red-600 font-bold">⚠️</span>
                        <div>
                            <p className="font-semibold text-red-900">Producción</p>
                            <p className="text-sm text-red-700">
                                Sin acceso a BD - <span className="font-semibold">Impacto: Alto</span>
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-red-50 border-l-4 border-red-500 rounded">
                        <span className="text-red-600 font-bold">⚠️</span>
                        <div>
                            <p className="font-semibold text-red-900">Kg Lavados</p>
                            <p className="text-sm text-red-700">
                                Sin acceso a BD - <span className="font-semibold">Impacto: Alto</span>
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                        <span className="text-yellow-600 font-bold">⚠️</span>
                        <div>
                            <p className="font-semibold text-yellow-900">Cuadrante Personal</p>
                            <p className="text-sm text-yellow-700">
                                Con arreglos pendientes complejos -{" "}
                                <span className="font-semibold">Impacto: Medio</span>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
                    <p className="text-sm text-blue-900">
                        💡 <strong>Protocolo:</strong> Documentar, marcar como bloqueado, y continuar con la siguiente
                        tarea. Estos bloqueadores se resolverán al final del sprint o se escalarán a DevOps.
                    </p>
                </div>
            </div>
        </div>
    );
}

import { Pantalla, Prioridad } from "@/types";

// DEPRECATED: Este dato ya no se usa. Los datos se obtienen desde tracking.json vía API
// Se mantiene solo por compatibilidad temporal
export const rawTrackingData = ``;

export function parseTrackingData(): Pantalla[] {
    console.warn("parseTrackingData() está deprecated. Usa el hook useTrackingData() en su lugar.");
    return [];
}

// DEPRECATED: Este dato ya no se usa. El plan diario se genera dinámicamente desde tracking.json
// Se mantiene solo por compatibilidad temporal
export const tareasPorDia: unknown[] = [];

// DEPRECATED: Este dato ya no se usa. Los bloqueadores se manejan desde tracking.json
export const bloqueadoresConocidos: unknown[] = [];

// Funciones de cálculo de estadísticas
import type { EstadisticasGlobales, EstadisticasPorPrioridad } from "@/types";

export function calcularEstadisticasGlobales(pantallas: Pantalla[]): EstadisticasGlobales {
    const totalPantallas = pantallas.length;
    const importadas = pantallas.filter((p) => p.importada).length;
    const verificadas = pantallas.filter((p) => p.verificada).length;
    const pendientes = pantallas.filter((p) => !p.importada).length;
    const segundasRevisiones = pantallas.filter((p) => p.segundaRevision).length;

    // Cálculo de progreso ponderado: Importada = 33.33%, Verificada = 66.67%, Segunda Revisión = 100%
    let progresoTotal = 0;
    pantallas.forEach((p) => {
        if (p.segundaRevision) {
            progresoTotal += 100; // 100% completo
        } else if (p.verificada) {
            progresoTotal += 66.67; // 66.67% completo
        } else if (p.importada) {
            progresoTotal += 33.33; // 33.33% completo
        }
        // Si no está importada = 0%
    });

    const porcentajeProgreso = totalPantallas > 0 ? Math.round(progresoTotal / totalPantallas) : 0;

    return {
        totalPantallas,
        importadas,
        verificadas,
        pendientes,
        porcentajeImportadas: totalPantallas > 0 ? Math.round((importadas / totalPantallas) * 100) : 0,
        porcentajeVerificadas: totalPantallas > 0 ? Math.round((verificadas / totalPantallas) * 100) : 0,
        porcentajePendientes: totalPantallas > 0 ? Math.round((pendientes / totalPantallas) * 100) : 0,
        segundasRevisiones,
        porcentajeSegundaRevision: totalPantallas > 0 ? Math.round((segundasRevisiones / totalPantallas) * 100) : 0,
        porcentajeProgreso,
    };
}

export function calcularEstadisticasPorPrioridad(pantallas: Pantalla[]): EstadisticasPorPrioridad[] {
    const prioridades: Prioridad[] = ["Crítico", "Alto", "Medio-Alto", "Medio", "Bajo", "Media"];
    const stats: EstadisticasPorPrioridad[] = [];

    for (const prioridad of prioridades) {
        const pantallasPrioridad = pantallas.filter((p) => p.prioridad === prioridad);
        const total = pantallasPrioridad.length;

        if (total > 0) {
            const importadas = pantallasPrioridad.filter((p) => p.importada).length;
            const verificadas = pantallasPrioridad.filter((p) => p.verificada).length;
            const pendientes = pantallasPrioridad.filter((p) => !p.importada).length;

            stats.push({
                prioridad,
                total,
                importadas,
                verificadas,
                pendientes,
                porcentaje: Math.round((total / pantallas.length) * 100),
            });
        }
    }

    return stats;
}

export function getColorPrioridad(prioridad: Prioridad): string {
    const colores: Record<Prioridad, string> = {
        Crítico: "text-red-700 bg-red-50 border-red-500",
        Alto: "text-orange-700 bg-orange-50 border-orange-500",
        "Medio-Alto": "text-yellow-700 bg-yellow-50 border-yellow-500",
        Medio: "text-blue-700 bg-blue-50 border-blue-500",
        Bajo: "text-gray-700 bg-gray-50 border-gray-500",
        Media: "text-gray-700 bg-gray-50 border-gray-500",
    };
    return colores[prioridad] || colores.Medio;
}

export function getColorEstado(estado: string): string {
    if (estado.includes("Completada")) return "bg-green-50 text-green-700 border-green-500";
    if (estado.includes("Verificar")) return "bg-blue-50 text-blue-700 border-blue-500";
    if (estado.includes("Bloqueada")) return "bg-red-50 text-red-700 border-red-500";
    return "bg-gray-50 text-gray-700 border-gray-500";
}

import { Pantalla, Prioridad } from "@/types";
import type { EstadisticasGlobales, EstadisticasPorPrioridad } from "@/types";

export function calcularEstadisticasGlobales(pantallas: Pantalla[]): EstadisticasGlobales {
    const totalPantallas = pantallas.length;
    const importadas = pantallas.filter((p) => p.importada).length;
    const verificadas = pantallas.filter((p) => p.verificada).length;
    const pendientes = pantallas.filter((p) => !p.importada).length;
    const segundasRevisiones = pantallas.filter((p) => p.segundaRevision && p.estado === "✅ Completada").length;
    const revisionesEsteticas = pantallas.filter((p) => p.revisionEstetica).length;
    const revisionesFluidez = pantallas.filter((p) => p.revisionFluidez).length;

    // Cálculo de progreso ponderado: Importada = 50%, Verificada (1ª Rev.) = 30%, Segunda Revisión = 20%
    let progresoTotal = 0;
    pantallas.forEach((p) => {
        if (p.segundaRevision) {
            progresoTotal += 100; // 100% completo (50% + 30% + 20%)
        } else if (p.verificada) {
            progresoTotal += 80; // 80% completo (50% + 30%)
        } else if (p.importada) {
            progresoTotal += 50; // 50% completo
        }
        // Si no está importada = 0%
    });

    const totalPantallasCompletadas = pantallas.filter((p) => p.estado === "✅ Completada").length;
    const porcentajeProgreso =
        totalPantallasCompletadas > 0 ? Math.round(progresoTotal / totalPantallasCompletadas) : 0;

    return {
        totalPantallas,
        importadas,
        verificadas,
        pendientes,
        porcentajeImportadas: totalPantallas > 0 ? Math.round((importadas / totalPantallas) * 100) : 0,
        porcentajeVerificadas: totalPantallas > 0 ? Math.round((verificadas / totalPantallas) * 100) : 0,
        porcentajePendientes: totalPantallas > 0 ? Math.round((pendientes / totalPantallas) * 100) : 0,
        segundasRevisiones,
        porcentajeSegundaRevision:
            totalPantallasCompletadas > 0 ? Math.round((segundasRevisiones / totalPantallasCompletadas) * 100) : 0,
        revisionesEsteticas,
        porcentajeRevisionEstetica: totalPantallas > 0 ? Math.round((revisionesEsteticas / totalPantallas) * 100) : 0,
        revisionesFluidez,
        porcentajeRevisionFluidez: totalPantallas > 0 ? Math.round((revisionesFluidez / totalPantallas) * 100) : 0,
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
    if (estado.includes("estética")) return "bg-purple-50 text-purple-700 border-purple-500";
    if (estado.includes("fluidez")) return "bg-indigo-50 text-indigo-700 border-indigo-500";
    return "bg-gray-50 text-gray-700 border-gray-500";
}

export function getEstadoBorderColor(estado: string): string {
    if (estado.includes("Completada")) return "border-green-500";
    if (estado.includes("Verificar")) return "border-blue-500";
    if (estado.includes("Bloqueada")) return "border-red-500";
    if (estado.includes("estética")) return "border-purple-500";
    if (estado.includes("fluidez")) return "border-indigo-500";
    return "border-gray-300";
}

export function getEstadoIcon(estado: string): string {
    if (estado.includes("Completada")) return "✅";
    if (estado.includes("Verificar")) return "✓";
    if (estado.includes("Bloqueada")) return "🚨";
    if (estado.includes("estética")) return "🎨";
    if (estado.includes("fluidez")) return "⚡";
    return "⏳";
}

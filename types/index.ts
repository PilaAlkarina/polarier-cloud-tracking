export type Prioridad = "Crítico" | "Alto" | "Medio-Alto" | "Medio" | "Bajo" | "Media";

export type Estado =
    | "⏳ Pendiente"
    | "✓ Por Verificar"
    | "✅ Completada"
    | "🚨 Bloqueada"
    | "🎨 Revisión estética"
    | "⚡ Revisión fluidez";

// Estructura original del tracking.json
export interface TrackingItemRaw {
    denominacion: string;
    prioridad: number;
    estado: "PENDIENTE" | "IMPORTADO" | "REVISADO";
    revisionEstetica: boolean;
    revisionFluidez: boolean;
    revisionEsteticaGrupal: boolean;
    revisionFluidezGrupal: boolean;
}

export interface Pantalla {
    id: number;
    nombre: string;
    modulo: string;
    prioridad: Prioridad;
    prioridadNum?: number; // Número de prioridad original (1-130)
    importada: boolean;
    verificada: boolean;
    estado: Estado;
    revisionEstetica: boolean;
    revisionFluidez: boolean;
    revisionEsteticaGrupal: boolean;
    revisionFluidezGrupal: boolean;
}

export interface TareaDiaria {
    dia: number;
    fecha: string;
    nombreDia: string;
    pantallas: string[];
    metaDelDia: number;
    modulos: string[];
}

export interface EstadisticasGlobales {
    totalPantallas: number;
    importadas: number;
    verificadas: number;
    pendientes: number;
    porcentajeImportadas: number;
    porcentajeVerificadas: number;
    porcentajePendientes: number;
    revisionesEsteticas: number;
    porcentajeRevisionEstetica: number;
    revisionesFluidez: number;
    porcentajeRevisionFluidez: number;
    revisionesEsteticasGrupales: number;
    porcentajeRevisionEsteticaGrupal: number;
    revisionesFluidezGrupales: number;
    porcentajeRevisionFluidezGrupal: number;
}

export interface EstadisticasPorPrioridad {
    prioridad: Prioridad;
    total: number;
    importadas: number;
    verificadas: number;
    pendientes: number;
    porcentaje: number;
}

export interface BloqueadorConocido {
    pantalla: string;
    descripcion: string;
    impacto: "Alto" | "Medio" | "Bajo";
}

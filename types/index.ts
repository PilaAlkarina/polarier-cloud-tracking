export type Prioridad = "Crítico" | "Alto" | "Medio-Alto" | "Medio" | "Bajo" | "Media";

export type Estado = "⏳ Pendiente" | "✓ Por Verificar" | "✅ Completada" | "🚨 Bloqueada" | "🎨 Revisión estética" | "⚡ Revisión fluidez";

// Estructura original del tracking.json
export interface TrackingItemRaw {
    denominacion: string;
    consultas: number;
    porcentaje: number;
    prioridad: number;
    estado: "PENDIENTE" | "IMPORTADO" | "REVISADO";
    usuario_prepara: string;
    fechaLimite: string;
    conErrores: boolean;
    enDesarrollo: boolean;
    segundaRevision?: boolean;
    checkIsaac?: boolean;
    checkDavid?: boolean;
    revisor?: string;
    isInClickUP?: boolean;
    revisionEstetica?: boolean;
    revisionFluidez?: boolean;
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
    responsable?: string;
    fechaLimite?: string;
    fechaReal?: string;
    bloqueadores?: string;
    notas?: string;
    consultas?: number;
    porcentaje?: number;
    conErrores?: boolean;
    enDesarrollo?: boolean;
    segundaRevision?: boolean;
    checkIsaac?: boolean;
    checkDavid?: boolean;
    revisor?: string;
    isInClickUP?: boolean;
    revisionEstetica?: boolean;
    revisionFluidez?: boolean;
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
    segundasRevisiones: number;
    porcentajeSegundaRevision: number;
    revisionesEsteticas: number;
    porcentajeRevisionEstetica: number;
    revisionesFluidez: number;
    porcentajeRevisionFluidez: number;
    porcentajeProgreso: number; // Progreso ponderado: importación (50%) + 1ª revisión (30%) + 2ª revisión (20%)
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

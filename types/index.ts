export type Prioridad = "Crítico" | "Alto" | "Medio-Alto" | "Medio" | "Bajo" | "Media";

export type Estado = "⏳ Pendiente" | "✓ Por Verificar" | "✅ Completada" | "🚨 Bloqueada";

// Estructura original del tracking.json
export interface TrackingItemRaw {
    denominacion: string;
    consultas: number;
    porcentaje: number;
    prioridad: number;
    estado: "PENDIENTE" | "IMPORTADO" | "REVISADO";
    usuario_prepara: string;
    fechaLimite: string;
}

export interface Pantalla {
    id: number;
    nombre: string;
    modulo: string;
    prioridad: Prioridad;
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

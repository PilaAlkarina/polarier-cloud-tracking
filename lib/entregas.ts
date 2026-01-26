import { GrupoEntrega, InfoEntrega } from "@/types";

export const ENTREGAS_CONFIG: Record<GrupoEntrega, InfoEntrega> = {
    ADMINISTRACION: {
        grupo: "ADMINISTRACION",
        fecha: "20/12/2025",
        orden: 1,
        earlyAdopters: ["Silverio"],
    },
    RRHH: {
        grupo: "RRHH",
        fecha: "14/01/2026",
        orden: 2,
        earlyAdopters: ["Vanessa"],
    },
    CONTROL_ECONOMICO: {
        grupo: "CONTROL_ECONOMICO",
        fecha: "22/01/2026",
        orden: 3,
        earlyAdopters: ["Laura", "Nerea", "Silverio", "Mateo (Compras)"],
    },
    MANTENIMIENTO: {
        grupo: "MANTENIMIENTO",
        fecha: "26/01/2026",
        orden: 4,
        earlyAdopters: ["Mateo Romaguera"],
    },
    PRODUCCION: {
        grupo: "PRODUCCION",
        fecha: "30/01/2026",
        orden: 5,
        earlyAdopters: ["Pau Oliver", "Zulema"],
    },
};

export const NOMBRES_GRUPOS: Record<GrupoEntrega, string> = {
    ADMINISTRACION: "💱 Administración",
    RRHH: "💼 Recursos Humanos",
    CONTROL_ECONOMICO: "💰 Control Económico y Gestión",
    MANTENIMIENTO: "🔧 Mantenimiento",
    PRODUCCION: "🏭 Producción",
};

// Mapeo de pantallas a grupos de entrega basado en el análisis del plan
export const PANTALLAS_POR_GRUPO: Record<number, GrupoEntrega> = {
    // ENTREGA 1: RECURSOS HUMANOS - 14/01/2026
    10: "RRHH", // Personal general
    25: "RRHH", // Personal (Caribe)
    8: "RRHH", // Cuadrante personal
    6: "RRHH", // Entrada / Salida personal
    11: "RRHH", // Calendario laboral
    23: "RRHH", // Calendario laboral RRHH
    30: "RRHH", // Calendario nóminas
    31: "RRHH", // Gestión de nóminas
    40: "RRHH", // Asientos de nóminas
    29: "RRHH", // Notificaciones
    35: "RRHH", // Solicitudes de alta
    48: "RRHH", // Gestión de finiquitos
    43: "RRHH", // Informe de recursos humanos
    36: "RRHH", // Informe de eventos persona
    101: "CONTROL_ECONOMICO", // Informe cumplimiento horario
    58: "RRHH", // Categorías laborales
    74: "RRHH", // Festivos y cierres
    71: "RRHH", // Turnos
    49: "RRHH", // Gestión de usuarios

    // ENTREGA 2: CONTROL ECONÓMICO Y GESTIÓN - 19/01/2026
    5: "PRODUCCION", // Informe operativo
    107: "CONTROL_ECONOMICO", // Dashboard financiero
    9: "CONTROL_ECONOMICO", // Facturación por cliente
    21: "ADMINISTRACION", // Factura venta
    70: "ADMINISTRACION", // Factura compra
    75: "ADMINISTRACION", // Albarán venta
    54: "ADMINISTRACION", // Albarán compra
    19: "ADMINISTRACION", // Presupuesto venta
    100: "ADMINISTRACION", // Pedido cliente
    27: "ADMINISTRACION", // Pedido proveedor
    109: "ADMINISTRACION", // Validación factura
    52: "CONTROL_ECONOMICO", // Facturación uniformidad
    95: "CONTROL_ECONOMICO", // Control presupuestario
    62: "CONTROL_ECONOMICO", // Cierre de datos
    110: "CONTROL_ECONOMICO", // Datos financieros
    37: "CONTROL_ECONOMICO", // Prev. ingresos y costes
    81: "CONTROL_ECONOMICO", // Prev. Ingresos y costes (Informe)
    78: "CONTROL_ECONOMICO", // Kg. Presupuestados
    106: "CONTROL_ECONOMICO", // Agrupación PEP
    105: "CONTROL_ECONOMICO", // Distribución Kg
    103: "CONTROL_ECONOMICO", // Asignación CeCo
    91: "CONTROL_ECONOMICO", // Distribución CeCo
    88: "CONTROL_ECONOMICO", // Rentabilidad por centro
    99: "CONTROL_ECONOMICO", // Informes costes estructura
    1: "PRODUCCION", // Dashboard operativo
    2: "CONTROL_ECONOMICO", // Pedidos
    4: "CONTROL_ECONOMICO", // Repartos
    3: "CONTROL_ECONOMICO", // Repartos office
    14: "CONTROL_ECONOMICO", // Validar repartos
    85: "MANTENIMIENTO", // Partes de trabajo
    89: "CONTROL_ECONOMICO", // Balance pedidos / repartos
    17: "CONTROL_ECONOMICO", // Comparativa procesados - entregados
    53: "ADMINISTRACION", // Control de envíos
    44: "CONTROL_ECONOMICO", // Rutas de expedición
    96: "CONTROL_ECONOMICO", // Rutas de revisión
    98: "PRODUCCION", // Vehículos
    18: "PRODUCCION", // Smart View
    59: "ADMINISTRACION", // Artículos
    64: "ADMINISTRACION", // Clientes
    92: "ADMINISTRACION", // Proveedores
    42: "CONTROL_ECONOMICO", // Abonos
    38: "CONTROL_ECONOMICO", // Solicitudes de abono
    90: "CONTROL_ECONOMICO", // Revisiones
    97: "CONTROL_ECONOMICO", // Reuniones comerciales
    20: "CONTROL_ECONOMICO", // Estructura organizativa
    86: "PRODUCCION", // Estructura operativa

    // ENTREGA 3: MANTENIMIENTO - 22/01/2026
    26: "MANTENIMIENTO", // Monitor SAT
    60: "MANTENIMIENTO", // Órdenes de trabajo (MBC)
    79: "MANTENIMIENTO", // Gestión de mantenimiento
    55: "MANTENIMIENTO", // Mantenimiento preventivo
    94: "MANTENIMIENTO", // Plantilla mantenimiento prev.
    50: "MANTENIMIENTO", // Maquinaria
    76: "MANTENIMIENTO", // Categorías de máquinas
    41: "MANTENIMIENTO", // Recambios
    47: "MANTENIMIENTO", // Entradas Recambios
    61: "MANTENIMIENTO", // Salidas Recambios
    51: "MANTENIMIENTO", // Traspasos Recambios
    104: "MANTENIMIENTO", // Abonos Recambio
    72: "MANTENIMIENTO", // Almacenes Recambios
    93: "MANTENIMIENTO", // Inventarios Recambios
    87: "MANTENIMIENTO", // Regularizaciones Recambios
    22: "MANTENIMIENTO", // Incidencias

    // ENTREGA 4: PRODUCCIÓN - SIN FECHA
    7: "PRODUCCION", // Producción
    67: "PRODUCCION", // Laundry dashboard
    12: "PRODUCCION", // Control de kilos lavados
    108: "PRODUCCION", // Kg. Lavados
    13: "PRODUCCION", // Lectura de recursos
    68: "PRODUCCION", // Recursos energéticos
    102: "PRODUCCION", // Control de uso
    32: "CONTROL_ECONOMICO", // Estancias
    15: "PRODUCCION", // Consumos de lencería
    24: "PRODUCCION", // Reposiciones general
    28: "PRODUCCION", // Reposiciones office
    16: "MANTENIMIENTO", // Gestión de almacenes
    39: "PRODUCCION", // Inventarios de lencería
    46: "PRODUCCION", // Informe de inventarios
    34: "PRODUCCION", // Config. uniformidad
    45: "PRODUCCION", // Movimientos uniformidad
    63: "PRODUCCION", // Parametrización de prendas
    69: "CONTROL_ECONOMICO", // Definición de prendas
    66: "CONTROL_ECONOMICO", // Lavandería
    84: "PRODUCCION", // Auditorías
    65: "PRODUCCION", // Informe de auditorías
    112: "PRODUCCION", // Config. Auditorias
    80: "PRODUCCION", // No conformidades
    82: "PRODUCCION", // Informe clasificación sucio
    56: "PRODUCCION", // Informe encuestas
    57: "PRODUCCION", // Informe cumplimiento pedidos
    73: "PRODUCCION", // Informe rechazo cliente
    77: "PRODUCCION", // Informe control almacén cliente
    113: "PRODUCCION", // Distribución de recursos TI
};

// Función helper para obtener el grupo de una pantalla por su índice (1-based)
export function getGrupoEntrega(indice: number): GrupoEntrega | undefined {
    return PANTALLAS_POR_GRUPO[indice];
}

// Función helper para obtener info de entrega de una pantalla
export function getInfoEntrega(indice: number): InfoEntrega | undefined {
    const grupo = getGrupoEntrega(indice);
    return grupo ? ENTREGAS_CONFIG[grupo] : undefined;
}

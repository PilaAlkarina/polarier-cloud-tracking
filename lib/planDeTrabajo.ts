/**
 * Plan de Trabajo Diario - MyPolarier Migration
 * Deadline: 20 de Noviembre de 2025
 */

export interface TareaDiaria {
    fecha: string; // Formato: "2025-11-11"
    dia: number; // 1-9
    titulo: string;
    pantallasPorNombre: string[]; // Nombres exactos de las pantallas
}

export const FECHA_INICIO = "2025-11-11"; // Lunes 11 Nov
export const FECHA_DEADLINE = "2025-11-20"; // Miércoles 20 Nov

export const PLAN_DE_TRABAJO: TareaDiaria[] = [
    {
        fecha: "2025-11-11",
        dia: 1,
        titulo: "Crítico - Dashboards",
        pantallasPorNombre: [
            "Dashboard Ejecutivo",
            "Dashboard Mantenimiento",
            "Dashboard EnergyHub",
            "Control de Uso",
            "Ingresos y Costes",
            "Producción Lavadoras",
            "Visor de Rutas",
            "Dashboard Operativo",
            "LaundryDashboard",
            "SmartView",
        ],
    },
    {
        fecha: "2025-11-12",
        dia: 2,
        titulo: "Crítico - Informes Parte 1",
        pantallasPorNombre: [
            "Home de Informes",
            "Informe Operativo (Nueva versión)",
            "Informe Lencería",
            "Informe Auditorías",
            "Informe Inventarios",
            "Informe Gestión Mantenimiento",
            "Informe Producción",
            "Informe Logística",
            "Informe Balance Pedidos/Repartos",
            "Informe Partes de Trabajo",
        ],
    },
    {
        fecha: "2025-11-13",
        dia: 3,
        titulo: "Crítico - Informes Parte 2",
        pantallasPorNombre: [
            "Informe RRHH",
            "Informe Preventivo SAT",
            "Informe Rutas Expedición",
            "Informe Pedidos Huésped",
            "Informe Comparativa Proc/Entreg",
            "Informe Kg Lavados",
            "Informe Operativo",
            "Informe Reposiciones General",
            "Informe Reposiciones Office",
            "Informe Facturación Cliente",
            "Informe Facturación Uniformidad",
        ],
    },
    {
        fecha: "2025-11-14",
        dia: 4,
        titulo: "Alto - RRHH + Producción",
        pantallasPorNombre: [
            "Personal General",
            "Validación Nómina",
            "Jornada Persona",
            "Informe Eventos Persona",
            "Calendario Laboral RRHH",
            "Calendario Lavandería",
            "Personal",
            "Cuadrante Personal",
            "Gestión Nóminas",
            "Calendario Laboral",
            "Festivos y Cierres",
            "Categorías Laborales",
            "Notificaciones",
            "Solicitudes de Alta",
            "Gestión Finiquitos",
        ],
    },
    {
        fecha: "2025-11-15",
        dia: 5,
        titulo: "Alto - Logística + Finanzas",
        pantallasPorNombre: [
            "Partes de Transporte",
            "Solicitud de Abono",
            "Pedidos",
            "Repartos",
            "Repartos Office",
            "Validar Repartos",
            "Abonos",
            "Revisiones",
            "Control Presupuestario V2",
            "Producción",
            "Kg Lavados",
            "Lectura de Recursos",
            "Estancias",
            "Dashboard Financiero",
            "Datos Financieros",
            "Control Presupuestario",
            "Cierre de Datos",
        ],
    },
    {
        fecha: "2025-11-18",
        dia: 6,
        titulo: "Medio-Alto - Control Presupuestario + Admin",
        pantallasPorNombre: [
            "Kg Presupuestados",
            "Agrupación PEP",
            "Distribución Kg",
            "Asignación CeCo",
            "Distribución CeCo",
            "Rentabilidad Centro",
            "Informes Coste Estructura",
            "Pedido Proveedor",
            "Albarán Compra",
            "Factura Compra",
            "Validación Factura",
            "Pedido Cliente",
            "Albarán Venta",
            "Presupuesto Venta",
            "Factura Venta",
        ],
    },
    {
        fecha: "2025-11-19",
        dia: 7,
        titulo: "Verificación Masiva - Parte 1",
        pantallasPorNombre: [
            "Monitor SAT",
            "Órdenes de Trabajo",
            "Maquinaria",
            "Categorías Máquinas",
            "Mantenimiento Preventivo",
            "Plantilla Mantenimiento Preventivo",
            "Gestión Almacenes",
            "Almacenes",
            "Informe Recambios",
            "Grupos de Máquinas",
            "Recambios",
            "Entradas",
            "Traspasos",
            "Salidas",
            "Abonos (Assistant)",
            "Inventarios (Assistant)",
            "Regularizaciones",
            "Auditorías",
            "No Conformidades",
            "Incidencias",
            "Reuniones Comerciales",
            "Config Auditoría",
            "Informe Clasificación Sucio",
            "Informe Cumplimiento Horario",
            "Informe Rechazo Cliente",
            "Informe Cumplimiento Pedidos",
            "Informe Control Almacén Cliente",
            "Informe Encuestas",
        ],
    },
    {
        fecha: "2025-11-20",
        dia: 8,
        titulo: "Verificación Final + Testing",
        pantallasPorNombre: [
            "Inventarios",
            "Movimientos",
            "Prendas Huésped",
            "Repartos Huésped",
            "Config Uniformidad",
            "Movimientos Uniformidad",
            "Pedidos Huésped",
            "Lavandería",
            "Previsión Ingresos/Costes",
            "Recursos Energéticos",
            "Rutas Expedición",
            "Rutas Revisión",
            "Vehículos",
            "Turno",
            "Estructura Operativa",
            "Parametrización Prendas",
            "Estructura Organizativa",
            "Artículos",
            "Clientes",
            "Proveedores",
            "Asientos Nóminas",
            "Solicitudes de Alta (Gestoría)",
            "Gestión Finiquitos (Gestoría)",
            "Usuarios",
            "Mi Cuenta",
            "Informe Control Horas TI",
            "Distribución Recursos TI",
            "Home/Main (Página principal)",
            "Not Found (404)",
            "Login",
            "Redirect",
            "ForgotPassword",
            "RecoveryPassword",
        ],
    },
];

/**
 * Obtiene el plan de trabajo para una fecha específica
 */
export function getPlanParaFecha(fecha: Date): TareaDiaria | null {
    const fechaStr = fecha.toISOString().split("T")[0];
    return PLAN_DE_TRABAJO.find((plan) => plan.fecha === fechaStr) || null;
}

/**
 * Obtiene el número de día del plan (1-9) para una fecha
 */
export function getNumeroDia(fecha: Date): number {
    const fechaStr = fecha.toISOString().split("T")[0];
    const plan = PLAN_DE_TRABAJO.find((p) => p.fecha === fechaStr);
    return plan?.dia || 0;
}

/**
 * Calcula cuántos días quedan hasta el deadline
 */
export function getDiasRestantes(): number {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const deadline = new Date(FECHA_DEADLINE);
    deadline.setHours(0, 0, 0, 0);
    const diff = deadline.getTime() - hoy.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

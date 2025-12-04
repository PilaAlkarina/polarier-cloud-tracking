import { NextResponse } from "next/server";
import type { Pantalla, Prioridad, Estado, TrackingItemRaw } from "@/types";

const GITHUB_API_URL = "https://api.github.com/repos/PilaAlkarina/polarier-cloud-tracking/contents/tracking.json";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main";

export async function GET() {
    try {
        // Leer el archivo tracking.json desde GitHub
        const api = `${GITHUB_API_URL}?ref=${GITHUB_BRANCH}`;
        const response = await fetch(api, {
            headers: { Accept: "application/vnd.github.raw" }, // te devuelve el JSON directo
            cache: "no-store",
        });

        if (!response.ok) {
            throw new Error(`Error al obtener el archivo: ${response.status} ${response.statusText}`);
        }

        const jsonContent = await response.text();
        const trackingData: TrackingItemRaw[] = JSON.parse(jsonContent);
        console.log(trackingData.find((item) => item.denominacion === "Comparativa procesados - entregados"));

        // Transformar la estructura del JSON al formato esperado por la aplicación
        const pantallas = transformTrackingData(trackingData);

        return NextResponse.json({
            success: true,
            data: pantallas,
            timestamp: new Date().toISOString(),
            source: "GitHub - tracking.json",
            totalItems: trackingData.length,
        });
    } catch (error) {
        console.error("Error obteniendo archivo tracking.json desde GitHub:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Error al obtener el archivo de tracking desde GitHub",
            },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        if (!GITHUB_TOKEN) {
            throw new Error("GITHUB_TOKEN no configurado en variables de entorno");
        }

        const { pantallas } = await request.json();

        if (!pantallas || !Array.isArray(pantallas)) {
            return NextResponse.json({ success: false, error: "Datos inválidos" }, { status: 400 });
        }

        // 1. Obtener el SHA actual del archivo
        const getResponse = await fetch(`${GITHUB_API_URL}?ref=${GITHUB_BRANCH}`, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
                Accept: "application/vnd.github.v3+json",
            },
        });

        if (!getResponse.ok) {
            throw new Error(`Error al obtener SHA: ${getResponse.status}`);
        }

        const fileData = await getResponse.json();
        const currentSha = fileData.sha;

        // 2. Transformar Pantalla[] de vuelta a TrackingItemRaw[]
        const trackingData = transformPantallasToRaw(pantallas);

        // 3. Convertir a base64
        const content = Buffer.from(JSON.stringify(trackingData, null, 2)).toString("base64");

        // 4. Actualizar el archivo en GitHub
        const updateResponse = await fetch(GITHUB_API_URL, {
            method: "PUT",
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
                Accept: "application/vnd.github.v3+json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: `📊 Actualizar tracking - ${new Date().toISOString()}`,
                content,
                sha: currentSha,
                branch: GITHUB_BRANCH,
            }),
        });

        if (!updateResponse.ok) {
            const errorData = await updateResponse.json();
            throw new Error(`Error al actualizar: ${JSON.stringify(errorData)}`);
        }

        const result = await updateResponse.json();

        return NextResponse.json({
            success: true,
            message: "Datos guardados exitosamente en GitHub",
            commit: result.commit,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error("❌ Error guardando en GitHub:", error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : "Error desconocido",
            },
            { status: 500 }
        );
    }
}

// Función para transformar los datos del tracking.json al formato de Pantalla[]
function transformTrackingData(trackingData: TrackingItemRaw[]): Pantalla[] {
    return trackingData.map((item, index) => {
        const importada = item.estado === "IMPORTADO" || item.estado === "REVISADO";
        const verificada = item.estado === "REVISADO";

        return {
            id: index + 1,
            nombre: item.denominacion,
            modulo: inferirModulo(item.denominacion),
            prioridad: mapearPrioridad(item.prioridad),
            prioridadNum: item.prioridad,
            importada,
            verificada,
            estado: calcularEstado(importada, verificada),
            responsable: item.usuario_prepara,
            fechaLimite: item.fechaLimite,
            consultas: item.consultas,
            porcentaje: item.porcentaje,
            conErrores: item.conErrores,
            enDesarrollo: item.enDesarrollo,
            segundaRevision: item.segundaRevision || false,
            checkIsaac: item.checkIsaac || false,
            checkDavid: item.checkDavid || false,
            revisor: item.revisor,
            isInClickUP: item.isInClickUP || false,
            revisionEstetica: item.revisionEstetica || false,
            revisionFluidez: item.revisionFluidez || false,
            errorEstetica: item.errorEstetica || false,
            errorFluidez: item.errorFluidez || false,
        };
    });
}

// Función auxiliar para mapear el número de prioridad a categoría
function mapearPrioridad(prioridadNum: number): Prioridad {
    // Las primeras 20 pantallas son críticas/altas
    if (prioridadNum <= 10) return "Crítico";
    if (prioridadNum <= 20) return "Alto";
    if (prioridadNum <= 40) return "Medio-Alto";
    if (prioridadNum <= 80) return "Medio";
    return "Bajo";
}

// Función para inferir el módulo basado en el nombre de la pantalla
function inferirModulo(denominacion: string): string {
    const palabrasClave: Record<string, string> = {
        dashboard: "Dashboard",
        pedido: "Pedidos",
        reparto: "Repartos",
        producción: "Producción",
        personal: "RRHH",
        cuadrante: "RRHH",
        facturación: "Facturación",
        factura: "Facturación",
        calendario: "RRHH",
        entrada: "RRHH",
        salida: "RRHH",
        nómina: "RRHH",
        inventario: "Inventarios",
        almacén: "Inventarios",
        almacenes: "Inventarios",
        stock: "Inventarios",
        validar: "Validación",
        control: "Operaciones",
        informe: "Informes",
        presupuesto: "Finanzas",
        recurso: "Recursos",
        máquina: "Mantenimiento",
        maquinaria: "Mantenimiento",
        mantenimiento: "Mantenimiento",
        preventivo: "Mantenimiento",
        transporte: "Logística",
        logística: "Logística",
        ruta: "Logística",
        vehículo: "Logística",
        cliente: "Clientes",
        proveedor: "Proveedores",
        compra: "Compras",
        venta: "Ventas",
        abono: "Facturación",
        incidencia: "Calidad",
        auditoría: "Calidad",
        "no conformidad": "Calidad",
        uniformidad: "Uniformidad",
        lencería: "Lencería",
        lavandería: "Lavandería",
        "smart view": "Configuración",
        usuario: "Configuración",
        estructura: "Configuración",
    };

    const nombreLower = denominacion.toLowerCase();
    for (const [palabra, modulo] of Object.entries(palabrasClave)) {
        if (nombreLower.includes(palabra)) {
            return modulo;
        }
    }

    return "General";
}

// Función para calcular el estado basado en importada y verificada
function calcularEstado(importada: boolean, verificada: boolean): Estado {
    if (verificada) return "✅ Completada";
    if (importada) return "✓ Por Verificar";
    return "⏳ Pendiente";
}

// Función inversa: transformar Pantalla[] de vuelta a TrackingItemRaw[]
function transformPantallasToRaw(pantallas: Pantalla[]): TrackingItemRaw[] {
    return pantallas.map((pantalla) => {
        let estado: "PENDIENTE" | "IMPORTADO" | "REVISADO" = "PENDIENTE";

        if (pantalla.verificada) {
            estado = "REVISADO";
        } else if (pantalla.importada) {
            estado = "IMPORTADO";
        }

        return {
            denominacion: pantalla.nombre,
            prioridad: pantalla.prioridadNum || 0,
            estado,
            usuario_prepara: pantalla.responsable || "",
            fechaLimite: pantalla.fechaLimite || "",
            consultas: pantalla.consultas || 0,
            porcentaje: pantalla.porcentaje || 0,
            conErrores: pantalla.conErrores || false,
            enDesarrollo: pantalla.enDesarrollo || false,
            segundaRevision: pantalla.segundaRevision || false,
            checkIsaac: pantalla.checkIsaac || false,
            checkDavid: pantalla.checkDavid || false,
            revisor: pantalla.revisor,
            isInClickUP: pantalla.isInClickUP || false,
            revisionEstetica: pantalla.revisionEstetica || false,
            revisionFluidez: pantalla.revisionFluidez || false,
            errorEstetica: pantalla.errorEstetica || false,
            errorFluidez: pantalla.errorFluidez || false,
        };
    });
}

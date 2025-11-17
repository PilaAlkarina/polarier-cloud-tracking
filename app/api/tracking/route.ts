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

        // Obtener también el SHA para detección de conflictos
        const shaResponse = await fetch(`${GITHUB_API_URL}?ref=${GITHUB_BRANCH}`, {
            headers: { Accept: "application/vnd.github.v3+json" },
            cache: "no-store",
        });

        let sha = null;
        if (shaResponse.ok) {
            const shaData = await shaResponse.json();
            sha = shaData.sha;
        }

        const jsonContent = await response.text();
        const trackingData: TrackingItemRaw[] = JSON.parse(jsonContent);
        console.log(trackingData.find((item) => item.denominacion === "Comparativa procesados - entregados"));

        // Transformar la estructura del JSON al formato esperado por la aplicación
        const pantallas = transformTrackingData(trackingData);

        return NextResponse.json({
            success: true,
            data: pantallas,
            sha, // Devolver SHA para detección de conflictos
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

        const { pantallas, originalSha } = await request.json();

        if (!pantallas || !Array.isArray(pantallas)) {
            return NextResponse.json({ success: false, error: "Datos inválidos" }, { status: 400 });
        }

        // 1. Obtener el SHA y datos actuales del archivo
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

        // 2. DETECCIÓN DE CONFLICTOS: Verificar si el archivo cambió desde que el usuario lo cargó
        if (originalSha && originalSha !== currentSha) {
            console.log("⚠️ Conflicto detectado: archivo modificado por otro usuario");

            // Obtener datos actuales de GitHub
            const currentDataResponse = await fetch(`${GITHUB_API_URL}?ref=${GITHUB_BRANCH}`, {
                headers: { Accept: "application/vnd.github.raw" },
                cache: "no-store",
            });

            if (!currentDataResponse.ok) {
                throw new Error("Error al obtener datos actuales para merge");
            }

            const currentJsonContent = await currentDataResponse.text();
            const currentTrackingData: TrackingItemRaw[] = JSON.parse(currentJsonContent);
            const currentPantallas = transformTrackingData(currentTrackingData);

            // MERGE INTELIGENTE: Combinar cambios
            const mergeResult = mergeChanges(pantallas, currentPantallas);

            if (mergeResult.conflicts.length > 0) {
                // Hay conflictos reales (misma tarea modificada por ambos)
                return NextResponse.json(
                    {
                        success: false,
                        error: "conflict",
                        message: "Conflicto: otro usuario modificó las mismas tareas",
                        conflicts: mergeResult.conflicts,
                        currentData: currentPantallas,
                        mergedData: mergeResult.merged,
                    },
                    { status: 409 }
                ); // 409 Conflict
            }

            // Merge exitoso: usar datos combinados
            console.log("✅ Merge automático exitoso");
            const trackingData = transformPantallasToRaw(mergeResult.merged);
            const content = Buffer.from(JSON.stringify(trackingData, null, 2)).toString("base64");

            // Actualizar con datos mergeados
            const updateResponse = await fetch(GITHUB_API_URL, {
                method: "PUT",
                headers: {
                    Authorization: `token ${GITHUB_TOKEN}`,
                    Accept: "application/vnd.github.v3+json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: `📊 Actualizar tracking (merge automático) - ${new Date().toISOString()}`,
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
                message: "Datos guardados con merge automático",
                merged: true,
                commit: result.commit,
                newSha: result.content?.sha || result.commit?.sha, // SHA del archivo actualizado
                timestamp: new Date().toISOString(),
            });
        }

        // 3. No hay conflictos: guardado normal
        const trackingData = transformPantallasToRaw(pantallas);

        // 4. Convertir a base64
        const content = Buffer.from(JSON.stringify(trackingData, null, 2)).toString("base64");

        // 5. Actualizar el archivo en GitHub
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
            newSha: result.content?.sha || result.commit?.sha, // SHA del archivo actualizado
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

// Función para hacer merge inteligente de cambios
function mergeChanges(
    localPantallas: Pantalla[],
    remotePantallas: Pantalla[]
): { merged: Pantalla[]; conflicts: { id: number; denominacion: string }[] } {
    const conflicts: { id: number; denominacion: string }[] = [];
    const merged: Pantalla[] = [];

    // Crear un mapa de pantallas remotas por denominación (identificador único)
    const remoteMap = new Map<string, Pantalla>();
    remotePantallas.forEach((p) => {
        remoteMap.set(p.nombre, p);
    });

    // Crear un mapa de pantallas locales por denominación
    const localMap = new Map<string, Pantalla>();
    localPantallas.forEach((p) => {
        localMap.set(p.nombre, p);
    });

    // Iterar sobre todas las pantallas únicas
    const allNames = new Set([...Array.from(localMap.keys()), ...Array.from(remoteMap.keys())]);

    allNames.forEach((nombre) => {
        const local = localMap.get(nombre);
        const remote = remoteMap.get(nombre);

        if (!local && remote) {
            // Solo existe en remoto (nueva tarea agregada por otro usuario)
            merged.push(remote);
        } else if (local && !remote) {
            // Solo existe en local (nueva tarea agregada por este usuario)
            merged.push(local);
        } else if (local && remote) {
            // Existe en ambos: verificar si hay cambios
            const localChanged = hasChanges(local, remote);

            if (localChanged) {
                // Ambos usuarios modificaron la misma tarea → CONFLICTO
                conflicts.push({ id: local.id, denominacion: nombre });
                // Por ahora, usar la versión local (se puede cambiar la estrategia)
                merged.push(local);
            } else {
                // No hay cambios, usar cualquiera (son iguales)
                merged.push(remote);
            }
        }
    });

    // Ordenar por prioridadNum
    merged.sort((a, b) => (a.prioridadNum || 0) - (b.prioridadNum || 0));

    return { merged, conflicts };
}

// Función para detectar si una pantalla fue modificada
function hasChanges(local: Pantalla, remote: Pantalla): boolean {
    // Comparar campos relevantes (excluir id que puede cambiar)
    return (
        local.estado !== remote.estado ||
        local.importada !== remote.importada ||
        local.verificada !== remote.verificada ||
        local.responsable !== remote.responsable ||
        local.fechaLimite !== remote.fechaLimite ||
        local.conErrores !== remote.conErrores ||
        local.enDesarrollo !== remote.enDesarrollo ||
        local.prioridadNum !== remote.prioridadNum ||
        local.porcentaje !== remote.porcentaje
    );
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
        };
    });
}

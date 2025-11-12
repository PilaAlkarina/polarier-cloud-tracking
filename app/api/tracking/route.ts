import { NextResponse } from "next/server";
import type { Pantalla, Prioridad, Estado, TrackingItemRaw } from "@/types";

export async function GET() {
	try {
		// Leer el archivo tracking.json desde GitHub
		const api = "https://api.github.com/repos/PilaAlkarina/polarier-cloud-tracking/contents/tracking.json?ref=main";
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

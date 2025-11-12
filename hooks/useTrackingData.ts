"use client";

import { useState, useEffect } from "react";
import { Pantalla } from "@/types";

const STORAGE_KEY = "mypolarier_tracking_data";

export function useTrackingData() {
    const [pantallas, setPantallas] = useState<Pantalla[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadData() {
            setIsLoading(true);
            try {
                // Primero intentar cargar desde localStorage
                const storedData = localStorage.getItem(STORAGE_KEY);
                if (storedData) {
                    const parsed = JSON.parse(storedData);
                    // Solo usar localStorage si tiene datos válidos
                    if (parsed && Array.isArray(parsed) && parsed.length > 0) {
                        console.log("📦 Cargando desde localStorage:", parsed.length, "pantallas");
                        setPantallas(parsed);
                        setIsLoading(false);
                        return;
                    } else {
                        console.log("⚠️ localStorage vacío o inválido, cargando desde API...");
                        localStorage.removeItem(STORAGE_KEY);
                    }
                }

                // Si no hay datos en localStorage, cargar desde la API
                console.log("🌐 Cargando desde API...");
                const response = await fetch("/api/tracking");
                if (!response.ok) {
                    throw new Error("Error al cargar los datos");
                }

                const result = await response.json();
                console.log("✅ Respuesta de API:", result);
                if (result.success && result.data) {
                    console.log("📊 Datos recibidos:", result.data.length, "pantallas");
                    setPantallas(result.data);
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(result.data));
                } else {
                    throw new Error(result.error || "Error al procesar los datos");
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "Error desconocido");
                console.error("❌ Error cargando datos:", err);
            } finally {
                setIsLoading(false);
            }
        }

        loadData();
    }, []);

    useEffect(() => {
        // Guardar en localStorage cuando cambian los datos
        if (pantallas.length > 0) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(pantallas));
        }
    }, [pantallas]);

    // Auto-reset cada 5 minutos
    useEffect(() => {
        const interval = setInterval(() => {
            console.log("⏰ Auto-reset programado ejecutándose...");
            resetData();
        }, 5 * 60 * 1000); // 5 minutos en milisegundos

        return () => clearInterval(interval);
    }, []);

    const updatePantalla = (id: number, updates: Partial<Pantalla>) => {
        setPantallas((prev: Pantalla[]) => prev.map((p: Pantalla) => (p.id === id ? { ...p, ...updates } : p)));
    };

    const toggleImportada = (id: number) => {
        setPantallas((prev: Pantalla[]) =>
            prev.map((p: Pantalla) => {
                if (p.id === id) {
                    const newImportada = !p.importada;
                    const newEstado = newImportada ? ("✓ Por Verificar" as const) : ("⏳ Pendiente" as const);
                    return { ...p, importada: newImportada, estado: newEstado };
                }
                return p;
            })
        );
    };

    const toggleVerificada = (id: number) => {
        setPantallas((prev: Pantalla[]) =>
            prev.map((p: Pantalla) => {
                if (p.id === id) {
                    const newVerificada = !p.verificada;
                    const newEstado = newVerificada ? ("✅ Completada" as const) : ("✓ Por Verificar" as const);
                    return { ...p, verificada: newVerificada, estado: newEstado };
                }
                return p;
            })
        );
    };

    const resetData = async () => {
        try {
            // Limpiar localStorage primero
            localStorage.removeItem(STORAGE_KEY);

            // Recargar desde el archivo original
            console.log("🔄 Reseteando datos...");
            const response = await fetch("/api/tracking");
            if (!response.ok) {
                throw new Error("Error al cargar los datos");
            }

            const result = await response.json();
            console.log("✅ Datos reseteados:", result);
            if (result.success && result.data) {
                console.log("📊 Nuevos datos:", result.data.length, "pantallas");
                setPantallas(result.data);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(result.data));
            }
        } catch (err) {
            console.error("❌ Error reseteando datos:", err);
            alert("Error al resetear los datos. Por favor, recarga la página.");
        }
    };

    const exportData = () => {
        const dataStr = JSON.stringify(pantallas, null, 2);
        const dataBlob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `mypolarier_tracking_${new Date().toISOString().split("T")[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    return {
        pantallas,
        isLoading,
        error,
        updatePantalla,
        toggleImportada,
        toggleVerificada,
        resetData,
        exportData,
    };
}

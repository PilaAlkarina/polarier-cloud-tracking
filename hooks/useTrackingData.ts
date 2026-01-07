"use client";

import { useState, useEffect } from "react";
import { Pantalla, Estado } from "@/types";

const STORAGE_KEY = "mypolarier_tracking_data";

function normalizePantallas(input: unknown): Pantalla[] {
    if (!Array.isArray(input)) return [];

    return input
        .filter((p): p is Pantalla => !!p && typeof p === "object")
        .map((p: any) => ({
            ...p,
            revisionEstetica: Boolean(p.revisionEstetica),
            revisionFluidez: Boolean(p.revisionFluidez),
            revisionEsteticaGrupal: Boolean(p.revisionEsteticaGrupal),
            revisionFluidezGrupal: Boolean(p.revisionFluidezGrupal),
        }));
}

export function useTrackingData() {
    const [pantallas, setPantallas] = useState<Pantalla[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [nextResetTime, setNextResetTime] = useState<number>(5 * 60 * 1000); // 5 minutos en ms
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");

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
                        setPantallas(normalizePantallas(parsed));
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
                    const normalized = normalizePantallas(result.data);
                    setPantallas(normalized);
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
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

    // Función base para actualizar cualquier campo de una pantalla
    const updatePantallaField = (id: number, updates: Partial<Pantalla>) => {
        setPantallas((prev: Pantalla[]) => prev.map((p: Pantalla) => (p.id === id ? { ...p, ...updates } : p)));
    };

    // Auto-reset cada 5 minutos
    useEffect(() => {
        const RESET_INTERVAL = 5 * 60 * 1000; // 5 minutos
        let lastResetTime = Date.now();

        // Actualizar el contador cada segundo
        const countdownInterval = setInterval(() => {
            const elapsed = Date.now() - lastResetTime;
            const remaining = RESET_INTERVAL - elapsed;
            setNextResetTime(Math.max(0, remaining));
        }, 1000);

        // Ejecutar el reset cada 5 minutos
        const resetInterval = setInterval(() => {
            console.log("⏰ Auto-reset programado ejecutándose...");
            resetData();
            lastResetTime = Date.now();
            setNextResetTime(RESET_INTERVAL);
        }, RESET_INTERVAL);

        return () => {
            clearInterval(countdownInterval);
            clearInterval(resetInterval);
        };
    }, []);

    const updatePantalla = updatePantallaField;

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
                const normalized = normalizePantallas(result.data);
                setPantallas(normalized);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
            }
        } catch (err) {
            console.error("❌ Error reseteando datos:", err);
            alert("Error al resetear los datos. Por favor, recarga la página.");
        }
    };

    const saveToGitHub = async () => {
        setIsSaving(true);
        setSaveStatus("idle");
        setError(null);

        const maxRetries = 3;
        let attempt = 0;

        while (attempt < maxRetries) {
            try {
                attempt++;
                console.log(
                    `💾 Guardando datos en GitHub... (intento ${attempt}/${maxRetries})`,
                    pantallas.length,
                    "pantallas"
                );

                // 1. Guardar en GitHub
                const response = await fetch("/api/tracking", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ pantallas }),
                });

                const result = await response.json();

                if (!response.ok || !result.success) {
                    throw new Error(result.error || "Error al guardar los datos");
                }

                console.log("✅ Datos guardados, verificando...");

                // 2. Verificar que se guardó correctamente (esperar 2 segundos)
                await new Promise((resolve) => setTimeout(resolve, 2000));

                const verifyResponse = await fetch("/api/tracking", {
                    cache: "no-store",
                    headers: {
                        "Cache-Control": "no-cache, no-store, must-revalidate",
                    },
                });

                const verifyResult = await verifyResponse.json();

                if (!verifyResult.success || !verifyResult.data) {
                    throw new Error("Error al verificar los datos guardados");
                }

                // 3. Comparar que los datos guardados coinciden
                const savedCount = verifyResult.data.length;
                const localCount = pantallas.length;

                if (savedCount !== localCount) {
                    console.warn(`⚠️ Diferencia en cantidad: local=${localCount}, GitHub=${savedCount}`);
                }

                console.log("✅ Verificación exitosa: datos guardados correctamente en GitHub");
                console.log(`📊 Commit: ${result.commit?.sha?.substring(0, 7) || "N/A"}`);

                setSaveStatus("success");
                setIsSaving(false);

                // Limpiar el mensaje de éxito después de 3 segundos
                setTimeout(() => {
                    setSaveStatus("idle");
                }, 3000);

                // Éxito, salir del bucle
                return;
            } catch (err) {
                console.error(`❌ Error en intento ${attempt}:`, err);

                if (attempt >= maxRetries) {
                    // Se agotaron los reintentos
                    const errorMessage = err instanceof Error ? err.message : "Error desconocido al guardar";
                    setError(`Error después de ${maxRetries} intentos: ${errorMessage}`);
                    setSaveStatus("error");
                    setIsSaving(false);

                    // Limpiar el mensaje de error después de 5 segundos
                    setTimeout(() => {
                        setSaveStatus("idle");
                        setError(null);
                    }, 5000);
                } else {
                    // Esperar antes del siguiente intento
                    console.log(`⏳ Esperando 2 segundos antes del siguiente intento...`);
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                }
            }
        }

        setIsSaving(false);
    };

    const deletePantalla = (id: number) => {
        setPantallas((prev: Pantalla[]) => prev.filter((p: Pantalla) => p.id !== id));
    };

    const reorderPantallas = (startIndex: number, endIndex: number) => {
        setPantallas((prev: Pantalla[]) => {
            const result = Array.from(prev);
            const [removed] = result.splice(startIndex, 1);
            result.splice(endIndex, 0, removed);

            // Recalcular prioridades basadas en el nuevo orden
            return result.map((p, index) => ({
                ...p,
                prioridadNum: index + 1,
            }));
        });
    };

    const updateEstado = (id: number, nuevoEstado: Estado) => {
        setPantallas((prev: Pantalla[]) =>
            prev.map((p: Pantalla) => {
                if (p.id === id) {
                    // Actualizar también importada y verificada según el estado
                    const importada = nuevoEstado !== "⏳ Pendiente";
                    const verificada = nuevoEstado === "✅ Completada";
                    return { ...p, estado: nuevoEstado, importada, verificada };
                }
                return p;
            })
        );
    };

    const updateRevisionEstetica = (id: number, revisionEstetica: boolean) => {
        updatePantallaField(id, { revisionEstetica });
    };

    const updateRevisionFluidez = (id: number, revisionFluidez: boolean) => {
        updatePantallaField(id, { revisionFluidez });
    };

    const updateRevisionEsteticaGrupal = (id: number, revisionEsteticaGrupal: boolean) => {
        updatePantallaField(id, { revisionEsteticaGrupal });
    };

    const updateRevisionFluidezGrupal = (id: number, revisionFluidezGrupal: boolean) => {
        updatePantallaField(id, { revisionFluidezGrupal });
    };

    return {
        pantallas,
        isLoading,
        error,
        updatePantalla,
        resetData,
        saveToGitHub,
        deletePantalla,
        reorderPantallas,
        updateEstado,
        updateRevisionEstetica,
        updateRevisionFluidez,
        updateRevisionEsteticaGrupal,
        updateRevisionFluidezGrupal,
        isSaving,
        saveStatus,
        nextResetTime,
    };
}

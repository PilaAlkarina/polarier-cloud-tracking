"use client";

import { useState, useEffect } from "react";
import { Pantalla, Estado } from "@/types";

const STORAGE_KEY = "mypolarier_tracking_data";

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

    const updateFechaLimite = (id: number, nuevaFecha: string) => {
        setPantallas((prev: Pantalla[]) =>
            prev.map((p: Pantalla) => (p.id === id ? { ...p, fechaLimite: nuevaFecha } : p))
        );
    };

    const updateResponsable = (id: number, nuevoResponsable: string) => {
        setPantallas((prev: Pantalla[]) =>
            prev.map((p: Pantalla) => (p.id === id ? { ...p, responsable: nuevoResponsable } : p))
        );
    };

    const updateRevisor = (id: number, nuevoRevisor: string) => {
        setPantallas((prev: Pantalla[]) =>
            prev.map((p: Pantalla) => (p.id === id ? { ...p, revisor: nuevoRevisor } : p))
        );
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

    const updateConErrores = (id: number, conErrores: boolean) => {
        setPantallas((prev: Pantalla[]) => prev.map((p: Pantalla) => (p.id === id ? { ...p, conErrores } : p)));
    };

    const updateEnDesarrollo = (id: number, enDesarrollo: boolean) => {
        setPantallas((prev: Pantalla[]) => prev.map((p: Pantalla) => (p.id === id ? { ...p, enDesarrollo } : p)));
    };

    const updateSegundaRevision = (id: number, segundaRevision: boolean) => {
        setPantallas((prev: Pantalla[]) => prev.map((p: Pantalla) => (p.id === id ? { ...p, segundaRevision } : p)));
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
        saveToGitHub,
        deletePantalla,
        updateFechaLimite,
        updateResponsable,
        updateRevisor,
        reorderPantallas,
        updateEstado,
        updateConErrores,
        updateEnDesarrollo,
        updateSegundaRevision,
        isSaving,
        saveStatus,
        nextResetTime,
    };
}

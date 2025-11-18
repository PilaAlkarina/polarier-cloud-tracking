"use client";

import { useState, useEffect } from "react";
import { Pantalla, Estado } from "@/types";

const STORAGE_KEY = "mypolarier_tracking_data";

export function useTrackingData() {
    const [pantallas, setPantallas] = useState<Pantalla[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error" | "auto-saving">("idle");
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [lastSavedData, setLastSavedData] = useState<string>("");
    const [lastAutoSaveTime, setLastAutoSaveTime] = useState<number>(() => Date.now());
    const [originalSha, setOriginalSha] = useState<string | null>(null);

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
                        setLastSavedData(storedData); // Inicializar con datos de localStorage
                        setLastAutoSaveTime(Date.now()); // Inicializar tiempo

                        // Cargar SHA guardado
                        const savedSha = localStorage.getItem("mypolarier_original_sha");
                        if (savedSha) {
                            setOriginalSha(savedSha);
                            console.log("🔑 SHA recuperado desde localStorage:", savedSha.substring(0, 7));
                        }

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
                    const dataString = JSON.stringify(result.data);
                    localStorage.setItem(STORAGE_KEY, dataString);
                    setLastSavedData(dataString); // Guardar snapshot inicial
                    setLastAutoSaveTime(Date.now()); // Inicializar tiempo de carga

                    // Guardar SHA original para detección de conflictos
                    if (result.sha) {
                        setOriginalSha(result.sha);
                        localStorage.setItem("mypolarier_original_sha", result.sha);
                    }
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

    // Detectar cambios sin guardar
    useEffect(() => {
        if (pantallas.length === 0) return;

        const currentData = JSON.stringify(pantallas);
        const hasChanges = currentData !== lastSavedData;
        setHasUnsavedChanges(hasChanges);

        // Guardar en localStorage inmediatamente (copia local)
        localStorage.setItem(STORAGE_KEY, currentData);
    }, [pantallas, lastSavedData]);

    // Protección contra pérdida de datos al cerrar
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = "Tienes cambios sin guardar. ¿Seguro que quieres salir?";
                return e.returnValue;
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [hasUnsavedChanges]);

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

    // Auto-guardado (sin confirmación del usuario)
    const autoSave = async () => {
        if (isSaving) {
            console.log("⏳ Guardado en progreso, saltando auto-save...");
            return;
        }

        setIsSaving(true);
        setSaveStatus("auto-saving");

        try {
            // NO crear backup en auto-save para evitar saturación
            // Los backups se crean solo en operaciones críticas (reset, guardado manual)
            console.log("💾 Auto-guardando en GitHub...", pantallas.length, "pantallas");

            const response = await fetch("/api/tracking", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    pantallas,
                    originalSha, // Enviar SHA para detección de conflictos
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                if (response.status === 409) {
                    // Conflicto detectado
                    console.error("⚠️ Conflicto: otro usuario modificó las mismas tareas");
                    setSaveStatus("error");
                    setError(`Conflicto: ${result.conflicts?.length || 0} tareas modificadas por otro usuario`);
                    
                    // Mostrar detalles del conflicto
                    const conflictDetails = result.conflicts
                        ?.map((c: { denominacion: string }) => `  • ${c.denominacion}`)
                        .join('\n') || '';
                    
                    // Dar opciones al usuario
                    const userChoice = confirm(
                        `⚠️ CONFLICTO DETECTADO\n\n` +
                        `Otro usuario modificó ${result.conflicts?.length || 0} tareas mientras trabajabas:\n\n` +
                        conflictDetails + `\n\n` +
                        `Opciones:\n` +
                        `• OK: Recargar datos de GitHub (perderás tus cambios locales)\n` +
                        `• Cancelar: Continuar editando (puedes guardar más tarde)\n\n` +
                        `¿Recargar desde GitHub?`
                    );

                    if (userChoice) {
                        // Recargar desde GitHub
                        window.location.reload();
                    } else {
                        // Continuar editando
                        setSaveStatus("idle");
                        setError(null);
                    }
                    return;
                }
                throw new Error(result.error || "Error al auto-guardar");
            }

            console.log("✅ Auto-guardado exitoso", result.merged ? "(con merge)" : "");
            const currentData = JSON.stringify(pantallas);
            setLastSavedData(currentData);
            setHasUnsavedChanges(false);
            setLastAutoSaveTime(Date.now());
            setSaveStatus("success");

            // Actualizar SHA después de guardado exitoso
            if (result.newSha) {
                setOriginalSha(result.newSha);
                localStorage.setItem("mypolarier_original_sha", result.newSha);
            }

            // Limpiar estado después de 3 segundos
            setTimeout(() => {
                setSaveStatus("idle");
            }, 3000);
        } catch (err) {
            console.error("❌ Error en auto-guardado:", err);
            // En auto-guardado, no mostramos error al usuario, solo lo registramos
            setSaveStatus("idle");
        } finally {
            setIsSaving(false);
        }
    };

    // Auto-guardado inteligente cada 30 segundos si hay cambios
    useEffect(() => {
        const AUTO_SAVE_INTERVAL = 30000; // 30 segundos

        const autoSaveTimer = setInterval(() => {
            if (hasUnsavedChanges && !isSaving) {
                console.log("💾 Auto-guardado activado - detectados cambios sin guardar");
                autoSave();
            } else if (!hasUnsavedChanges) {
                console.log("✅ No hay cambios para auto-guardar");
            }
        }, AUTO_SAVE_INTERVAL);

        return () => clearInterval(autoSaveTimer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasUnsavedChanges, isSaving]);

    const resetData = async () => {
        // Advertir si hay cambios sin guardar
        if (hasUnsavedChanges) {
            const confirmar = confirm(
                "⚠️ Tienes cambios sin guardar.\n\n" +
                    "¿Continuar con el reset? Los cambios se perderán."
            );
            if (!confirmar) return;
        }

        try {
            // Limpiar localStorage
            localStorage.removeItem(STORAGE_KEY);

            // Recargar desde el archivo original
            console.log("🔄 Reseteando datos...");
            const response = await fetch("/api/tracking", {
                cache: "no-store",
                headers: {
                    "Cache-Control": "no-cache",
                },
            });
            if (!response.ok) {
                throw new Error("Error al cargar los datos");
            }

            const result = await response.json();
            console.log("✅ Datos reseteados:", result);
            if (result.success && result.data) {
                console.log("📊 Nuevos datos:", result.data.length, "pantallas");
                setPantallas(result.data);
                const dataString = JSON.stringify(result.data);
                localStorage.setItem(STORAGE_KEY, dataString);
                setLastSavedData(dataString);
                setHasUnsavedChanges(false);

                // Actualizar SHA original
                if (result.sha) {
                    setOriginalSha(result.sha);
                    localStorage.setItem("mypolarier_original_sha", result.sha);
                }
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
        let forceSave = false; // Flag para forzar guardado sin verificación de SHA

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
                    body: JSON.stringify({
                        pantallas,
                        originalSha: forceSave ? null : originalSha, // Si forceSave, no enviar SHA
                    }),
                });

                const result = await response.json();

                if (!response.ok) {
                if (response.status === 409) {
                    // Conflicto detectado
                    console.error("⚠️ Conflicto detectado");
                    
                    const conflictList = result.conflicts
                        ?.map((c: { denominacion: string }) => `  • ${c.denominacion}`)
                        .join("\n") || "";
                    
                    const confirmar = confirm(
                        `⚠️ CONFLICTO DETECTADO\n\n` +
                        `Otro usuario modificó ${result.conflicts?.length || 0} tareas mientras trabajabas:\n\n` +
                        conflictList + `\n\n` +
                        `Opciones:\n` +
                        `• OK: Forzar guardado de TUS cambios (sobrescribirá cambios remotos)\n` +
                        `• Cancelar: Ver opciones para recargar\n\n` +
                        `¿Forzar guardado de tus cambios?`
                    );

                    if (!confirmar) {
                        // Usuario cancela forzar guardado
                        const recargar = confirm(
                            `¿Quieres recargar la página para ver los cambios de GitHub?\n\n` +
                            `⚠️ Tus cambios locales se perderán.`
                        );
                        
                        if (recargar) {
                            window.location.reload();
                        } else {
                            // Usuario decide no hacer nada - desbloquear interfaz
                            setSaveStatus("idle");
                            setError("Guardado cancelado por conflicto. Puedes seguir editando.");
                        }
                        setIsSaving(false);
                        return;
                    }

                    // Forzar guardado sin SHA (sobrescribir)
                    console.log("🔄 Forzando guardado (sobrescribir cambios remotos)...");
                    forceSave = true; // Activar flag para forzar
                    continue; // Reintentar sin SHA
                }                    throw new Error(result.error || "Error al guardar los datos");
                }

                console.log("✅ Datos guardados", result.merged ? "(con merge automático)" : "", "verificando...");

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

                // Actualizar estado de guardado
                const currentData = JSON.stringify(pantallas);
                setLastSavedData(currentData);
                setHasUnsavedChanges(false);
                setLastAutoSaveTime(Date.now());
                setSaveStatus("success");
                setIsSaving(false);

                // Actualizar SHA después de guardado exitoso
                if (result.newSha) {
                    setOriginalSha(result.newSha);
                    localStorage.setItem("mypolarier_original_sha", result.newSha);
                }

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
        reorderPantallas,
        updateEstado,
        updateConErrores,
        updateEnDesarrollo,
        isSaving,
        saveStatus,
        hasUnsavedChanges,
        lastAutoSaveTime,
    };
}

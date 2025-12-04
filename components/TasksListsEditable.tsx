"use client";

import { useState } from "react";
import { Pantalla, Estado } from "@/types";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
} from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface TasksListsEditableProps {
    pantallas: Pantalla[];
    onUpdateResponsable: (id: number, responsable: string) => void;
    onDelete: (id: number) => void;
    onReorder: (startIndex: number, endIndex: number) => void;
    onUpdateEstado: (id: number, estado: Estado) => void;
    onUpdateConErrores: (id: number, conErrores: boolean) => void;
    onUpdateEnDesarrollo: (id: number, enDesarrollo: boolean) => void;
    onUpdateUsuarioPrepara?: (id: number, usuario: string) => void;
    onUpdateSegundaRevision: (id: number, check: boolean) => void;
    onUpdateCheckIsaac: (id: number, check: boolean) => void;
    onUpdateIsInClickUP: (id: number, isInClickUP: boolean) => void;
    onUpdateRevisionEstetica: (id: number, check: boolean) => void;
    onUpdateRevisionFluidez: (id: number, check: boolean) => void;
    onUpdateErrorEstetica: (id: number, check: boolean) => void;
    onUpdateErrorFluidez: (id: number, check: boolean) => void;
}

interface TareasPorUsuario {
    [usuario: string]: Pantalla[];
}

interface SortableTaskItemProps {
    pantalla: Pantalla;
    onDelete: (id: number) => void;
    color: string;
    onOpenModal: (pantalla: Pantalla) => void;
}

function SortableTaskItem({ pantalla, onDelete, color, onOpenModal }: SortableTaskItemProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: pantalla.id.toString(),
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const handleDoubleClick = () => {
        onOpenModal(pantalla);
    };

    return (
        <div ref={setNodeRef} style={style} className="group relative">
            <div
                className={`text-xs rounded px-2 py-1 flex items-center justify-between gap-1 ${
                    pantalla.segundaRevision
                        ? "bg-purple-100 border border-purple-300"
                        : pantalla.conErrores
                        ? "bg-red-100 border border-red-300"
                        : pantalla.enDesarrollo
                        ? "bg-amber-100 border border-amber-300"
                        : color.includes("red")
                        ? "bg-red-50"
                        : color.includes("blue")
                        ? "bg-blue-50"
                        : color.includes("green")
                        ? "bg-green-50"
                        : "bg-emerald-50"
                }`}
            >
                {/* Drag handle */}
                <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing shrink-0">
                    <span className="text-gray-400 hover:text-gray-600">⋮⋮</span>
                </div>

                {/* Task info - SIMPLIFICADO: Solo prioridad y nombre */}
                <div
                    className="flex items-center gap-1 truncate flex-1 min-w-0 cursor-pointer"
                    onDoubleClick={handleDoubleClick}
                    title="Doble click para editar estado"
                >
                    {pantalla.prioridadNum && (
                        <span className="text-[10px] font-bold text-gray-500 shrink-0 w-5">
                            #{pantalla.prioridadNum}
                        </span>
                    )}
                    <span className="truncate text-gray-700" title={pantalla.nombre}>
                        {pantalla.nombre}
                    </span>
                </div>

                {/* Delete button */}
                <button
                    onClick={() => {
                        if (confirm(`¿Eliminar tarea "${pantalla.nombre}"?`)) {
                            onDelete(pantalla.id);
                        }
                    }}
                    className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-800 shrink-0 ml-1"
                    title="Eliminar tarea"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}

export default function TasksListsEditable({
    pantallas,
    onUpdateResponsable,
    onDelete,
    onReorder,
    onUpdateEstado,
    onUpdateConErrores,
    onUpdateEnDesarrollo,
    onUpdateUsuarioPrepara,
    onUpdateSegundaRevision,
    onUpdateCheckIsaac,
    onUpdateIsInClickUP,
    onUpdateRevisionEstetica,
    onUpdateRevisionFluidez,
    onUpdateErrorEstetica,
    onUpdateErrorFluidez,
}: TasksListsEditableProps) {
    const [activeId, setActiveId] = useState<string | null>(null);
    const [modalPantalla, setModalPantalla] = useState<Pantalla | null>(null);
    const [modalEstado, setModalEstado] = useState<Estado>("⏳ Pendiente");
    const [modalConErrores, setModalConErrores] = useState(false);
    const [modalEnDesarrollo, setModalEnDesarrollo] = useState(false);
    const [modalUsuarioPrepara, setModalUsuarioPrepara] = useState("");
    const [modalSegundaRevision, setModalSegundaRevision] = useState(false);
    const [modalCheckIsaac, setModalCheckIsaac] = useState(false);
    const [modalIsInClickUP, setModalIsInClickUP] = useState(false);
    const [modalRevisionEstetica, setModalRevisionEstetica] = useState(false);
    const [modalRevisionFluidez, setModalRevisionFluidez] = useState(false);
    const [modalErrorEstetica, setModalErrorEstetica] = useState(false);
    const [modalErrorFluidez, setModalErrorFluidez] = useState(false);

    const openModal = (pantalla: Pantalla) => {
        setModalPantalla(pantalla);
        setModalEstado(pantalla.estado);
        setModalConErrores(pantalla.conErrores || false);
        setModalEnDesarrollo(pantalla.enDesarrollo || false);
        setModalUsuarioPrepara(pantalla.responsable || "");
        setModalSegundaRevision(pantalla.segundaRevision || false);
        setModalCheckIsaac(pantalla.checkIsaac || false);
        setModalIsInClickUP(pantalla.isInClickUP || false);
        setModalRevisionEstetica(pantalla.revisionEstetica || false);
        setModalRevisionFluidez(pantalla.revisionFluidez || false);
        setModalErrorEstetica(pantalla.errorEstetica || false);
        setModalErrorFluidez(pantalla.errorFluidez || false);
    };

    const closeModal = () => {
        setModalPantalla(null);
    };

    const saveModal = () => {
        if (modalPantalla) {
            onUpdateEstado(modalPantalla.id, modalEstado);
            onUpdateConErrores(modalPantalla.id, modalConErrores);
            onUpdateEnDesarrollo(modalPantalla.id, modalEnDesarrollo);
            onUpdateIsInClickUP(modalPantalla.id, modalIsInClickUP);

            // Actualizar checks individuales
            onUpdateCheckIsaac(modalPantalla.id, modalCheckIsaac);
            onUpdateRevisionEstetica(modalPantalla.id, modalRevisionEstetica);
            onUpdateRevisionFluidez(modalPantalla.id, modalRevisionFluidez);
            onUpdateErrorEstetica(modalPantalla.id, modalErrorEstetica);
            onUpdateErrorFluidez(modalPantalla.id, modalErrorFluidez);

            if (onUpdateUsuarioPrepara && modalUsuarioPrepara !== modalPantalla.responsable) {
                onUpdateUsuarioPrepara(modalPantalla.id, modalUsuarioPrepara);
            }
            closeModal();
        }
    };

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    // Calcular porcentajes para lógica condicional
    const totalPantallas = pantallas.length;
    const importadas = pantallas.filter((p) => p.importada).length;
    const verificadas = pantallas.filter((p) => p.verificada).length;
    const porcentajeImportadas = totalPantallas > 0 ? Math.round((importadas / totalPantallas) * 100) : 0;
    const porcentajeVerificadas = totalPantallas > 0 ? Math.round((verificadas / totalPantallas) * 100) : 0;

    // Calcular tareas por categoría
    const tareasAtrasadas: Pantalla[] = [];
    const tareasDeHoy: Pantalla[] = [];
    const tareasFuturas: Pantalla[] = [];
    const tareasCompletadas: Pantalla[] = [];

    // Determinar si estamos en modo "Segunda Revisión"
    const modoSegundaRevision = porcentajeImportadas === 100 && porcentajeVerificadas === 100;

    pantallas.forEach((pantalla) => {
        // En modo Segunda Revisión: completadas = segundaRevision
        // En modo normal: completadas = verificadas
        if (modoSegundaRevision) {
            if (pantalla.segundaRevision) {
                tareasCompletadas.push(pantalla);
            } else if (pantalla.verificada) {
                // Verificadas sin segunda revisión se muestran en contenedor "Segunda Revisión"
            } else if (pantalla.fechaLimite) {
                const fechaLimite = new Date(pantalla.fechaLimite);
                fechaLimite.setHours(0, 0, 0, 0);
                if (fechaLimite < hoy) {
                    tareasAtrasadas.push(pantalla);
                } else if (fechaLimite.getTime() === hoy.getTime()) {
                    tareasDeHoy.push(pantalla);
                } else {
                    tareasFuturas.push(pantalla);
                }
            } else {
                tareasAtrasadas.push(pantalla);
            }
        } else {
            // Modo normal: completadas son las verificadas
            if (pantalla.verificada) {
                tareasCompletadas.push(pantalla);
            } else if (pantalla.fechaLimite) {
                const fechaLimite = new Date(pantalla.fechaLimite);
                fechaLimite.setHours(0, 0, 0, 0);
                if (fechaLimite < hoy) {
                    tareasAtrasadas.push(pantalla);
                } else if (fechaLimite.getTime() === hoy.getTime()) {
                    tareasDeHoy.push(pantalla);
                } else {
                    tareasFuturas.push(pantalla);
                }
            } else {
                tareasAtrasadas.push(pantalla);
            }
        }
    });

    // Agrupar por usuario
    const agruparPorUsuario = (tareas: Pantalla[]): TareasPorUsuario => {
        const agrupadas: TareasPorUsuario = {};
        tareas.forEach((pantalla) => {
            const usuario = pantalla.responsable || "Sin asignar";
            if (!agrupadas[usuario]) {
                agrupadas[usuario] = [];
            }
            agrupadas[usuario].push(pantalla);
        });
        return agrupadas;
    };

    // Orden fijo de usuarios
    const ordenUsuarios = ["ISAAC", "LUCIANO", "CARPIO", "JOAN", "CARRASCOSA", "DAVID", "Sin asignar"];

    const ordenarUsuarios = (usuariosObj: TareasPorUsuario): string[] => {
        const usuariosPresentes = Object.keys(usuariosObj);
        return ordenUsuarios.filter((usuario) => usuariosPresentes.includes(usuario));
    };

    const getColorUsuario = (usuario: string) => {
        const coloresPorUsuario: { [key: string]: string } = {
            ISAAC: "bg-purple-100 border-purple-300 text-purple-700",
            LUCIANO: "bg-blue-100 border-blue-300 text-blue-700",
            CARPIO: "bg-green-100 border-green-300 text-green-700",
            JOAN: "bg-yellow-100 border-yellow-300 text-yellow-700",
            CARRASCOSA: "bg-pink-100 border-pink-300 text-pink-700",
            DAVID: "bg-indigo-100 border-indigo-300 text-indigo-700",
            "Sin asignar": "bg-gray-100 border-gray-300 text-gray-700",
        };
        return coloresPorUsuario[usuario] || "bg-gray-100 border-gray-300 text-gray-700";
    };

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id.toString());
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = pantallas.findIndex((p) => p.id.toString() === active.id);
            const newIndex = pantallas.findIndex((p) => p.id.toString() === over.id);

            if (oldIndex !== -1 && newIndex !== -1) {
                onReorder(oldIndex, newIndex);
            }
        }

        setActiveId(null);
    };

    const handleDragOver = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) return;

        // Si se arrastra sobre una columna de usuario diferente
        const activeId = parseInt(active.id.toString());
        const pantalla = pantallas.find((p) => p.id === activeId);

        if (pantalla && over.id && over.id.toString().startsWith("user-")) {
            const nuevoUsuario = over.id.toString().replace("user-", "");
            if (pantalla.responsable !== nuevoUsuario) {
                onUpdateResponsable(activeId, nuevoUsuario);
            }
        }
    };

    // Nuevas agrupaciones basadas en doble revisión

    // Tareas que están listas para revisión (verificadas) pero no completadas (ambos checks)
    const tareasEnRevision = pantallas.filter((p) => p.verificada && !(p.checkIsaac || p.segundaRevision));

    // Completadas (ambos checks o legacy)
    const tareasRevisadas = pantallas.filter((p) => p.checkIsaac || p.segundaRevision);

    // Columna Isaac: Tareas en revisión que NO tienen checkIsaac.
    const tareasPteRevisionIsaac = tareasEnRevision.filter((p) => !p.checkIsaac);

    // Columnas de Revisión Estética
    const tareasPteRevisionEstetica = pantallas.filter((p) => p.verificada && !p.revisionEstetica);
    const tareasEsteticaRevisada = pantallas.filter((p) => p.revisionEstetica);

    // Columnas de Revisión Fluidez
    const tareasPteRevisionFluidez = pantallas.filter((p) => p.verificada && !p.revisionFluidez);
    const tareasFluidezRevisada = pantallas.filter((p) => p.revisionFluidez);

    // Tareas pendientes de primera revisión (no verificadas)
    const tareasPtePrimeraRevision = pantallas.filter((p) => !p.verificada);

    const ptePrimeraRevisionPorUsuario = agruparPorUsuario(tareasPtePrimeraRevision);

    const usuariosPtePrimeraRevision = ordenarUsuarios(ptePrimeraRevisionPorUsuario);

    return (
        <>
            {/* SECCIONES HORIZONTALES - 6 COLUMNAS */}
            <div className="grid grid-cols-6 gap-4">
                {/* Pte. Revisión - ISAAC */}
                <div className="col-span-1">
                    <div className="bg-white rounded-lg shadow-sm p-3 border-l-4 border-purple-500 h-[600px] overflow-y-auto">
                        <div className="flex items-center justify-between mb-2 sticky top-0 bg-white pb-2 border-b">
                            <h3 className="text-sm font-bold text-purple-700 flex items-center gap-1">
                                📋 Pte. Revisión - ISAAC
                            </h3>
                            <span className="text-xl font-black text-purple-700">{tareasPteRevisionIsaac.length}</span>
                        </div>

                        {tareasPteRevisionIsaac.length === 0 ? (
                            <div className="text-center py-4 text-gray-400">
                                <div className="text-2xl mb-1">🎉</div>
                                <p className="text-xs font-medium">¡Todas revisadas!</p>
                            </div>
                        ) : (
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragStart={handleDragStart}
                                onDragEnd={handleDragEnd}
                                onDragOver={handleDragOver}
                            >
                                <SortableContext
                                    items={tareasPteRevisionIsaac.map((p) => p.id.toString())}
                                    strategy={verticalListSortingStrategy}
                                >
                                    <div className="space-y-0.5">
                                        {tareasPteRevisionIsaac
                                            .sort((a, b) => (a.prioridadNum || 0) - (b.prioridadNum || 0))
                                            .map((pantalla) => (
                                                <SortableTaskItem
                                                    key={pantalla.id}
                                                    pantalla={pantalla}
                                                    onDelete={onDelete}
                                                    color="border-purple-500"
                                                    onOpenModal={openModal}
                                                />
                                            ))}
                                    </div>
                                </SortableContext>

                                <DragOverlay>
                                    {activeId ? (
                                        <div className="bg-blue-100 border border-blue-300 rounded px-2 py-1 shadow-lg">
                                            <span className="text-xs font-medium">
                                                {pantallas.find((p) => p.id.toString() === activeId)?.nombre}
                                            </span>
                                        </div>
                                    ) : null}
                                </DragOverlay>
                            </DndContext>
                        )}
                    </div>
                </div>

                {/* Revisados */}
                <div className="col-span-1">
                    <div className="bg-white rounded-lg shadow-sm p-3 border-l-4 border-green-500 h-[600px] overflow-y-auto">
                        <div className="flex items-center justify-between mb-2 sticky top-0 bg-white pb-2 border-b">
                            <h3 className="text-sm font-bold text-green-700 flex items-center gap-1">✅ Revisados</h3>
                            <span className="text-xl font-black text-green-700">{tareasRevisadas.length}</span>
                        </div>

                        {tareasRevisadas.length === 0 ? (
                            <div className="text-center py-8 text-gray-400">
                                <div className="text-3xl mb-2">📋</div>
                                <p className="text-xs font-medium">Sin revisiones completadas</p>
                            </div>
                        ) : (
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragStart={handleDragStart}
                                onDragEnd={handleDragEnd}
                                onDragOver={handleDragOver}
                            >
                                <SortableContext
                                    items={tareasRevisadas.map((p) => p.id.toString())}
                                    strategy={verticalListSortingStrategy}
                                >
                                    <div className="space-y-0.5">
                                        {tareasRevisadas
                                            .sort((a, b) => (a.prioridadNum || 0) - (b.prioridadNum || 0))
                                            .map((pantalla) => (
                                                <SortableTaskItem
                                                    key={pantalla.id}
                                                    pantalla={pantalla}
                                                    onDelete={onDelete}
                                                    color="border-green-500"
                                                    onOpenModal={openModal}
                                                />
                                            ))}
                                    </div>
                                </SortableContext>

                                <DragOverlay>
                                    {activeId ? (
                                        <div className="bg-blue-100 border border-blue-300 rounded px-2 py-1 shadow-lg">
                                            <span className="text-xs font-medium">
                                                {pantallas.find((p) => p.id.toString() === activeId)?.nombre}
                                            </span>
                                        </div>
                                    ) : null}
                                </DragOverlay>
                            </DndContext>
                        )}
                    </div>
                </div>

                {/* Pte. Revisión Estética */}
                <div className="col-span-1">
                    <div className="bg-white rounded-lg shadow-sm p-3 border-l-4 border-pink-500 h-[600px] overflow-y-auto">
                        <div className="flex items-center justify-between mb-2 sticky top-0 bg-white pb-2 border-b">
                            <h3 className="text-sm font-bold text-pink-700 flex items-center gap-1">
                                🎨 Pte. Revisión Estética
                            </h3>
                            <span className="text-xl font-black text-pink-700">{tareasPteRevisionEstetica.length}</span>
                        </div>

                        {tareasPteRevisionEstetica.length === 0 ? (
                            <div className="text-center py-8 text-gray-400">
                                <div className="text-3xl mb-2">🎉</div>
                                <p className="text-xs font-medium">¡Todas revisadas!</p>
                            </div>
                        ) : (
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragStart={handleDragStart}
                                onDragEnd={handleDragEnd}
                                onDragOver={handleDragOver}
                            >
                                <SortableContext
                                    items={tareasPteRevisionEstetica.map((p) => p.id.toString())}
                                    strategy={verticalListSortingStrategy}
                                >
                                    <div className="space-y-0.5">
                                        {tareasPteRevisionEstetica
                                            .sort((a, b) => (a.prioridadNum || 0) - (b.prioridadNum || 0))
                                            .map((pantalla) => (
                                                <SortableTaskItem
                                                    key={pantalla.id}
                                                    pantalla={pantalla}
                                                    onDelete={onDelete}
                                                    color="border-pink-500"
                                                    onOpenModal={openModal}
                                                />
                                            ))}
                                    </div>
                                </SortableContext>

                                <DragOverlay>
                                    {activeId ? (
                                        <div className="bg-blue-100 border border-blue-300 rounded px-2 py-1 shadow-lg">
                                            <span className="text-xs font-medium">
                                                {pantallas.find((p) => p.id.toString() === activeId)?.nombre}
                                            </span>
                                        </div>
                                    ) : null}
                                </DragOverlay>
                            </DndContext>
                        )}
                    </div>
                </div>

                {/* Estética Revisada */}
                <div className="col-span-1">
                    <div className="bg-white rounded-lg shadow-sm p-3 border-l-4 border-cyan-500 h-[600px] overflow-y-auto">
                        <div className="flex items-center justify-between mb-2 sticky top-0 bg-white pb-2 border-b">
                            <h3 className="text-sm font-bold text-cyan-700 flex items-center gap-1">
                                ✨ Estética Revisada
                            </h3>
                            <span className="text-xl font-black text-cyan-700">{tareasEsteticaRevisada.length}</span>
                        </div>

                        {tareasEsteticaRevisada.length === 0 ? (
                            <div className="text-center py-8 text-gray-400">
                                <div className="text-3xl mb-2">📋</div>
                                <p className="text-xs font-medium">Sin revisiones estéticas completadas</p>
                            </div>
                        ) : (
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragStart={handleDragStart}
                                onDragEnd={handleDragEnd}
                                onDragOver={handleDragOver}
                            >
                                <SortableContext
                                    items={tareasEsteticaRevisada.map((p) => p.id.toString())}
                                    strategy={verticalListSortingStrategy}
                                >
                                    <div className="space-y-0.5">
                                        {tareasEsteticaRevisada
                                            .sort((a, b) => (a.prioridadNum || 0) - (b.prioridadNum || 0))
                                            .map((pantalla) => (
                                                <SortableTaskItem
                                                    key={pantalla.id}
                                                    pantalla={pantalla}
                                                    onDelete={onDelete}
                                                    color="border-cyan-500"
                                                    onOpenModal={openModal}
                                                />
                                            ))}
                                    </div>
                                </SortableContext>

                                <DragOverlay>
                                    {activeId ? (
                                        <div className="bg-blue-100 border border-blue-300 rounded px-2 py-1 shadow-lg">
                                            <span className="text-xs font-medium">
                                                {pantallas.find((p) => p.id.toString() === activeId)?.nombre}
                                            </span>
                                        </div>
                                    ) : null}
                                </DragOverlay>
                            </DndContext>
                        )}
                    </div>
                </div>

                {/* Pte. Revisión Fluidez */}
                <div className="col-span-1">
                    <div className="bg-white rounded-lg shadow-sm p-3 border-l-4 border-indigo-500 h-[600px] overflow-y-auto">
                        <div className="flex items-center justify-between mb-2 sticky top-0 bg-white pb-2 border-b">
                            <h3 className="text-sm font-bold text-indigo-700 flex items-center gap-1">
                                ⚡ Pte. Revisión Fluidez
                            </h3>
                            <span className="text-xl font-black text-indigo-700">
                                {tareasPteRevisionFluidez.length}
                            </span>
                        </div>

                        {tareasPteRevisionFluidez.length === 0 ? (
                            <div className="text-center py-8 text-gray-400">
                                <div className="text-3xl mb-2">🎉</div>
                                <p className="text-xs font-medium">¡Todas revisadas!</p>
                            </div>
                        ) : (
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragStart={handleDragStart}
                                onDragEnd={handleDragEnd}
                                onDragOver={handleDragOver}
                            >
                                <SortableContext
                                    items={tareasPteRevisionFluidez.map((p) => p.id.toString())}
                                    strategy={verticalListSortingStrategy}
                                >
                                    <div className="space-y-0.5">
                                        {tareasPteRevisionFluidez
                                            .sort((a, b) => (a.prioridadNum || 0) - (b.prioridadNum || 0))
                                            .map((pantalla) => (
                                                <SortableTaskItem
                                                    key={pantalla.id}
                                                    pantalla={pantalla}
                                                    onDelete={onDelete}
                                                    color="border-indigo-500"
                                                    onOpenModal={openModal}
                                                />
                                            ))}
                                    </div>
                                </SortableContext>

                                <DragOverlay>
                                    {activeId ? (
                                        <div className="bg-blue-100 border border-blue-300 rounded px-2 py-1 shadow-lg">
                                            <span className="text-xs font-medium">
                                                {pantallas.find((p) => p.id.toString() === activeId)?.nombre}
                                            </span>
                                        </div>
                                    ) : null}
                                </DragOverlay>
                            </DndContext>
                        )}
                    </div>
                </div>

                {/* Fluidez Revisada */}
                <div className="col-span-1">
                    <div className="bg-white rounded-lg shadow-sm p-3 border-l-4 border-teal-500 h-[600px] overflow-y-auto">
                        <div className="flex items-center justify-between mb-2 sticky top-0 bg-white pb-2 border-b">
                            <h3 className="text-sm font-bold text-teal-700 flex items-center gap-1">
                                💨 Fluidez Revisada
                            </h3>
                            <span className="text-xl font-black text-teal-700">{tareasFluidezRevisada.length}</span>
                        </div>

                        {tareasFluidezRevisada.length === 0 ? (
                            <div className="text-center py-8 text-gray-400">
                                <div className="text-3xl mb-2">📋</div>
                                <p className="text-xs font-medium">Sin revisiones de fluidez completadas</p>
                            </div>
                        ) : (
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragStart={handleDragStart}
                                onDragEnd={handleDragEnd}
                                onDragOver={handleDragOver}
                            >
                                <SortableContext
                                    items={tareasFluidezRevisada.map((p) => p.id.toString())}
                                    strategy={verticalListSortingStrategy}
                                >
                                    <div className="space-y-0.5">
                                        {tareasFluidezRevisada
                                            .sort((a, b) => (a.prioridadNum || 0) - (b.prioridadNum || 0))
                                            .map((pantalla) => (
                                                <SortableTaskItem
                                                    key={pantalla.id}
                                                    pantalla={pantalla}
                                                    onDelete={onDelete}
                                                    color="border-teal-500"
                                                    onOpenModal={openModal}
                                                />
                                            ))}
                                    </div>
                                </SortableContext>

                                <DragOverlay>
                                    {activeId ? (
                                        <div className="bg-blue-100 border border-blue-300 rounded px-2 py-1 shadow-lg">
                                            <span className="text-xs font-medium">
                                                {pantallas.find((p) => p.id.toString() === activeId)?.nombre}
                                            </span>
                                        </div>
                                    ) : null}
                                </DragOverlay>
                            </DndContext>
                        )}
                    </div>
                </div>
            </div>

            {/* Pte. Primera Revisión - Contenedor completo debajo */}
            <div className="mt-4">
                <div className="bg-white rounded-lg shadow-sm p-3 border-l-4 border-blue-500 h-[400px] overflow-y-auto">
                    <div className="flex items-center justify-between mb-2 sticky top-0 bg-white pb-2 border-b">
                        <h3 className="text-sm font-bold text-blue-700 flex items-center gap-1">
                            🔄 Pendiente Primera Revisión
                        </h3>
                        <span className="text-xl font-black text-blue-700">{tareasPtePrimeraRevision.length}</span>
                    </div>

                    {tareasPtePrimeraRevision.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">
                            <div className="text-3xl mb-2">✅</div>
                            <p className="text-xs font-medium">¡Todas con primera revisión!</p>
                        </div>
                    ) : (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                            onDragOver={handleDragOver}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2">
                                {usuariosPtePrimeraRevision.map((usuario) => {
                                    const tareasUsuario = ptePrimeraRevisionPorUsuario[usuario];
                                    const itemIds = tareasUsuario.map((p) => p.id.toString());

                                    return (
                                        <div key={usuario} className="space-y-1">
                                            {/* Header del usuario */}
                                            <div
                                                id={`user-${usuario}`}
                                                className={`flex items-center justify-between px-2 py-1 rounded border ${getColorUsuario(
                                                    usuario
                                                )}`}
                                            >
                                                <span className="text-xs font-bold truncate">{usuario}</span>
                                                <span className="text-sm font-black ml-2">{tareasUsuario.length}</span>
                                            </div>

                                            {/* Tareas */}
                                            <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
                                                <div className="space-y-0.5">
                                                    {tareasUsuario
                                                        .sort((a, b) => (a.prioridadNum || 0) - (b.prioridadNum || 0))
                                                        .map((pantalla) => (
                                                            <SortableTaskItem
                                                                key={pantalla.id}
                                                                pantalla={pantalla}
                                                                onDelete={onDelete}
                                                                color="border-blue-500"
                                                                onOpenModal={openModal}
                                                            />
                                                        ))}
                                                </div>
                                            </SortableContext>
                                        </div>
                                    );
                                })}
                            </div>

                            <DragOverlay>
                                {activeId ? (
                                    <div className="bg-blue-100 border border-blue-300 rounded px-2 py-1 shadow-lg">
                                        <span className="text-xs font-medium">
                                            {pantallas.find((p) => p.id.toString() === activeId)?.nombre}
                                        </span>
                                    </div>
                                ) : null}
                            </DragOverlay>
                        </DndContext>
                    )}
                </div>
            </div>

            {/* Modal de edición */}
            {modalPantalla && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    onClick={closeModal}
                >
                    <div
                        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Editar Tarea</h2>

                        <div className="mb-4">
                            <p className="text-sm font-medium text-gray-600 mb-2">Tarea:</p>
                            <p className="text-base text-gray-800">{modalPantalla.nombre}</p>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                            <select
                                value={modalEstado}
                                onChange={(e) => setModalEstado(e.target.value as Estado)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="⏳ Pendiente">⏳ Pendiente</option>
                                <option value="✓ Por Verificar">✓ Por Verificar</option>
                                <option value="✅ Completada">✅ Completada</option>
                                <option value="🚨 Bloqueada">🚨 Bloqueada</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Usuario que Prepara</label>
                            <select
                                value={modalUsuarioPrepara}
                                onChange={(e) => setModalUsuarioPrepara(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Sin asignar</option>
                                <option value="ISAAC">ISAAC</option>
                                <option value="LUCIANO">LUCIANO</option>
                                <option value="CARPIO">CARPIO</option>
                                <option value="JOAN">JOAN</option>
                                <option value="CARRASCOSA">CARRASCOSA</option>
                                <option value="DAVID">DAVID</option>
                            </select>
                        </div>

                        <div className="mb-4 space-y-3">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={modalConErrores}
                                    onChange={(e) => setModalConErrores(e.target.checked)}
                                    className="w-5 h-5 rounded border-gray-300 text-red-600 focus:ring-red-500"
                                />
                                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <span className="text-lg">⚠️</span>
                                    Con Errores
                                </span>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={modalEnDesarrollo}
                                    onChange={(e) => setModalEnDesarrollo(e.target.checked)}
                                    className="w-5 h-5 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                                />
                                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <span className="text-lg">🚧</span>
                                    En Desarrollo
                                </span>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={modalIsInClickUP}
                                    onChange={(e) => setModalIsInClickUP(e.target.checked)}
                                    className="w-5 h-5 rounded border-gray-300 text-[#7B68EE] focus:ring-[#7B68EE]"
                                />
                                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <span className="text-xs bg-[#7B68EE] text-white px-1.5 py-0.5 rounded font-bold">
                                        ClickUp
                                    </span>
                                    Gestionado en ClickUp
                                </span>
                            </label>

                            <div className="border-t pt-3 mt-3">
                                <p className="text-sm font-medium text-gray-700 mb-2">Revisiones Finales</p>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={modalCheckIsaac}
                                            onChange={(e) => setModalCheckIsaac(e.target.checked)}
                                            disabled={!modalPantalla.verificada}
                                            className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        />
                                        <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                            <span className="text-lg">👨‍💻</span>
                                            Revisado por Isaac
                                        </span>
                                    </label>

                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={modalRevisionEstetica}
                                            onChange={(e) => setModalRevisionEstetica(e.target.checked)}
                                            disabled={!modalPantalla.verificada}
                                            className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        />
                                        <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                            <span className="text-lg">🎨</span>
                                            Revisión estética
                                        </span>
                                    </label>

                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={modalRevisionFluidez}
                                            onChange={(e) => setModalRevisionFluidez(e.target.checked)}
                                            disabled={!modalPantalla.verificada}
                                            className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        />
                                        <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                            <span className="text-lg">⚡</span>
                                            Revisión de fluidez
                                        </span>
                                    </label>

                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={modalErrorEstetica}
                                            onChange={(e) => setModalErrorEstetica(e.target.checked)}
                                            disabled={!modalPantalla.verificada}
                                            className="w-5 h-5 rounded border-gray-300 text-red-600 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        />
                                        <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                            <span className="text-lg">❌</span>
                                            Error estética
                                        </span>
                                    </label>

                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={modalErrorFluidez}
                                            onChange={(e) => setModalErrorFluidez(e.target.checked)}
                                            disabled={!modalPantalla.verificada}
                                            className="w-5 h-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        />
                                        <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                            <span className="text-lg">⚠️</span>
                                            Error fluidez
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={closeModal}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={saveModal}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                            >
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

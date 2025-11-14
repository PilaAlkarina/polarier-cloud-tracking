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
    onUpdateFecha: (id: number, fecha: string) => void;
    onUpdateResponsable: (id: number, responsable: string) => void;
    onDelete: (id: number) => void;
    onReorder: (startIndex: number, endIndex: number) => void;
    onUpdateEstado: (id: number, estado: Estado) => void;
    onUpdateConErrores: (id: number, conErrores: boolean) => void;
    onUpdateEnDesarrollo: (id: number, enDesarrollo: boolean) => void;
    onUpdateUsuarioPrepara?: (id: number, usuario: string) => void;
}

interface TareasPorUsuario {
    [usuario: string]: Pantalla[];
}

interface SortableTaskItemProps {
    pantalla: Pantalla;
    onUpdateFecha: (id: number, fecha: string) => void;
    onDelete: (id: number) => void;
    color: string;
    onOpenModal: (pantalla: Pantalla) => void;
}

function SortableTaskItem({ pantalla, onUpdateFecha, onDelete, color, onOpenModal }: SortableTaskItemProps) {
    const [isEditingDate, setIsEditingDate] = useState(false);
    const [tempDate, setTempDate] = useState(pantalla.fechaLimite || "");

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

    const handleDateSave = () => {
        if (tempDate && tempDate !== pantalla.fechaLimite) {
            onUpdateFecha(pantalla.id, tempDate);
        }
        setIsEditingDate(false);
    };

    return (
        <div ref={setNodeRef} style={style} className="group relative">
            <div
                className={`text-xs rounded px-2 py-1 flex items-center justify-between gap-1 ${
                    pantalla.conErrores
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

                {/* Task info */}
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
                    {/* Estado actual */}
                    <span className="shrink-0 text-xs" title={`Estado: ${pantalla.estado}`}>
                        {pantalla.estado === "⏳ Pendiente"
                            ? "⭕"
                            : pantalla.estado === "✓ Por Verificar"
                            ? "🔍"
                            : pantalla.estado === "✅ Completada"
                            ? "✅"
                            : pantalla.estado === "🚨 Bloqueada"
                            ? "🚨"
                            : "⭕"}
                    </span>
                    {pantalla.conErrores && <span className="text-red-600 shrink-0">⚠️</span>}
                    {pantalla.enDesarrollo && <span className="text-amber-600 shrink-0">🚧</span>}
                    <span className="truncate text-gray-700" title={pantalla.nombre}>
                        {pantalla.nombre}
                    </span>
                </div>

                {/* Date editor */}
                {isEditingDate ? (
                    <div className="flex items-center gap-1 shrink-0">
                        <input
                            type="date"
                            value={tempDate}
                            onChange={(e) => setTempDate(e.target.value)}
                            className="text-[10px] px-1 py-0.5 border rounded w-24"
                            autoFocus
                            onBlur={handleDateSave}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleDateSave();
                                if (e.key === "Escape") setIsEditingDate(false);
                            }}
                        />
                    </div>
                ) : (
                    <button
                        onClick={() => {
                            setIsEditingDate(true);
                            setTempDate(pantalla.fechaLimite || new Date().toISOString().split("T")[0]);
                        }}
                        className="text-xs font-semibold shrink-0 hover:underline text-gray-700"
                        title="Click para editar fecha"
                    >
                        {pantalla.fechaLimite
                            ? new Date(pantalla.fechaLimite).toLocaleDateString("es-ES", {
                                  day: "2-digit",
                                  month: "2-digit",
                              })
                            : "Sin fecha"}
                    </button>
                )}

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
    onUpdateFecha,
    onUpdateResponsable,
    onDelete,
    onReorder,
    onUpdateEstado,
    onUpdateConErrores,
    onUpdateEnDesarrollo,
    onUpdateUsuarioPrepara,
}: TasksListsEditableProps) {
    const [activeId, setActiveId] = useState<string | null>(null);
    const [modalPantalla, setModalPantalla] = useState<Pantalla | null>(null);
    const [modalEstado, setModalEstado] = useState<Estado>("⏳ Pendiente");
    const [modalConErrores, setModalConErrores] = useState(false);
    const [modalEnDesarrollo, setModalEnDesarrollo] = useState(false);
    const [modalUsuarioPrepara, setModalUsuarioPrepara] = useState("");

    const openModal = (pantalla: Pantalla) => {
        setModalPantalla(pantalla);
        setModalEstado(pantalla.estado);
        setModalConErrores(pantalla.conErrores || false);
        setModalEnDesarrollo(pantalla.enDesarrollo || false);
        setModalUsuarioPrepara(pantalla.responsable || "");
    };

    const closeModal = () => {
        setModalPantalla(null);
    };

    const saveModal = () => {
        if (modalPantalla) {
            onUpdateEstado(modalPantalla.id, modalEstado);
            onUpdateConErrores(modalPantalla.id, modalConErrores);
            onUpdateEnDesarrollo(modalPantalla.id, modalEnDesarrollo);
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

    // Calcular tareas por categoría
    const tareasAtrasadas: Pantalla[] = [];
    const tareasDeHoy: Pantalla[] = [];
    const tareasFuturas: Pantalla[] = [];
    const tareasCompletadas: Pantalla[] = [];

    pantallas.forEach((pantalla) => {
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

    const atrasadasPorUsuario = agruparPorUsuario(tareasAtrasadas);
    const hoyPorUsuario = agruparPorUsuario(tareasDeHoy);
    const futurasPorUsuario = agruparPorUsuario(tareasFuturas);
    const completadasPorUsuario = agruparPorUsuario(tareasCompletadas);

    // Orden fijo de usuarios
    const ordenUsuarios = ["ISAAC", "LUCIANO", "CARPIO", "JOAN", "CARRASCOSA", "DAVID", "Sin asignar"];

    const ordenarUsuarios = (usuariosObj: TareasPorUsuario): string[] => {
        const usuariosPresentes = Object.keys(usuariosObj);
        return ordenUsuarios.filter((usuario) => usuariosPresentes.includes(usuario));
    };

    const usuariosAtrasadas = ordenarUsuarios(atrasadasPorUsuario);
    const usuariosHoy = ordenarUsuarios(hoyPorUsuario);
    const usuariosFuturas = ordenarUsuarios(futurasPorUsuario);
    const usuariosCompletadas = ordenarUsuarios(completadasPorUsuario);

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

    const renderSection = (
        titulo: string,
        emoji: string,
        tareas: Pantalla[],
        usuariosPorOrden: string[],
        tareasPorUsuario: TareasPorUsuario,
        borderColor: string,
        textColor: string
    ) => (
        <div className={`bg-white rounded-lg shadow-sm p-3 border-l-4 ${borderColor}`}>
            <div className="flex items-center justify-between mb-2">
                <h3 className={`text-sm font-bold ${textColor} flex items-center gap-1`}>
                    {emoji} {titulo}
                </h3>
                <span className={`text-xl font-black ${textColor}`}>{tareas.length}</span>
            </div>

            {tareas.length === 0 ? (
                <div className="text-center py-4 text-gray-400">
                    <div className="text-2xl mb-1">{emoji === "🔥" ? "✅" : "📭"}</div>
                    <p className="text-xs font-medium">{emoji === "🔥" ? "¡Todo al día!" : "Sin tareas"}</p>
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
                        {usuariosPorOrden.map((usuario) => {
                            const tareasUsuario = tareasPorUsuario[usuario];
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
                                            {tareasUsuario.map((pantalla) => (
                                                <SortableTaskItem
                                                    key={pantalla.id}
                                                    pantalla={pantalla}
                                                    onUpdateFecha={onUpdateFecha}
                                                    onDelete={onDelete}
                                                    color={borderColor}
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
    );

    return (
        <>
            <div className="space-y-3">
                {renderSection(
                    "Hoy",
                    "📋",
                    tareasDeHoy,
                    usuariosHoy,
                    hoyPorUsuario,
                    "border-blue-500",
                    "text-blue-700"
                )}
                {renderSection(
                    "Atrasadas",
                    "🔥",
                    tareasAtrasadas,
                    usuariosAtrasadas,
                    atrasadasPorUsuario,
                    "border-red-500",
                    "text-red-700"
                )}
                {renderSection(
                    "Próximas",
                    "📅",
                    tareasFuturas,
                    usuariosFuturas,
                    futurasPorUsuario,
                    "border-green-500",
                    "text-green-700"
                )}
                {renderSection(
                    "Completadas",
                    "✅",
                    tareasCompletadas,
                    usuariosCompletadas,
                    completadasPorUsuario,
                    "border-emerald-500",
                    "text-emerald-700"
                )}
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">Usuario Prepara</label>
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

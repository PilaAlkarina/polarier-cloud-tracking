import { Pantalla } from "@/types";

interface TasksListsProps {
    pantallas: Pantalla[];
}

interface TareasPorUsuario {
    [usuario: string]: Pantalla[];
}

export default function TasksLists({ pantallas }: TasksListsProps) {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    // Calcular tareas atrasadas: fechaLimite < hoy
    const tareasAtrasadas: Pantalla[] = [];
    pantallas.forEach((pantalla) => {
        if (!pantalla.verificada && pantalla.fechaLimite) {
            const fechaLimite = new Date(pantalla.fechaLimite);
            fechaLimite.setHours(0, 0, 0, 0);
            if (fechaLimite < hoy) {
                tareasAtrasadas.push(pantalla);
            }
        }
    });

    // Calcular tareas de hoy: fechaLimite === hoy
    const tareasDeHoy: Pantalla[] = [];
    pantallas.forEach((pantalla) => {
        if (!pantalla.verificada && pantalla.fechaLimite) {
            const fechaLimite = new Date(pantalla.fechaLimite);
            fechaLimite.setHours(0, 0, 0, 0);
            if (fechaLimite.getTime() === hoy.getTime()) {
                tareasDeHoy.push(pantalla);
            }
        }
    });

    // Calcular tareas futuras: fechaLimite > hoy
    const tareasFuturas: Pantalla[] = [];
    pantallas.forEach((pantalla) => {
        if (!pantalla.verificada && pantalla.fechaLimite) {
            const fechaLimite = new Date(pantalla.fechaLimite);
            fechaLimite.setHours(0, 0, 0, 0);
            if (fechaLimite > hoy) {
                tareasFuturas.push(pantalla);
            }
        }
    });

    // Calcular tareas completadas (verificadas)
    const tareasCompletadas: Pantalla[] = [];
    pantallas.forEach((pantalla) => {
        if (pantalla.verificada) {
            tareasCompletadas.push(pantalla);
        }
    });

    // Agrupar tareas atrasadas por usuario
    const atrasadasPorUsuario: TareasPorUsuario = {};
    tareasAtrasadas.forEach((pantalla) => {
        const usuario = pantalla.responsable || "Sin asignar";
        if (!atrasadasPorUsuario[usuario]) {
            atrasadasPorUsuario[usuario] = [];
        }
        atrasadasPorUsuario[usuario].push(pantalla);
    });

    // Ordenar tareas atrasadas por fecha y prioridad
    Object.keys(atrasadasPorUsuario).forEach((usuario) => {
        atrasadasPorUsuario[usuario].sort((a, b) => {
            const fechaA = a.fechaLimite ? new Date(a.fechaLimite).getTime() : Infinity;
            const fechaB = b.fechaLimite ? new Date(b.fechaLimite).getTime() : Infinity;
            if (fechaA !== fechaB) {
                return fechaA - fechaB; // Primero por fecha (más antigua primero)
            }
            // Si las fechas son iguales, ordenar por prioridad
            return (a.prioridadNum || 999) - (b.prioridadNum || 999);
        });
    });

    // Agrupar tareas de hoy por usuario
    const hoyPorUsuario: TareasPorUsuario = {};
    tareasDeHoy.forEach((pantalla) => {
        const usuario = pantalla.responsable || "Sin asignar";
        if (!hoyPorUsuario[usuario]) {
            hoyPorUsuario[usuario] = [];
        }
        hoyPorUsuario[usuario].push(pantalla);
    });

    // Ordenar tareas de hoy por prioridad
    Object.keys(hoyPorUsuario).forEach((usuario) => {
        hoyPorUsuario[usuario].sort((a, b) => {
            return (a.prioridadNum || 999) - (b.prioridadNum || 999);
        });
    });

    // Agrupar tareas futuras por usuario
    const futurasPorUsuario: TareasPorUsuario = {};
    tareasFuturas.forEach((pantalla) => {
        const usuario = pantalla.responsable || "Sin asignar";
        if (!futurasPorUsuario[usuario]) {
            futurasPorUsuario[usuario] = [];
        }
        futurasPorUsuario[usuario].push(pantalla);
    });

    // Ordenar tareas futuras por fecha y prioridad
    Object.keys(futurasPorUsuario).forEach((usuario) => {
        futurasPorUsuario[usuario].sort((a, b) => {
            const fechaA = a.fechaLimite ? new Date(a.fechaLimite).getTime() : Infinity;
            const fechaB = b.fechaLimite ? new Date(b.fechaLimite).getTime() : Infinity;
            if (fechaA !== fechaB) {
                return fechaA - fechaB; // Primero por fecha (más cercana primero)
            }
            // Si las fechas son iguales, ordenar por prioridad
            return (a.prioridadNum || 999) - (b.prioridadNum || 999);
        });
    });

    // Agrupar tareas completadas por usuario
    const completadasPorUsuario: TareasPorUsuario = {};
    tareasCompletadas.forEach((pantalla) => {
        const usuario = pantalla.responsable || "Sin asignar";
        if (!completadasPorUsuario[usuario]) {
            completadasPorUsuario[usuario] = [];
        }
        completadasPorUsuario[usuario].push(pantalla);
    });

    // Ordenar tareas completadas por fecha real y prioridad
    Object.keys(completadasPorUsuario).forEach((usuario) => {
        completadasPorUsuario[usuario].sort((a, b) => {
            const fechaA = a.fechaReal
                ? new Date(a.fechaReal).getTime()
                : a.fechaLimite
                ? new Date(a.fechaLimite).getTime()
                : Infinity;
            const fechaB = b.fechaReal
                ? new Date(b.fechaReal).getTime()
                : b.fechaLimite
                ? new Date(b.fechaLimite).getTime()
                : Infinity;
            if (fechaA !== fechaB) {
                return fechaB - fechaA; // Primero las más recientes
            }
            // Si las fechas son iguales, ordenar por prioridad
            return (a.prioridadNum || 999) - (b.prioridadNum || 999);
        });
    });

    // Ordenar usuarios por cantidad de tareas (descendente)
    const usuariosAtrasadas = Object.keys(atrasadasPorUsuario).sort(
        (a, b) => atrasadasPorUsuario[b].length - atrasadasPorUsuario[a].length
    );
    const usuariosHoy = Object.keys(hoyPorUsuario).sort((a, b) => hoyPorUsuario[b].length - hoyPorUsuario[a].length);
    const usuariosFuturas = Object.keys(futurasPorUsuario).sort(
        (a, b) => futurasPorUsuario[b].length - futurasPorUsuario[a].length
    );
    const usuariosCompletadas = Object.keys(completadasPorUsuario).sort(
        (a, b) => completadasPorUsuario[b].length - completadasPorUsuario[a].length
    );

    // Función para obtener color por usuario
    const getColorUsuario = (index: number) => {
        const colores = [
            "bg-purple-100 border-purple-300 text-purple-700",
            "bg-blue-100 border-blue-300 text-blue-700",
            "bg-green-100 border-green-300 text-green-700",
            "bg-yellow-100 border-yellow-300 text-yellow-700",
            "bg-pink-100 border-pink-300 text-pink-700",
            "bg-indigo-100 border-indigo-300 text-indigo-700",
        ];
        return colores[index % colores.length];
    };

    return (
        <div className="space-y-3">
            {/* Tareas de Hoy */}
            <div className="bg-white rounded-lg shadow-sm p-3 border-l-4 border-blue-500">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-blue-700 flex items-center gap-1">📋 Hoy</h3>
                    <span className="text-xl font-black text-blue-600">{tareasDeHoy.length}</span>
                </div>

                {tareasDeHoy.length === 0 ? (
                    <div className="text-center py-4 text-gray-400">
                        <div className="text-2xl mb-1">🎉</div>
                        <p className="text-xs font-medium">Sin tareas</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2">
                        {usuariosHoy.map((usuario, index) => (
                            <div key={usuario} className="space-y-1">
                                {/* Header del usuario compacto */}
                                <div
                                    className={`flex items-center justify-between px-2 py-1 rounded border ${getColorUsuario(
                                        index
                                    )}`}
                                >
                                    <span className="text-xs font-bold truncate">{usuario}</span>
                                    <span className="text-sm font-black ml-2">{hoyPorUsuario[usuario].length}</span>
                                </div>
                                {/* Todas las tareas */}
                                <div className="space-y-0.5">
                                    {hoyPorUsuario[usuario].map((pantalla) => (
                                        <div
                                            key={pantalla.id}
                                            className={`text-xs rounded px-2 py-0.5 flex items-center justify-between ${
                                                pantalla.conErrores
                                                    ? "bg-red-100 border border-red-300"
                                                    : pantalla.enDesarrollo
                                                    ? "bg-amber-100 border border-amber-300"
                                                    : "bg-blue-50"
                                            }`}
                                        >
                                            <div className="flex items-center gap-1 truncate flex-1">
                                                {pantalla.prioridadNum && (
                                                    <span className="text-[10px] font-bold text-gray-500 shrink-0 w-5">
                                                        #{pantalla.prioridadNum}
                                                    </span>
                                                )}
                                                {pantalla.conErrores && <span className="text-red-600">⚠️</span>}
                                                {pantalla.enDesarrollo && <span className="text-amber-600">🚧</span>}
                                                <span className="truncate text-gray-700">{pantalla.nombre}</span>
                                            </div>
                                            <span
                                                className={`text-xs font-semibold ml-1 shrink-0 ${
                                                    pantalla.importada ? "text-purple-600" : "text-orange-600"
                                                }`}
                                            >
                                                {pantalla.importada ? "Verif." : "Imp."}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {/* Tareas Atrasadas */}
            <div className="bg-white rounded-lg shadow-sm p-3 border-l-4 border-red-500">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-red-700 flex items-center gap-1">🔥 Atrasadas</h3>
                    <span className="text-xl font-black text-red-600">{tareasAtrasadas.length}</span>
                </div>

                {tareasAtrasadas.length === 0 ? (
                    <div className="text-center py-4 text-green-600">
                        <div className="text-2xl mb-1">✅</div>
                        <p className="text-xs font-medium">¡Todo al día!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2">
                        {usuariosAtrasadas.map((usuario, index) => (
                            <div key={usuario} className="space-y-1">
                                {/* Header del usuario compacto */}
                                <div
                                    className={`flex items-center justify-between px-2 py-1 rounded border ${getColorUsuario(
                                        index
                                    )}`}
                                >
                                    <span className="text-xs font-bold truncate">{usuario}</span>
                                    <span className="text-sm font-black ml-2">
                                        {atrasadasPorUsuario[usuario].length}
                                    </span>
                                </div>
                                {/* Todas las tareas */}
                                <div className="space-y-0.5">
                                    {atrasadasPorUsuario[usuario].map((pantalla) => (
                                        <div
                                            key={pantalla.id}
                                            className={`text-xs rounded px-2 py-0.5 flex items-center justify-between ${
                                                pantalla.conErrores
                                                    ? "bg-red-200 border border-red-400"
                                                    : pantalla.enDesarrollo
                                                    ? "bg-amber-100 border border-amber-300"
                                                    : "bg-red-50"
                                            }`}
                                        >
                                            <div className="flex items-center gap-1 truncate flex-1">
                                                {pantalla.prioridadNum && (
                                                    <span className="text-[10px] font-bold text-gray-500 shrink-0 w-5">
                                                        #{pantalla.prioridadNum}
                                                    </span>
                                                )}
                                                {pantalla.conErrores && <span className="text-red-700">⚠️</span>}
                                                {pantalla.enDesarrollo && <span className="text-amber-600">🚧</span>}
                                                {pantalla.segundaRevision && (
                                                    <span
                                                        className="inline-flex items-center justify-center text-purple-600 font-bold"
                                                        title="Segunda revisión completada"
                                                    >
                                                        ✓✓
                                                    </span>
                                                )}
                                                <span className="truncate text-gray-700">{pantalla.nombre}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Tareas Futuras */}
            <div className="bg-white rounded-lg shadow-sm p-3 border-l-4 border-green-500">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-green-700 flex items-center gap-1">📅 Próximas</h3>
                    <span className="text-xl font-black text-green-600">{tareasFuturas.length}</span>
                </div>

                {tareasFuturas.length === 0 ? (
                    <div className="text-center py-4 text-gray-400">
                        <div className="text-2xl mb-1">📭</div>
                        <p className="text-xs font-medium">Sin tareas futuras</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2">
                        {usuariosFuturas.map((usuario, index) => (
                            <div key={usuario} className="space-y-1">
                                {/* Header del usuario compacto */}
                                <div
                                    className={`flex items-center justify-between px-2 py-1 rounded border ${getColorUsuario(
                                        index
                                    )}`}
                                >
                                    <span className="text-xs font-bold truncate">{usuario}</span>
                                    <span className="text-sm font-black ml-2">{futurasPorUsuario[usuario].length}</span>
                                </div>
                                {/* Todas las tareas */}
                                <div className="space-y-0.5">
                                    {futurasPorUsuario[usuario].map((pantalla) => (
                                        <div
                                            key={pantalla.id}
                                            className={`text-xs rounded px-2 py-0.5 flex items-center justify-between ${
                                                pantalla.conErrores
                                                    ? "bg-red-100 border border-red-300"
                                                    : pantalla.enDesarrollo
                                                    ? "bg-amber-100 border border-amber-300"
                                                    : "bg-green-50"
                                            }`}
                                        >
                                            <div className="flex items-center gap-1 truncate flex-1">
                                                {pantalla.prioridadNum && (
                                                    <span className="text-[10px] font-bold text-gray-500 shrink-0 w-5">
                                                        #{pantalla.prioridadNum}
                                                    </span>
                                                )}
                                                {pantalla.conErrores && <span className="text-red-600">⚠️</span>}
                                                {pantalla.enDesarrollo && <span className="text-amber-600">🚧</span>}
                                                {pantalla.segundaRevision && (
                                                    <span
                                                        className="inline-flex items-center justify-center text-purple-600 font-bold"
                                                        title="Segunda revisión completada"
                                                    >
                                                        ✓✓
                                                    </span>
                                                )}
                                                <span className="truncate text-gray-700">{pantalla.nombre}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Tareas Completadas */}
            <div className="bg-white rounded-lg shadow-sm p-3 border-l-4 border-emerald-500">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-emerald-700 flex items-center gap-1">✅ Completadas</h3>
                    <span className="text-xl font-black text-emerald-600">{tareasCompletadas.length}</span>
                </div>

                {tareasCompletadas.length === 0 ? (
                    <div className="text-center py-4 text-gray-400">
                        <div className="text-2xl mb-1">🎯</div>
                        <p className="text-xs font-medium">Sin tareas completadas</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2">
                        {usuariosCompletadas.map((usuario, index) => (
                            <div key={usuario} className="space-y-1">
                                {/* Header del usuario compacto */}
                                <div
                                    className={`flex items-center justify-between px-2 py-1 rounded border ${getColorUsuario(
                                        index
                                    )}`}
                                >
                                    <span className="text-xs font-bold truncate">{usuario}</span>
                                    <span className="text-sm font-black ml-2">
                                        {completadasPorUsuario[usuario].length}
                                    </span>
                                </div>
                                {/* Todas las tareas */}
                                <div className="space-y-0.5">
                                    {completadasPorUsuario[usuario].map((pantalla) => (
                                        <div
                                            key={pantalla.id}
                                            className={`text-xs rounded px-2 py-0.5 flex items-center justify-between ${
                                                pantalla.conErrores
                                                    ? "bg-red-100 border border-red-300"
                                                    : pantalla.enDesarrollo
                                                    ? "bg-amber-100 border border-amber-300"
                                                    : "bg-emerald-50"
                                            }`}
                                        >
                                            <div className="flex items-center gap-1 truncate flex-1">
                                                {pantalla.prioridadNum && (
                                                    <span className="text-[10px] font-bold text-gray-500 shrink-0 w-5">
                                                        #{pantalla.prioridadNum}
                                                    </span>
                                                )}
                                                {pantalla.conErrores && <span className="text-red-600">⚠️</span>}
                                                {pantalla.enDesarrollo && <span className="text-amber-600">🚧</span>}
                                                {pantalla.segundaRevision && (
                                                    <span
                                                        className="inline-flex items-center justify-center text-purple-600 font-bold"
                                                        title="Segunda revisión completada"
                                                    >
                                                        ✓✓
                                                    </span>
                                                )}
                                                <span className="truncate text-gray-700">{pantalla.nombre}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

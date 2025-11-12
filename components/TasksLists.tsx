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

    // Agrupar tareas atrasadas por usuario
    const atrasadasPorUsuario: TareasPorUsuario = {};
    tareasAtrasadas.forEach((pantalla) => {
        const usuario = pantalla.responsable || "Sin asignar";
        if (!atrasadasPorUsuario[usuario]) {
            atrasadasPorUsuario[usuario] = [];
        }
        atrasadasPorUsuario[usuario].push(pantalla);
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

    // Ordenar usuarios por cantidad de tareas (descendente)
    const usuariosAtrasadas = Object.keys(atrasadasPorUsuario).sort(
        (a, b) => atrasadasPorUsuario[b].length - atrasadasPorUsuario[a].length
    );
    const usuariosHoy = Object.keys(hoyPorUsuario).sort((a, b) => hoyPorUsuario[b].length - hoyPorUsuario[a].length);

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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
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
                                            className="text-xs bg-blue-50 rounded px-2 py-0.5 flex items-center justify-between"
                                        >
                                            <span className="truncate flex-1 text-gray-700">{pantalla.nombre}</span>
                                            <span
                                                className={`text-xs font-semibold ml-1 flex-shrink-0 ${
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
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
                                            className="text-xs bg-red-50 rounded px-2 py-0.5 flex items-center justify-between"
                                        >
                                            <span className="truncate flex-1 text-gray-700">{pantalla.nombre}</span>
                                            <span className="text-red-600 font-semibold text-xs ml-1 flex-shrink-0">
                                                {pantalla.fechaLimite
                                                    ? new Date(pantalla.fechaLimite).toLocaleDateString("es-ES", {
                                                          day: "2-digit",
                                                          month: "2-digit",
                                                      })
                                                    : ""}
                                            </span>
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

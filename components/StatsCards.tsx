import { EstadisticasGlobales, Pantalla } from "@/types";

interface StatsCardsProps {
    stats: EstadisticasGlobales;
    pantallas: Pantalla[];
}

export default function StatsCards({ stats, pantallas }: StatsCardsProps) {
    // Calcular tareas con segunda revisión
    const tareasSegundaRevision = pantallas.filter((p) => p.segundaRevision).length;
    // Determinar estado del proyecto
    const getEstadoProyecto = () => {
        if (stats.porcentajeVerificadas >= 80)
            return {
                emoji: "🎉",
                text: "EXCELENTE PROGRESO",
                color: "text-green-700",
                bg: "bg-green-100",
                border: "border-green-300",
            };
        if (stats.porcentajeVerificadas >= 50)
            return {
                emoji: "🚀",
                text: "EN BUEN CAMINO",
                color: "text-blue-700",
                bg: "bg-blue-100",
                border: "border-blue-300",
            };
        return {
            emoji: "⏳",
            text: "EN INICIO",
            color: "text-gray-700",
            bg: "bg-gray-100",
            border: "border-gray-300",
        };
    };

    const estado = getEstadoProyecto();

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            {/* Header con emoji y estado */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">{estado.emoji}</span>
                    <h2 className={`text-sm font-bold ${estado.color}`}>{estado.text}</h2>
                </div>
                <span className={`text-2xl font-black ${estado.color}`}>{stats.porcentajeVerificadas}%</span>
            </div>

            {/* Barra de progreso principal */}
            <div className="mb-3">
                <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                        className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-700"
                        style={{ width: `${stats.porcentajeVerificadas}%` }}
                    />
                </div>
            </div>

            {/* Estadísticas en línea */}
            <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-4">
                    <div>
                        <span className="font-bold text-green-600">{stats.verificadas}</span>
                        <span className="text-gray-500 ml-1">Completadas</span>
                    </div>
                    <div>
                        <span className="font-bold text-blue-600">{stats.importadas - stats.verificadas}</span>
                        <span className="text-gray-500 ml-1">En Verificación</span>
                    </div>
                    <div>
                        <span className="font-bold text-orange-600">{stats.pendientes}</span>
                        <span className="text-gray-500 ml-1">Pendientes</span>
                    </div>
                    <div>
                        <span className="font-bold text-purple-600">{tareasSegundaRevision}</span>
                        <span className="text-gray-500 ml-1">✓✓ 2ª Rev.</span>
                    </div>
                </div>
                <div className="text-gray-400 font-medium">
                    {stats.verificadas} / {stats.totalPantallas}
                </div>
            </div>
        </div>
    );
}

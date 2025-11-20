import { EstadisticasGlobales, Pantalla } from "@/types";

interface StatsCardsProps {
    stats: EstadisticasGlobales;
    pantallas: Pantalla[];
}

export default function StatsCards({ stats, pantallas }: StatsCardsProps) {
    // Calcular tareas con segunda revisión
    const tareasSegundaRevision = pantallas.filter((p) => p.segundaRevision).length;
    // Calcular progreso por niveles

    // Determinar estado del proyecto basado en progreso total
    const getEstadoProyecto = () => {
        if (stats.porcentajeProgreso >= 80)
            return {
                emoji: "🎉",
                text: "EXCELENTE PROGRESO",
                color: "text-green-700",
                bg: "bg-green-100",
                border: "border-green-300",
            };
        if (stats.porcentajeProgreso >= 50)
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

    // Calcular pantallas pendientes de revisión y revisadas
    const pantallasRevisadas = pantallas.filter((p) => p.segundaRevision).length;
    const pantallasPteRevision = pantallas.filter((p) => !p.segundaRevision).length;

    return (
        <div className="flex gap-4">
            {/* Barra de progreso - flex-basis */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4" style={{ flexBasis: "40%" }}>
                {/* Header con emoji y estado */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">{estado.emoji}</span>
                        <h2 className={`text-sm font-bold ${estado.color}`}>{estado.text}</h2>
                    </div>
                    <span className={`text-2xl font-black ${estado.color}`}>{stats.porcentajeProgreso}%</span>
                </div>

                {/* Barra de progreso */}
                <div className="mb-3">
                    <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-blue-500 to-green-500 h-full rounded-full transition-all duration-700"
                            style={{ width: `${stats.porcentajeProgreso}%` }}
                        />
                    </div>
                </div>

                {/* Estadísticas en línea - COMENTADAS */}
                {/* <div className="flex items-center justify-between text-xs">
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
                </div> */}
            </div>

            {/* Tarjeta: Pte. Revisión - flex-1 */}
            <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 p-4 border-l-4 border-l-orange-500">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-orange-700 flex items-center gap-2">📋 Pte. Revisión</h3>
                    <span className="text-3xl font-black text-orange-600">{pantallasPteRevision}</span>
                </div>
                <p className="text-xs text-gray-500">Pantallas sin segunda revisión</p>
            </div>

            {/* Tarjeta: Revisados - flex-1 */}
            <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 p-4 border-l-4 border-l-green-500">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-green-700 flex items-center gap-2">✅ Revisados</h3>
                    <span className="text-3xl font-black text-green-600">{pantallasRevisadas}</span>
                </div>
                <p className="text-xs text-gray-500">Pantallas con segunda revisión completa</p>
            </div>
        </div>
    );
}

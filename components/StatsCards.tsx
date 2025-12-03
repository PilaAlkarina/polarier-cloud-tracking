import { EstadisticasGlobales, Pantalla } from "@/types";

interface StatsCardsProps {
    stats: EstadisticasGlobales;
    pantallas: Pantalla[];
}

export default function StatsCards({ stats, pantallas }: StatsCardsProps) {
    return (
        <div className="flex gap-4">
            {/* Barra de progreso - flex-basis */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex-1">
                {/* Header con emoji y estado */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <span className="text-4xl">📊</span>
                        <h2 className="text-4xl font-bold text-purple-700">Progreso total implementable</h2>
                    </div>
                    <span className="text-5xl font-black text-purple-700">{stats.porcentajeSegundaRevision}%</span>
                </div>

                {/* Barra de progreso */}
                <div className="mb-4">
                    <div className="bg-gray-200 rounded-full h-5 overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-purple-500 to-green-500 h-full rounded-full transition-all duration-700"
                            style={{ width: `${stats.porcentajeSegundaRevision}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

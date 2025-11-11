import { EstadisticasPorPrioridad } from "@/types";

interface PriorityStatsProps {
    stats: EstadisticasPorPrioridad[];
}

const priorityColors: Record<string, { bg: string; border: string; text: string }> = {
    Crítico: { bg: "bg-red-50", border: "border-red-500", text: "text-red-700" },
    Alto: { bg: "bg-orange-50", border: "border-orange-500", text: "text-orange-700" },
    "Medio-Alto": { bg: "bg-yellow-50", border: "border-yellow-500", text: "text-yellow-700" },
    Medio: { bg: "bg-blue-50", border: "border-blue-500", text: "text-blue-700" },
    Bajo: { bg: "bg-gray-50", border: "border-gray-500", text: "text-gray-700" },
    Media: { bg: "bg-blue-50", border: "border-blue-500", text: "text-blue-700" },
};

export default function PriorityStats({ stats }: PriorityStatsProps) {
    return (
        <div className="bg-white rounded-xl shadow-md p-4">
            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">🎯 Por Prioridad</h2>
            <div className="space-y-2">
                {stats.map((stat) => {
                    const colors = priorityColors[stat.prioridad] || priorityColors["Medio"];
                    const completionPercent = stat.total > 0 ? Math.round((stat.verificadas / stat.total) * 100) : 0;
                    return (
                        <div key={stat.prioridad} className={`${colors.bg} rounded-lg p-3 border-l-4 ${colors.border}`}>
                            <div className="flex items-center justify-between mb-2">
                                <span className={`font-bold ${colors.text} text-sm`}>{stat.prioridad}</span>
                                <div className="flex items-center gap-3 text-xs">
                                    <span className="text-green-600 font-bold">✓{stat.verificadas}</span>
                                    <span className="text-blue-600 font-bold">
                                        ⏳{stat.importadas - stat.verificadas}
                                    </span>
                                    <span className="text-orange-600 font-bold">—{stat.pendientes}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                                    <div
                                        className="bg-green-500 h-1.5 rounded-full transition-all duration-500"
                                        style={{ width: `${completionPercent}%` }}
                                    />
                                </div>
                                <span className="text-xs font-bold text-gray-600 w-10 text-right">
                                    {completionPercent}%
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

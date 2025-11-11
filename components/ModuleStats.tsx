import { Pantalla } from "@/types";

interface ModuleStatsProps {
    pantallas: Pantalla[];
}

export default function ModuleStats({ pantallas }: ModuleStatsProps) {
    // Agrupar por módulo
    const moduleGroups = pantallas.reduce((acc, pantalla) => {
        if (!acc[pantalla.modulo]) {
            acc[pantalla.modulo] = [];
        }
        acc[pantalla.modulo].push(pantalla);
        return acc;
    }, {} as Record<string, Pantalla[]>);

    const moduleStats = Object.entries(moduleGroups)
        .map(([modulo, screens]) => ({
            modulo,
            total: screens.length,
            importadas: screens.filter((s) => s.importada).length,
            verificadas: screens.filter((s) => s.verificada).length,
            pendientes: screens.filter((s) => !s.importada).length,
            porcentajeCompletado: Math.round((screens.filter((s) => s.verificada).length / screens.length) * 100),
        }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 8); // Mostrar solo los 8 principales

    return (
        <div className="bg-white rounded-xl shadow-md p-4">
            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">📦 Por Módulo (Top 8)</h2>
            <div className="space-y-2">
                {moduleStats.map((stat) => (
                    <div
                        key={stat.modulo}
                        className="border border-gray-200 rounded-lg p-2 hover:shadow-sm transition-shadow"
                    >
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="font-bold text-gray-900 text-sm truncate flex-1">{stat.modulo}</h3>
                            <div className="flex items-center gap-3 text-xs ml-2">
                                <span className="text-green-600 font-bold">✓{stat.verificadas}</span>
                                <span className="text-blue-600 font-bold">⏳{stat.importadas - stat.verificadas}</span>
                                <span className="text-orange-600 font-bold">—{stat.pendientes}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                                <div
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-1.5 rounded-full transition-all duration-500"
                                    style={{ width: `${stat.porcentajeCompletado}%` }}
                                />
                            </div>
                            <span className="text-xs font-bold text-gray-600 w-10 text-right">
                                {stat.porcentajeCompletado}%
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

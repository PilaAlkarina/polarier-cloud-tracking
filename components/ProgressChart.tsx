import { Pantalla } from "@/types";

interface ProgressChartProps {
    pantallas: Pantalla[];
}

export default function ProgressChart({ pantallas }: ProgressChartProps) {
    const totalPantallas = pantallas.length;
    const segundasRevisiones = pantallas.filter((p) => p.segundaRevision).length;
    const porcentajeSegundaRevision = Math.round((segundasRevisiones / totalPantallas) * 100);

    return (
        <div className="bg-white rounded-xl shadow-md p-4">
            <div className="grid grid-cols-1 gap-3">
                {/* Progreso de Segunda Revisión */}
                <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-purple-900">🔍 Progreso de Segunda Revisión</span>
                        <span className="text-3xl font-black text-purple-700">{porcentajeSegundaRevision}%</span>
                    </div>
                    <div className="bg-purple-200 rounded-full h-3 overflow-hidden">
                        <div
                            className="bg-purple-600 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${porcentajeSegundaRevision}%` }}
                        />
                    </div>
                    <p className="text-sm text-purple-700 font-medium mt-2">
                        {segundasRevisiones}/{totalPantallas} pantallas con segunda revisión completada
                    </p>
                </div>
            </div>
        </div>
    );
}

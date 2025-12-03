import { Pantalla } from "@/types";

interface ProgressChartProps {
    pantallas: Pantalla[];
}

export default function ProgressChart({ pantallas }: ProgressChartProps) {
    const totalPantallas = pantallas.length;
    const segundasRevisiones = pantallas.filter((p) => p.segundaRevision).length;
    const porcentajeSegundaRevision = Math.round((segundasRevisiones / totalPantallas) * 100);

    const revisionesEsteticas = pantallas.filter((p) => p.revisionEstetica).length;
    const porcentajeRevisionEstetica = Math.round((revisionesEsteticas / totalPantallas) * 100);

    const revisionesFluidez = pantallas.filter((p) => p.revisionFluidez).length;
    const porcentajeRevisionFluidez = Math.round((revisionesFluidez / totalPantallas) * 100);

    return (
        <div className="bg-white rounded-xl shadow-md p-2">
            <div className="grid grid-cols-3 gap-3">
                {/* Progreso de Segunda Revisión */}
                <div className="bg-purple-50 rounded-lg p-3 border-l-4 border-purple-500">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-purple-900">Implementado:</span>
                        <span className="text-2xl font-black text-purple-700">{porcentajeSegundaRevision}%</span>
                    </div>
                    <div className="bg-purple-200 rounded-full h-2 overflow-hidden">
                        <div
                            className="bg-purple-600 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${porcentajeSegundaRevision}%` }}
                        />
                    </div>
                    <p className="text-xs text-purple-700 font-medium mt-1">
                        {segundasRevisiones}/{totalPantallas} pantallas con segunda revisión completada
                    </p>
                </div>

                {/* Progreso de Revisión Estética */}
                <div className="bg-purple-50 rounded-lg p-3 border-l-4 border-purple-500">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-purple-900">🎨 Estética:</span>
                        <span className="text-2xl font-black text-purple-700">{porcentajeRevisionEstetica}%</span>
                    </div>
                    <div className="bg-purple-200 rounded-full h-2 overflow-hidden">
                        <div
                            className="bg-purple-600 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${porcentajeRevisionEstetica}%` }}
                        />
                    </div>
                    <p className="text-xs text-purple-700 font-medium mt-1">
                        {revisionesEsteticas}/{totalPantallas} pantallas con revisión estética
                    </p>
                </div>

                {/* Progreso de Revisión Fluidez */}
                <div className="bg-indigo-50 rounded-lg p-3 border-l-4 border-indigo-500">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-indigo-900">⚡ Fluidez:</span>
                        <span className="text-2xl font-black text-indigo-700">{porcentajeRevisionFluidez}%</span>
                    </div>
                    <div className="bg-indigo-200 rounded-full h-2 overflow-hidden">
                        <div
                            className="bg-indigo-600 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${porcentajeRevisionFluidez}%` }}
                        />
                    </div>
                    <p className="text-xs text-indigo-700 font-medium mt-1">
                        {revisionesFluidez}/{totalPantallas} pantallas con revisión de fluidez
                    </p>
                </div>
            </div>
        </div>
    );
}

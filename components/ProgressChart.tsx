import { Pantalla } from "@/types";

interface ProgressChartProps {
    pantallas: Pantalla[];
}

export default function ProgressChart({ pantallas }: ProgressChartProps) {
    const totalPantallas = pantallas.length;
    const importadas = pantallas.filter((p) => p.importada).length;
    const verificadas = pantallas.filter((p) => p.verificada).length;

    // Calcular días restantes
    const hoy = new Date();
    const deadline = new Date("2025-11-20");
    const diasRestantes = Math.ceil((deadline.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));

    // Calcular velocidad necesaria
    const tareasRestantes = totalPantallas - importadas + (importadas - verificadas);
    const velocidadRequerida = diasRestantes > 0 ? Math.ceil(tareasRestantes / diasRestantes) : tareasRestantes;

    const porcentajeImportado = Math.round((importadas / totalPantallas) * 100);
    const porcentajeVerificado = Math.round((verificadas / totalPantallas) * 100);

    return (
        <div className="bg-white rounded-xl shadow-md p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Progreso de Importación */}
                <div className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-500">
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-blue-900">📥 Importación</span>
                        <span className="text-xl font-black text-blue-700">{porcentajeImportado}%</span>
                    </div>
                    <div className="bg-blue-200 rounded-full h-2 overflow-hidden">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${porcentajeImportado}%` }}
                        />
                    </div>
                    <p className="text-xs text-blue-700 font-medium mt-1.5">
                        {importadas}/{totalPantallas} completadas
                    </p>
                </div>

                {/* Progreso de Verificación */}
                <div className="bg-green-50 rounded-lg p-3 border-l-4 border-green-500">
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-green-900">✅ Verificación</span>
                        <span className="text-xl font-black text-green-700">{porcentajeVerificado}%</span>
                    </div>
                    <div className="bg-green-200 rounded-full h-2 overflow-hidden">
                        <div
                            className="bg-green-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${porcentajeVerificado}%` }}
                        />
                    </div>
                    <p className="text-xs text-green-700 font-medium mt-1.5">
                        {verificadas}/{totalPantallas} completadas
                    </p>
                </div>

                {/* Velocidad Requerida */}
                <div
                    className={`rounded-lg p-3 border-l-4 ${
                        velocidadRequerida > 25
                            ? "bg-red-50 border-red-500"
                            : velocidadRequerida > 20
                            ? "bg-orange-50 border-orange-500"
                            : "bg-purple-50 border-purple-500"
                    }`}
                >
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-gray-900">⚡ Velocidad</span>
                        <span
                            className={`text-xl font-black ${
                                velocidadRequerida > 25
                                    ? "text-red-700"
                                    : velocidadRequerida > 20
                                    ? "text-orange-700"
                                    : "text-purple-700"
                            }`}
                        >
                            {velocidadRequerida}
                        </span>
                    </div>
                    <p className="text-xs font-medium text-gray-700">tareas/día requeridas</p>
                    <p className="text-xs text-gray-600 mt-0.5">
                        {diasRestantes} días restantes • {tareasRestantes} tareas
                    </p>
                </div>
            </div>
        </div>
    );
}

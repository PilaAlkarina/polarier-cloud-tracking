import { Pantalla } from "@/types";

interface TaskStatusIndicatorsProps {
    pantalla: Pantalla;
}

export default function TaskStatusIndicators({ pantalla }: TaskStatusIndicatorsProps) {
    const indicators = [];

    // Indicadores de revisión específica
    if (pantalla.revisionEstetica) {
        indicators.push(
            <span
                key="revision-estetica"
                className="inline-flex items-center justify-center w-4 h-4 text-[10px] bg-pink-50 text-pink-600 rounded-full border border-pink-300"
                title="Revisión estética"
            >
                🎨
            </span>
        );
    }

    if (pantalla.revisionFluidez) {
        indicators.push(
            <span
                key="revision-fluidez"
                className="inline-flex items-center justify-center w-4 h-4 text-[10px] bg-indigo-50 text-indigo-600 rounded-full border border-indigo-300"
                title="Revisión fluidez"
            >
                ⚡
            </span>
        );
    }

    // Indicadores de estado base (importada/verificada) - solo si relevante
    if (pantalla.importada && !pantalla.verificada) {
        indicators.push(
            <span
                key="importada"
                className="inline-flex items-center justify-center w-4 h-4 text-[10px] bg-cyan-50 text-cyan-600 rounded-full border border-cyan-300"
                title="Importada (pendiente verificación)"
            >
                ↑
            </span>
        );
    }

    if (pantalla.verificada) {
        indicators.push(
            <span
                key="verificada"
                className="inline-flex items-center justify-center w-4 h-4 text-[10px] bg-green-50 text-green-600 rounded-full border border-green-300"
                title="Verificada"
            >
                ✓
            </span>
        );
    }

    if (indicators.length === 0) {
        return null;
    }

    return <div className="flex items-center gap-0.5">{indicators}</div>;
}

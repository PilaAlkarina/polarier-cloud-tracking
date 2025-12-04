import { Pantalla } from "@/types";

interface TaskStatusIndicatorsProps {
    pantalla: Pantalla;
}

export default function TaskStatusIndicators({ pantalla }: TaskStatusIndicatorsProps) {
    const indicators = [];

    // Indicadores de errores (alta prioridad visual)
    if (pantalla.conErrores) {
        indicators.push(
            <span
                key="errores"
                className="inline-flex items-center justify-center w-4 h-4 text-[10px] bg-red-100 text-red-700 rounded-full"
                title="Con errores"
            >
                ⚠️
            </span>
        );
    }

    if (pantalla.errorEstetica) {
        indicators.push(
            <span
                key="error-estetica"
                className="inline-flex items-center justify-center w-4 h-4 text-[10px] bg-gradient-to-br from-red-100 to-pink-200 text-pink-800 rounded-full border border-pink-300 shadow-sm"
                title="Error estética"
            >
                🎨
            </span>
        );
    }

    if (pantalla.errorFluidez) {
        indicators.push(
            <span
                key="error-fluidez"
                className="inline-flex items-center justify-center w-4 h-4 text-[10px] bg-gradient-to-br from-red-100 to-orange-200 text-orange-800 rounded-full border border-orange-300 shadow-sm"
                title="Error fluidez"
            >
                ⚡
            </span>
        );
    }

    // Indicador de desarrollo
    if (pantalla.enDesarrollo) {
        indicators.push(
            <span
                key="desarrollo"
                className="inline-flex items-center justify-center w-4 h-4 text-[10px] bg-yellow-100 text-yellow-700 rounded-full"
                title="En desarrollo"
            >
                🚧
            </span>
        );
    }

    // Indicadores de revisión (baja prioridad visual)
    if (pantalla.checkIsaac) {
        indicators.push(
            <span
                key="check-isaac"
                className="inline-flex items-center justify-center w-4 h-4 text-[10px] bg-purple-100 text-purple-700 rounded-full"
                title="Revisado por Isaac"
            >
                I
            </span>
        );
    }

    if (pantalla.checkDavid) {
        indicators.push(
            <span
                key="check-david"
                className="inline-flex items-center justify-center w-4 h-4 text-[10px] bg-indigo-100 text-indigo-700 rounded-full"
                title="Revisado por David"
            >
                D
            </span>
        );
    }

    if (pantalla.segundaRevision && !pantalla.checkIsaac && !pantalla.checkDavid) {
        indicators.push(
            <span
                key="segunda-revision"
                className="inline-flex items-center justify-center w-4 h-4 text-[10px] bg-emerald-100 text-emerald-700 rounded-full"
                title="Segunda revisión"
            >
                ✓✓
            </span>
        );
    }

    // Indicadores de revisión específica
    if (pantalla.revisionEstetica && !pantalla.errorEstetica) {
        indicators.push(
            <span
                key="revision-estetica"
                className="inline-flex items-center justify-center w-4 h-4 text-[10px] bg-pink-50 text-pink-600 rounded-full border border-pink-300"
                title="Revisión estética OK"
            >
                🎨
            </span>
        );
    }

    if (pantalla.revisionFluidez && !pantalla.errorFluidez) {
        indicators.push(
            <span
                key="revision-fluidez"
                className="inline-flex items-center justify-center w-4 h-4 text-[10px] bg-indigo-50 text-indigo-600 rounded-full border border-indigo-300"
                title="Revisión fluidez OK"
            >
                ⚡
            </span>
        );
    }

    // Indicador de ClickUp
    if (pantalla.isInClickUP) {
        indicators.push(
            <span
                key="clickup"
                className="inline-flex items-center justify-center w-4 h-4 text-[10px] bg-blue-100 text-blue-700 rounded-full"
                title="Gestionado en ClickUp"
            >
                📋
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

    if (pantalla.verificada && !pantalla.segundaRevision && !pantalla.checkIsaac && !pantalla.checkDavid) {
        indicators.push(
            <span
                key="verificada"
                className="inline-flex items-center justify-center w-4 h-4 text-[10px] bg-green-50 text-green-600 rounded-full border border-green-300"
                title="Verificada (pendiente 2ª revisión)"
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

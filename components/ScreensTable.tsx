"use client";

import { useState } from "react";
import { Pantalla } from "@/types";
import { getColorPrioridad, getColorEstado } from "@/lib/data";

interface ScreensTableProps {
    pantallas: Pantalla[];
    onToggleImportada: (id: number) => void;
    onToggleVerificada: (id: number) => void;
}

export default function ScreensTable({ pantallas, onToggleImportada, onToggleVerificada }: ScreensTableProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterModulo, setFilterModulo] = useState("all");
    const [filterPrioridad, setFilterPrioridad] = useState("all");
    const [filterEstado, setFilterEstado] = useState("all");

    const modulos = Array.from(new Set(pantallas.map((p) => p.modulo))).sort();
    const prioridades = Array.from(new Set(pantallas.map((p) => p.prioridad))).sort();

    const pantallasFiltradas = pantallas.filter((pantalla) => {
        const matchSearch =
            pantalla.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pantalla.modulo.toLowerCase().includes(searchTerm.toLowerCase());
        const matchModulo = filterModulo === "all" || pantalla.modulo === filterModulo;
        const matchPrioridad = filterPrioridad === "all" || pantalla.prioridad === filterPrioridad;
        const matchEstado =
            filterEstado === "all" ||
            (filterEstado === "pendiente" && pantalla.estado.includes("Pendiente")) ||
            (filterEstado === "verificar" && pantalla.estado.includes("Verificar")) ||
            (filterEstado === "completada" && pantalla.estado.includes("Completada"));

        return matchSearch && matchModulo && matchPrioridad && matchEstado;
    });

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                📋 Listado Completo de Pantallas ({pantallasFiltradas.length} / {pantallas.length})
            </h2>

            {/* Filtros */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">🔍 Buscar</label>
                    <input
                        type="text"
                        placeholder="Nombre o módulo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">📦 Módulo</label>
                    <select
                        value={filterModulo}
                        onChange={(e) => setFilterModulo(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">Todos los módulos</option>
                        {modulos.map((modulo) => (
                            <option key={modulo} value={modulo}>
                                {modulo}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">🎯 Prioridad</label>
                    <select
                        value={filterPrioridad}
                        onChange={(e) => setFilterPrioridad(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">Todas las prioridades</option>
                        {prioridades.map((prioridad) => (
                            <option key={prioridad} value={prioridad}>
                                {prioridad}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">📊 Estado</label>
                    <select
                        value={filterEstado}
                        onChange={(e) => setFilterEstado(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">Todos los estados</option>
                        <option value="pendiente">⏳ Pendiente</option>
                        <option value="verificar">✓ Por Verificar</option>
                        <option value="completada">✅ Completada</option>
                    </select>
                </div>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ID
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Pantalla
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Módulo
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Prioridad
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Estado
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Importada
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Verificada
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Errores
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Desarrollo
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Notas
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {pantallasFiltradas.map((pantalla) => (
                            <tr key={pantalla.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-medium">
                                    {pantalla.id}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900 font-medium" title={pantalla.nombre}>
                                    {pantalla.nombre}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{pantalla.modulo}</td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <span
                                        className={`px-2 py-1 text-xs font-semibold rounded-full border ${getColorPrioridad(
                                            pantalla.prioridad
                                        )}`}
                                    >
                                        {pantalla.prioridad}
                                    </span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <span
                                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getColorEstado(
                                            pantalla.estado
                                        )}`}
                                    >
                                        {pantalla.estado}
                                    </span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-center">
                                    <button
                                        onClick={() => onToggleImportada(pantalla.id)}
                                        className="transition-all hover:scale-110"
                                        title={
                                            pantalla.importada ? "Marcar como NO importada" : "Marcar como importada"
                                        }
                                    >
                                        {pantalla.importada ? (
                                            <span className="text-green-600 text-xl cursor-pointer">✅</span>
                                        ) : (
                                            <span className="text-gray-400 text-xl cursor-pointer hover:text-green-500">
                                                ○
                                            </span>
                                        )}
                                    </button>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-center">
                                    <button
                                        onClick={() => onToggleVerificada(pantalla.id)}
                                        className="transition-all hover:scale-110"
                                        title={
                                            pantalla.verificada ? "Marcar como NO verificada" : "Marcar como verificada"
                                        }
                                        disabled={!pantalla.importada}
                                    >
                                        {pantalla.verificada ? (
                                            <span className="text-purple-600 text-xl cursor-pointer">🔍</span>
                                        ) : (
                                            <span
                                                className={`text-xl ${
                                                    pantalla.importada
                                                        ? "text-gray-400 cursor-pointer hover:text-purple-500"
                                                        : "text-gray-300 cursor-not-allowed"
                                                }`}
                                            >
                                                ○
                                            </span>
                                        )}
                                    </button>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-center">
                                    {pantalla.conErrores ? (
                                        <span
                                            className="inline-flex items-center justify-center w-8 h-8 bg-red-100 border-2 border-red-300 rounded-full text-red-600"
                                            title="Con errores"
                                        >
                                            ⚠️
                                        </span>
                                    ) : (
                                        <span className="text-gray-300">—</span>
                                    )}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-center">
                                    {pantalla.enDesarrollo ? (
                                        <span
                                            className="inline-flex items-center justify-center w-8 h-8 bg-amber-100 border-2 border-amber-300 rounded-full text-amber-600"
                                            title="En desarrollo"
                                        >
                                            🚧
                                        </span>
                                    ) : (
                                        <span className="text-gray-300">—</span>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                                    {pantalla.bloqueadores && (
                                        <span className="text-red-600 font-medium">🚨 {pantalla.bloqueadores}</span>
                                    )}
                                    {pantalla.notas && !pantalla.bloqueadores && (
                                        <span className="text-blue-600">{pantalla.notas}</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {pantallasFiltradas.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No se encontraron pantallas con los filtros aplicados</p>
                </div>
            )}
        </div>
    );
}

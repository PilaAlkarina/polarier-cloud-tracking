export default function StatusLegend() {
	return (
		<div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
			<h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
				<span>🎯</span>
				<span>Leyenda de Estados</span>
			</h3>
			<div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
				<div className="flex items-center gap-2">
					<span className="inline-flex items-center justify-center w-6 h-6 bg-red-100 border-2 border-red-300 rounded-full text-red-600">
						⚠️
					</span>
					<span className="text-gray-700 font-medium">Con errores</span>
				</div>
				<div className="flex items-center gap-2">
					<span className="inline-flex items-center justify-center w-6 h-6 bg-amber-100 border-2 border-amber-300 rounded-full text-amber-600">
						🚧
					</span>
					<span className="text-gray-700 font-medium">En desarrollo</span>
				</div>
				<div className="flex items-center gap-2">
					<span className="text-green-600 text-lg">✅</span>
					<span className="text-gray-700 font-medium">Importada</span>
				</div>
				<div className="flex items-center gap-2">
					<span className="text-purple-600 text-lg">🔍</span>
					<span className="text-gray-700 font-medium">Verificada</span>
				</div>
			</div>
		</div>
	);
}

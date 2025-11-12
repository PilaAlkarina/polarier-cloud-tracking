export default function StatusLegend() {
	return (
		<div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
			<h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
				<span>🎯</span>
				<span>Leyenda de Estados</span>
			</h3>
			<div className="space-y-3 text-xs">
				<div className="flex items-center gap-3">
					<span className="inline-flex items-center justify-center w-8 h-8 bg-red-100 border-2 border-red-300 rounded-full text-red-600 shrink-0">
						⚠️
					</span>
					<span className="text-gray-700 font-medium">Con errores</span>
				</div>
				<div className="flex items-center gap-3">
					<span className="inline-flex items-center justify-center w-8 h-8 bg-amber-100 border-2 border-amber-300 rounded-full text-amber-600 shrink-0">
						🚧
					</span>
					<span className="text-gray-700 font-medium">En desarrollo</span>
				</div>
				<div className="flex items-center gap-3">
					<span className="inline-flex items-center justify-center w-8 h-8 shrink-0 text-green-600 text-xl">
						✅
					</span>
					<span className="text-gray-700 font-medium">Importada</span>
				</div>
				<div className="flex items-center gap-3">
					<span className="inline-flex items-center justify-center w-8 h-8 shrink-0 text-purple-600 text-xl">
						🔍
					</span>
					<span className="text-gray-700 font-medium">Verificada</span>
				</div>
			</div>
		</div>
	);
}

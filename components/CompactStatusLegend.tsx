export default function CompactStatusLegend() {
	return (
		<div className="flex items-center gap-3 text-xs">
			<div className="flex items-center gap-1.5">
				<span className="inline-flex items-center justify-center w-5 h-5 bg-red-100 border border-red-300 rounded-full text-xs">
					⚠️
				</span>
				<span className="text-white/90 font-medium">Errores</span>
			</div>
			<div className="flex items-center gap-1.5">
				<span className="inline-flex items-center justify-center w-5 h-5 bg-amber-100 border border-amber-300 rounded-full text-xs">
					🚧
				</span>
				<span className="text-white/90 font-medium">Desarrollo</span>
			</div>
			<div className="flex items-center gap-1.5">
				<span className="text-green-400 text-sm">✅</span>
				<span className="text-white/90 font-medium">Importada</span>
			</div>
			<div className="flex items-center gap-1.5">
				<span className="text-purple-400 text-sm">🔍</span>
				<span className="text-white/90 font-medium">Verificada</span>
			</div>
		</div>
	);
}

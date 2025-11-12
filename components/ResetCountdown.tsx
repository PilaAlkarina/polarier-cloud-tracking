interface ResetCountdownProps {
	nextResetTime: number;
}

export default function ResetCountdown({ nextResetTime }: ResetCountdownProps) {
	const minutes = Math.floor(nextResetTime / 60000);
	const seconds = Math.floor((nextResetTime % 60000) / 1000);

	return (
		<div className="text-white/70 text-xs font-medium">
			⏰ Auto-reset: {minutes}:{seconds.toString().padStart(2, "0")}
		</div>
	);
}

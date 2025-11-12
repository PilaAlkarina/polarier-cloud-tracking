"use client";

import { useEffect, useState } from "react";

interface CountdownTimerProps {
    deadline: string; // Formato: "2025-11-20"
}

interface TimeRemaining {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    total: number;
}

const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20 min-w-[60px]">
            <div className="text-3xl sm:text-4xl font-bold text-[#F1BE48] tabular-nums">
                {value.toString().padStart(2, "0")}
            </div>
        </div>
        <div className="text-white/80 text-xs font-medium mt-1">{label}</div>
    </div>
);

export default function CountdownTimer({ deadline }: CountdownTimerProps) {
    const calculateTimeRemaining = (): TimeRemaining => {
        const now = new Date().getTime();
        const deadlineDate = new Date(deadline + "T23:59:59").getTime();
        const total = deadlineDate - now;

        if (total <= 0) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
        }

        const days = Math.floor(total / (1000 * 60 * 60 * 24));
        const hours = Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((total % (1000 * 60)) / 1000);

        return { days, hours, minutes, seconds, total };
    };

    const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(calculateTimeRemaining());

    useEffect(() => {
        // Actualizar cada segundo
        const interval = setInterval(() => {
            setTimeRemaining(calculateTimeRemaining());
        }, 1000);

        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deadline]);

    if (timeRemaining.total <= 0) {
        return (
            <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">⏰ ¡DEADLINE ALCANZADO!</div>
                <div className="text-white/80 text-sm">El plazo ha finalizado</div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center sm:justify-start gap-2">
            <TimeUnit value={timeRemaining.days} label="días" />
            <div className="text-white/50 text-2xl font-bold pb-6">:</div>
            <TimeUnit value={timeRemaining.hours} label="horas" />
            <div className="text-white/50 text-2xl font-bold pb-6">:</div>
            <TimeUnit value={timeRemaining.minutes} label="min" />
            <div className="text-white/50 text-2xl font-bold pb-6">:</div>
            <TimeUnit value={timeRemaining.seconds} label="seg" />
        </div>
    );
}

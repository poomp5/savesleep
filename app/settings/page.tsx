"use client";

import { useState, useMemo } from "react";
import { Moon, Sun, Bell } from "lucide-react";

export default function SettingsPage() {
    const [remindMe, setRemindMe] = useState(false);
    const [bedTime, setBedTime] = useState("00:00");
    const [wakeTime, setWakeTime] = useState("06:00");

    const sleepDuration = useMemo(() => {
        const [bedHours, bedMinutes] = bedTime.split(":").map(Number);
        const [wakeHours, wakeMinutes] = wakeTime.split(":").map(Number);

        let hours = wakeHours - bedHours;
        let minutes = wakeMinutes - bedMinutes;

        if (hours < 0) hours += 24;
        if (minutes < 0) {
            minutes += 60;
            hours -= 1;
        }

        return `${hours}h ${minutes}m`;
    }, [bedTime, wakeTime]);

    const arcStyle = useMemo(() => {
        const bedTimeMinutes = bedTime.split(":").map(Number).reduce((acc, curr) => acc * 60 + curr, 0);
        const wakeTimeMinutes = wakeTime.split(":").map(Number).reduce((acc, curr) => acc * 60 + curr, 0);

        let startAngle = (bedTimeMinutes / (24 * 60)) * 360;
        let endAngle = (wakeTimeMinutes / (24 * 60)) * 360;

        if (endAngle < startAngle) endAngle += 360;

        // Add opacity to the color (e.g., 0.7 for 70% opacity)
        const arcColor = `rgba(107, 70, 193, 0.2)`; // #6b46c1 with 70% opacity

        return {
            background: `conic-gradient(from ${startAngle}deg, ${arcColor} 0deg ${endAngle - startAngle}deg, transparent ${endAngle - startAngle}deg 360deg)`
        };
    }, [bedTime, wakeTime]);

    const moonPosition = useMemo(() => {
        const bedTimeMinutes = bedTime.split(":").map(Number).reduce((acc, curr) => acc * 60 + curr, 0);
        const angle = (bedTimeMinutes / (24 * 60)) * 360; // Convert time to angle
        const radius = 160; // Half of the container's width (320px / 2)
        const x = radius * Math.cos((angle - 90) * (Math.PI / 180)); // Adjust for 12 o'clock position
        const y = radius * Math.sin((angle - 90) * (Math.PI / 180)); // Adjust for 12 o'clock position
        return { x, y };
    }, [bedTime]);

    const sunPosition = useMemo(() => {
        const wakeTimeMinutes = wakeTime.split(":").map(Number).reduce((acc, curr) => acc * 60 + curr, 0);
        const angle = (wakeTimeMinutes / (24 * 60)) * 360; // Convert time to angle
        const radius = 160; // Half of the container's width (320px / 2)
        const x = radius * Math.cos((angle - 90) * (Math.PI / 180)); // Adjust for 12 o'clock position
        const y = radius * Math.sin((angle - 90) * (Math.PI / 180)); // Adjust for 12 o'clock position
        return { x, y };
    }, [wakeTime]);
    return (
        <div className="min-h-screen bg-gray-800 text-white p-6 pb-24">
            <div className="mx-4 space-y-8">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold">ตั้งค่าเวลานอน</h1>
                    <div className="w-6 h-6 text-gray-400">
                        <Bell />
                    </div>
                </div>

                {/* Circular Time Display */}
                <div className="relative w-full aspect-square max-w-[320px] mx-auto">
                    <div className="absolute inset-0 rounded-full border-2 border-white/10 flex items-center justify-center">
                        {[...Array(12)].map((_, i) => {
                            const rotation = i * 30; // 30 degrees per hour (360 / 12 = 30)
                            const hour = i === 0 ? 12 : i; // Display numbers 12, 1, 2, ..., 11
                            return (
                                <div
                                    key={i}
                                    className="absolute w-full h-full"
                                    style={{ transform: `rotate(${rotation}deg)` }}
                                >
                                    <span
                                        className="absolute top-4 left-1/2 -translate-x-1/2 text-gray-400"
                                        style={{ transform: `rotate(-${rotation}deg)` }}
                                    >
                                        {hour}
                                    </span>
                                </div>
                            );
                        })}

                        {/* Center Time Display */}
                        <div className="text-3xl font-bold">{sleepDuration}</div>
                        <div
                            className="absolute inset-0 rounded-full"
                            style={arcStyle}
                        />
                        <div
                            className="absolute w-8 h-8 rounded-full bg-[#6b46c1] flex items-center justify-center"
                            style={{
                                transform: `translate(${moonPosition.x}px, ${moonPosition.y}px)`,
                            }}
                        >
                            <Moon className="w-5 h-5" />
                        </div>

                        {/* Sun Icon */}
                        <div
                            className="absolute w-8 h-8 rounded-full bg-[#f59e0b] flex items-center justify-center"
                            style={{
                                transform: `translate(${sunPosition.x}px, ${sunPosition.y}px)`,
                            }}
                        >
                            <Sun className="w-5 h-5" />
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-800 border border-1 border-gray-600 rounded-3xl p-4">
                        <div className="flex items-center gap-2 mb-2 whitespace-nowrap">
                            <Moon className="w-5 h-5 text-purple-400" />
                            <span className="text-sm">เวลานอน</span>
                        </div>
                        <input
                            type="time"
                            value={bedTime}
                            onChange={(e) => setBedTime(e.target.value)}
                            className="text-2xl font-bold bg-transparent [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:brightness-100 w-full focus:outline-none"
                        />
                        <div className="text-sm text-gray-400">วันนี้</div>
                    </div>
                    <div className="bg-gray-800 border border-1 border-gray-600 rounded-3xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Sun className="w-5 h-5 text-[#f59e0b]" />
                            <span className="text-sm">เวลาตื่น</span>
                        </div>
                        <input
                            type="time"
                            value={wakeTime}
                            onChange={(e) => setWakeTime(e.target.value)}
                            className="text-2xl font-bold bg-transparent w-full focus:outline-none [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:brightness-100"
                        />
                        <div className="text-sm text-gray-400">พรุ่งนี้เช้า</div>
                    </div>
                </div>
                <div className="bg-gray-700 rounded-2xl p-4 flex items-center justify-between">
                    <span>ปลุกเมื่อถึงเวลาตื่น</span>
                    <div
                        className="relative inline-flex cursor-pointer"
                        onClick={() => setRemindMe(!remindMe)}
                    >
                        <div className={`w-11 h-6 rounded-full transition-colors duration-200 ease-in-out ${remindMe ? 'bg-purple-500' : 'bg-gray-600'}`}>
                            <div className={`w-5 h-5 rounded-full bg-white transform transition-transform duration-200 ease-in-out ${remindMe ? 'translate-x-6' : 'translate-x-1'} mt-0.5`} />
                        </div>
                    </div>
                </div>
                <button className="bg-gray-100 hover:bg-gray-300 text-gray-800 w-full px-4 py-2 rounded-lg">บันทึกตั้งค่า</button>
            </div>
        </div>
    );
}
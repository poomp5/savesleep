"use client";

import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Moon, BedDouble, Activity } from "lucide-react";
import Image from "next/image";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";

type SleepLog = {
    sleep: number;
    quality: number;
    emotional: number;
    created_at: string;
};

export default function Home() {
    const [activeTab, setActiveTab] = useState("day");
    const [sleepData, setSleepData] = useState<{ time: number, value: number }[]>([]);
    const [userData, setUserData] = useState<User | null>(null);
    const supabase = createClientComponentClient();
    const router = useRouter();

    useEffect(() => {
        async function fetchUserAndSleepData() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }
            setUserData(user);
            const { data, error } = await supabase
                .from('savesleep')
                .select('*')
                .eq('user_email', user.email)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching sleep data:', error);
                return;
            }

            const chartData = data.map((log: SleepLog) => ({
                time: log.sleep,
                value: calculateSleepQuality(log)
            }));

            setSleepData(chartData);
        }

        fetchUserAndSleepData();
    }, [router, supabase]);

    const calculateSleepQuality = (log: SleepLog) => {
        return (log.quality + log.emotional) / 2;
    };

    const calculateSleepStats = () => {
        if (sleepData.length === 0) return { bedTime: '0h', sleepTime: '0h', activity: '0h' };

        // You would typically calculate these more precisely based on your data
        return {
            bedTime: '8h 27min',
            sleepTime: '7h 45min',
            activity: '30min'
        };
    };

    const stats = calculateSleepStats();

    return (
        <div className="min-h-screen bg-gray-800 text-white p-6">
            <div className="px-2 md:px-8 mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                            <Image
                                src={'/profile.png'}
                                alt="poom"
                                width={300}
                                height={300}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold">ยินดีต้อนรับ</h1>
                            <p className="text-sm text-gray-400">
                                {userData?.email || 'ผู้ใช้'}
                            </p>
                        </div>
                    </div>
                    <div className="bg-yellow-50 rounded-full p-2">
                        <Moon className="w-6 h-6 text-yellow-500" />
                    </div>
                </div>

                <div>
                    <h2 className="text-lg font-semibold mb-4">สถิติการนอนประจำวันนี้</h2>
                    <div className="w-full">
                        <div className="grid grid-cols-3 bg-gray-800 rounded-lg p-1 gap-1 mb-4">
                            {["วัน", "สัปดาห์", "เดือน"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`py-2 px-4 rounded-md text-sm font-medium transition-colors
                    ${activeTab === tab
                                            ? "bg-white text-gray-900"
                                            : "text-gray-400 hover:text-white"
                                        }`}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            ))}
                        </div>

                        <div className="mt-4">
                            <div className="text-sm text-gray-400 mb-2">
                                {new Date().toLocaleDateString('th-TH', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>
                            <div className="h-48 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={sleepData}>
                                        <XAxis dataKey="time" stroke="#6b7280" />
                                        <YAxis stroke="#6b7280" />
                                        <Line
                                            type="monotone"
                                            dataKey="value"
                                            stroke="#ec4899"
                                            strokeWidth={2}
                                            dot={{ fill: "#ec4899", r: 4 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sleep Stats Cards */}
                <div className="grid grid-cols-3 gap-4">
                    {[
                        { icon: BedDouble, label: "เวลาบนเตียง", color: "text-pink-500", value: stats.bedTime },
                        { icon: Moon, label: "เวลานอนหลับ", color: "text-blue-500", value: stats.sleepTime },
                        { icon: Activity, label: "กิจกรรม", color: "text-green-500", value: stats.activity }
                    ].map(({ icon: Icon, label, color, value }) => (
                        <div key={label} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                            <div className="flex flex-col items-center">
                                <Icon className={`w-5 h-5 ${color} mb-2`} />
                                <div className="text-sm">{label}</div>
                                <div className="font-semibold">{value}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
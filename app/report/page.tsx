"use client";

import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Moon, BedDouble, Activity } from "lucide-react";
import Image from "next/image";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { format, eachDayOfInterval, startOfWeek } from 'date-fns';
import { enUS } from 'date-fns/locale';



type SleepLog = {
    quality: number;
    emotional: number;
    created_at: string;
    sleeptime: number;
    factortime: number;
};


export default function Home() {

    function formatTimestampToDate(timestamp: string) {
        const date = new Date(timestamp);

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
    }





    const [activeTab, setActiveTab] = useState("สัปดาห์");
    const [sleepData, setSleepData] = useState<{ time: string, value: number, sleeptime: number, factortime: number }[]>([]);
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
                .order('created_at', { ascending: true });


            if (error) {
                console.error('Error fetching sleep data:', error);
                return;
            }
            const chartData = data.map((log: SleepLog) => ({

                time: formatTimestampToDate(log.created_at),
                value: calculateSleepQuality(log),
                sleeptime: log.sleeptime,
                factortime: log.factortime

            }));


            setSleepData(chartData);

        }

        fetchUserAndSleepData();





    }, [router, supabase]);

    const today = new Date();

    const startOfWeekDate = startOfWeek(today, { weekStartsOn: 1 });
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const daysOfWeek = eachDayOfInterval({
        start: startOfWeekDate,
        end: today
    });

    const daysOfMonth = eachDayOfInterval({
        start: startOfMonth,
        end: today
    });


    const weekdays = daysOfWeek.map((day) => format(day, 'dd-MM-yyyy', { locale: enUS }));
    const monthdays = daysOfMonth.map((day) => format(day, 'dd-MM-yyyy', { locale: enUS }))
    const filtered: { time: string; value: number; sleeptime: number; factortime: number }[] = [];


    if (activeTab == 'สัปดาห์') {


        weekdays.forEach(item => {

            sleepData.forEach(element => {

                if (item == element.time) {
                    filtered.push({ time: item, value: element.value, sleeptime: element.sleeptime, factortime: element.factortime })
                }
            });


        });



    } else if (activeTab == 'เดือน') {


        monthdays.forEach(item => {
            const a: string = item[3] + item[4]

            sleepData.forEach(element => {
                const b: string = element.time[3] + element.time[4]

                if (a === b && item == element.time) {


                    filtered.push({ time: item, value: element.value, sleeptime: element.sleeptime, factortime: element.factortime })


                }
            });


        });



    }
    const tabLabels: Record<string, string> = {
        สัปดาห์: "สถิติการนอนประจำสัปดาห์นี้",
        เดือน: "สถิติการนอนประจำเดือนนี้",
    };

    const statlabels: Record<string, string[]> = {
        สัปดาห์: ["เวลาบนเตียงเฉลี่ยตามสัปดาห์", "เวลานอนหลับเฉลี่ยตามสัปดาห์", "เวลาทำกิจกรรมเฉลี่ยตามสัปดาห์"],
        เดือน: ["เวลาบนเตียงเฉลี่ยตามเดือน", "เวลานอนหลับเฉลี่ยตามเดือน", "เวลาทำกิจกรรมเฉลี่ยตามเดือน"],
    };

    const calculateSleepQuality = (log: SleepLog) => {
        return (log.quality + log.emotional) / 2;
    };

    const calculateSleepStats = () => {
        if (sleepData.length === 0) return { bedTime: '0h', sleepTime: '0h', activity: '0h' };

        let bedTime: number = 0;
        let sleepTime: number = 0;
        let avgFac: number = 0;


        avgFac = filtered.reduce((a, b) => a += b.factortime / filtered.length, 0);
        sleepTime = filtered.reduce((a, b) => a += (b.sleeptime - b.factortime) / filtered.length, 0);
        bedTime = filtered.reduce((a, b) => a += b.sleeptime / filtered.length, 0);




       

        return { bedTime: formatSleepTime(bedTime), sleepTime: formatSleepTime(sleepTime), activity: formatSleepTime(avgFac) }


    };

    const formatSleepTime = (value: number) => {
        const hours = Math.floor(value / 60);
        const minutes = Math.round(value % 60);
        return `${hours} ชั่วโมง ${minutes} นาที`;
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
                    <h2 className="text-lg font-semibold mb-4">{tabLabels[activeTab]}</h2>
                    <div className="w-full">
                        <div className="grid grid-cols-3 bg-gray-800 rounded-lg p-1 gap-1 mb-4">
                            {["สัปดาห์", "เดือน"].map((tab) => (
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
                                    <LineChart data={filtered}>
                                        <XAxis dataKey="time" stroke="#6b7280" />
                                        <YAxis stroke="#6b7280"
                                            label={{ value: "ชั่วโมงหลับ", angle: -90, position: "insideLeft" }}
                                            tickFormatter={(value) => (value / 60).toFixed(1)}
                                        />
                                        <Tooltip formatter={(value) => formatSleepTime(value as number)} />
                                        <Line
                                            type="monotone"
                                            dataKey="sleeptime"
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
                        { icon: BedDouble, label: statlabels[activeTab][0], color: "text-pink-500", value: stats.bedTime },
                        { icon: Moon, label: statlabels[activeTab][1], color: "text-blue-500", value: stats.sleepTime },
                        { icon: Activity, label: statlabels[activeTab][2], color: "text-green-500", value: stats.activity }
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
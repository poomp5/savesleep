"use client";
import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Play, ChevronRight } from 'lucide-react';
import Link from 'next/link';

type Settinglog = {
  quality_goal: number;
  emotional_goal: number;
  sleep_goal: number;
};

type Sleeplog = {
  quality: number;
  emotional: number;
  sleeptime: number;
  cal: number;
}
const SleepTracker = () => {
  const supabase = createClientComponentClient();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [, setUser] = useState<{ email: string } | null>(null);
  const [settingData, setSettingData] = useState<{sleep_goal: number, overall_goal : number}[]>([]);
  const [sleepData, setSleepData] = useState<{ sleeptime: number,  cal: number }[]>([]);

  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser({ email: user.email ?? '' });
        setIsLoggedIn(true);

        const { data } = await supabase
        .from('user_setting')
        .select('*')
        .eq('user_email', user?.email)
        const safeData = data || [];

        const userSettings = safeData.map((row: Settinglog) => {
          const qualityGoal = row.quality_goal || 0; 
          const emotionalGoal = row.emotional_goal || 0;
        
          return {
            sleep_goal: row.sleep_goal,
            overall_goal: (qualityGoal + emotionalGoal) / 2,
          };
        });
        


        setSettingData(userSettings)

        if (userSettings) {
          const { data } = await supabase
          .from('savesleep')
          .select('*')
          .eq('user_email', user.email)
          .order('created_at', { ascending: true });

          const safeData = data || [];

              const chartData = safeData.map((log: Sleeplog) => ({
                sleeptime: log.sleeptime || 0,
                cal: calculateSleepQuality(log)
            }));


            setSleepData(chartData);
     

        }

      } else {
        setIsLoggedIn(false);
      }

    }
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase.auth]);

  console.log(sleepData)

  
  const calculateSleepQuality = (log: Sleeplog) => {
    const quality = (log.quality + log.emotional) / 2; 

    if (isNaN(quality)) {
       return 0;
    }

    return quality
};
  

  
  const formatSleepTime = (value: number) => {
    const hours = Math.floor(value / 60);
    const minutes = Math.round(value % 60);
    return `${hours} ชั่วโมง ${minutes} นาที`;
};

const averagetime = sleepData.reduce((sum, entry) => sum + entry.sleeptime, 0) / sleepData.length
const averageCal = sleepData.reduce((sum, entry) => sum + entry.cal, 0) / sleepData.length

const percentage = (value: number, value2: number) => {

  const average = (value/value2) * 100 
  if(isNaN(average)) {
    return 0
  }

  if (average > 100.00 ){
     return 100
  }

 return average
};

const progressSleep = percentage(averagetime, settingData[0]?.sleep_goal)
const progressGoal = percentage(averageCal, settingData[0]?.overall_goal)








  
  

  const currentDate = new Date().toLocaleDateString('th-TH', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gray-800 p-6 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">SaveSleep</h1>
        <button className="p-2">
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <div className="bg-gray-700 rounded-3xl p-6 mb-8">
        <h2 className="text-2xl mb-2">{currentDate}</h2>
        <Link href={'/input'}>
          <button className="bg-white hover:bg-gray-200 text-gray-800 px-6 py-2 rounded-full font-medium flex items-center gap-2">
            <Play className="w-4 h-4" />
            เริ่มติดตามการนอนหลับ
          </button>
        </Link>
      </div>

      {isLoggedIn ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">STATISTICS</h2>
            <button className="text-gray-300">See all</button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Quality Card */}
            <div className="bg-gray-700 rounded-3xl p-6">
              <h3 className="text-base whitespace-nowrap md:text-xl mb-4">คุณภาพการนอนเฉลี่ย</h3>
              <div className="flex items-end gap-1">
                <span className="text-4xl font-semibold">{Math.round(progressGoal)}</span>
                <span className="text-2xl mb-1">%</span>
              </div>
              <div className="w-full bg-gray-500 rounded-full h-2 mt-4">
                <div
                  className="bg-white rounded-full h-2"
                  style={{ width: `${progressGoal}%` }}
                />
              </div>
            </div>

            <div className="bg-gray-700 rounded-3xl p-6">
              <h3 className="text-base whitespace-nowrap md:text-xl mb-4">ระยะเวลานอนเฉลี่ย</h3>
              <div className="text-4xl font-semibold mb-4 whitespace-nowrap">
                {formatSleepTime(averagetime)}
              </div>
              <div className="w-full bg-gray-500 rounded-full h-2">
                <div
                  className="bg-white rounded-full h-2"
                  style={{ width: `${progressSleep}%`}}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Link href={'/login'}>
          <button className="bg-white hover:bg-gray-200 text-gray-800 px-6 py-2 w-full rounded-lg font-medium">
            เข้าสู่ระบบเพื่อดูข้อมูลเชิงลึก
          </button>
        </Link>
      )}
    </div>
  );
};

export default SleepTracker;
import React from 'react';
import { Play, ChevronRight } from 'lucide-react';
import Link from 'next/link';
const SleepTracker = () => {
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
        <p className="text-gray-300 mb-4">ช่วงเวลานอน: 10:30 PM - 07:15 AM</p>
        <Link href={'/input'}>
          <button className="bg-white hover:bg-gray-200 text-gray-800 px-6 py-2 rounded-full font-medium flex items-center gap-2">
            <Play className="w-4 h-4" />
            เริ่มติดตามการนอนหลับ
          </button>
        </Link>
      </div>

      {/* Statistics Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">STATISTICS</h2>
          <button className="text-gray-300">See all</button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Quality Card */}
          <div className="bg-gray-700 rounded-3xl p-6">
            <h3 className="text-base whitespace-nowrap md:text-xl mb-4">คุณภาพการนอน</h3>
            <div className="flex items-end gap-1">
              <span className="text-4xl font-semibold">78</span>
              <span className="text-2xl mb-1">%</span>
            </div>
            <div className="w-full bg-gray-500 rounded-full h-2 mt-4">
              <div
                className="bg-white rounded-full h-2"
                style={{ width: '78%' }}
              />
            </div>
          </div>

          {/* Duration Card */}
          <div className="bg-gray-700 rounded-3xl p-6">
            <h3 className="text-base whitespace-nowrap md:text-xl mb-4">ระยะเวลานอน</h3>
            <div className="text-4xl font-semibold mb-4 whitespace-nowrap">
              7h 50m
            </div>
            <div className="w-full bg-gray-500 rounded-full h-2">
              <div
                className="bg-white rounded-full h-2"
                style={{ width: '85%' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SleepTracker;
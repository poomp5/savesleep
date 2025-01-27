"use client";
import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { Moon, Sun } from 'lucide-react';

export default function SleepTrackerPage() {
    const supabase = createClientComponentClient();
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [sleepData, setSleepData] = useState({
        sleep: '',
        awake: '',
        quality: 5,
        emotional: 5,
        factor: '',
        stress: 5,
        note: ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchUser() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
            } else {
                router.push('/login');
            }
        }
        fetchUser();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setSleepData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            if (!user) throw new Error('User not authenticated');

            const { data, error } = await supabase
                .from('savesleep')
                .insert({
                    ...sleepData,
                    user_email: user.email
                });

            console.log('Insert data:', data);
            console.log('Insert error:', error);

            if (error) throw error;

            // Use SweetAlert for success message
            Swal.fire({
                title: 'สำเร็จ!',
                text: 'บันทึกข้อมูลสำเร็จ',
                icon: 'success',
                confirmButtonText: 'ตกลง',
            });
        } catch (err) {
            console.error('Full error:', err);
            setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');

            // Use SweetAlert for error message
            Swal.fire({
                title: 'เกิดข้อผิดพลาด!',
                text: err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการบันทึกข้อมูล',
                icon: 'error',
                confirmButtonText: 'ตกลง',
            });
        }
    };
    if (!user) return <div>กำลังโหลด...</div>;

    return (
        <div className="mx-auto p-6 bg-gray-800 text-white min-h-screen">
            <div className="flex flex-col md:flex-row md:justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold w-full md:w-auto mb-4 md:mb-0">บันทึกการนอน</h1>
                <div className="w-full md:w-auto flex flex-col md:flex-row items-center md:items-end">
                    <span className="mr-2 mb-2 md:mb-0">{user.email}</span>
                    <button
                        onClick={async () => {
                            // SweetAlert confirmation popup
                            const result = await Swal.fire({
                                title: 'คุณแน่ใจหรือไม่?',
                                text: 'คุณต้องการออกจากระบบหรือไม่?',
                                icon: 'warning',
                                showCancelButton: true,
                                confirmButtonText: 'ออกจากระบบ',
                                cancelButtonText: 'ยกเลิก',
                                confirmButtonColor: '#d33',
                                cancelButtonColor: '#3085d6',
                            });
                            // If user confirms, sign out
                            if (result.isConfirmed) {
                                await supabase.auth.signOut();
                                router.push('/login'); // Redirect to login page
                            }
                        }}
                        className="bg-red-500 px-3 py-1 rounded"
                    >
                        ออกจากระบบ
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {error && <div className="text-red-500 mb-4">{error}</div>}

                <div className="bg-gray-700 rounded-xl p-4 space-y-4">
                    <div className="flex items-center gap-4">
                        <Moon className="w-6 h-6" />
                        <div className="flex-1">
                            <label className="block text-sm mb-1">เวลาเข้านอน</label>
                            <input
                                type="time"
                                name="sleep"
                                value={sleepData.sleep}
                                onChange={handleChange}
                                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Sun className="w-6 h-6" />
                        <div className="flex-1">
                            <label className="block text-sm mb-1">เวลาตื่น</label>
                            <input
                                type="time"
                                name="awake"
                                value={sleepData.awake}
                                onChange={handleChange}
                                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white"
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-gray-700 rounded-xl p-4 space-y-4">
                    <div>
                        <label className="block text-sm mb-2">คุณภาพการนอน (1-10)</label>
                        <input
                            type="range"
                            name="quality"
                            min="1"
                            max="10"
                            value={sleepData.quality}
                            onChange={handleChange}
                            className="w-full"
                        />
                        <div className="flex justify-between text-xs">
                            <span>แย่</span>
                            <span>ดีมาก</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm mb-2">อารมณ์ (1-10)</label>
                        <input
                            type="range"
                            name="emotional"
                            min="1"
                            max="10"
                            value={sleepData.emotional}
                            onChange={handleChange}
                            className="w-full"
                        />
                        <div className="flex justify-between text-xs">
                            <span>แย่</span>
                            <span>ดีมาก</span>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-700 rounded-xl p-4">
                    <label className="block text-sm mb-2">ปัจจัยที่มีผลต่อการนอน</label>
                    <input
                        type="text"
                        name="factor"
                        value={sleepData.factor}
                        onChange={handleChange}
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white"
                        placeholder="เช่น ดื่มกาแฟ, ออกกำลังกาย"
                    />
                </div>

                <div className="bg-gray-700 rounded-xl p-4">
                    <label className="block text-sm mb-2">ระดับความเครียด (1-10)</label>
                    <input
                        type="range"
                        name="stress"
                        min="1"
                        max="10"
                        value={sleepData.stress}
                        onChange={handleChange}
                        className="w-full"
                    />
                </div>

                <div className="bg-gray-700 rounded-xl p-4">
                    <label className="block text-sm mb-2">บันทึกเพิ่มเติม</label>
                    <textarea
                        name="note"
                        value={sleepData.note}
                        onChange={handleChange}
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white"
                        rows={3}
                        placeholder="บันทึกรายละเอียดเพิ่มเติม..."
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-white text-gray-800 font-semibold py-3 rounded-xl transition duration-200"
                >
                    บันทึกข้อมูล
                </button>
            </form>
        </div>
    );
}
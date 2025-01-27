"use client";
import React, { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const supabase = createClientComponentClient();
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            Swal.fire({
                title: 'เข้าสู่ระบบสำเร็จ!',
                text: 'คุณได้เข้าสู่ระบบเรียบร้อยแล้ว',
                icon: 'success',
                confirmButtonText: 'ตกลง',
            }).then(() => {
                router.push('/');
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
            Swal.fire({
                title: 'เกิดข้อผิดพลาด!',
                text: err instanceof Error ? err.message : 'เข้าสู่ระบบไม่สำเร็จ',
                icon: 'error',
                confirmButtonText: 'ตกลง',
            });
        }
    };

    const handleSignUp = async () => {
        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${location.origin}/auth/callback`,
                },
            });

            if (error) throw error;
            Swal.fire({
                title: 'โปรดยืนยันการสมัคร!',
                text: 'ตรวจสอบอีเมลของคุณเพื่อยืนยันการสมัคร',
                icon: 'info',
                confirmButtonText: 'ตกลง',
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Signup failed');
            Swal.fire({
                title: 'เกิดข้อผิดพลาด!',
                text: err instanceof Error ? err.message : 'การสมัครไม่สำเร็จ',
                icon: 'error',
                confirmButtonText: 'ตกลง',
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-800 flex items-center justify-center">
            <div className="bg-gray-700 p-8 rounded-xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-white text-center">Login</h2>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-white mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-white mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                        />
                    </div>
                    <div className="space-y-4">
                        <button
                            type="submit"
                            className="w-full bg-white text-gray-800 py-2 rounded-lg font-semibold"
                        >
                            Login
                        </button>
                        <button
                            type="button"
                            onClick={handleSignUp}
                            className="w-full bg-gray-600 text-white py-2 rounded-lg font-semibold"
                        >
                            Sign Up
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center gap-6">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-primary/20 rounded-full"></div>
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-xl font-bold text-white tracking-widest uppercase">CL System</h1>
        <p className="text-xs text-slate-500 font-medium tracking-tight">Initializing secure session...</p>
      </div>
    </div>
  );
}

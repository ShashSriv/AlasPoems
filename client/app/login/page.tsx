'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles } from 'lucide-react';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem('isAdmin', 'true');
        // Force a router refresh to update Navbar state if needed, then push
        router.refresh(); 
        router.push('/');
      } else {
        setError('Invalid password');
      }
    } catch (err) {
        console.error(err);
      setError('Something went wrong');
    }
  };

  return (
    <main className="flex justify-center items-center py-20">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md border border-white/60 p-10 rounded-3xl shadow-pink-soft">
        <div className="flex justify-center mb-6 text-dusty-rose">
            <Sparkles size={32} />
        </div>
        <h1 className="text-3xl font-serif font-bold mb-6 text-center text-chocolate-text">Login</h1>
        <p className="text-center text-soft-mauve mb-8 font-sans">Enter password to access the writing room.</p>
        
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-xl mb-4 text-sm text-center font-bold font-sans">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-bold text-chocolate-text mb-2 font-sans">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-pink-100 rounded-xl focus:ring-2 focus:ring-dusty-rose focus:border-dusty-rose outline-none transition bg-white/50 text-chocolate-text placeholder-soft-mauve"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-dusty-rose text-white py-3 rounded-xl hover:bg-[#c46d88] transition font-bold shadow-pink-glow"
          >
            Enter
          </button>
        </form>
      </div>
    </main>
  );
}

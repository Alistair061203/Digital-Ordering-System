import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const AdminLogin = () => {
  const { restaurantName } = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const MOCK_ADMIN = {
    email: 'admin@example.com',
    password: 'admin123',
  };

  useEffect(() => {
    const authenticated = localStorage.getItem('adminAuthenticated') === 'true';
    const adminRestaurant = localStorage.getItem('adminRestaurant');

    if (authenticated && adminRestaurant === restaurantName) {
      navigate(`/${restaurantName}/admin`);
    }
  }, [restaurantName, navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      if (email === MOCK_ADMIN.email && password === MOCK_ADMIN.password) {
        localStorage.setItem('adminAuthenticated', 'true');
        localStorage.setItem('adminRestaurant', restaurantName);
        navigate(`/${restaurantName}/admin`);
      } else {
        setError('Invalid credentials. Please try again.');
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#f4efe8] flex flex-col font-sans">
      {/* 1. Fixed Header Area */}
      <header className="bg-white px-6 py-4 flex justify-between items-center shadow-sm z-10">
        <div className="font-black text-xl tracking-tighter text-gray-900 uppercase">
          May's Foodies
        </div>
        <div className="flex gap-4 items-center">
          <span className="text-sm font-medium text-gray-500 hidden sm:block">Menu</span>
          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-xs">
            MF
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-[2.5rem] bg-white shadow-2xl lg:grid-cols-2">
          
          {/* 2. Left Side: Image (Responsive height) */}
          <div className="relative h-[35vh] lg:h-full overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80"
              alt="Kitchen Interior"
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
            />
            {/* Gradient Overlay tailored for mobile text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent lg:bg-gradient-to-r"></div>
            
            <div className="absolute bottom-0 left-0 p-8 lg:p-12 text-white">
              <p className="text-[10px] uppercase tracking-[0.4em] text-orange-200 font-bold mb-2">
                Precision in every presentation
              </p>
              <h2 className="text-3xl lg:text-5xl font-extrabold tracking-tight">
                Welcome to <br className="hidden lg:block" /> May's Foodies.
              </h2>
            </div>
          </div>

          {/* 3. Right Side: Login Form */}
          <div className="flex flex-col p-8 lg:p-16 bg-white">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700 uppercase tracking-wider mb-6">
                <span className="animate-pulse">●</span> Authorized Access
              </div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                May's Foodies Admin Login
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                Enter your credentials to manage kitchen operations.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleLogin}>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-400">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-4 text-sm outline-none transition-all focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                  placeholder="chef@maysfoodies.com"
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    Password
                  </label>
               
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-4 text-sm outline-none transition-all focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-xs font-medium text-red-600 animate-shake">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full overflow-hidden rounded-xl bg-[#b23a2f] py-4 text-sm font-bold text-white transition-all hover:bg-[#912f26] active:scale-[0.98] disabled:opacity-70"
              >
                <span className={loading ? 'opacity-0' : 'opacity-100'}>
                  Sign In
                </span>
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                  </div>
                )}
              </button>
            </form>

            <footer className="mt-12 text-center text-[10px] uppercase tracking-widest text-gray-400">
              © 2026 BullEyeOrg. All rights reserved.
            </footer>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLogin;
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../connectDB';

const AdminLandingPage = () => {
  const { restaurantName } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [activeOrderCount, setActiveOrderCount] = useState(0);

  useEffect(() => {
    const fetchRestaurant = async () => {
      if (!restaurantName) return;
      const { data, error } = await supabase
        .from('RESTAURANT')
        .select('name')
        .ilike('name', restaurantName)
        .single();

      if (data) setRestaurant(data);
      if (error) console.error('Restaurant lookup failed:', error.message);
    };

    const fetchActiveOrders = async () => {
      const { count, error } = await supabase
        .from('ORDER_SAMPLE')
        .select('id', { count: 'exact', head: true })
        .eq('is_active', true);

      if (!error) setActiveOrderCount(count || 0);
      else console.error('Failed to fetch active orders:', error.message);
    };

    fetchRestaurant();
    fetchActiveOrders();
  }, [restaurantName]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminRestaurant');
    navigate(`/${restaurantName}/admin/login`);
  };

  const goTo = (path) => navigate(`/${restaurantName}/admin/${path}`);

  return (
    <div className="min-h-screen bg-[#faf6f0] px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl">
        {/* Main Grid: Stacks on mobile (grid-cols-1), side-by-side on large (lg:grid-cols-...) */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-[1.4fr_0.9fr] items-start">
          
          {/* Left Panel: Statistics */}
          <div className="rounded-[2.5rem] bg-white p-6 sm:p-8 shadow-2xl shadow-black/5 border border-white/60 overflow-hidden relative">
            {/* Background Decoration: Hidden on mobile to prevent text clash, visible on desktop */}
            <div className="absolute inset-y-0 left-0 w-1/2 bg-[#f7e7dd] opacity-80 hidden lg:block" />
            
            <div className="relative flex flex-col gap-6 lg:gap-8">
              <div className="max-w-xl">
                <p className="text-[10px] sm:text-xs uppercase tracking-[0.45em] text-[#b23a2f] font-semibold mb-3">
                  The Culinary Editorial
                </p>
                <h1 className="text-3xl font-black text-gray-900 leading-tight sm:text-5xl">
                  Kitchen Command
                </h1>
                <p className="mt-3 text-xs sm:text-sm text-gray-600 max-w-2xl">
                  Keep orders moving and manage your menu from one dashboard.
                </p>
              </div>

              {/* Stats Grid: Always 2 columns for symmetry */}
              <div className="grid gap-3 sm:gap-4 grid-cols-2">
                <div className="rounded-3xl bg-white/95 border border-gray-100 p-4 sm:p-6 shadow-sm">
                  <p className="text-[9px] sm:text-xs uppercase tracking-[0.25em] text-gray-500 font-bold">Queue</p>
                  <p className="mt-2 text-3xl sm:text-5xl font-black text-gray-900">{activeOrderCount}</p>
                  <p className="mt-1 text-[10px] sm:text-xs text-gray-400">Active orders</p>
                </div>
                <div className="rounded-3xl bg-white/95 border border-gray-100 p-4 sm:p-6 shadow-sm">
                  <p className="text-[9px] sm:text-xs uppercase tracking-[0.25em] text-gray-500 font-bold">Next</p>
                  <p className="mt-2 text-3xl sm:text-5xl font-black text-gray-900">#{activeOrderCount + 1}</p>
                  <p className="mt-1 text-[10px] sm:text-xs text-gray-400">Estimated ticket</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Controls */}
          <div className="rounded-[2.5rem] bg-white p-6 sm:p-8 shadow-2xl shadow-black/5 border border-white/60">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.35em] text-[#b23a2f] font-semibold">Welcome back</p>
                  <h2 className="mt-2 text-2xl sm:text-3xl font-black text-gray-900 truncate max-w-[150px] sm:max-w-none">
                    {restaurant?.name || 'Chef'}
                  </h2>
                </div>
                <button
                  onClick={handleLogout}
                  className="rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-[9px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-gray-600 hover:bg-gray-100 transition whitespace-nowrap"
                >
                  Sign Out
                </button>
              </div>

              {/* Kitchen Health Banner */}
              <div className="rounded-3xl bg-[#f6ede6] p-5 border border-[#f1d8cc]">
                <p className="text-[10px] uppercase tracking-[0.35em] text-[#8e3f29] font-semibold">Kitchen health</p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <div className="rounded-2xl bg-white px-3 py-2 border border-gray-200 text-[11px] sm:text-xs text-gray-600">
                    {activeOrderCount === 0 ? 'No active orders' : `${activeOrderCount} active order${activeOrderCount === 1 ? '' : 's'}`}
                  </div>
                  <div className="rounded-2xl bg-[#fff4ef] px-3 py-2 border border-[#f3d3c6] text-[11px] sm:text-xs font-semibold text-[#b23a2f]">
                    Smooth service
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid gap-3">
                <button
                  onClick={() => goTo('OrderPage')}
                  className="w-full rounded-2xl bg-[#b23a2f] px-6 py-4 text-xs sm:text-sm font-bold text-white uppercase tracking-[0.15em] shadow-lg shadow-[#9a3b28]/20 hover:bg-[#963526] transition active:scale-95"
                >
                  View Active Orders
                </button>
                <button
                  onClick={() => goTo('Menu')}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-6 py-4 text-xs sm:text-sm font-bold text-gray-800 uppercase tracking-[0.15em] shadow-sm hover:bg-gray-50 transition active:scale-95"
                >
                  Manage Menu
                </button>
                <button
                  onClick={() => goTo('archived')}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-6 py-4 text-xs sm:text-sm font-bold text-gray-800 uppercase tracking-[0.15em] shadow-sm hover:bg-gray-50 transition active:scale-95"
                >
                  View Archived Orders
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminLandingPage;
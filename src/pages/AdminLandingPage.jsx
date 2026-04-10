import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../connectDB';
import AdminActionCard from '../components/AdminActionCard';

const AdminLandingPage = () => {
  const { restaurantName } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);

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

    fetchRestaurant();
  }, [restaurantName]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminRestaurant');
    navigate(`/${restaurantName}/admin/login`);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] py-12">
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-4xl overflow-hidden shadow-2xl ring-1 ring-black/5">
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80"
              alt="Kitchen command workspace"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="rounded-4xl bg-white p-10 shadow-2xl ring-1 ring-black/5">
            <div className="mb-8">
              <p className="text-sm uppercase tracking-[0.35em] text-orange-600 font-bold">
                The Culinary Editorial
              </p>
              <h1 className="mt-4 text-4xl font-extrabold text-gray-900 sm:text-5xl">
                Kitchen Command
              </h1>
              <p className="mt-4 text-gray-600 text-base sm:text-lg">
                Please enter your credentials to access the dashboard and manage orders with precision.
              </p>
            </div>

            <div className="space-y-4">
              <div className="rounded-3xl bg-[#f6eee5] p-5 text-sm text-gray-700">
                Welcome back, <span className="font-semibold">{restaurant?.name || restaurantName || 'Chef'}</span>.
                Use the controls below to review active kitchen orders or archived history.
              </div>

              <AdminActionCard
                title="Active Orders"
                description="Open the live order queue and manage kitchen progress in real time."
                actionText="View Active Orders"
                primary={true}
                onClick={() => navigate(`/${restaurantName}/admin/OrderPage`)}
              />

              <AdminActionCard
                title="Archived Orders"
                description="Inspect completed orders and restore them when needed."
                actionText="View Archived Orders"
                onClick={() => navigate(`/${restaurantName}/admin/archived`)}
              />
            </div>

            <div className="mt-10 text-sm text-gray-400">
              Authorized personnel only. Manage your editorial flow and kitchen operations with surgical precision.
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full rounded-3xl border border-gray-300 bg-gray-50 px-6 py-3 text-gray-700 text-sm font-semibold transition hover:bg-gray-100"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLandingPage;

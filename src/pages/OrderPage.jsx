// src/pages/OrderPage.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../connectDB';
import { useNavigate, useParams } from 'react-router-dom';
import OrderSummaryCards from '../components/OrderSummaryCards';
import OrderTableRow from '../components/OrderTableRow';
import { Archive, ClipboardList } from 'lucide-react';

const OrderPage = () => {
  const navigate = useNavigate();
  const { restaurantName } = useParams();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRows, setExpandedRows] = useState([]);
  
  // State for our Daily Revenue (All paid orders from today)
  const [dailyRevenue, setDailyRevenue] = useState(0);

  // 1. Unified Fetch Function (Used for initial load and Realtime updates)
  const fetchOrdersAndRevenue = async () => {
    try {
      // Fetch Active Queue
      const { data: activeOrders, error: activeError } = await supabase
        .from('ORDER_SAMPLE')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (activeError) throw activeError;
      setOrders(activeOrders);

      // Fetch Today's Revenue (regardless of active/archived status)
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data: allPaidOrders, error: revenueError } = await supabase
        .from('ORDER_SAMPLE')
        .select('total_price')
        .eq('payment_status', 'Paid') 
        .gte('created_at', today.toISOString()); 

      if (revenueError) throw revenueError;
      
      const calculatedRevenue = allPaidOrders.reduce((sum, order) => sum + Number(order.total_price || 0), 0);
      setDailyRevenue(calculatedRevenue);

    } catch (err) {
      console.error("Error fetching data:", err.message);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersAndRevenue();

    // 2. THE REALTIME MAGIC
    // Listen for any changes on the ORDER_SAMPLE table and refresh the data
    const channel = supabase
      .channel('kitchen-updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'ORDER_SAMPLE' },
        (payload) => {
          console.log("Change detected!", payload);
          fetchOrdersAndRevenue();
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    if (newStatus === 'Completed') {
      // If "Completed", we archive it immediately (Optimistic UI)
      setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
      await supabase.from('ORDER_SAMPLE').update({ 
        status: newStatus, 
        is_active: false 
      }).eq('id', orderId);
    } else {
      // Otherwise, just update status normally
      setOrders(prevOrders => prevOrders.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
      await supabase.from('ORDER_SAMPLE').update({ status: newStatus }).eq('id', orderId);
    }
  };

  const handlePaymentChange = async (orderId, newPaymentStatus) => {
    setOrders(prevOrders => prevOrders.map(order => order.id === orderId ? { ...order, payment_status: newPaymentStatus } : order));
    await supabase.from('ORDER_SAMPLE').update({ payment_status: newPaymentStatus }).eq('id', orderId);
  };

  const handleArchive = async (orderId) => {
    setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
    const { error } = await supabase.from('ORDER_SAMPLE').update({ is_active: false }).eq('id', orderId);
    if (error) alert("Failed to archive order.");
  };

  const handleArchiveAll = async () => {
    const isConfirmed = window.confirm("Are you sure you want to archive ALL active orders? This will clear the entire queue.");
    if (!isConfirmed) return;

    const orderIds = orders.map(order => order.id);
    if (orderIds.length === 0) return;

    setOrders([]);

    const { error } = await supabase
      .from('ORDER_SAMPLE')
      .update({ is_active: false })
      .in('id', orderIds);

    if (error) {
      console.error("Error archiving all:", error.message);
      alert("Something went wrong while archiving. Please refresh the page.");
    }
  };

  const toggleRow = (orderId) => {
    setExpandedRows(prev => prev.includes(orderId) ? prev.filter(id => id !== orderId) : [...prev, orderId]);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  };

  const preparingCount = orders.filter(order => order.status === 'Preparing').length;

  if (loading) return <div className="flex justify-center items-center min-h-screen"><p className="animate-pulse font-bold text-gray-400 tracking-widest uppercase">Syncing Kitchen...</p></div>;
  if (error) return <div className="flex justify-center items-center min-h-screen text-[#b23a2f] font-bold">{error}</div>;

  return (
    <div className="min-h-screen bg-[#faf8f5] p-6 sm:p-8 font-sans text-gray-800">
      <div className="max-w-7xl mx-auto">
        
        {/* Header section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#b23a2f] mb-2">Live Feed</p>
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tighter">Active Orders</h1>
          </div>
          <button 
            onClick={() => navigate(`/${restaurantName}/admin/archived`)}
            className="bg-white border border-gray-200 text-gray-600 font-bold py-3 px-6 rounded-full shadow-sm hover:bg-gray-50 transition-all flex items-center gap-2 text-xs uppercase tracking-widest"
          >
            <Archive size={16} />
            Archived
          </button>
        </div>

        {/* Passing the dailyRevenue (calculated from ALL today's paid orders) */}
        <OrderSummaryCards orders={orders} preparingCount={preparingCount} totalRevenue={dailyRevenue} />

        {/* Premium Table Container */}
        <div className="bg-white shadow-xl shadow-gray-200/40 rounded-[2.5rem] overflow-hidden border border-gray-100">
          
          <div className="px-8 py-6 border-b border-gray-100 bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-50 rounded-xl text-gray-400">
                <ClipboardList size={20} strokeWidth={2.5} />
              </div>
              <h2 className="text-xl font-black text-gray-800 tracking-tight">Order Queue</h2>
            </div>
            
            {orders.length > 0 && (
              <button
                onClick={handleArchiveAll}
                className="flex items-center gap-2 bg-[#fff2ee] text-[#b23a2f] hover:bg-[#ffe6dd] border border-[#f3d3c6] font-bold py-2 px-5 rounded-xl transition-all text-xs uppercase tracking-widest shadow-sm"
              >
                <Archive size={14} strokeWidth={2.5} />
                Clear Queue
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#faf8f5] border-b border-gray-100">
                  <th className="py-5 px-4 w-12"></th>
                  <th className="py-5 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Time</th>
                  <th className="py-5 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Table</th>
                  <th className="py-5 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Status</th>
                  <th className="py-5 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Payment</th>
                  <th className="py-5 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Method</th>
                  <th className="py-5 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Total</th>
                  <th className="py-5 px-6 text-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-20 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <ClipboardList size={48} strokeWidth={1} className="mb-4 opacity-50" />
                        <p className="font-bold text-sm tracking-widest uppercase">No active orders</p>
                        <p className="text-xs mt-1">The kitchen is clear.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <OrderTableRow 
                      key={order.id} 
                      order={order} 
                      isExpanded={expandedRows.includes(order.id)}
                      toggleRow={toggleRow} 
                      handleStatusChange={handleStatusChange}
                      handlePaymentChange={handlePaymentChange} 
                      formatDate={formatDate}
                      onActionClick={handleArchive}
                      actionText="Archive"
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
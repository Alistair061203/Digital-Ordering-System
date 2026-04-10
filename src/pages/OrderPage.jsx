// src/pages/OrderPage.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../connectDB';
import { useNavigate, useParams } from 'react-router-dom';
import OrderSummaryCards from '../components/OrderSummaryCards';
import OrderTableRow from '../components/OrderTableRow';

const OrderPage = () => {
  const navigate = useNavigate();
  const { restaurantName } = useParams();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRows, setExpandedRows] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('ORDER_SAMPLE')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders:", err.message);
        setError("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setOrders(prevOrders => prevOrders.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
    await supabase.from('ORDER_SAMPLE').update({ status: newStatus }).eq('id', orderId);
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

  // NEW: Function to archive ALL visible orders
  const handleArchiveAll = async () => {
    // 1. Show a safety confirmation popup
    const isConfirmed = window.confirm("Are you sure you want to archive ALL active orders? This will clear the entire queue.");
    
    // 2. If they click Cancel, stop here
    if (!isConfirmed) return;

    // 3. Get the IDs of every order currently on the screen
    const orderIds = orders.map(order => order.id);
    if (orderIds.length === 0) return;

    // 4. Instantly clear the screen (Optimistic UI update)
    setOrders([]);

    // 5. Tell Supabase to update all of those specific IDs to inactive
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

  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_price || 0), 0);
  const preparingCount = orders.filter(order => order.status === 'Preparing').length;

  if (loading) return <div className="flex justify-center items-center min-h-screen"><p className="animate-pulse">Loading orders...</p></div>;
  if (error) return <div className="flex justify-center items-center min-h-screen text-red-500"><p>{error}</p></div>;

  return (
    <div className="min-h-screen bg-[#faf8f5] p-8 font-sans text-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Active Orders</h1>
            <p className="text-gray-500 mt-1">Manage and track real-time kitchen operations.</p>
          </div>
          <button 
            onClick={() => navigate(`/${restaurantName}/admin/archived`)}
            className="bg-[#F4DAB1] text-[#933314] font-bold py-2.5 px-5 rounded-full shadow-sm hover:bg-[#ebd0a5] transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
              <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            View Archived Orders
          </button>
        </div>

        <OrderSummaryCards orders={orders} preparingCount={preparingCount} totalRevenue={totalRevenue} />

        <div className="bg-white shadow-sm rounded-2xl overflow-hidden border border-gray-100">
          
          {/* NEW: Updated Header with Flexbox and Archive All Button */}
          <div className="px-6 py-4 border-b border-gray-100 bg-white flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Order Queue</h2>
            
            {/* Only show the button if there are actually orders to archive */}
            {orders.length > 0 && (
              <button
                onClick={handleArchiveAll}
                className="flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 font-bold py-2 px-4 rounded-lg transition-colors text-sm shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Archive All
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-400 uppercase text-xs font-bold tracking-wider">
                  <th className="py-4 px-4 w-12"></th>
                  <th className="py-4 px-6">Time</th>
                  <th className="py-4 px-6">Table #</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Payment</th>
                  <th className="py-4 px-6">Total</th>
                  <th className="py-4 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                {orders.length === 0 ? (
                  <tr><td colSpan="7" className="py-12 text-center text-gray-400 font-medium">No active orders found.</td></tr>
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
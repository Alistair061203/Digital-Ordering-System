// src/pages/OrderPage.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../connectDB';

// IMPORT YOUR NEW COMPONENTS HERE
import OrderSummaryCards from '../components/OrderSummaryCards';
import OrderTableRow from '../components/OrderTableRow';

const OrderPage = () => {
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
    setOrders(prevOrders =>
      prevOrders.map(order => order.id === orderId ? { ...order, status: newStatus } : order)
    );
    await supabase.from('ORDER_SAMPLE').update({ status: newStatus }).eq('id', orderId);
  };

  const handlePaymentChange = async (orderId, newPaymentStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(order => order.id === orderId ? { ...order, payment_status: newPaymentStatus } : order)
    );
    await supabase.from('ORDER_SAMPLE').update({ payment_status: newPaymentStatus }).eq('id', orderId);
  };

  const handleArchive = async (orderId) => {
    setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
    const { error } = await supabase.from('ORDER_SAMPLE').update({ is_active: false }).eq('id', orderId);
    if (error) {
      console.error("Error archiving:", error.message);
      alert("Failed to archive order.");
    }
  };

  const toggleRow = (orderId) => {
    setExpandedRows(prev => prev.includes(orderId) ? prev.filter(id => id !== orderId) : [...prev, orderId]);
  };

  const formatDate = (dateString) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };

  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_price || 0), 0);
  const preparingCount = orders.filter(order => order.status === 'Preparing').length;

  if (loading) return <div className="flex justify-center items-center min-h-screen bg-[#faf8f5]"><p className="text-lg text-gray-500 font-medium animate-pulse">Loading active orders...</p></div>;
  if (error) return <div className="flex justify-center items-center min-h-screen bg-[#faf8f5]"><p className="text-lg text-red-500 font-medium">{error}</p></div>;

  return (
    <div className="min-h-screen bg-[#faf8f5] p-8 font-sans text-gray-800">
      <div className="max-w-7xl mx-auto">

        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Active Orders</h1>
            <p className="text-gray-500 mt-1">Manage and track real-time kitchen operations.</p>
          </div>
          <button className="bg-[#F4DAB1] text-[#933314] font-bold py-2.5 px-5 rounded-full shadow-sm hover:bg-[#ebd0a5] transition-colors">
            View Archived Orders
          </button>
        </div>

        <OrderSummaryCards 
          orders={orders} 
          preparingCount={preparingCount} 
          totalRevenue={totalRevenue} 
        />

        {/* Table Section */}
        <div className="bg-white shadow-sm rounded-2xl overflow-hidden border border-gray-100">
          <div className="px-6 py-5 border-b border-gray-100 bg-white">
            <h2 className="text-xl font-bold text-gray-800">Order Queue</h2>
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
                  <th className="py-4 px-6">Instructions</th>
                  <th className="py-4 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-12 text-center text-gray-400 font-medium">No active orders found.</td>
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
                      handleArchive={handleArchive}
                      formatDate={formatDate}
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
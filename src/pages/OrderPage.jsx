import React, { useState, useEffect } from 'react';
import { supabase } from '../connectDB'; 

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('ORDER_SAMPLE')
          .select('id, created_at, table_number, status, total_price, special_instructions, payment_status')
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
      prevOrders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    await supabase.from('ORDER_SAMPLE').update({ status: newStatus }).eq('id', orderId);
  };

  const handlePaymentChange = async (orderId, newPaymentStatus) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId ? { ...order, payment_status: newPaymentStatus } : order
      )
    );
    await supabase.from('ORDER_SAMPLE').update({ payment_status: newPaymentStatus }).eq('id', orderId);
  };

  const handleArchive = async (orderId) => {
    setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
    const { error } = await supabase
      .from('ORDER_SAMPLE')
      .update({ is_active: false })
      .eq('id', orderId);

    if (error) {
      console.error("Error archiving order in DB:", error.message);
      alert("Failed to archive order. Please refresh.");
    }
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
        
        {/* Header Section */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Active Orders</h1>
            <p className="text-gray-500 mt-1">Manage and track real-time kitchen operations.</p>
          </div>
          <div className="flex gap-3">
            {/* View Archived Orders Button - Styled with the Peach tone */}
            <button className="bg-[#F4DAB1] text-[#933314] font-bold py-2.5 px-5 rounded-full shadow-sm hover:bg-[#ebd0a5] transition-colors flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              View Archived Orders
            </button>
          </div>
        </div>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Total Orders</h3>
            <p className="text-4xl font-black text-gray-800">{orders.length}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">In Preparation</h3>
            <p className="text-4xl font-black text-gray-800">{preparingCount}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Average Wait</h3>
            <p className="text-4xl font-black text-gray-800">14m</p>
            <p className="text-xs font-bold text-[#B84018] mt-2">~ Peak hour</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Total Revenue</h3>
            <p className="text-4xl font-black text-[#B84018]">₱{totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white shadow-sm rounded-2xl overflow-hidden border border-gray-100">
          <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
            <h2 className="text-xl font-bold text-gray-800">Order Queue</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-400 uppercase text-xs font-bold tracking-wider">
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
                    <td colSpan="7" className="py-12 text-center text-gray-400 font-medium">
                      No active orders found.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-50 hover:bg-orange-50/30 transition duration-150">
                      <td className="py-5 px-6 whitespace-nowrap font-medium text-gray-500">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="py-5 px-6 font-black text-[#B84018] text-2xl">
                        {order.table_number < 10 ? `0${order.table_number}` : order.table_number}
                      </td>
                      <td className="py-5 px-6">
                        <select
                          value={order.status || 'Pending'}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className={`py-1.5 px-4 rounded-full text-xs font-bold uppercase tracking-wide border-none cursor-pointer outline-none ring-2 ring-transparent transition-all appearance-none text-center
                            ${
                            order.status === 'Pending' ? 'bg-gray-100 text-gray-600' :
                            order.status === 'Preparing' ? 'bg-[#F4DAB1] text-[#933314]' :
                            order.status === 'Served' ? 'bg-green-100 text-green-700' :
                            order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-600'
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Preparing">Preparing</option>
                          <option value="Served">Served</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-5 px-6">
                         <select
                          value={order.payment_status || 'Unpaid'}
                          onChange={(e) => handlePaymentChange(order.id, e.target.value)}
                          className={`py-1.5 px-3 rounded-md text-sm font-bold border-none cursor-pointer outline-none ring-2 ring-transparent transition-all bg-transparent
                            ${order.payment_status === 'Paid' ? 'text-green-600' : 'text-red-500'}`}
                        >
                          <option value="Unpaid">Unpaid</option>
                          <option value="Paid">Paid</option>
                        </select>
                      </td>
                      <td className="py-5 px-6 font-black text-[#B84018] text-base">
                        ₱{Number(order.total_price).toFixed(2)}
                      </td>
                      <td className="py-5 px-6 text-gray-500 italic text-sm max-w-xs truncate" title={order.special_instructions}>
                        {order.special_instructions || "—"}
                      </td>
                      <td className="py-5 px-6 text-center">
                        <button 
                          onClick={() => handleArchive(order.id)}
                          className="bg-white border-2 border-[#B84018] hover:bg-[#F4DAB1] text-[#B84018] text-xs font-bold py-1.5 px-4 rounded-full transition-colors shadow-sm"
                        >
                          Archive
                        </button>
                      </td>
                    </tr>
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
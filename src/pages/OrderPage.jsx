import React, { useState, useEffect } from 'react';
// Adjust this import to point to your actual Supabase client configuration file
import { supabase } from './supabaseClient'; 

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
          .select('created_at, table_number, status, total_price, special_instructions')
          .order('created_at', { ascending: false }); // Shows newest orders first

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

  // Helper function to format the timestamp into a readable date/time
  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-lg text-gray-600 font-semibold animate-pulse">Loading active orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-lg text-red-600 font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Active Orders</h1>
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
            {orders.length} Orders
          </span>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 font-semibold">Time</th>
                  <th className="py-3 px-6 font-semibold">Table #</th>
                  <th className="py-3 px-6 font-semibold">Status</th>
                  <th className="py-3 px-6 font-semibold">Total Price</th>
                  <th className="py-3 px-6 font-semibold">Special Instructions</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm font-light">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-gray-500 italic">
                      No active orders found.
                    </td>
                  </tr>
                ) : (
                  orders.map((order, index) => (
                    <tr 
                      key={index} 
                      className="border-b border-gray-200 hover:bg-gray-50 transition duration-150"
                    >
                      <td className="py-4 px-6 whitespace-nowrap">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="py-4 px-6 font-bold text-gray-800">
                        {order.table_number}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`py-1 px-3 rounded-full text-xs font-semibold ${
                          order.status?.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          order.status?.toLowerCase() === 'preparing' ? 'bg-blue-100 text-blue-700' :
                          order.status?.toLowerCase() === 'completed' ? 'bg-green-100 text-green-700' :
                          'bg-gray-200 text-gray-700'
                        }`}>
                          {order.status || 'Unknown'}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-medium">
                        ₱{Number(order.total_price).toFixed(2)}
                      </td>
                      <td className="py-4 px-6 text-gray-600 max-w-xs truncate" title={order.special_instructions}>
                        {order.special_instructions || <span className="text-gray-400 italic">None</span>}
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
// src/pages/LiveStatusPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../connectDB';
import { Clock, ChefHat, Utensils, Info } from 'lucide-react';

function LiveStatusPage() {
  const { tableNumber } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Function to pull the data
  const fetchMyOrders = async () => {
    const { data, error } = await supabase
      .from('ORDER_SAMPLE')
      .select('*')
      .eq('table_number', tableNumber)
      .eq('is_active', true) // Only shows orders that aren't 'Completed'/Archived
      .order('created_at', { ascending: false });

    if (!error) setOrders(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchMyOrders();

    // 2. THE REAL-TIME SYNC
    // This channel listens specifically for when the Chef updates the status
    const channel = supabase
      .channel('guest-updates')
      .on(
        'postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'ORDER_SAMPLE',
          filter: `table_number=eq.${tableNumber}` 
        }, 
        (payload) => {
          console.log("Real-time update received!", payload);
          fetchMyOrders(); // Automatically refreshes the UI
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [tableNumber]);

  const getStatusConfig = (status) => {
    switch (status) {
      case 'Pending': 
        return { label: 'RECEIVED', color: 'border-gray-300', text: 'text-gray-400', bg: 'bg-gray-50', icon: <Clock size={14} /> };
      case 'Preparing': 
        return { label: 'IN PROGRESS', color: 'border-[#b23a2f]', text: 'text-[#b23a2f]', bg: 'bg-[#fff2ee]', icon: <ChefHat size={14} /> };
      case 'Served': 
        return { label: 'ON TABLE', color: 'border-green-600', text: 'text-green-600', bg: 'bg-green-50', icon: <Utensils size={14} /> };
      default: 
        return { label: 'PROCESSING', color: 'border-gray-200', text: 'text-gray-400', bg: 'bg-gray-50', icon: <Info size={14} /> };
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center font-black uppercase tracking-widest text-gray-400 animate-pulse">
      Syncing Table...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#faf8f5] p-6 sm:p-10">
      <div className="max-w-5xl mx-auto">
        
        <header className="mb-10 text-center sm:text-left">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#b23a2f] mb-2">The Guest Experience</p>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tighter">Live Order Tracker</h1>
          <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mt-2">Table {tableNumber}</p>
        </header>

        {orders.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-16 text-center border border-gray-100 shadow-xl shadow-gray-200/50">
            <Utensils className="mx-auto text-gray-200 mb-4" size={48} />
            <h2 className="text-xl font-black uppercase tracking-tighter text-gray-400">No active tickets</h2>
            <p className="text-xs text-gray-400 mt-2 font-bold uppercase tracking-widest">Visit the menu to start your order.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {orders.map((order) => {
              const config = getStatusConfig(order.status);
              return (
                <div 
                  key={order.id} 
                  className={`bg-white rounded-3xl shadow-xl shadow-gray-200/40 border-l-[6px] overflow-hidden flex flex-col ${config.color}`}
                >
                  {/* Card Header */}
                  <div className="p-6 pb-4 flex justify-between items-start">
                    <div>
                      <h3 className="font-black text-gray-900 text-lg uppercase tracking-tighter">
                        Order #{order.id.toString().slice(-3)}
                      </h3>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Table {order.table_number} • {order.order_items?.length} Items
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-sm text-gray-900">
                        {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className={`text-[9px] font-black uppercase tracking-widest mt-1 ${config.text}`}>
                        {config.label}
                      </p>
                    </div>
                  </div>

                  {/* Item List */}
                  <div className="px-6 py-4 space-y-5 flex-grow">
                    {order.order_items?.map((item, idx) => (
                      <div key={idx} className="flex gap-4">
                        <span className="w-7 h-7 bg-gray-100 rounded-md flex items-center justify-center font-black text-xs text-gray-600 flex-shrink-0">
                          {item.quantity}
                        </span>
                        <div>
                          <p className="font-black text-xs uppercase text-gray-900 tracking-tight leading-tight">
                            {item.name}
                          </p>
                          {item.selections && (
                            <p className="text-[10px] font-medium text-gray-400 mt-0.5">
                              {item.selections.side} {item.selections.extras?.join(', ')}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Table Notes / Special Requests */}
                  {order.special_instructions && order.special_instructions !== 'None' && (
                    <div className="px-6 mb-4">
                        <div className="inline-block bg-[#fff2ee] border border-[#f3d3c6] px-3 py-1.5 rounded-lg">
                            <p className="text-[9px] font-black text-[#b23a2f] uppercase tracking-widest">
                                Note: {order.special_instructions}
                            </p>
                        </div>
                    </div>
                  )}

                  {/* Bottom Status Area */}
                  <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-3">
                    <div className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-sm transition-all ${config.bg} ${config.text} border border-transparent`}>
                      {config.icon}
                      {order.status}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default LiveStatusPage;
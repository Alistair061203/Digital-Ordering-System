// src/pages/ArchivedPage.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../connectDB';
import { useNavigate, useParams } from 'react-router-dom';
import OrderTableRow from '../components/OrderTableRow';

const ArchivedPage = () => {
    const { restaurantName } = useParams();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedRows, setExpandedRows] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchArchivedOrders = async () => {
            try {
                setLoading(true);
                // Fetch ONLY inactive orders
                const { data, error } = await supabase
                    .from('ORDER_SAMPLE')
                    .select('*')
                    .eq('is_active', false)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setOrders(data);
            } catch (err) {
                setError("Failed to load archived orders.");
            } finally {
                setLoading(false);
            }
        };

        fetchArchivedOrders();
    }, []);

    // Restore function: Changes is_active back to true
    const handleRestore = async (orderId) => {
        setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
        const { error } = await supabase.from('ORDER_SAMPLE').update({ is_active: true }).eq('id', orderId);
        if (error) alert("Failed to restore order.");
    };

    const handleStatusChange = async (orderId, newStatus) => {
        setOrders(prevOrders => prevOrders.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
        await supabase.from('ORDER_SAMPLE').update({ status: newStatus }).eq('id', orderId);
    };

    const handlePaymentChange = async (orderId, newPaymentStatus) => {
        setOrders(prevOrders => prevOrders.map(order => order.id === orderId ? { ...order, payment_status: newPaymentStatus } : order));
        await supabase.from('ORDER_SAMPLE').update({ payment_status: newPaymentStatus }).eq('id', orderId);
    };

    const toggleRow = (orderId) => {
        setExpandedRows(prev => prev.includes(orderId) ? prev.filter(id => id !== orderId) : [...prev, orderId]);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    };

    if (loading) return <div className="flex justify-center items-center min-h-screen"><p className="animate-pulse">Loading archive...</p></div>;
    if (error) return <div className="flex justify-center items-center min-h-screen text-red-500"><p>{error}</p></div>;

    return (
        <div className="min-h-screen bg-gray-100 p-8 font-sans text-gray-800">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Archived Orders</h1>
                        <p className="text-gray-500 mt-1">Review past orders or restore them to the active queue.</p>
                    </div>
                    <button
                        onClick={() => navigate(`/${restaurantName}/admin`)}
                        className="bg-gray-200 text-gray-700 font-bold py-2.5 px-5 rounded-full shadow-sm hover:bg-gray-300 transition-colors flex items-center gap-2"
                    >
                        ← Back to Dashboard
                    </button>
                </div>

                <div className="bg-white shadow-sm rounded-2xl overflow-hidden border border-gray-200">
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
                                    <tr><td colSpan="7" className="py-12 text-center text-gray-400 font-medium">No archived orders found.</td></tr>
                                ) : (
                                    orders.map((order) => (
                                        <OrderTableRow
                                            key={order.id} order={order} isExpanded={expandedRows.includes(order.id)}
                                            toggleRow={toggleRow} handleStatusChange={handleStatusChange}
                                            handlePaymentChange={handlePaymentChange} formatDate={formatDate}
                                            onActionClick={handleRestore} // <-- Passes handleRestore!
                                            actionText="Restore"          // <-- Button says Restore!
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

export default ArchivedPage;
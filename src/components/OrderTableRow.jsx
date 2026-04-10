// src/components/OrderTableRow.jsx
import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const OrderTableRow = ({
  order,
  isExpanded,
  toggleRow,
  handleStatusChange,
  handlePaymentChange,
  formatDate,
  onActionClick,
  actionText
}) => {
  if (!order) return null;

  return (
    <React.Fragment>
      <tr className="border-b border-gray-50 hover:bg-white transition-colors group">
        
        <td className="py-4 px-4 w-12 text-center cursor-pointer" onClick={() => toggleRow(order.id)}>
          <button className="text-gray-400 group-hover:text-[#b23a2f] transition-colors">
            {isExpanded ? <ChevronUp size={18} strokeWidth={3} /> : <ChevronDown size={18} strokeWidth={3} />}
          </button>
        </td>

        <td className="py-4 px-6 text-gray-500 font-medium text-sm">
          {order.created_at ? formatDate(order.created_at) : 'N/A'}
        </td>

        <td className="py-4 px-6">
          <span className="font-black text-[#b23a2f] text-lg">
            {String(order.table_number).padStart(2, '0')}
          </span>
        </td>

        {/* --- UPDATED: The new 4-step workflow dropdown --- */}
        <td className="py-4 px-6">
          <div className="relative inline-block">
            <select
              value={order.status}
              onChange={(e) => handleStatusChange(order.id, e.target.value)}
              className="bg-gray-100 text-gray-600 font-bold text-[10px] uppercase tracking-widest py-2 px-4 rounded-full outline-none cursor-pointer appearance-none text-center hover:bg-gray-200 transition-colors"
            >
              <option value="Pending">Pending</option>
              <option value="Preparing">Preparing</option>
              <option value="Served">Served</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </td>

        <td className="py-4 px-6">
          <select
            value={order.payment_status}
            onChange={(e) => handlePaymentChange(order.id, e.target.value)}
            className={`font-bold text-xs uppercase tracking-widest py-1.5 outline-none cursor-pointer appearance-none bg-transparent transition-colors ${
              order.payment_status === 'Paid' ? 'text-green-600' : 'text-red-500'
            }`}
          >
            <option value="Unpaid" className="text-red-500 font-bold">Unpaid</option>
            <option value="Paid" className="text-green-600 font-bold">Paid</option>
          </select>
        </td>

        <td className="py-4 px-6">
          <span className="font-bold text-gray-600 text-[11px] uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
            {order.payment_method || 'N/A'}
          </span>
        </td>

        <td className="py-4 px-6 font-black text-[#b23a2f] text-sm">
          ₱{Number(order.total_price || 0).toFixed(2)}
        </td>

        <td className="py-4 px-6 text-center">
          <button
            onClick={() => onActionClick(order.id)}
            className="border border-[#b23a2f] text-[#b23a2f] hover:bg-[#b23a2f] hover:text-white font-bold text-[10px] uppercase tracking-widest py-1.5 px-4 rounded-full transition-all active:scale-95"
          >
            {actionText}
          </button>
        </td>
      </tr>

      {/* --- EXPANDED ROW --- */}
      {isExpanded && (
        <tr className="bg-[#faf8f5]">
          <td colSpan="8" className="py-6 px-8 border-b border-gray-100 shadow-inner">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
              
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b23a2f] mb-3 border-b border-[#b23a2f]/20 pb-2">
                  Ticket Details
                </h4>
                <ul className="space-y-3">
                  {order.order_items?.map((item, idx) => (
                    <li key={idx} className="flex justify-between items-start text-sm text-gray-700">
                      <div className="flex gap-3">
                        <span className="font-black text-gray-900 bg-white border border-gray-200 w-7 h-7 flex items-center justify-center rounded-md shadow-sm">
                          {item.quantity}
                        </span>
                        <div className="flex flex-col">
                          <span className="font-bold uppercase text-xs mt-1">{item.name}</span>
                          {item.selections && (
                            <div className="text-[11px] text-gray-500 mt-0.5 space-y-0.5">
                              {item.selections.side && <span>• {item.selections.side}</span>}
                              {item.selections.extras?.map(ext => <span key={ext} className="block">• + {ext}</span>)}
                              {item.selections.request && <span className="block italic mt-1 text-[#b23a2f]">"{item.selections.request}"</span>}
                            </div>
                          )}
                        </div>
                      </div>
                      <span className="font-bold text-gray-500 mt-1">
                        ₱{((item.perItemTotal || item.price) * item.quantity).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {order.special_instructions && order.special_instructions !== 'None' && (
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b23a2f] mb-3 border-b border-[#b23a2f]/20 pb-2">
                    Table Notes
                  </h4>
                  <div className="text-sm text-[#b23a2f] bg-[#fff2ee] p-4 rounded-2xl border border-[#f3d3c6] italic font-medium shadow-sm">
                    "{order.special_instructions}"
                  </div>
                </div>
              )}

            </div>
          </td>
        </tr>
      )}
    </React.Fragment>
  );
};

export default OrderTableRow;
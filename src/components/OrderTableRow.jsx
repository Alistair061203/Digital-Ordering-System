// src/components/OrderTableRow.jsx
import React from 'react';

const OrderTableRow = ({
  order,
  isExpanded,
  toggleRow,
  handleStatusChange,
  handlePaymentChange,
  handleArchive,
  formatDate
}) => {
  return (
    <React.Fragment>
      {/* MAIN ROW */}
      <tr className={`border-b border-gray-50 hover:bg-orange-50/30 transition duration-150 ${isExpanded ? 'bg-orange-50/20' : ''}`}>
        <td className="py-5 px-4 text-center">
          <button
            onClick={() => toggleRow(order.id)}
            className="p-1 rounded-full hover:bg-gray-200 transition-colors text-gray-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </td>
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
              ${order.status === 'Pending' ? 'bg-gray-100 text-gray-600' :
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

      {/* EXPANDED DETAILS ROW */}
      {isExpanded && (
        <tr className="bg-[#faf8f5] border-b border-gray-100">
          <td colSpan="8" className="py-6 px-8">
            <div className="flex flex-col">
              <h4 className="text-sm font-black text-gray-800 uppercase tracking-wider mb-3 border-b border-gray-200 pb-2 inline-block w-fit">Order Details</h4>

              {order.order_items && order.order_items.length > 0 ? (
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {order.order_items.map((item, index) => (
                    <li key={index} className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                      <div className="bg-[#F4DAB1] text-[#933314] font-black text-sm px-2.5 py-1 rounded-md">
                        {item.quantity}x
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{item.name}</p>
                        <p className="text-xs text-gray-500">₱{item.price.toFixed(2)} each</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 italic text-sm">No items found for this order.</p>
              )}
            </div>
          </td>
        </tr>
      )}
    </React.Fragment>
  );
};

export default OrderTableRow;
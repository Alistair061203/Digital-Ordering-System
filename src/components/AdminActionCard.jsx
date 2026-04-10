import React from 'react';

const AdminActionCard = ({
  title,
  description,
  actionText,
  onClick,
  primary = false,
}) => {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-lg">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <p className="mt-2 text-sm text-gray-600">{description}</p>
      </div>

      <button
        type="button"
        onClick={onClick}
        className={`inline-flex w-full items-center justify-center rounded-3xl px-5 py-3 text-sm font-semibold transition ${primary ? 'bg-[#b23a2f] text-white hover:bg-[#912f26]' : 'border border-[#b23a2f] bg-white text-[#b23a2f] hover:bg-[#fff2ee]'}`}
      >
        {actionText}
      </button>
    </div>
  );
};

export default AdminActionCard;

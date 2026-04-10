// src/components/Navbar.jsx
import React from 'react';
import { Link, useMatch, useNavigate } from 'react-router-dom';

function Navbar({ restaurant }) {
    const navigate = useNavigate();

    // 1. Use useMatch instead of useParams since Navbar sits outside the Routes
    const match = useMatch("/:restaurantName/table/:tableNumber/*");

    // 2. Grab variables safely from the URL match
    const tableNumber = match?.params?.tableNumber;

    // 3. Use the URL name, but fallback to the database name or May'sFoodies
    const restaurantName = match?.params?.restaurantName || restaurant?.name || "May'sFoodies";

    const getImageUrl = (url) => {
        if (!url) return null;
        if (url.includes('drive.google.com')) {
            const fileId = url.split('/d/')[1]?.split('/')[0] || url.split('id=')[1]?.split('&')[0];
            return fileId ? `https://drive.google.com/uc?export=view&id=${fileId}` : url;
        }
        return url;
    };

    const logoSrc = getImageUrl(restaurant?.logo_url);

    return (
        <nav className="bg-neutral-surface/90 backdrop-blur-md p-4 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto grid grid-cols-3 items-center px-4 md:px-8">

                {/* Left Side: Table Number */}
                <div className="flex items-center justify-start">
                    {tableNumber && (
                        <div className="font-bold text-[10px] text-tertiary uppercase tracking-widest bg-tertiary/10 px-3 py-1.5 rounded-md border border-tertiary/20">
                            Table {tableNumber}
                        </div>
                    )}
                </div>

                {/* Center: Branding & Navigation */}
                <div className="flex items-center justify-center gap-8">
                    <Link to={tableNumber ? `/${restaurantName}/table/${tableNumber}/menu` : "/"} className="flex items-center gap-3 group">
                        <span className="text-xl font-headline font-extrabold text-secondary tracking-tighter">
                            {restaurant?.name || restaurantName}
                        </span>
                    </Link>

                    {/* Only show menu links if we are active on a table */}
                    {tableNumber && (
                        <div className="hidden md:flex gap-6">
                            <button
                                onClick={() => navigate(`/${restaurantName}/table/${tableNumber}/menu`)}
                                className="text-xs font-bold text-gray-400 hover:text-primary transition-colors uppercase tracking-widest"
                            >
                                Menu
                            </button>
                            <button
                                onClick={() => navigate(`/${restaurantName}/table/${tableNumber}/cart`)}
                                className="text-xs font-bold text-gray-400 hover:text-primary transition-colors uppercase tracking-widest"
                            >
                                Cart
                            </button>
                            {/* NEW: Track Order Link */}
                            <button
                                onClick={() => navigate(`/${restaurantName}/table/${tableNumber}/status`)}
                                className="text-xs font-bold text-[#b23a2f] hover:text-primary transition-colors uppercase tracking-widest"
                            >
                                Track Order
                            </button>
                        </div>
                    )}
                </div>

                {/* Right Side: Actions & Logo Profile Avatar */}
                <div className="flex items-center justify-end gap-6">
                    <div className="flex items-center gap-4 border-l border-gray-100 pl-6">

                        {/* Only show the cart icon if we are active on a table */}
                        {tableNumber && (
                            <button
                                onClick={() => navigate(`/${restaurantName}/table/${tableNumber}/cart`)}
                                className="relative text-secondary hover:text-primary transition-colors pr-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                <span className="absolute -top-1 -right-1 bg-primary w-2 h-2 rounded-full border-2 border-white"></span>
                            </button>
                        )}

                        {/* Profile Avatar */}
                        <button className="w-9 h-9 rounded-full bg-secondary overflow-hidden border border-gray-100 shadow-sm transition-transform hover:scale-105 flex items-center justify-center">
                            {logoSrc ? (
                                <img
                                    src={logoSrc}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                    }}
                                />
                            ) : null}
                            <span className={`${logoSrc ? 'hidden' : 'flex'} text-[10px] font-bold text-white uppercase`}>
                                {restaurant?.name?.substring(0, 2) || 'MA'}
                            </span>
                        </button>
                    </div>
                </div>

            </div>
        </nav>
    );
}

export default Navbar;
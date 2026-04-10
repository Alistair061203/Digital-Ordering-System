// src/components/Navbar.jsx
import React from 'react';
import { Link, useMatch, useNavigate } from 'react-router-dom';
import { Bell, ShoppingBag } from 'lucide-react'; // Using Lucide for both icons to match!

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
            <div className="max-w-7xl mx-auto grid grid-cols-3 items-center px-1 md:px-8">

                {/* Left Side: Table Number */}
                <div className="flex items-center justify-start">
                    {tableNumber && (
                        <div className="font-bold text-[10px] text-tertiary uppercase tracking-widest bg-tertiary/10 px-3 py-1.5 rounded-md border border-tertiary/20 whitespace-nowrap">
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

                    {/* Desktop Navigation Links */}
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
                <div className="flex items-center justify-end">
                    <div className="flex items-center gap-3 border-l border-gray-100 pl-3 md:pl-6 md:gap-4">

                        {tableNumber && (
                            <>
                                {/* Notification / Track Order Icon (Mobile Only) */}
                                <button
                                    onClick={() => navigate(`/${restaurantName}/table/${tableNumber}/status`)}
                                    className="relative text-secondary hover:text-[#b23a2f] transition-colors p-1 md:hidden"
                                    aria-label="Track Order Status"
                                >
                                    <Bell size={20} strokeWidth={2.5} />
                                </button>

                                {/* Cart Icon (Shopping Bag to match your design) */}
                                <button
                                    onClick={() => navigate(`/${restaurantName}/table/${tableNumber}/cart`)}
                                    className="relative text-secondary hover:text-primary transition-colors p-1 md:pr-2"
                                    aria-label="View Cart"
                                >
                                    <ShoppingBag size={20} strokeWidth={2.5} />
                                    <span className="absolute top-0 right-0 md:-top-1 md:-right-1 bg-primary w-2.5 h-2.5 rounded-full border-2 border-white"></span>
                                </button>
                            </>
                        )}

                        {/* Profile Avatar */}
                        <button className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-secondary overflow-hidden border border-gray-100 shadow-sm transition-transform hover:scale-105 flex items-center justify-center flex-shrink-0">
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
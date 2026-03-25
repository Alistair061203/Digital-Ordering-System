// src/components/Navbar.jsx
import React from 'react';
import { Link, useMatch } from 'react-router-dom';

function Navbar({ restaurant }) {

    const menuRoute = useMatch("/:restaurantName/table/:tableNumber/menu");
    const tableNumber = menuRoute?.params?.tableNumber;

    return (
        <nav className="bg-white p-4 shadow-sm border-b border-gray-200 sticky top-0 z-50 ">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div>
                    <Link to="/" className="text-2xl font-black text-neutral flex items-center gap-2">
                        {restaurant?.name || 'BullEyeOrg'}
                    </Link>
                </div>

                {/* Right Side - Only shows the Table Number if they are on a menu page */}
                <div className="font-semibold text-sm text-gray-700 uppercase tracking-wide mr-3">
                    {tableNumber ? `TABLE ${tableNumber}` : ''}
                </div>

            </div>
        </nav>
    );
}

export default Navbar;
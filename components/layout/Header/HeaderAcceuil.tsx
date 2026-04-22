import React from 'react';
import { Search, MessageSquare, Bell, ShoppingCart, SlidersHorizontal } from 'lucide-react';
import Navigation from "./Navigation"

const HeaderAcceuil = () => {
  return (
    <nav className="w-full bg-white px-4 py-6 flex flex-col gap-6">
      {/* Top Row: Logo and Icons */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-gray-900 leading-tight">Nevo</h1>
          <p className="text-gray-500 text-sm font-medium">Votre marketplace idéale</p>
        </div>

        <div className="flex items-center gap-5">
          {/* Messages */}
          <div className="relative cursor-pointer">
            <MessageSquare size={28} className="text-gray-600" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white">
              2
            </span>
          </div>

          {/* Notifications */}
          <div className="relative cursor-pointer">
            <Bell size={28} className="text-gray-600" />
          </div>

          {/* Cart */}
          <div className="relative cursor-pointer">
            <ShoppingCart size={28} className="text-gray-600" />
            <span className="absolute -top-1 -right-2 bg-zinc-800 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white">
              4
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Row: Search Bar and menu */}
      <div className=" ">
            <div className="relative w-full">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                    <Search className="text-gray-400" size={22} />
                </div>
                <input
                type="text"
                placeholder="Rechercher une boutique..."
                className="w-full bg-gray-100 border-none rounded-full py-4 pl-14 pr-14 text-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-gray-200 outline-none transition-all"
                />
                <div className="absolute inset-y-0 right-3 flex items-center">
                    <button className="p-2 bg-white rounded-xl shadow-sm text-gray-600 hover:bg-gray-50 transition-colors">
                        <SlidersHorizontal size={20} />
                    </button>
                </div>
            </div>
            <div>
                <Navigation />
            </div>
            
        
      </div>
    </nav>
  );
};

export default HeaderAcceuil;
"use client";
import BottomNav from "@/components/features/ShopDashboardComponent/BottomNav"; 

import React, { useState, useMemo } from 'react';
import { Search, MessageSquare, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---
type TabType = 'Tous' | 'Produits' | 'Commandes' | 'Litiges';

interface Message {
  id: string;
  sender: string;
  category: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  type: TabType;
}

// --- Données Initiales ---
const MOCK_MESSAGES: Message[] = [
  {
    id: '1',
    sender: 'Clara Faith',
    category: 'chaussures',
    lastMessage: 'Bonsoir',
    time: '4h',
    unreadCount: 1,
    type: 'Produits',
  },
];

export default function MessageInterface() {
  const [activeTab, setActiveTab] = useState<TabType>('Tous');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs: { id: TabType; count?: number }[] = [
    { id: 'Tous', count: 1 },
    { id: 'Produits', count: 1 },
    { id: 'Commandes' },
    { id: 'Litiges' },
  ];

  // Logic de filtrage
  const filteredMessages = useMemo(() => {
    return MOCK_MESSAGES.filter((msg) => {
      const matchesSearch = msg.sender.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = activeTab === 'Tous' || msg.type === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [searchQuery, activeTab]);

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen font-sans text-slate-900">
      {/* Header & Search Section */}
      <div className="p-4 bg-white sticky top-0 z-10">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-indigo-600 transition-colors" />
          <input
            type="text"
            placeholder="Rechercher un client..."
            className="w-full bg-[#f1f5f9] border-none rounded-2xl py-3.5 pl-12 pr-10 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none text-[15px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-100 px-2 sticky top-[84px] bg-white z-10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="relative flex-1 py-3 text-[14px] font-semibold transition-colors"
          >
            <span className={activeTab === tab.id ? "text-slate-900" : "text-slate-400"}>
              {tab.id}
              {tab.count && (
                <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] ${
                  activeTab === tab.id ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"
                }`}>
                  {tab.count}
                </span>
              )}
            </span>
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-[3px] bg-teal-500 rounded-t-full"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait">
          {filteredMessages.length > 0 ? (
            <motion.div
              key={activeTab + searchQuery}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="divide-y divide-slate-50"
            >
              {filteredMessages.map((msg) => (
                <div 
                  key={msg.id} 
                  className="flex items-center p-4 gap-4 hover:bg-slate-50 transition-colors cursor-pointer active:scale-[0.98]"
                >
                  {/* Avatar avec badge */}
                  <div className="relative">
                    <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center border-2 border-indigo-200">
                      <span className="text-indigo-600 font-bold text-xl">
                        {msg.sender.charAt(0)}
                      </span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-lg shadow-sm border border-slate-100">
                      <div className="w-4 h-4 bg-slate-200 rounded flex items-center justify-center">
                         <div className="w-2.5 h-2.5 border-t border-r border-slate-400 rotate-45 translate-y-[1px]" />
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h3 className="font-bold text-slate-900 truncate">{msg.sender}</h3>
                      <span className="text-[12px] font-bold text-indigo-900">{msg.time}</span>
                    </div>
                    <p className="text-[13px] text-slate-400 mb-0.5">{msg.category}</p>
                    <div className="flex justify-between items-center">
                      <p className="text-[14px] text-slate-600 truncate font-medium">{msg.lastMessage}</p>
                      {msg.unreadCount > 0 && (
                        <span className="bg-indigo-900 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                          {msg.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-24 px-10 text-center"
            >
              <div className="w-24 h-24 bg-slate-50 rounded-2xl flex items-center justify-center mb-6">
                <MessageSquare className="w-12 h-12 text-slate-200" strokeWidth={1.5} />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">
                {searchQuery ? "Aucun résultat" : "Aucun message"}
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                {searchQuery 
                  ? `Aucune conversation ne correspond à votre recherche`
                  : `Aucune conversation de ce type`
                }
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <BottomNav/>
    </div>
  );
}
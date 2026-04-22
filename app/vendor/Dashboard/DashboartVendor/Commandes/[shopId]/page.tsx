"use client";

import React, { useState } from 'react';
import { 
  LayoutGrid, 
  Clock, 
  CheckCircle2, 
  Package, 
  Truck, 
  AlertTriangle, 
  TrendingUp,
  Inbox
} from 'lucide-react';
import { motion } from 'framer-motion';
import BottomNav from "@/components/features/ShopDashboardComponent/BottomNav"; 

// Types pour la structure
type TabType = 'Toutes' | 'En attente' | 'Confirmées' | 'Expédiées' | 'Livrées' | 'Litiges';

interface TabConfig {
  id: TabType;
  label: string;
  icon: React.ElementType;
}

const tabs: TabConfig[] = [
  { id: 'Toutes', label: 'Toutes', icon: LayoutGrid },
  { id: 'En attente', label: 'En attente', icon: Clock },
  { id: 'Confirmées', label: 'Confirmées', icon: CheckCircle2 },
  { id: 'Expédiées', label: 'Expédiées', icon: Package },
  { id: 'Livrées', label: 'Livrées', icon: CheckCircle2 },
  { id: 'Litiges', label: 'Litiges', icon: AlertTriangle },
];

export default function OrderManagement() {
  const [activeTab, setActiveTab] = useState<TabType>('En attente');

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FB]">
      {/* Header / Tabs Navigation */}
      <div className="bg-white border-b sticky top-0 z-20">
        <div className="flex overflow-x-auto no-scrollbar scroll-smooth">
          <div className="flex px-2">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-5 py-4 transition-colors ${
                    isActive ? "text-[#1E3A8A] font-semibold" : "text-gray-500"
                  }`}
                >
                  <tab.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-[14px] whitespace-nowrap">{tab.label}</span>
                  
                  {/* Transition du soulignement identique à la vidéo */}
                  {isActive && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#0D9488]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-3 gap-3 p-4">
        {/* En attente */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 flex flex-col items-center shadow-sm">
          <div className="text-orange-400 mb-1">
            <Clock size={22} />
          </div>
          <span className="text-2xl font-bold text-gray-800 leading-none">0</span>
          <span className="text-[11px] text-gray-400 mt-2 font-medium">En attente</span>
        </div>

        {/* Confirmées */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 flex flex-col items-center shadow-sm">
          <div className="text-emerald-500 mb-1">
            <CheckCircle2 size={22} />
          </div>
          <span className="text-2xl font-bold text-gray-800 leading-none">0</span>
          <span className="text-[11px] text-gray-400 mt-2 font-medium">Confirmées</span>
        </div>

        {/* CA Aujourd'hui */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 flex flex-col items-center shadow-sm">
          <div className="text-indigo-600 mb-1">
            <TrendingUp size={22} />
          </div>
          <span className="text-2xl font-bold text-gray-800 leading-none">0</span>
          <span className="text-[11px] text-gray-400 mt-2 font-medium">CA Aujourd&apos;hui</span>
        </div>
      </div>

      {/* Empty State / Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center -mt-20">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          key={activeTab} // Déclenche la transition au changement d'onglet
          className="flex flex-col items-center"
        >
          <div className="bg-gray-200/60 p-10 rounded-4xl mb-6">
            <Inbox size={60} className="text-gray-400/80" strokeWidth={1.5} />
          </div>
          
          <h2 className="text-[20px] font-medium text-gray-700">Aucune commande</h2>
          <p className="text-gray-400 text-[14px] mt-1">
            Tirez vers le bas pour actualiser
          </p>
        </motion.div>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <BottomNav/>
    </div>
  );
}
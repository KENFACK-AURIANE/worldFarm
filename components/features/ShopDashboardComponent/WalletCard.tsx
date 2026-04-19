/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";


import { Wallet, ChevronRight, CheckCircle2, Lock, Landmark, Info, Clock } from 'lucide-react';

export default function WalletCard({ data }: { data: any }) {
  return (
    <div className="max-w-md mx-auto p-4  lg:max-w-screen ">
      <div className="bg-linear-to-b from-[#1D267D] via-[#3F51B5] to-[#a61bd0] rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl">
        
        {/* Effet de cercle en arrière-plan */}
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

        {/* Header de la carte */}
        <div className="flex justify-between items-center mb-8 relative z-10">
          <div className="flex items-center gap-3">
            <Wallet size={24} className="opacity-90" />
            <span className="text-lg font-bold tracking-widest uppercase">Mon Portefeuille</span>
          </div>
          <ChevronRight size={20} className="opacity-70" />
        </div>

        {/* Solde Principal */}
        <div className="mb-8 relative z-10">
          <p className="text-lg opacity-70 font-medium mb-1 uppercase tracking-wider">Solde Total</p>
          <h1 className="text-5xl font-bold mb-2">{data?.totalSales || 0} FCFA</h1>
          <div className="flex items-center gap-1.5 opacity-60 text-[10px] text-lg">
            <span className="w-3 h-3 flex items-center justify-center text-lg"><Clock /></span>
            Mis à jour à l&apos;instant
          </div>
        </div>

        {/* Séparateur */}
        <div className="h-[1px] bg-white/20 w-full mb-8"></div>

        {/* Grille des statuts (Disponible / Bloqué) */}
        <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
          {/* Case Disponible */}
          <div className="bg-white/10 border border-white/5 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2 text-lg font-semibold">
              <CheckCircle2 size={14} className="text-green-400" />
              <span>Disponible</span>
            </div>
            <p className="text-2xl font-bold">0</p>
            <div className="mt-3 h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-green-400 w-0"></div>
            </div>
            <p className="text-[10px] mt-1 opacity-60">0%</p>
          </div>

          {/* Case Bloqué */}
          <div className="bg-white/10 border border-white/5 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2 text-lg font-semibold">
              <Lock size={14} className="text-orange-400" />
              <span>Bloqué</span>
            </div>
            <p className="text-2xl font-bold">0</p>
            <div className="mt-3 h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-orange-400 w-0"></div>
            </div>
            <p className="text-[10px] mt-1 opacity-60">0%</p>
          </div>
        </div>

        {/* Bouton d'action */}
        <button className="w-full bg-white text-[#4c48c9] py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors relative z-10">
          <Landmark size={20} />
          RETIRER MES GAINS
          <ChevronRight size={18} />
        </button>

        {/* Message d'information */}
        <div className="mt-4 bg-white/10 border border-white/5 rounded-xl p-3 flex items-start gap-3 relative z-10">
          <Info size={16} className="mt-0.5 shrink-0 opacity-80" />
          <div className="text-[15px] leading-snug opacity-90 ">
            Solde minimum requis: 500 FCFA pour effectuer un retrait
          </div>
        </div>
      </div>
    </div>
  );
};
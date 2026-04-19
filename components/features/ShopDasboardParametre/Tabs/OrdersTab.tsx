/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from 'react';
import { 
  
  ShoppingCart, 
  Save, 
  Lightbulb, 
  ShieldCheck, 
  Clock, 
  Lock, 
  DollarSign
} from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { Shop } from '@/lib/types/shop.types';
import { showToastSuccess } from '@/components/Toast/ToastSuccess';
import { showToastFailed } from '@/components/Toast/ToastFailed';

export const OrdersTab = ({ shop}: { shop: Shop }) => {
 
  const [minAmount, setMinAmount] = useState<number | "">(shop?.minimumOrderAmount || "");

  const [isLoading, setIsLoading] = useState(false);

  const handleSaveMinAmount = async () => {
    
    if (!shop?.shopId) {
        showToastFailed("Erreur : ID de la boutique introuvable");
        return;
    }
    try {
        setIsLoading(true);
      // L'API attend : /minimum-order-amount/{shopId}?amount={value}
      const response = await apiClient.patch(
        `/minimum-order-amount/${shop.shopId}`, 
        {}, // Corps vide
        { params: { amount: minAmount } } // Query parameters
      );

      if ( response.status === 200 || response.status === 204) {
        showToastSuccess("Montant minimum mis à jour ");
       
      }
    } catch (error) {
      console.error("Erreur:", error);
      showToastFailed("Erreur lors de la mise à jour : " + error);
    } finally {
      setIsLoading(false);
    }
  };


  return (
        <div className="min-h-screen bg-slate-50 pb-32 font-sans text-slate-900">
        

        <main className="p-4 space-y-4 max-w-lg mx-auto">
            {/* Section Montant Minimum */}
            <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 transition-all active:scale-[0.98]">
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-slate-100 p-2 rounded-xl">
                <DollarSign className="w-6 h-6 text-slate-600" />
                </div>
                <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">Montant minimum</h2>
                </div>
            </div>

            <div className="relative mb-6">
                <label className="absolute -top-3 left-4 bg-white px-2 text-xs text-slate-400 z-10">
                Montant minimum de commande (FCFA)
                </label>
                <div className="flex items-center border-2 border-slate-100 rounded-2xl p-4 transition-focus-within focus-within:border-blue-500">
                <ShoppingCart className="w-5 h-5 text-[#1e2b8b] mr-3" />
                <input
                    type="number"
                    value={minAmount}
                    // Si e.target.value est vide, on met "", sinon on met le nombre
                    onChange={(e) => setMinAmount(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full outline-none text-lg font-medium"
                    placeholder="0"
                />

                </div>
                <p className="text-xs text-slate-400 mt-2 ml-1">
                Le client devra atteindre ce montant pour passer commande
                </p>
            </div>

            <button 
            onClick={handleSaveMinAmount}
            disabled={isLoading}
            className="w-full bg-[#1e2b8b] text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70 shadow-lg shadow-blue-900/20"
          >
            {isLoading ? "Enregistrement..." : (
              <>
                <Save className="w-5 h-5" />
                Enregistrer le montant minimum
              </>
            )}
          </button>
            </section>

            {/* Section Conseil (Yellow Box) */}
            <section className="bg-[#fff9eb] border border-orange-100 rounded-3xl p-6 flex gap-4 transition-all hover:shadow-md">
            <div className="bg-white p-2 rounded-full h-fit shadow-sm">
                <Lightbulb className="w-6 h-6 text-orange-400 fill-orange-400/20" />
            </div>
            <div>
                <h3 className="font-bold text-slate-800 mb-1">Conseil</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                Laissez vide ou mettez 0 pour ne pas imposer de minimum. Un montant minimum peut aider à rentabiliser vos livraisons.
                </p>
            </div>
            </section>

            {/* Section Politique de commande */}
            <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-slate-100 p-2 rounded-xl text-slate-600">
                <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">Politique de commande</h2>
                </div>
            </div>

            <div className="space-y-6">
                {/* Item 1 */}
                <div className="flex gap-4">
                <div className="bg-blue-50 p-2 rounded-xl h-fit">
                    <ShieldCheck className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1 border-b border-slate-100 pb-4">
                    <h4 className="font-bold text-slate-800">Confirmation automatique</h4>
                    <p className="text-sm text-slate-400">Les commandes sont automatiquement confirmées après paiement</p>
                </div>
                </div>

                {/* Item 2 */}
                <div className="flex gap-4">
                <div className="bg-blue-50 p-2 rounded-xl h-fit">
                    <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1 border-b border-slate-100 pb-4">
                    <h4 className="font-bold text-slate-800">Délai de traitement</h4>
                    <p className="text-sm text-slate-400">24 heures pour confirmer ou annuler une commande</p>
                </div>
                </div>

                {/* Item 3 */}
                <div className="flex gap-4">
                <div className="bg-blue-50 p-2 rounded-xl h-fit">
                    <Lock className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                    <h4 className="font-bold text-slate-800">Paiement sécurisé</h4>
                    <p className="text-sm text-slate-400">Les fonds sont bloqués jusqu&apos;à la livraison</p>
                </div>
                </div>
            </div>
            </section>
        </main>

        </div>
    );
};
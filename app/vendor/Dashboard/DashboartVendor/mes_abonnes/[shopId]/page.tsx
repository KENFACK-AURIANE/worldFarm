"use client";

import React, { useEffect, useState } from 'react';
import { use } from "react";
import { ArrowLeft, RefreshCw,Users, Calendar,MessageSquare,CheckCircle2, Heart } from 'lucide-react';
import { apiClient } from "@/lib/api/client";
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useRouter } from "next/navigation"
import BottomNav from "@/components/features/ShopDashboardComponent/BottomNav"; 

// --- Interfaces basées sur votre documentation API ---
interface Subscriber {
  id: string;
  createdAt: string;
  shopId: string;
  shopName: string;
  shopLogo: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar: string | null;
}

interface PageInfo {
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
}

interface ApiResponse {
  content: Subscriber[];
  pageInfo: PageInfo;
}

export default function SubscribersPage({ params }: { params: Promise<{ shopId: string }> }) {
  const unwrappedParams = use(params);
  const shopId = unwrappedParams.shopId;
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter()
  console.log("donnees",shopId)

  // Exemple de l'appel API nécessaire pour ce rendu
  const fetchSubscribers = async () => {
    try {
      
      setIsLoading(true);
      const response = await apiClient.get(`/shop/user/subscriptions/shop/${shopId}`, {
        params: { page: 0, size: 20, sort: "createdAt,DESC" }
      });
      console.log("donnees",response.data.content)
      setSubscribers(response.data.content); // L'API renvoie 'content'
      console.log("donnees",response.data.content)
      setPageInfo(response.data.pageInfo);   // L'API renvoie 'pageInfo'
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  



  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header - Bleu foncé identique à l'image */}
    
      <div className="min-h-screen bg-slate-50 font-sans">
        {/* Header - Identique à votre image */}
        <header className="bg-[#1e2a78] text-white p-5 flex items-center justify-between sticky top-0 z-10 shadow-lg">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-1 hover:bg-white/10 rounded-full transition-colors">
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Mes Abonnés</h1>
              <p className="text-[11px] text-blue-200 font-medium uppercase tracking-wider">
                {pageInfo ? `${pageInfo.totalElements} membre${pageInfo.totalElements > 1 ? 's' : ''}` : 'Synchronisation...'}
              </p>
            </div>
          </div>
          <button 
            onClick={fetchSubscribers}
            className={`p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all ${isLoading ? 'animate-spin' : ''}`}
          >
            <RefreshCw size={20} />
          </button>
        </header>

        {/* Liste des abonnés */}
        <main className="p-4 max-w-2xl mx-auto space-y-4">
          {isLoading ? (
            // Skeleton Loader optimisé
            [1, 2, 3, 4].map((n) => (
              <div key={n} className="h-24 w-full bg-white rounded-2xl border border-gray-100 flex items-center p-4 gap-4">
                <div className="w-14 h-14 bg-gray-100 rounded-full animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-1/3 animate-pulse" />
                  <div className="h-3 bg-gray-100 rounded w-1/2 animate-pulse" />
                </div>
              </div>
            ))
          ) : (
            subscribers.map((subscriber) => (
              <div 
                key={subscriber.id}
                className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex items-center justify-between group transition-all hover:border-blue-200 active:scale-[0.98]"
              >
                <div className="flex items-center gap-4">
                  {/* Avatar avec gestion de l'absence d'image */}
                  <div className="w-14 h-14 rounded-full bg-linear-to-br from-blue-50 to-indigo-50 flex items-center justify-center border border-blue-100 shrink-0 overflow-hidden">
                    {subscriber.userAvatar ? (
                      <img 
                        src={subscriber.userAvatar} 
                        alt={subscriber.userName} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[#1e2a78] font-bold text-lg">
                        {subscriber.userName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                      </span>
                    )}
                  </div>

                  {/* Infos Utilisateur provenant de l'API */}
                  <div className="flex flex-col">
                    <h3 className="font-bold text-slate-800 text-base leading-tight">
                      {subscriber.userName}
                    </h3>
                    <p className="text-xs text-slate-500 mb-1">
                      {subscriber.userEmail}
                    </p>
                    <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400">
                      <Calendar size={12} className="text-blue-400" />
                      <span>
                        Membre depuis le {new Date(subscriber.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                      
                    </div>
                  </div>
                </div>

                {/* Actions / Statut */}
                <div className="flex flex-col items-end gap-2">
                  <div className="bg-vendor-primary/10 text-bg-vendor-primary px-3 py-1 rounded-full text-[10px] font-bold border border-vendor-primary/10 flex items-center gap-1">
                      <Heart size={10} className='fill-vendor-primary' />
                      Abonné
                  </div>
                  
                </div>
              </div>
            ))
          )}

          {/* État vide si l'API renvoie content: [] */}
          {!isLoading && subscribers.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="bg-slate-100 p-6 rounded-full mb-4">
                <Users size={40} className="text-slate-300" />
              </div>
              <h4 className="font-bold text-slate-800">Aucun abonné</h4>
              <p className="text-sm text-slate-400 max-w-50 mt-1">
                Partagez votre boutique pour attirer vos premiers abonnés !
              </p>
            </div>
          )}
        </main>
      </div>

      <BottomNav/>
    </div>
  );
}
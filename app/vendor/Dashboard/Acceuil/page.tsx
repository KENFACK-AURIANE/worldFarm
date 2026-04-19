/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { MapPin, ChevronRight, Box, ShoppingBag, Star, Loader2, Plus } from 'lucide-react';
import { useShopsData } from '@/lib/hooks/UseShopData';
import { showToastLogin } from '@/components/Toast/ToastLogin';
import Image from 'next/image';
import {useRouter }from 'next/navigation';

const Acceuil = () => {
  const { shops, loading, error } = useShopsData();
  const router = useRouter();
  

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-indigo-600 mb-2" size={40} />
        <p className="text-gray-500">Chargement de vos boutiques...</p>
      </div>
    );
  }

  if (error) {
    showToastLogin("Erreur de connexion: " + error);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#1a1a40] via-[#2d3269] to-[#4facfe] p-8 pb-16 text-white">
        <div className="max-w-2xl mx-auto">
           <h1 className="text-3xl font-bold">Mes boutiques</h1>
           <p className="opacity-80 mt-1">{shops.length} boutiques disponibles</p>
        </div>
      </div>

      {/* Liste des boutiques dynamiques */}
      <div className="max-w-2xl mx-auto px-4 -mt-8 pb-10">
        <div className="space-y-4">
          {shops.map((shop) => (
            <div key={shop.shopId} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100" onClick={() => router.push(`/vendor/Dashboard/DashboartVendor/${shop.shopId}`)}>
              
              {/* Infos Boutique */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center overflow-hidden border">
                    {shop.logoUrl ? (
                      <Image src={shop.logoUrl} alt={shop.name} 
                      width={300}
                      height={300}
                      className="object-cover w-full h-full" />
                    ) : (
                      <span className="text-indigo-600 font-bold">{shop.name.substring(0,2).toUpperCase()}</span>
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">{shop.name}</h2>
                    <p className="flex items-center text-gray-400 text-sm mt-1">
                      <MapPin size={14} className="mr-1" /> {shop?.address?.city},{shop?.address?.region}, {shop?.address?.country}
                    </p>
                  </div>
                </div>
                <ChevronRight className="text-indigo-900" />
              </div>

              {/* Stats provenant de l'API */}
              <div className="bg-gray-50 rounded-2xl p-4 grid grid-cols-3 gap-2 mb-6">
                <StatItem icon={<Box size={20}/>} value={shop?.data?.numberOfProducts} label="Produits" />
                <StatItem icon={<ShoppingBag size={20}/>} value={shop?.data?.numberOfSales} label="Ventes" />
                <StatItem icon={<Star size={20}/>} value={shop?.data?.rating} label="Note" />
              </div>

              {/* Badges Dynamiques */}
              <div className="flex flex-wrap gap-2">
                <Badge type="info" >
                  {shop.isActive ? "Active" : "Inactif"}
                </Badge>
                <Badge type="info">{shop.souscription?.shopSouscriptionType?.name}</Badge>
                {shop.isVerified && <Badge type="success">Vérifiée</Badge>}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className='px-4 md:px-50 '>
        {/* Bouton d'action */}
        <button className="w-full bg-white text-vendor-primary py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors mx-auto  mb-4  lg:max-w-screen lg:mb-20" onClick={() => router.push("/vendor/createShop/Plan")}>
          <Plus size={20} />
            Créer une nouvelle boutique
          
        </button>
      </div>
      
    </div>
  );
};

// Sous-composants pour plus de clarté
const StatItem = ({ icon, value, label }: { icon: any, value: any, label: string }) => (
  <div className="flex flex-col items-center border-r last:border-0 border-gray-200">
    <div className="text-indigo-900 mb-1">{icon}</div>
    <span className="font-bold text-gray-800">{value}</span>
    <span className="text-xs text-gray-400">{label}</span>
  </div>
);

const Badge = ({ children, type }: { children: React.ReactNode, type: 'success' | 'info' | 'neutral' }) => {
  const styles = {
    success: 'bg-green-50 text-green-600 border-green-100',
    info: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    neutral: 'bg-gray-100 text-gray-500 border-gray-200',
  };
  return (
    <span className={`px-4 py-1 rounded-full text-xs font-medium border ${styles[type]}`}>
      {children}
    </span>
  );
};

export default Acceuil;
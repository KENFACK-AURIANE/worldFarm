/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import WalletCard from "@/components/features/ShopDashboardComponent/WalletCard";
import SalesChart from "@/components/features/ShopDashboardComponent/SalesChart";
import EmptyOrders from "@/components/features/ShopDashboardComponent/EmptyOrders";
import EmptyProducts from "@/components/features/ShopDashboardComponent/EmptyProducts";
import BottomNav from "@/components/features/ShopDashboardComponent/BottomNav"; 
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api/client";
import { queryGraphql } from "@/lib/api/apiGraphql";
import { FETCH_SHOP_BY_ID } from "@/lib/services/shopService";
import { AlertTriangle, Archive, Bell, Eye, Info, Megaphone, Settings, Star, Store, Users, Verified,Hand, CheckCircle, TrendingUp, ClipboardCheck  } from "lucide-react";
import { BiMovie } from "react-icons/bi";
import AlertMerchant from "@/components/features/ShopDashboardComponent/AlertMerchant";

export default function ShopDashboard() {
  const { shopId } = useParams();
  const [shop, setShop] = useState<any>(null); // État pour stocker la boutique
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [totalContentCount, setTotalContentCount] = useState(0)
  const [salesData, setSalesData] = useState<any>(null);

 useEffect(() => {
    if (!shopId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        // On attend la réponse de la requête GraphQL
        const response = await queryGraphql(FETCH_SHOP_BY_ID, { shopId });
        setShop(response?.fetchShopById);
        console.log("Détails de la boutique:", response?.fetchShopById);

        // Récupérer les commandes en attente (PENDING)
        // On utilise le endpoint : /order/shop/{shopId}/PENDING
        const ordersRes = await apiClient.get(`/order/shop/${shopId}/PENDING?size=1`);

        // recuperer les inforlations sur les reels
        const reelsRes = await apiClient.get(`/reels/vendor/stats/${shopId}`);
        const storiesRes = await apiClient.get(`/stories/vendor/stats/${shopId}`);
        const totalR = reelsRes.data.totalReels || 0;
        const totalS = storiesRes.data.totalActiveStories || 0
        setTotalContentCount(totalR + totalS);
        const salesRes = await apiClient.get(`/analytics/shops/${shopId}/sales/weekly`);
        setSalesData(salesRes.data);
        
        setPendingOrdersCount(ordersRes.data.totalElements || ordersRes.data.content?.length || 0);
      } catch (error) {
        console.error("Erreur GraphQL:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [shopId]);


  return (
    <div className="pb-20 max-w-md bg-green-50  lg:max-w-screen ">
      {/* header */}
      <div className="bg-[#1D267D] text-white p-4 flex items-center justify-between sticky top-0 z-50 shadow-md w-screen md:w-full">
        <div className="flex items-center gap-2">
          <Store className="h-6 w-6" />
          <h1 className="text-xl font-bold">Ma Boutique</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="hover:text-blue-200"><Star className="h-5 w-5" /></button>
          <button className="hover:text-blue-200"><Users className="h-5 w-5" /></button>
          <div className="relative">
            <button className="hover:text-blue-200"><Bell className="h-5 w-5" /></button>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">6</span>
          </div>
          <button className="hover:text-blue-200"><Megaphone className="h-5 w-5" /></button>
          <button className="hover:text-blue-200"><Settings className="h-5 w-5" onClick={() => router.push(`/vendor/Dashboard/DashboartVendor/parametres/${shop.shopId}`)} /></button>
        </div>
      </div>

      <div className="w-full">   

        {/* presentation de la boutique */}
        <div className="bg-linear-to-b from-[#1D267D] via-[#3F51B5] to-[#a61bd0] text-white p-6 rounded-3xl shadow-lg  -mt-4 mb-6 relative overflow-hidden">
          <div className="flex justify-between items-center mb-5 relative z-10">
            <div>
              <p className="text-xl font-bold flex items-center gap-1.5 mb-2">Bonjour <Hand size={24} color="#FFCC00" /></p>
              <h2 className="text-5xl font-extrabold tracking-tight">{shop?.name}</h2>
            </div>
            <div className="flex items-center gap-2.5">
              <button className="bg-[#FFFFFF]/10 p-2.5 rounded-full hover:bg-[#FFFFFF]/20 text-indigo-100"><Info className="h-6 w-6"/></button>
              <button className="bg-[#FFFFFF]/10 px-5 py-2.5 rounded-full font-semibold flex items-center gap-2 text-indigo-100 hover:bg-[#FFFFFF]/20">
                  <Eye className="h-5 w-5"/> Aperçu
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-3 relative z-10 mb-2">
            <div className="bg-[#FFFFFF]/10 px-4 py-2 rounded-full text-xs font-medium text-indigo-100 flex items-center gap-1.5 border border-[#FFFFFF]/10">
              {shop?.isVerified ? (<span className="flex flex-row "><Verified className="h-3.5 w-3.5 green-500" /> Vérifié</span>) : (<span className="flex flex-row gap-2 " ><AlertTriangle className="h-3.5 w-3.5 text-red-400" /> En attente de vérification</span>)}
            </div>
            <div className="bg-[#FFFFFF]/10 px-4 py-2 rounded-full text-xs font-medium text-indigo-100 flex items-center gap-1.5 border border-[#FFFFFF]/10">
                <Store className="h-3.5 w-3.5 text-indigo-200" /> {shop?.souscription?.shopSouscriptionType?.name }
            </div>
          </div>
          <div className="bg-[#E53935]/15 border border-[#E53935]/20 text-[#EF9A9A] px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 w-fit relative z-10">
            {!shop?.souscription?.active ? (<span className="flex flex-row gap-2 " ><AlertTriangle className="h-3.5 w-3.5 text-red-400" /> Abonnement expiré</span>) : (<span className="flex flex-row gap-2 " ><CheckCircle className="h-3.5 w-3.5 text-green-400" /> Abonnement actif</span>)}
          </div>
        </div> 
      </div>
      <div>
        <AlertMerchant />
        <WalletCard data={shop} />

        <div className="mx-4 mt-4 grid grid-cols-4 gap-2 text-lg">
          {/* sales */}
          <div className="bg-white p-3 rounded-xl text-center shadow-md h-40 w-22 flex flex-col items-center justify-center gap-2 lg:w-70">
            <div className="bg-green-200 rounded-full h-10 w-10 flex items-center">
              <TrendingUp size={20} className="mx-auto mb-1 text-green-500"/>
            </div>
            
            <p className="font-bold">{shop?.totalSales || 0}</p>
            <p className="text-gray-400 text-sm">Ventes Aujoud&apos;hui</p>
          </div>  

          {/* commandes en attente */}
          <div className="bg-white p-3 rounded-xl text-center shadow-md h-40 w-22 flex flex-col items-center justify-center gap-2 lg:w-70">
            <div className="bg-orange-200 rounded-full h-10 w-10 flex items-center">
              <ClipboardCheck size={20} className="mx-auto mb-1 text-orange-500" />
            </div>
            
            <p className="font-bold">{pendingOrdersCount}</p>
            <p className="text-gray-400 text-sm w-10">En attente</p>
          </div>  

          {/* produits actifs */}
          <div className="bg-white p-3 rounded-xl text-center shadow-md h-40 w-22 flex flex-col items-center justify-center gap-2 lg:w-70">
            <div className="bg-violet-200 rounded-full h-10 w-10 flex items-center">
              <Archive size={20} className="mx-auto mb-1 text-violet-500 fill-violet-500 stroke-white"  />
            </div>
            
            <p className="font-bold">{shop?.data?.numberOfProducts || 0}</p>
            <p className="text-gray-400 text-sm">Produits Actifs</p>
          </div>  

          {/* reels et status */}
          <div className="bg-white p-3 rounded-xl text-center shadow-md h-40 w-22 flex flex-col items-center justify-center gap-2 lg:w-70">
            <div className="bg-blue-200 rounded-full h-10 w-10 flex items-center">
              <BiMovie size={20} className="mx-auto mb-1 text-blue-500" />
            </div>
            
            <p className="font-bold text-sm">{totalContentCount}</p>
            <p className="text-gray-400 text-sm">Réels & Status</p>
          </div>  
        </div>
        
        <SalesChart salesData={salesData} />
        {pendingOrdersCount === 0 && <EmptyOrders />}
        {shop?.data?.numberOfProducts === 0 && <EmptyProducts />} 

      </div>
      
      
      

      {/* {shop.orders.length === 0 && <EmptyOrders />}
      {shop.products.length === 0 && <EmptyProducts />} */}

      <BottomNav />
    </div>
  );
}
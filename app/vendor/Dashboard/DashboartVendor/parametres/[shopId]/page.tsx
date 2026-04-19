/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { SetStateAction, useEffect, useState } from "react"; 
import { GeneralTab } from "@/components/features/ShopDasboardParametre/Tabs/GeneralTab"; 
import { DeliveryTab } from "@/components/features/ShopDasboardParametre/Tabs/DeliveryTab"; 
import { OrdersTab } from "@/components/features/ShopDasboardParametre/Tabs/OrdersTab"; 
import { AppearanceTab } from "@/components/features/ShopDasboardParametre/Tabs/AppearanceTab";
import { useParams, useRouter } from "next/navigation";
import { queryGraphql } from "@/lib/api/apiGraphql";
import { 
  Store, Truck, ShoppingCart, Palette
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FETCH_SHOP_BY_ID } from "@/lib/services/shopService";

const ShopSettings = () => { 
    const { shopId } = useParams();
    const [shop, setShop] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("general");
    const tabs = [
        { id: 'general', icon: Store },
        { id: 'delivery', icon: Truck },
        { id: 'orders', icon: ShoppingCart },
        { id: 'appearance', icon: Palette },
      ];

    useEffect(() => {
        if (!shopId) return;
    
        const fetchData = async () => {
          try {
            setLoading(true);
            // On attend la réponse de la requête GraphQL
            const response = await queryGraphql(FETCH_SHOP_BY_ID, { shopId });
            setShop(response?.fetchShopById);
            console.log("Détails de la boutique:", response?.fetchShopById);
    
          } catch (error) {
            console.error("Erreur GraphQL:", error);
          } finally {
            setLoading(false);
          }
        };
    
        fetchData();
    }, [shopId]);


    

return ( 
    <div className="min-h-screen bg-slate-50">
        <div className="flex gap-2 p-2 bg-indigo-900 text-white">
            {tabs.map((tab) => (
                <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex flex-col items-center gap-1 relative pb-1 transition-all"
                >
                <tab.icon size={20} className={activeTab === tab.id ? "text-white" : "text-gray-400"} />
                <span className={`text-[10px] ${activeTab === tab.id ? "font-bold text-white" : "text-gray-400"}`}>{tab.id}</span>
                {activeTab === tab.id && (
                    <motion.div layoutId="underline_tab" className="absolute -bottom-1 w-full h-1 bg-green-500 rounded-full" />
                )}
                </button>
            ))}
        </div>

        {/* Content */}
        <div className="">
          {activeTab === "general" && (
          <GeneralTab shop={shop}  />
          )}
          {activeTab === "delivery" && <DeliveryTab  shop={shop} />}
          {activeTab === "orders" && <OrdersTab shop={shop} />}
          {activeTab === "appearance" && <AppearanceTab  shop={shop} />}
        </div>
    </div>

); };

export default ShopSettings;
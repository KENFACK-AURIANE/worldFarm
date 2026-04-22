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
import { AlertTriangle,BadgeCheck,Globe, MousePointerClick, CheckCircle2 ,X, Archive, Bell, Eye, Info, Megaphone, Settings, Star, Store, Users, Verified,Hand, CheckCircle, TrendingUp, ClipboardCheck,Zap, Gem,Wallet,Gift ,ChevronRight  } from "lucide-react";
import { BiMovie } from "react-icons/bi";
import { motion, AnimatePresence } from 'framer-motion';
import AlertMerchant from "@/components/features/ShopDashboardComponent/AlertMerchant";
import Link from 'next/link';

// --- Composants Types ---
interface CommissionRowProps {
  label: string;
  value: string;
}

const CommissionRow = ({ label, value }: CommissionRowProps) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
    <span className="text-gray-600 text-sm">{label}</span>
    <div className="bg-blue-50 text-blue-600 px-4 py-1 rounded-full font-bold text-sm min-w-17.5 text-center">
      {value}
    </div>
  </div>
);

export default function ShopDashboard() {
  const { shopId } = useParams();
  const [shop, setShop] = useState<any>(null); // État pour stocker la boutique
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [totalContentCount, setTotalContentCount] = useState(0)
  const [salesData, setSalesData] = useState<any>(null);
  const [isSheetSponsorOpen, setIsSheetSponsorOpen] = useState(false);
  const [isForfaitOpen, setIsForfaitOpen] = useState(false);

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
          <Link 
            href={`/vendor/Dashboard/DashboartVendor/mes_abonnes/${shopId}`}
            className="hover:text-blue-200 transition-colors"
          >
            <button  className="hover:text-blue-200"><Users className="h-5 w-5" /></button>
          </Link>
          
          <div className="relative">
            <button className="hover:text-blue-200"><Bell className="h-5 w-5" /></button>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">6</span>
          </div>
          <button onClick={() => setIsSheetSponsorOpen(true)} className="hover:text-blue-200"><Megaphone className="h-5 w-5" /></button>
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
              <button  onClick={() => setIsForfaitOpen(true)} className="bg-[#FFFFFF]/10 p-2.5 rounded-full hover:bg-[#FFFFFF]/20 text-indigo-100"><Info className="h-6 w-6"/></button>
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

      {/* Bannière Sponsoring */}
      <button 
        onClick={() => setIsSheetSponsorOpen(true)}
        className=" bg-indigo-600 rounded-2xl p-4 text-white flex items-center justify-between shadow-lg shadow-indigo-200 mx-4 mt-4 md:w-full md:mr-15"
      >
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-xl">
            <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
          </div>
          <div className="text-left">
            <h3 className="font-bold">Sponsorisez votre boutique</h3>
            <p className="text-xs text-indigo-100">Apparaissez en tête de page et boostez vos ventes !</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 opacity-70" />
      </button>

      {/* Bottom Sheet Overlay */}
      <AnimatePresence>
        {isSheetSponsorOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSheetSponsorOpen(false)}
              className="fixed inset-0 bg-black/40 z-40"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-slate-50 rounded-t-4xl z-50 max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                {/* Barre de drag */}
                <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto mb-6" />
                
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <div className="bg-amber-500 p-2 rounded-lg text-white">
                      <Star className="w-5 h-5 fill-current" />
                    </div>
                    <h2 className="text-xl font-bold">Sponsoriser ma boutique</h2>
                  </div>
                  <button onClick={() => setIsSheetSponsorOpen(false)} className="bg-slate-200 p-1 rounded-full">
                    <X className="w-5 h-5 text-slate-600" />
                  </button>
                </div>

                {/* Carte Boost */}
                <div className="bg-linear-to-br from-indigo-700 to-indigo-900 rounded-2xl p-5 text-white mb-6 flex items-start gap-4">
                  <div className="bg-white/20 p-3 rounded-xl mt-1">
                    <Star className="w-6 h-6 fill-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Boostez votre visibilité</h3>
                    <p className="text-sm text-indigo-100 opacity-90">
                      Votre boutique apparaîtra en tête de la page d&apos;accueil avec le badge Sponsorisé.
                    </p>
                  </div>
                </div>

                {/* Avantages */}
                <div className="mb-8">
                  <h4 className="font-bold mb-4">Avantages du sponsoring</h4>
                  <div className="space-y-4">
                    {[
                      { icon: Eye, label: 'Visibilité maximale', desc: "Mise en avant sur la page d'accueil" },
                      { icon: BadgeCheck, label: 'Badge Sponsorisé', desc: "Distinguez-vous des autres boutiques" },
                      { icon: TrendingUp, label: 'Plus de clients', desc: "Augmentez vos ventes et vos abonnés" },
                      { icon: MousePointerClick, label: 'Auto-défilement', desc: "Votre boutique défile automatiquement" },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
                            <item.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-sm">{item.label}</p>
                            <p className="text-xs text-slate-400">{item.desc}</p>
                          </div>
                        </div>
                        <CheckCircle2 className="w-5 h-5 text-green-500 fill-green-50" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section "Comment" */}
                <div className="bg-white rounded-3xl p-6 border border-slate-100 mb-6 text-center">
                  <div className="bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600">
                    <Globe className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-lg mb-3">Comment sponsoriser ?</h4>
                  <p className="text-sm text-slate-500 leading-relaxed mb-6">
                    Pour sponsoriser votre boutique, connectez-vous à votre compte Nevo Market sur notre site web. 
                    C&apos;est depuis la plateforme web que vous pourrez remplir votre demande de sponsorisation et effectuer le paiement.
                  </p>
                  
                  <div className="space-y-4 text-left max-w-xs mx-auto">
                    {[
                      "Rendez-vous sur nevomarket.com",
                      "Connectez-vous avec votre compte vendeur",
                      "Accédez à la section \"Sponsorisation\"",
                      "Remplissez le formulaire et payez"
                    ].map((step, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <span className="shrink-0 w-6 h-6 bg-indigo-900 text-white text-xs rounded-full flex items-center justify-center font-bold">
                          {i + 1}
                        </span>
                        <p className="text-sm font-medium text-slate-700">{step}</p>
                      </div>
                    ))}
                  </div>

                  {/* Info Box */}
                  <div className="mt-8 bg-amber-50 border border-amber-100 p-4 rounded-xl flex items-start gap-3 text-left">
                    <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-white text-[10px] font-bold mt-0.5">i</div>
                    <p className="text-xs text-amber-700 font-medium">
                      Votre demande sera traitée sous 24h après validation du paiement.
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => setIsSheetSponsorOpen(false)}
                  className="w-full bg-indigo-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  J&apos;ai compris
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

       {/* --- Bottom Sheet Forfaits & Commissions --- */}
      <AnimatePresence>
        {isForfaitOpen && (
          <>
            {/* Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsForfaitOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
            />
            
            {/* Sheet */}
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-x-0 bottom-0 z-50 bg-[#f8f9fe] rounded-t-[40px] max-h-[90vh] overflow-y-auto text-slate-900"
            >
              {/* Handle */}
              <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-4" />
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-indigo-600 rounded-2xl text-white">
                      <Wallet size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Forfaits & Commissions</h2>
                      <p className="text-sm text-gray-500">Comprendre nos tarifs</p>
                    </div>
                  </div>
                  <button onClick={() => setIsForfaitOpen(false)} className="p-2 bg-gray-100 rounded-full">
                    <X size={20} className="text-gray-400" />
                  </button>
                </div>

                {/* FAQ Note */}
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6 flex gap-4">
                  <div className="text-blue-500">
                    <Info size={24} />
                  </div>
                  <div>
                    <h4 className="text-blue-700 font-bold text-sm mb-1">Quand les frais s&apos;appliquent-ils ?</h4>
                    <p className="text-blue-600/80 text-[13px] leading-snug">
                      Les commissions Nevo Market sont prélevées uniquement lors du passage de votre solde bloqué vers votre solde disponible.C&apos;est la seule fois que nous appliquons des frais sur chaque transaction.
                    </p>
                  </div>
                </div>

                {/* Plan Gratuit */}
                <div className="bg-white border border-gray-200 rounded-3xl p-5 mb-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-gray-100 rounded-xl text-gray-600">
                      <Gift size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold">Gratuit</h3>
                      <p className="text-sm text-gray-500">0 FCFA / mois</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50/50 rounded-2xl p-4">
                    <div className="flex justify-between text-[11px] font-bold text-indigo-900 uppercase tracking-wider mb-2 px-1">
                      <span>Tranche (FCFA)</span>
                      <span>NM + Opérateur</span>
                    </div>
                    <CommissionRow label="0 - 100 000" value="9%" />
                    <CommissionRow label="100 001 - 200 000" value="8%" />
                    <CommissionRow label="200 001 - 800 000" value="7%" />
                    <CommissionRow label="800 001+" value="5%" />
                  </div>
                </div>

                {/* Plan Premium */}
                <div className="bg-white border-2 border-orange-200 rounded-3xl p-5 mb-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-orange-100 rounded-xl text-orange-500">
                      <Gem size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">Premium</h3>
                        <span className="bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full uppercase font-black">Populaire</span>
                      </div>
                      <p className="text-sm text-gray-500">5 000 FCFA / mois</p>
                    </div>
                  </div>
                  
                  <div className="bg-orange-50/30 rounded-2xl p-4">
                    <div className="flex justify-between text-[11px] font-bold text-orange-900/60 uppercase tracking-wider mb-2 px-1">
                      <span>Tranche (FCFA)</span>
                      <span>NM + Opérateur</span>
                    </div>
                    <CommissionRow label="0 - 100 000" value="6%" />
                    <CommissionRow label="100 001 - 200 000" value="5%" />
                    <CommissionRow label="200 001 - 800 000" value="4%" />
                    <CommissionRow label="800 001+" value="3%" />
                  </div>
                </div>

                {/* Footer Info */}
                <div className="flex items-start gap-3 p-2 opacity-70 mb-10  flex-col">
                  <div className="flex flex-row gap-5">
                    <Info size={16} className="mt-1 shrink-0" />
                    <p>Commissions tout inclus</p>
                  </div>
                  
                  <p className="text-xs leading-relaxed">
                    Les pourcentages affichés incluent à la fois les frais de la plateforme Nevo Market et les frais des opérateurs Mobile Money. Aucun frais supplémentaire ne sera déduit.
                  </p>
                </div>
                <div className="max-w-md p-6 bg-slate-50 border border-slate-200 rounded-3xl shadow-sm">
                  {/* Titre de la légende */}
                  <h3 className="text-xl font-bold text-indigo-900 mb-4">
                    Légende
                  </h3>

                  <div className="space-y-4">
                    {/* Première ligne : Commission */}
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-indigo-900 rounded-md mt-0.5 shrink-0" />
                      <p className="text-gray-800 font-medium">
                        Commission totale <span className="text-gray-400 font-normal ml-1">• NM + Opérateurs Mobile Money</span>
                      </p>
                    </div>

                    {/* Deuxième ligne : Information promotionnelle */}
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-md mt-0.5 shrink-0" />
                      <p className="text-green-600 font-semibold italic">
                        Plus le montant est élevé, moins vous payez !
                      </p>
                    </div>
                  </div>
                  
                  {/* Optionnel : Une petite icône d'info pour enrichir l'UI */}
                  <div className="mt-6 flex justify-end">
                    <Info size={18} className="text-indigo-300" />
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      
      

      {/* {shop.orders.length === 0 && <EmptyOrders />}
      {shop.products.length === 0 && <EmptyProducts />} */}

      <BottomNav />
    </div>
  );
}
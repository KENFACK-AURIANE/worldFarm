/* eslint-disable @typescript-eslint/no-explicit-any */

import { queryGraphql } from "@/lib/api/apiGraphql";
import Image from "next/image";
import { Store, ShieldCheck, BadgeCheck, Star, Users, ShoppingBag, Truck, HelpCircle,Lock, Headset, Shield, CheckCircle2, Home, MapPin, ArrowLeft } from "lucide-react";
import { FETCH_SHOP_BY_ID } from "@/lib/services/shopService";
import HorairesOuverture from "@/components/features/cart/HorairesOuverture";
import PersonnalShopHeader from "@/components/layout/Header/PersonnalShopHeader";





// On définit le type de params comme une Promesse (spécifique à Next.js 15/16)
interface Props {
  params: Promise<{ shopId: string }>;
}
export default async function ShopDetailPage({ params }: Props) {



  // 1. Récupérer l'ID de l'URL
  const { shopId } = await params; // On attend que les params soient disponibles

  // 2. Appeler le serveur avec la fonction findProductById
  const data = await queryGraphql(FETCH_SHOP_BY_ID, { shopId: shopId });
  const shop = data?.fetchShopById;
  
 
  // 3. Gérer le cas où le produit n'existe pas
  if (!shop) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-xl font-bold">Oups ! Boutique introuvable.</h1>
        <p className="text-gray-500">L&apos;ID {shopId} ne correspond à aucune boutique.</p>
      </div>
    );
  }

  // 4. Affichage des informations
  return (
    <div className="container mx-auto  md:p-12 text-xl">
      <div  className="sticky top-0 z-50">
        <PersonnalShopHeader s={shop} />
      </div>
      
      <div className="flex flex-col md:flex-row gap-10">
        
        {/* BLOC IMAGE (Utilise tes classes de design system) */}
        <div className="w-full md:w-1/2 relative aspect-square rounded-xl shadow-card overflow-hidden border border-border">
          <Image 
            src={shop.logoUrl || "/images/default-shop.png"} 
            alt={shop.name} 
            fill 
            className="object-cover"
            priority // Charge l'image en priorité
          />
        </div>

        {/* BLOC INFOS */}
        <div className="w-full p-6 md:w-1/2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">{shop.name}</h1>
            <div className="flex items-center gap-2 text-primary-dark">
              <Store size={20} />
              <span className="font-medium">{shop?.name}</span>
              {shop?.isVerified && <BadgeCheck size={18} className="text-blue-500" />}
            </div>
          </div>

          {/* description */}
          <div className="text-xl">
            {shop.description}
          </div>

          {/* données */}
          <div className="flex flex-row justify-between h-40 border border-gray-500 rounded-2xl p-5 bg-gray-200">
            <div className="flex flex-col justify-between items-center ">
              <div className="bg-rating/30  h-15 w-15 flex justify-center items-center rounded-full ">
                <Star className="fill-rating stroke-rating"/>
              </div>
              
              <span className="font-bold text-black text-xl">{shop.data.rating === 0 ? "-" : shop.data.rating}</span>
              <p className="text-lg">
                note
              </p>
            </div>

              {/* ligne grises pour séparer les données */}
            <span className="bg-gray-400 h-20 mt-2 text-gray-400"> ,</span>

            <div className="flex flex-col justify-between items-center ">
              <div className="bg-blue-200  h-15 w-15 flex justify-center items-center rounded-full ">
                <Users className="fill-blue-500 stroke-blue-500"/>
              </div>
              
              <span className="font-bold text-black text-xl">{shop.data.numberOfSubscribers}</span>
              <p className="text-lg">Abonnés</p>
            </div>

            <span className="bg-gray-400 h-20 mt-2 text-gray-400"> ,</span>

            <div className="flex flex-col justify-between items-center">
              <div className="bg-green-200  h-15 w-15 flex justify-center items-center rounded-full ">
                <ShoppingBag className="fill-green-500 stroke-white"/>
              </div>
              
              <span className="font-bold text-black text-xl">{shop.data.numberOfProducts}</span>
              <p className="text-lg">Produits</p>
            </div>

            <span className="bg-gray-400 h-20 mt-2 text-gray-400"> ,</span>

            <div className="flex flex-col justify-between items-center">
              <div className="bg-purple-300  h-15 w-15 flex justify-center items-center rounded-full ">
                <Truck className="fill-purple-500 stroke-purple-500"/>
              </div>
              
              <span className="font-bold text-black text-xl">{shop.data.numberOfSales}</span>
              <p className="text-lg">Ventes</p>
            </div>
          </div>

          {/* securité */}
          <div className="p-4 bg-primary-dark/10 border border-blue-100 rounded-2xl">
            <div className="flex items-center gap-2 text-primary-dark font-bold mb-4">
              <ShieldCheck size={40} className="fill-primary-dark stroke-white" />
              <span className="text-xl">Protection des commandes WorldFarm</span>
            </div>

            {/* points forts de la boutique */}

            <div className="grid grid-cols-1 gap-3 text-xl text-gray-700">
              
              <div className="flex flex-row justify-between items-center gap-2">
                <div className="flex flex-row gap-2 items-center">
                  <Shield size={30} className="fill-primary-dark stroke-white" /> Paiement 100% sécurisé
                </div> 
                <CheckCircle2 size={30} className="fill-primary-dark stroke-white" />
              </div>

              <div className="flex flex-row justify-between items-center gap-2">
                <div className="flex flex-row gap-2 items-center">
                  <Truck size={30} className="fill-primary-dark stroke-white" /> livraison Garantie
                </div> 
                <CheckCircle2 size={30} className="fill-primary-dark stroke-white" />
              </div>

              <div className="flex flex-row justify-between items-center gap-2">
                <div className="flex flex-row gap-2 items-center">
                  <Headset size={30} className="fill-primary-dark stroke-white" /> Service client 24/7
                </div> 
                <CheckCircle2 size={30} className="fill-primary-dark stroke-white" />
              </div>
              
            </div>
            
                  
          </div>
          {/* Zones de livraisons */}

          <div className="border border-gray-200 rounded-lg bg-vendor-primary/10 p-4">
            <div className="flex flex-row items-center text-black font-bold ">
              <Truck size={40} className="fill-vendor-primary stroke-vendor-primary mx-4 mt-6 mb-3" />
              <h1 className="mx-4 mt-6 mb-3">Zones de livraison</h1>
            </div>
            
            <div >
              {shop?.deliveryZones.length > 0 ? (
                  shop.deliveryZones.map((zone: any, index: number) => (
                    <div key={index} className={`flex flex-row items-center justify-between border font-bold border-gray-200 rounded-xl p-3 mx-4 mb-3 bg-vendor-primary/10 text-xl ${zone.city === shop?.deliveryZones.city || zone.region === shop?.deliveryZones.region ? 'bg-primary-light/40  border-primary-light border-4' : 'bg-primary-light/20'}`}>
                      <div className="bg-vendor-primary/10">
                        {
                          zone.city === shop?.deliveryZones.city ? (
                            <div className="bg-primary-dark p-2 rounded-2xl flex items-center justify-center">
                              <Home size={20} className="text-white" />
                            </div>
                          ) : (
                            <div className="bg-vendor-primary/20 p-2 rounded-lg flex items-center justify-center">
                              <MapPin size={20} className="fill-vendor-primary stroke-white" />
                            </div>
                          )
                        }
                      </div>
                      <div>
                        <div className="flex flex-row items-center">
                          <p className="text-xl font-medium">{zone.city}</p>
                          {zone.city === shop?.deliveryZones.city && <span className="text-xs text-white bg-primary-light rounded-lg items-center p-1 font-bold ml-2">LOCAL</span>}
                        </div>
                        
                        <div className="flex flex-row items-center">
                          <p className="text-xl font-medium">{zone.region}</p>
                          {zone.region === shop?.deliveryZones.region && <span className="text-xl text-white bg-primary-light rounded-lg items-center p-1 font-bold ml-2">LOCAL</span>}
                        </div>
                        
                        <p className="text-lg">
                          {zone.estimatedDays }
                        </p>
                      </div>
                      <div>
                        {zone.estimatedCost > 0 ? (
                          <p className="flex text-xl w-20 font-medium text-orange bg-orange/20 items-center justify-center rounded-2xl">{zone.estimatedCost} F</p>
                        ) : ( <p className="flex text-xl w-20 font-medium text-primary-light bg-primary-light/20 items-center justify-center rounded-2xl">Gratuit </p>
                        )}
                      </div>
                    </div>
                  ))) : (
                    <p className="text-gray-500">Aucune zone de livraison disponible.</p>
                  )
              }
            </div>
          </div>    
          
          <HorairesOuverture s={shop} />      

         

          {/* Badge de réassurance */}
          <div className="bg-background-dark p-4 rounded-md flex gap-3 border border-border">
            <ShieldCheck className="fill-primary-dark stroke-white" />
            <p className="text-sm text-text-secondary">
              Paiement 100% protégé par <strong>World Farm</strong>. 
              Le vendeur ne reçoit l&apos;argent qu&apos;après votre confirmation.
            </p>
          </div>

          <button className="w-full bg-primary-dark text-white py-4 rounded-md font-bold text-lg hover:brightness-110 transition-all shadow-md">
            Ajouter au panier
          </button>
        </div>
      </div>
    </div>


  
    
    

  );
}


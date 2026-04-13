/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { GET_PRODUCTS } from "@/lib/services/productService";
import { GET_CATEGORIES } from "@/lib/services/categoryService";
import { queryGraphql } from "@/lib/api/apiGraphql";
import { useCallback } from "react";
import Image from "next/image";
import { Store, ShieldCheck, BadgeCheck, Star, Users, ShoppingBag, Truck,  Headset, Shield, CheckCircle2, Home, MapPin,  Heart, SquarePlay } from "lucide-react"
import HorairesOuverture from "@/components/features/cart/HorairesOuverture";
import PersonnalShopHeader from "@/components/layout/Header/PersonnalShopHeader";
import CategoryFilter from "@/components/features/cart/CategoryFilter";
import ProductGrid from "@/components/features/cart/ProductGrid";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/enpoints";

interface Category {
  id: string;
  name: string;
  subCategories?: { id: string; name: string }[];
}

export default function ShopClientView({ shop }: { shop: any }) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<any[]>([]); 
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [isSubscribed, setIsSubscribed] = useState(false); // État pour suivre si l'utilisateur est abonné ou non


    console.log("Valeur de shopId:", shop.shopId);
    // 1. Sortez la fonction pour qu'elle soit accessible partout dans le composant



    const checkSubscriptionStatus = useCallback(async () => {
        if (!shop?.shopId) return;
        try {
            const res = await apiClient.get(API_ENDPOINTS.BOUTIQUES.SHOP_UNSOUSCRIPTION_VERIFICATION(shop.shopId));
            if (res.status === 200) {
                setIsSubscribed(true);
            } 
        } catch (error: any) {
            setIsSubscribed(false);
            console.log("L'utilisateur n'est pas abonné à cette boutique ou une erreur est survenue lors de la vérification de l'abonnement.", error);
        }
    }, [shop.shopId]); // Ne change que si l'ID change

    useEffect(() => {
        // On crée une fonction locale pour gérer l'appel
        const executeCheck = async () => {
            await checkSubscriptionStatus();
        };

        executeCheck();
    }, [checkSubscriptionStatus]);
    const handleToggleSubscription = async () => {
        try {
            if (isSubscribed === false) {
                // PAS encore abonné → subscribe
                await apiClient.post(
                    API_ENDPOINTS.BOUTIQUES.SHOP_SOUSCRIPTION(shop.shopId),
                    {}
                );
                setIsSubscribed(true);
                alert("Vous êtes maintenant abonné à cette boutique !");
            } else if (isSubscribed === true){
                // déjà abonné → unsubscribe
                await apiClient.post(
                    API_ENDPOINTS.BOUTIQUES.SHOP_UNSOUSCRIPTION(shop.shopId),
                    {}
                );
                setIsSubscribed(false);
                alert("Vous êtes maintenant désabonné de cette boutique !");
            }

            //  IMPORTANT : on recharge depuis le backend
            await checkSubscriptionStatus();

        } catch (error: any) {
            if (error.response?.data?.message === "subscription_not_found") {
                setIsSubscribed(false); // On synchronise avec le serveur
                alert("Vous n'étiez pas abonné à cette boutique.");
                
            }
            console.error(error);
        }
    };
       
      // charger catégories
      useEffect(() => {
        if (!shop?.shopId) return; // Vérifie que shopId est disponible avant de charger les catégories
        const loadCategories = async () => {
          const data = await queryGraphql(GET_CATEGORIES);
       
          if (data?.getCategories) {
            setCategories(data.getCategories);
          } else {
            // Si data est null, on peut initialiser à un tableau vide pour éviter d'autres erreurs
            setCategories([]); 
            console.warn("Accès aux catégories refusé ou vide.");
          }
        };
    
        loadCategories();
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
    
      const loadProducts = useCallback(async (categoryId: string | null) => {
      setActiveCategory(categoryId);
    
      let allRelatedIds: (string | null)[];
    
      //  GESTION DU CAS "ALL"
      if (categoryId === null) {
        allRelatedIds = [null];
      } else {
        const selectedCat = categories.find((c) => c.id === categoryId);
    
        allRelatedIds =
          selectedCat?.subCategories && selectedCat.subCategories.length > 0
            ? [categoryId, ...selectedCat.subCategories.map(sub => sub.id)]
            : [categoryId];
      }
    
      try {
        // éviter d’envoyer null si ton backend ne supporte pas
        const promises = allRelatedIds.map(id =>
          id === null
            ? queryGraphql(GET_PRODUCTS) // sans filtre
            : queryGraphql(GET_PRODUCTS, { categoryId: id })
        );
    
        const results = await Promise.all(promises);
    
        console.log("RESULTS :", results);
    
        //obtenir les produits
        const allProducts = results.flatMap(
          res => res?.findAllProduct?.content || []
        );
    
    
        const produitsBoutique = allProducts.filter((res) => {
          return res?.shop?.name === shop.name;
        });
        console.log("Produits de la boutique :", produitsBoutique);
    
        // 5. SUPPRESSION DES DOUBLONS
        const uniqueProducts = Array.from(
          new Map( produitsBoutique.map(p => [p.id, p])).values()
          );
    
          setProducts(uniqueProducts);
        } catch (err) {
          console.error("Erreur lors du chargement des produits:", err);
          setProducts([]);
        }
    }, [categories,shop.name]);

        
    // charger tous les produits au début
    useEffect(() => { 
        loadProducts(null);
    }, [loadProducts]);

    return(
        <div className="container mx-auto   text-xl md:overflow-hidden ">
            <div  className="sticky top-0 z-50">
            <PersonnalShopHeader s={shop} />
            </div>
            
            <div className="flex flex-col md:flex-row gap-10 md:h-[calc(100vh-80px)]">
            
                {/* BLOC IMAGE (Utilise tes classes de design system) */}
                <div className="w-full md:w-1/2 relative aspect-square md:aspect-auto md:h-full md:sticky md:top-0 rounded-xl shadow-card overflow-hidden border border-border">
                    <Image 
                    src={shop.logoUrl || "/images/default-shop.png"} 
                    alt={shop.name} 
                    fill 

                    className=" w-full h-screen"
                    priority // Charge l'image en priorité
                    />
                </div>

                {/* BLOC INFOS */}
                <div className="w-full p-6 md:w-1/2 space-y-6 md:overflow-y-auto md:pr-4 custom-scrollbar">
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

                    {/* suivre et reels */}
                    <div className="flex flex-row justify-between gap-4">
                        <div className="flex flex-row items-center justify-center border border-vendor-primary w-50 h-15 rounded-xl gap-2 text-vendor-primary font-bold">
                            <SquarePlay  size={25} className="fill-white stroke-vendor-primary"/>
                            Réels
                        </div>
                        
                        <div className="flex flex-row items-center justify-center border border-vendor-primary w-50 rounded-xl gap-2 text-white bg-vendor-primary font-bold"
                            onClick={handleToggleSubscription}>
                                {
                                    isSubscribed === true? (
                                        <Heart size={25} className="fill-white"/>
                                    ):(
                                        <Heart size={25} />
                                    )
                                }
                                
                                Suivre
                        </div>
                            
                        
                        {/* {
                            isSubscribed === true?(
                                <div className="flex flex-row items-center justify-center border border-vendor-primary w-50 rounded-xl gap-2 text-white bg-vendor-primary font-bold"
                                onClick={() => {
                                    handleUnsubscribe()
                                    setIsSubscribed(false)

                                }}>
                            
                                    <Heart size={25} className="fill-white"/> 
                                    
                                    Suivre
                                </div>

                            ): (<div className="flex flex-row items-center justify-center border border-vendor-primary w-50 rounded-xl gap-2 text-white bg-vendor-primary font-bold"
                            onClick={() => {
                                handleSubscribe()
                                setIsSubscribed(true)

                            }}>
                        
                                <Heart size={25} /> 
                                
                                Suivre
                            </div>
                            )

                        } */}
                        
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

                    {/* localisation     */}
                    <div className="flex flex-row items-center bg-white border border-vendor-primary rounded-2xl p-4 gap-4">
                        <div className="flex flex-row items-center gap-2 ">  
                            <div className=" p-2 rounded-lg flex items-center justify-center bg-vendor-primary/20">
                                <MapPin size={30} className="fill-vendor-primary stroke-white" />
                            </div>
                            <div className="flex flex-col">
                                <div className="text-lg font-bold text-gray-400">
                                        Localisation
                                </div>
                                <div className="flex flex-row items-center">
                                    <p className="text-lg font-bold text-black w-max">{shop?.address?.city}, {shop?.address?.region}, {shop?.address?.country}</p>
                                </div> 
                                    
                            </div>                      
                        </div>
                                    
                            <div>
                                <p className="flex text-xl w-20 font-medium   items-center justify-center ">{shop?.address?.countryIcon}</p>
                                
                            </div>
                    </div>
            

                    {/* nos produits   */}
                    <div className="">

                        <div className="flex flex-row items-center justify-between gap-2 mb-4">
                            <div className="flex flex-row items-center gap-2">
                            <ShoppingBag size={30} className="text-vendor-primary " />
                            <h1 className="text-2xl font-bold text-text-primary ">Nos produits</h1>
                            </div>
                            
                            <p className="text-text-secondary">{products.length}</p> 

                        </div>
                        <div>

                        </div>
                        {/* produits et categories */}
                        <div>
                            {/* ligne d'entete pour les produits */}
                            <CategoryFilter
                                categories={categories}
                                activeCategory={activeCategory}
                                onSelect={loadProducts}
                            />
                            {/* grille de produits */}
                            <div className="container mx-auto  py-8">
                                <ProductGrid products={products} />
                            </div>
                        </div>
                    </div>

                    

                    
                </div>
            </div>
        </div>
        
    )
}
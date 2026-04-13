/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useState } from 'react';
import {
  Bell,
  Store,
  CheckCircle2,
  Trash2,
  Plus,
  Minus,
  ShieldCheck,
  ShoppingCart,
  FileText,
  ArrowLeft
} from 'lucide-react';
import Image from 'next/image';
import { ShopGroup } from "@/lib/types/CartItem.types";
import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/enpoints';
import { GET_PRODUCT_BY_ID } from '@/lib/services/productService';
import { queryGraphql } from '@/lib/api/apiGraphql';
import {useRouter } from 'next/navigation';

const CartPage = () => {
  const [shopGroups, setShopGroups] = useState<ShopGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalSubtotal, setGlobalSubtotal] = useState(0);
  const router = useRouter();


  // recuperer le prix total du panier
  useEffect(() => {
    const fetchCartsData = async () => {
       try {
         const response = await apiClient.get(API_ENDPOINTS.CART.GET_CART);
          setGlobalSubtotal((response.data.subtotal))
        
        
       }catch (error) {
         console.error("Erreur lors de la récupération du panier :", error);
       }
     };
     fetchCartsData();
   }, [shopGroups]);  

  //  recuperer les produits du panier groupé par boutique
  const fetchGroupCartData = async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.CART.CART_GROUPED_BY_SHOP);
      const rawData = response.data;

      const formatted = await Promise.all(
        Object.entries(rawData).map(async ([shopId, items]: [string, any]) => {
          const firstProductId = items[0].productId;
          try {
            const gqlResponse = await queryGraphql(GET_PRODUCT_BY_ID, { productId: firstProductId });
            const shop = gqlResponse.findProductById.shop;
            const deliveryCost = shop.deliveryZones && shop.deliveryZones.length > 0 ? Number(shop.deliveryZones[0].estimatedCost) : 0;

            const itemsTotal = items.reduce((acc: number, i: any) => acc + Number(i.lineTotal), 0);
            const prixGroupfinal = itemsTotal + deliveryCost;

            const enrichedItems = await Promise.all(items.map(async (item: any) => {
              try {
                const itemDetails = await queryGraphql(GET_PRODUCT_BY_ID, { productId: item.productId });
                const p = itemDetails.findProductById;
                return {
                  ...item,
                  name: p.name,
                  imageUrl: p.imageUrl,
  
                  originalPrice: p.originalPrice,
                  minQuantity: p.minQuantity, // Indispensable pour handleUpdateQuantity
                  maxQuantity: p.maxQuantity,
                  stock: p.stock,
                };
              } catch (err) {
                return { ...item, name: "Produit inconnu", imageUrl: null };
              }
            }));

            return {
              shopName: shop.name,
              estimatedCost: deliveryCost,
              isVerified: shop.isVerified,
              items: enrichedItems,
              itemstotal: itemsTotal, 
              subtotal: prixGroupfinal
            };
          } catch (err) {
            return {
              shopName: "Boutique inconnue",
              isVerified: false,
              estimatedCost: 0,
              itemstotal: 0,
              items: items,
              subtotal: items.reduce((acc: number, i: any) => acc + i.lineTotal, 0)
            };
          }
        })
      );
      setShopGroups(formatted);
    } catch (error) {
      console.error("Erreur générale panier:", error);
    } finally {
      setLoading(false);
    }
  };

  // Appelez-la au montage du composant
  useEffect(() => {
    fetchGroupCartData();
  }, []);

  //Supprimer un article
  const handleDeleteItem = async (itemId: string) => {
    if (!itemId) return console.error("ID manquant");
    try {
      // Appel API DELETE /cart/items/{itemId}
       await apiClient.delete(API_ENDPOINTS.CART.CART_REMOVE_ITEM(itemId),{
        params:{
          itemId: itemId
        }
       });
      
      // Mise à jour immédiate du state local pour la fluidité
      setShopGroups(prev => prev.map(group => ({
        ...group,
        items: group.items.filter(item => item.id !== itemId)
      })).filter(group => group.items.length > 0));
       await apiClient.post(API_ENDPOINTS.CART.CART_REFRESH);
      
      // Optionnel : rafraîchir depuis le serveur
      fetchGroupCartData();
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  //Augmanter la quantite d'un produit
  const handleUpdateQuantity = async (item: any, newQuantity: number) => {
  // 1. Vérification des limites min et max
  const min = item.minQuantity || 1;
  const max = item.maxQuantity || item.stock || 100; // Utilise le stock si maxQuantity n'est pas défini

  if (newQuantity < min) {
    alert(`La quantité minimale pour ce produit est de ${min}`);
    return;
  }
  
  if (newQuantity > max) {
    alert(`La quantité maximale disponible est de ${max}`);
    return;
  }

  try {
    // Appel API PATCH /cart/items/{itemId}
    await apiClient.patch(API_ENDPOINTS.CART.CART_UPDATE_QUANTITY(item.id), {
      quantity: newQuantity
    });
    
    // 3. Rafraîchir les données pour recalculer les linetotal et sous-totaux
    fetchGroupCartData();
  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
  }
};


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-dark"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-40 font-sans">
      {/* Header */}
      <header className="bg-primary-dark text-white p-4 flex items-center justify-between sticky top-0 z-10 h-20">
        <div className="rounded-lg flex flex-row items-center   ">
          <button onClick={() => router.back()} className="pl-2">
            <ArrowLeft size={30} className="text-white"/>
          </button>
        </div>
        <div className="flex items-center gap-3">
          <ShoppingCart className="w-6 h-6" />
          <h1 className="text-xl font-semibold">Mon Panier</h1>
        </div>
        <div className="relative">
          <Bell className="w-6 h-6" />
        </div>
      </header>

      {/* Barre de sécurité */}
      <div className="bg-[#f0f9f6] p-2 flex justify-center items-center gap-2 border-b border-gray-100">
        <ShieldCheck className="w-4 h-4 text-primary-dark" />
        <p className="text-primary-dark text-sm font-medium">
          Paiement sécurisé • Fonds bloqués jusqu&apos;à validation
        </p>
      </div>

      {/* Contenu du Panier */}
      <div className="p-4 flex-1 space-y-6">
        {shopGroups.length === 0 ? (
          <div className="text-center py-20 text-gray-500">Votre panier est vide</div>
        ) : (
          shopGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden text-lg">
              
              {/* Shop Header */}
              <div className="p-4 flex items-center justify-between border-b border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-primary-dark rounded flex items-center justify-center bg-primary-dark">
                    <div className="w-2 h-1 border-white border-b-2 border-l-2 -rotate-45 mb-0.5"></div>
                  </div>
                  <div className="bg-gray-100 p-2 rounded-lg">
                    <Store className="w-5 h-5 text-gray-600" />
                  </div>
                  <span className="font-bold text-gray-800">{group.shopName}</span>
                  {group.isVerified && (
                    <CheckCircle2 className="w-4 h-4 text-blue-500 fill-blue-500" />
                  )}
                </div>
                <span className="bg-cyan-50 text-cyan-600 text-xs px-3 py-1 rounded-full">
                  {group.items.length} {group.items.length > 1 ? 'articles' : 'article'}
                </span>
              </div>

              {/* Items List */}
              {group.items.map((item) => (
                <div key={item.id} className="p-4 border-b border-gray-50 text-lg">
                  <div className="flex gap-3 text-lg">
                    <div className="w-5 h-5 border-2 border-primary-dark rounded flex items-center justify-center bg-primary-dark self-center">
                      <div className="w-2 h-1 border-white border-b-2 border-l-2 -rotate-45 mb-0.5"></div>
                    </div>
                    
                    <Image 
                      src={item.imageUrl || "/api/placeholder/80/80"} 
                      alt={item.name} 
                      width={300}
                      height={300}
                      className="w-20 h-20 rounded-xl object-cover bg-gray-50" 
                    />
                    
                    <div className="flex-1">
                      <h3 className="text-gray-800 font-medium text-lg leading-tight line-clamp-2">{item.name}</h3>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-primary-dark font-bold">{item.unitPriceCaptured.toLocaleString()} FCFA</span>
                        {item.originalPrice  && (
                          <span className="text-gray-400 line-through text-lg">{item.originalPrice.toLocaleString()} FCFA</span>
                        )}
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className='flex flex-row justify-between'>
                        <div  className="flex items-center border border-gray-200 rounded-lg">
                          {/* Bouton MOINS */}
                          <button 
                            onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                            disabled={item.quantity <= (item.minQuantity || 1)}
                            className="p-1 px-2 text-gray-400 hover:bg-gray-50 disabled:opacity-20 disabled:cursor-not-allowed"
                          >
                            <Minus className="w-5 h-10" />
                          </button>
                          
                          <span className="px-4 font-semibold text-sm">{item.quantity}</span>
                          
                          {/* Bouton PLUS */}
                          <button 
                            onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                            disabled={item.quantity >= (item.maxQuantity || item.stock || 999)}
                            className="p-1 px-2 text-primary-dark hover:bg-gray-50 disabled:opacity-20 disabled:cursor-not-allowed"
                          >
                            <Plus className="w-4 h-4" />
                          </button>

                        </div>
                        {/* BOUTON SUPPRIMER */}
                        <button 
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-red-400 p-1 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                        
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Summary Section for this Shop */}
              <div className="p-4 bg-gray-50 space-y-3 text-sm">
                <div className="flex justify-between text-gray-500 text-sm">
                  <span>Sous-total boutique</span>
                  <span className="font-bold text-gray-800">{group.itemstotal.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between text-gray-500 text-sm">
                  <span>Livraison</span>
                  <span className="font-bold text-gray-800">{group.estimatedCost} FCFA</span>
                </div>
                <div>
                  <button className="w-full bg-orange text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-100 active:scale-[0.98] transition-transform">
                    <FileText className="w-5 h-5" />
                   Payer ({group.subtotal.toLocaleString()} FCFA)
                </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Sticky Bottom Checkout (Exemple global) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 px-6 flex items-center justify-between shadow-md text-lg">
        <div>
          <p className="text-gray-400 text-lg">Total à payer</p>
          <p className="text-primary-dark text-xl font-bold">
            {globalSubtotal} FCFA
          </p>
        </div>
        <button className="bg-primary-dark text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary-dark/20">
          Commander
        </button>
      </div>
    </div>
  );
};

export default CartPage;

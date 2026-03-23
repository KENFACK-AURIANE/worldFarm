/* eslint-disable @typescript-eslint/no-explicit-any */
import { queryGraphql } from "@/lib/api/apiGraphql";
import { GET_PRODUCT_BY_ID } from "@/lib/services/productService";
import { GET_CATEGORIES } from "@/lib/services/categoryService";
import Image from "next/image";
import {ShieldCheck, ListChecks, Palette, Shield, Store, Home, MapPin } from "lucide-react";
import Link from "next/link";

import { 
  ChevronLeft, Share2, Heart, MessageSquare, Shapes
  ,Star, Box,ShoppingCart,  CheckCircle2, Truck, CreditCard, Lock, HelpCircle 
} from 'lucide-react';
import ColorSelectorClient from "@/components/ui/Button/ColorSelectorClient";
import ProductTabs from "@/components/ui/Tabs/ProductTabs";

// On définit le type de params comme une Promesse (spécifique à Next.js 15/16)
interface Props {
  params: Promise<{ id: string }>;
}

// trouver la categorie du prodduit et la categorie parente
const findHierarchy = (categories: any[], targetId: string | undefined) => {
  if (!categories || !targetId) return { parentName: "Catégorie", childName: "" };

  for (const parent of categories) {
    // CAS 1 : Le produit est directement dans la catégorie parente (ex: Electronique)
    if (parent.id === targetId) {
      return { parentName: parent.name, childName: "" };
    }

    // CAS 2 : Le produit est dans une sous-catégorie (ex: Smartphones)
    const child = parent.subCategories?.find((s: any) => s.id === targetId);
    if (child) {
      return { 
        parentName: parent.name, // Nom du parent (Electronique)
        childName: child.name    // Nom de l'enfant (Smartphones) <--- VÉRIFIE BIEN CETTE LIGNE
      };
    }
  }
  return { parentName: "Produit", childName: "" };
};


export default async function ProductDetailPage({ params }: Props) {
  // 1. Récupérer l'ID de l'URL
  const { id } = await params; // On attend que les params soient disponibles

  // 2. Appeler le serveur avec la fonction findProductById
  const data = await queryGraphql(GET_PRODUCT_BY_ID, { productId: id });
  const product = data?.findProductById;
  console.log("DATA REÇUE :", product?.categoryId);
 
  // const categoryData = await queryGraphql(GET_CATEGORIES_BY_ID, { parentId: product?.categoryId });
  // const categorie = categoryData?.getCategories;
  // console.log("categorie recue :",  categorie?.[0]?.name);
  // // CE LOG VA TOUT VOUS DIRE :
  // console.log("STRUCTURE RÉELLE :", JSON.stringify(categoryData, null, 2));

  // // Essayez aussi ce chemin alternatif souvent utilisé par les clients GraphQL :
  // console.log("TEST ALTERNATIF :", categoryData?.data?.getCategories?.[0]?.name);

  // 1. Récupérez d'abord TOUTES les catégories (votre requête globale)
const allCatsData = await queryGraphql(GET_CATEGORIES);
  const allCategories = allCatsData?.getCategories || [];

  // 3. Lancer la recherche du nom
  const resultat = findHierarchy(allCategories, product?.categoryId);

  // LOG DE VÉRIFICATION
  console.log("RÉSULTAT TROUVÉ :", resultat.parentName, "›", resultat.childName);
  // 3. Gérer le cas où le produit n'existe pas
  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-screen px-4">
        <h1 className="text-xl font-bold">Oups ! Produit introuvable.</h1>
        <p className="text-gray-500">L&apos;ID {id} ne correspond à aucun article.</p>
      </div>
    );
  }
  console.log("CLES DISPONIBLES :", Object.keys(product));

  // 4. Affichage des informations
  return (
    

    <div className="max-w-md mx-auto  min-h-screen pb-24 font-sans text-slate-800  md:max-w-screen md:overflow-hidden md:m-0  md:min-w-md ">
      {/* Header Navigation */}
      <div className="flex items-center gap-4 p-4 sticky top-0 bg-teal-600/10 backdrop-blur-md z-10 md: w-screen ">
        <button className="p-2 bg-teal-600 text-white rounded-full">
          <ChevronLeft size={24} />
        </button>
        <h1 className="font-bold text-teal-800 uppercase tracking-wide">{product.name}</h1>
        <div className="flex gap-2">
          <button className="p-2 text-white bg-teal-600/50 rounded-full"><Share2 size={20} /></button>
            <button className="p-2 text-white bg-teal-600/50 rounded-full"><Heart size={20} /></button>
        </div>
      </div>
    
      {/* Product Image Section */}
      <div className="W-full bg-green-500 md:w-screen">
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={300}
          height={300}
          className="w-full  mb-5"
        />
        
      </div>
    
      {/* Price & Title */}
      <div className="p-4 bg-white">
        <div className="flex flex-row items-center gap-3">
          <h1 className="text-3xl font-bold text-teal-700">{product.price.toLocaleString()} FCFA</h1>
          <h2 className="text-text-secondary  line-through text-sm">{product.originalPrice} FCFA</h2>
        </div>
        <h3 className="text-xl font-bold uppercase mt-1">{product.name}</h3>
        <div className="flex items-center gap-1 mt-2 text-gray-300">
          {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
          <span className="text-xs text-gray-500 ml-2">0 avis</span>
        </div>
      </div>
    
      {/* Info Cards */}
      <div className="bg-background/70 border border-white/10 backdrop-blur-md rounded-xl p-3 mx-4 ">
        <div className="p-3 border-b border-gray-200 flex items-start gap-3">
          <div className="p-2 bg-teal-50 text-teal-600 rounded-lg"><Shapes size={20} /></div>
          <div>
            <p className="text-xs text-gray-500">Catégorie</p>
            <p className="font-semibold text-sm">{resultat.parentName} › {resultat.childName}</p>
          </div>
        </div>
        
        <div className="p-3 border-b border-gray-200 flex items-start gap-3">
          <div className="p-2 bg-teal-50 text-teal-600 rounded-lg"><Box size={20} /></div>
          <div>
            <p className="text-xs text-gray-500">Stock</p>
            <p className="font-semibold text-sm">{product.stock} disponible(s)</p>
          </div>
        </div>

        <div className="p-3 border-b border-gray-200 flex items-start gap-3">
          <div className="p-2 bg-teal-50 text-teal-600 rounded-lg"><div className="p-2 bg-teal-50 text-teal-600 rounded-lg"><ListChecks size={20} /></div></div>
          <div>
            <p className="text-xs text-gray-500">Caractéristiques</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {product.characteristics && product.characteristics.length > 0 ? (
                product.characteristics.map((char: string, index: number) => (
                  <span 
                    key={index} 
                    className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-sm font-medium"
                  >
                    {char}
                  </span>
                ))
              ) : (
                <p className="font-semibold text-sm">Non spécifiées</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* couleurs disponibles */}
      <div className="border border-gray-200 mx-4 my-4 backdrop-blur-md rounded-xl p-3  ">
        <div className="flex flex-row items-center gap-3 mt-6 mb-3 mx-4 border-gray-200 rounded-xl ">
          <div className="bg-primary-dark p-2 rounded-lg flex items-center justify-center">
          {/* L'icône elle-même */}
            <Palette size={20} className="text-white fill-white" />
            
          </div>
          <span className="text-black font-bold">Couleurs disponibles</span>
        </div>
        
        <ColorSelectorClient colors={product?.colors} />
      </div>
    
      {/* Protection Badge */}
      <div className="m-4 p-4 bg-blue-50/50 border border-blue-100 rounded-2xl">
        <div className="flex items-center gap-2 text-blue-700 font-bold mb-4">
          <ShieldCheck size={20} />
          <span className="text-sm">Protection des commandes WorldFarm</span>
        </div>
        <div className="grid grid-cols-1 gap-3 text-xs text-gray-700">
          <div className="flex items-center gap-2"><Lock size={14} className="text-green-600" /> Paiement sécurisé</div>
          <div className="flex items-center gap-2"><Truck size={14} className="text-green-600" /> Suivi de livraison</div>
          <div className="flex items-center gap-2"><CreditCard size={14} className="text-green-600" /> Protection remboursement</div>
          <div className="flex items-center gap-2"><HelpCircle size={14} className="text-green-600" /> Assistance 24h/24, 7j/7</div>
          <div className="flex items-center gap-2"><Shield size={14} className="text-green-600" /> Confidentialité des données</div>
        </div>
        
        
      </div>

      {/* Payment Methods */}
      <div className="mx-4">
        <h5>Paiement acceptés</h5>
        <div className="flex flex-wrap gap-1 mt-6">
          <span className="px-2 py-1 bg-yellow-400 text-[10px] font-bold rounded">MTN MoMo</span>
          <span className="px-2 py-1 bg-orange-500 text-white text-[10px] font-bold rounded">Orange Money</span>
          <span className="px-2 py-1 bg-blue-900 text-white text-[10px] font-bold rounded">Visa</span>
          <span className="px-2 py-1 bg-red-600 text-white text-[10px] font-bold rounded">Mastercard</span>
          <span className="px-2 py-1 bg-green-500 text-white text-[10px] font-bold rounded text-center">Livraison</span>
        </div>
      </div>

      {/* zones de livraison */}
      <div>
        <div className="flex flex-row items-center text-black font-bold ">
          <Truck size={40} className="text-primary-dark mx-4 mt-6 mb-3" />
          <h1 className="mx-4 mt-6 mb-3">Zones de livraison</h1>
        </div>
        <div className="flex flex-row text-primary-dark">
          <Store size={20} className="text-primary-dark mx-4 mb-5" />
          <p>Depuis {product.shop?.name}, {product.shop?.address?.city}-{product?.shop?.address?.country}</p>
        </div>
        <div>
          {product.shop?.deliveryZones.length > 0 ? (
              product.shop.deliveryZones.map((zone: any, index: number) => (
                <div key={index} className={`flex flex-row items-center justify-between border font-bold border-gray-200 rounded-xl p-3 mx-4 mb-3 ${zone.city === product.shop?.address?.city || zone.region === product.shop?.address?.region ? 'bg-primary-light/40  border-primary-light border-4' : 'bg-primary-light/20'}`}>
                  <div>
                    {
                      zone.city === product.shop?.address?.city ? (
                        <div className="bg-primary-dark p-2 rounded-2xl flex items-center justify-center">
                          <Home size={20} className="text-white" />
                        </div>
                      ) : (
                        <div className="bg-primary-dark p-2 rounded-2xl flex items-center justify-center">
                          <MapPin size={20} className="text-white" />
                        </div>
                      )
                    }
                  </div>
                  <div>
                    <div className="flex flex-row items-center">
                      <p className="text-sm font-medium">{zone.city}</p>
                      {zone.city === product.shop?.address?.city && <span className="text-xs text-white bg-primary-light rounded-lg items-center p-1 font-bold ml-2">LOCAL</span>}
                    </div>
                    
                    <div className="flex flex-row items-center">
                      <p className="text-sm font-medium">{zone.region}</p>
                      {zone.region === product.shop?.address?.region && <span className="text-xs text-white bg-primary-light rounded-lg items-center p-1 font-bold ml-2">LOCAL</span>}
                    </div>
                    
                    <p>
                      {zone.estimatedDays }
                    </p>
                  </div>
                  <div>
                    {zone.estimatedCost > 0 ? (
                      <p className="text-sm font-medium text-primary-light">{zone.estimatedCost} F</p>
                    ) : ( <p className="text-sm font-medium text-primary-light">GRATUIT </p>
                    )}
                  </div>
                </div>
              ))) : (
                <p className="text-gray-500">Aucune zone de livraison disponible.</p>
              )
          }
        </div>
      </div>    
    
    {/* Vendor Section */}
    <div className="p-4 flex items-center justify-between bg-white mt-2 border-y">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center p-1 overflow-hidden">
          {product.shop?.logoUrl && (
            <Image
              src={product.shop.logoUrl}
              alt={product.shop?.name}
              fill 
              className="object-cover"
            />
          )}
        </div>
        <div className="flex flex-row items-center justify-between ">
          <div className="flex flex-col items-center gap-1 font-bold">
            <div className="flex flex-row items-center gap-2">
              {product.shop?.name} 
              {product.shop?.isVerified && <CheckCircle2 size={16} className="text-blue-500" />}
            </div>
            
            <Link href={`/client/boutiques/${product.shop?.shopId}`}>
              <p className="text-sm text-primary-light">Voir la boutique</p>
            </Link>
          </div>
          
          
        </div>
      </div>
      <div>
        <Link href={`/client/boutiques/${product.shop?.shopId}`}>
          <ChevronLeft size={20} className="rotate-180 text-gray-400" />
        </Link>
      </div>
      
    </div>
    
    {/* Description Section */}
    <div>
      <ProductTabs product={product} />
    </div>
          
    
    {/* Bottom Sticky Action Bar */}
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white p-3 border-t flex gap-2 items-center">
      <button className="p-3 border rounded-xl text-gray-500"><Heart size={20} /></button>
      <button className="p-3 border rounded-xl text-gray-500"><ShoppingCart size={20} /></button>
      <button className="p-3 border rounded-xl text-gray-500"><MessageSquare size={20} /></button>
      <button className="flex-1 bg-teal-700 text-white font-bold py-3.5 rounded-xl text-sm">
        Commander maintenant
      </button>
    </div>
        </div>
    
  );
}


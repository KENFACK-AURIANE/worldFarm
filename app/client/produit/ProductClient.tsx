/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ColorSelectorClient from "@/components/ui/Button/ColorSelectorClient";
import QuantitySelector from "@/components/ui/Button/QuantitySelector";
import { CheckCircle2, ChevronLeft, CreditCard, Heart, HelpCircle, Home,  MapPin, MessageSquare,Lock, Palette, Shield, ShieldCheck, ShoppingCart, Store, Truck, Headset } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ProductTabs from "@/components/ui/Tabs/ProductTabs";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProductClient({ product }: any) {

  // 🔥 STATE CENTRAL
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.name);
  const [quantity, setQuantity] = useState(1);

  const router = useRouter();

  // 🔥 ACTION
  const handleOrder = () => {
    router.push(
      `/client/payement?productId=${product.id}&qty=${quantity}&color=${selectedColor}`
    );
  };

  return (
    <div className="max-w-md mx-auto  min-h-screen pb-24 font-sans text-slate-800  md:max-w-screen md:overflow-hidden md:m-0  md:min-w-md ">

      couleurs disponibles
      <div className="border border-gray-200 mx-4 my-4 backdrop-blur-md rounded-xl p-3  ">
        <div className="flex flex-row items-center gap-3 mt-6 mb-3 mx-4 border-gray-200 rounded-xl ">
          <div className="bg-primary-dark p-2 rounded-lg flex items-center justify-center">
          {/* L'icône elle-même */}
            <Palette size={20} className="text-white fill-white" />
            
          </div>
          <span className="text-black font-bold">Couleurs disponibles</span>
        </div>
        
        <ColorSelectorClient
        colors={product.colors}
        selectedId={selectedColor}
        onChange={setSelectedColor}
        />
      </div>

      {/* selectionné la quantité */}
      <div className="mx-4 my-4">
        <QuantitySelector
        product={product}
        quantity={quantity}
        setQuantity={setQuantity}
        />
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
          <div className="flex items-center gap-2"><Headset size={14} className="text-green-600" /> Assistance 24h/24, 7j/7</div>
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
    <div className="p-4 flex items-center justify-between bg-white mt-2 border-y mx-4">
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
    <div className="mx-4">
      <ProductTabs product={product} />
    </div>
          
    
    {/* Bottom Sticky Action Bar */}
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white p-3 border-t flex gap-2 items-center">
      <button className="p-3 border rounded-xl text-gray-500"><Heart size={20} /></button>
      <button className="p-3 border rounded-xl text-gray-500"><ShoppingCart size={20} /></button>
      <button className="p-3 border rounded-xl text-gray-500"><MessageSquare size={20} /></button>
      <button onClick={handleOrder} className="flex-1 bg-teal-700 text-white font-bold py-3.5 rounded-xl text-sm">
        Commander maintenant
      </button>
    </div>
    <div>
      {product.dimension ? (
        <p>
          {product.dimension.length} x {product.dimension.width} x {product.dimension.height}
        </p>
      ) : (
        <p>Dimensions non spécifiées</p>
      )}
    </div>
    <div>
      {product.tags && product.tags.length > 0 ? (
        <div>
          {product.tags.map((tag: string, index: number) => (
            <span key={index} className="bg-gray-200 text-gray-700 px-2 py-1 rounded-md text-sm mr-2">
              {tag}
            </span>
          ))}
        </div>
      ) : (
        <p>Aucun tag disponible</p>
      )}
    </div>

    </div>
  );
}
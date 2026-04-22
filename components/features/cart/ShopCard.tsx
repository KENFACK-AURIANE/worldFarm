import Image from "next/image";
import { BadgeCheck, Star, Store,ShoppingBag, MapPin } from "lucide-react";
import Link from "next/link"; 
import { Shop } from "@/lib/types/shop.types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ShopCard({ s }: { s: Shop }) {
  return (
    <div key={s.shopId} className="bg-white shadow-card rounded-md  px-5 py-4 flex flex-col items-center gap-2 border border-border hover:shadow-md transition-shadow md:w-64">

  
      <Link href={`/client/boutiques/${s.shopId}`} className=" flex flex-col items-center gap-2 ">
        <div className="relative w-12 h-12 rounded-full overflow-hidden border border-divider">
         {s.logoUrl && s.logoUrl !== "" ? (
            <Image 
              src={s.logoUrl} 
              alt={s.name} 
              fill 
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            
            /* 
              Si pas d'image, on affiche l'icône Store. 
              Le conteneur parent (flex items-center justify-center) 
              se charge de la centrer proprement.
            */
             <div className="w-12 h-12 flex items-center justify-center bg-gray-100 text-[#1e2a78] font-bold text-lg">
                {/* Affiche les 2 premières lettres du nom si pas de logo */}
                {s?.name?.slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>

        {/* Nom et Statut */}
        <div className="flex items-center gap-1">
          <h4 className="text-sm font-semibold text-text-primary truncate">
            {s.name}
          </h4>
          {s.isVerified && <BadgeCheck size={16} className="text-blue-500 shrink-0" />}
        </div>
        <div>
          <MapPin />
          <span>{s?.address?.city}{s?.address?.region}</span>
        </div>
        
        {/* Note  */}
        <div className="bg-rating/20 flex items-center  gap-2 px-3 py-1 rounded-full">
          {/* L'étoile reste toujours présente */}
          <span className="text-rating text-sm"><Star /></span>
          
          {/* Affiche le rating du backend ou 0.0 s'il est null */}
          <span className="text-rating text-sm font-bold">
            {s.rating ?? "0.0"}
          </span>
        </div>
         {/* Produits récupérés dynamiquement */}
          <div className="grid grid-cols-2 gap-1.5 w-full h-20 mt-2">
          {[0, 1].map((index) => {
            const img = s.displayImages && s.displayImages[index];
            return (
              <div 
                key={index} 
                className="aspect-square rounded-xl overflow-hidden relative bg-slate-50 border border-slate-100 "
              >
                {img ? (
                  <Image src={img} alt="product" fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingBag size={12} className="text-slate-200" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex flex-row items-center justify-center rounded-lg px-1 bg-gray-300 text-sm py-2 gap-2">
          <Store size={15} />
          Voir la boutique
        </div>
        
        

      </Link>
      
    </div>
  );
}


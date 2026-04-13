
import Image from "next/image";
import { BadgeCheck, Star, Store } from "lucide-react";
import Link from "next/link"; 

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ShopCard({ s }: { s: any }) {
  return (
    <div key={s.shopId} className="bg-white shadow-card rounded-md  px-5 py-4 flex flex-col items-center gap-2 border border-border hover:shadow-md transition-shadow md:w-64">

  
      <Link href={`/client/boutiques/${s.shopId}`} className=" flex flex-col items-center gap-2">
        <div className="relative w-16 h-16 rounded-full overflow-hidden border border-divider">
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
            <div className="flex flex-col items-center gap-2">
              <Store size={48} className="text-gray-300" />
              <span className="text-xs text-gray-400 font-medium italic">Pas de logo</span>
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
        
        {/* Note  */}
        <div className="bg-rating/20 flex items-center  gap-2 px-3 py-1 rounded-full">
          {/* L'étoile reste toujours présente */}
          <span className="text-rating text-sm"><Star /></span>
          
          {/* Affiche le rating du backend ou 0.0 s'il est null */}
          <span className="text-rating text-sm font-bold">
            {s.rating ?? "0.0"}
          </span>
        </div>

      </Link>
      
    </div>
  );
}


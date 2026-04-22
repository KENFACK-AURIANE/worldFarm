/* eslint-disable @typescript-eslint/no-explicit-any */
import ShopGrid from "@/components/features/cart/ShopGrid";
import { apiClient } from "@/lib/api/client";
import { Shop } from "@/lib/types/shop.types";
import { ChevronRight, Star, Store,Play,CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Reels() {
    const [reels, setReels] = useState<any[]>([]);

    useEffect(() => {
    // Définition de la fonction à l'intérieur pour éviter les problèmes de dépendances
    const fetchReels = async () => {
        try {
        const response = await apiClient.get('/reels/trending', {
            params: { 
            period: 'month', 
            limit: 10 
            }
        });
        // On met à jour l'état avec la liste des reels reçue
        setReels(response.data.reels || []);
        } catch (error) {
        console.error("Erreur lors du chargement des Reels:", error);
        }
    };

    fetchReels();
    }, []); // Le tableau vide [] assure que l'appel ne se fait qu'une seule fois

    
  return (
    <div>
        <section className="mt-8">
            <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-2">
                <div className="bg-pink-100 p-1.5 rounded-lg">
                    <Play className="w-4 h-4 text-pink-600 fill-current" />
                </div>
                <h2 className="font-bold text-lg">Reels Populaires</h2>
                </div>
            </div>
            
            <div className="flex overflow-x-auto gap-3 no-scrollbar snap-x snap-mandatory lg:grid lg:grid-cols-5 lg:overflow-visible px-2">
                {reels.map((reel: any) => (
                <ReelItem 
                    key={reel.id}
                    name={reel.shopName}
                    thumbnail={reel.thumbnailUrl}
                    views={reel.views}
                    isVerified={reel.isShopVerified}
                />
                ))}

                {/* Bouton "Voir plus" (Mobile seulement) */}
                {reels.length > 0 && (
                <div className="snap-center min-w-35 flex flex-col items-center justify-center gap-2 bg-gray-100 rounded-3xl aspect-[9/16] lg:hidden cursor-pointer active:scale-95 transition-transform">
                    <div className="bg-white p-3 rounded-full shadow-sm">
                        <ChevronRight className="w-6 h-6 text-gray-600" />
                    </div>
                    <span className="text-xs font-bold text-gray-500">Voir plus</span>
                </div>
                )}
            </div>
        </section>

     </div>
  );
}

function ReelItem({ name, thumbnail, views, isVerified, shopAvatar }: any) {
  return (
    <div className="snap-center min-w-[140px] relative aspect-[9/16] rounded-3xl overflow-hidden group cursor-pointer lg:min-w-0">
      {/* Thumbnail Image */}
      <Image 
        src={thumbnail || "/api/placeholder/140/250"} 
        alt={name}
        fill
        className="object-cover transition-transform group-hover:scale-110"
      />
      
      {/* Overlay dégradé pour le texte */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

      {/* Infos en bas */}
      <div className="absolute bottom-3 left-3 right-3 text-white">
        <div className="flex flex-row justify-between items-center gap-1 mb-1">
          <span className="text-[11px] font-bold truncate">{name}</span>
          {isVerified && <CheckCircle2 className="w-3 h-3 fill-blue-500 text-white" />}
          <div className="relative w-12 h-12 rounded-full overflow-hidden border border-divider">
            {shopAvatar && shopAvatar !== "" ? (
                <Image 
                src={shopAvatar} 
                alt="logo boutique" 
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
                    {name?.slice(0, 2).toUpperCase()}
                </div>
            )}
          </div>
           
            
        </div>
        <div className="text-[10px] opacity-80 flex items-center gap-1">
          <Play size={10} fill="white" /> {views > 1000 ? (views/1000).toFixed(1) + 'k' : views}
        </div>
      </div>
    </div>
  );
}

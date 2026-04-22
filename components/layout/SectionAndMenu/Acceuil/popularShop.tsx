import ShopGrid from "@/components/features/cart/ShopGrid";
import { Shop } from "@/lib/types/shop.types";
import { ChevronRight, Star, Store } from "lucide-react";

export default function PopularShop({shops}: {shops:Shop[]}) {
    
  return (
    <div>
        <div className="flex justify-between items-center mb-4 mt-4 mx-2">
            <div className="flex items-center gap-2">
                <div className="bg-black p-1.5 rounded-lg">
                <Store  className="w-4 h-4 fill-white" />
                </div>
                <h2 className="font-bold text-lg">Boutiques Populaires</h2>
            </div>
            <button className="text-gray-500 text-sm font-medium flex items-center gap-1">
                Voir tout <ChevronRight className="w-4 h-4" />
            </button>
        </div>
        <ShopGrid shops={shops} />
     </div>
  );
}
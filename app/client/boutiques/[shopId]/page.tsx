
import { queryGraphql } from "@/lib/api/apiGraphql";
import Image from "next/image";
import { Store, ShieldCheck, BadgeCheck } from "lucide-react";
import { FETCH_SHOP_BY_ID } from "@/lib/services/shopService";




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
    <div className="container mx-auto p-6 md:p-12">
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
        <div className="w-full md:w-1/2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">{shop.name}</h1>
            <div className="flex items-center gap-2 text-primary-dark">
              <Store size={20} />
              <span className="font-medium">{shop?.name}</span>
              {shop?.isVerified && <BadgeCheck size={18} className="text-blue-500" />}
            </div>
          </div>

         

          {/* Badge de réassurance */}
          <div className="bg-background-dark p-4 rounded-md flex gap-3 border border-border">
            <ShieldCheck className="text-primary-dark" />
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


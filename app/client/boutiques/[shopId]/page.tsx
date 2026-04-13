 import { queryGraphql } from "@/lib/api/apiGraphql";
import { FETCH_SHOP_BY_ID } from "@/lib/services/shopService";
import ShopClientView from "../ShopClient/ShopClientView";

// On définit le type de params comme une Promesse (spécifique à Next.js 15/16)
interface Props {
  params: Promise<{ shopId: string }>;
}
export default async function ShopDetailPage({ params }: Props) {



  // Récupérer l'ID de l'URL
  const { shopId } = await params; // On attend que les params soient disponibles

  //  Appeler le serveur avec la fonction findProductById
  const data = await queryGraphql(FETCH_SHOP_BY_ID, { shopId: shopId });
  const shop = data?.fetchShopById;

 
  //  Gérer le cas où le produit n'existe pas
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
    <ShopClientView shop={shop} />
  );
}


import { queryGraphql } from "@/lib/api/apiGraphql";
import { GET_PRODUCT_BY_ID } from "@/lib/services/productService";
import Image from "next/image";
import { Store, ShieldCheck, BadgeCheck } from "lucide-react";

// On définit le type de params comme une Promesse (spécifique à Next.js 15/16)
interface Props {
  params: Promise<{ id: string }>;
}
export default async function ProductDetailPage({ params }: Props) {
  // 1. Récupérer l'ID de l'URL
  const { id } = await params; // On attend que les params soient disponibles

  // 2. Appeler le serveur avec la fonction findProductById
  const data = await queryGraphql(GET_PRODUCT_BY_ID, { productId: id });
  const product = data?.findProductById;

  // 3. Gérer le cas où le produit n'existe pas
  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-xl font-bold">Oups ! Produit introuvable.</h1>
        <p className="text-gray-500">L&apos;ID {id} ne correspond à aucun article.</p>
      </div>
    );
  }

  // 4. Affichage des informations
  return (
    <div className="container mx-auto p-6 md:p-12">
      {/* BLOC IMAGE (Utilise tes classes de design system) */}
      <div className="w-full md:w-1/2 relative aspect-square  shadow-card overflow-hidden">
          <Image 
            src={product.imageUrl} 
            alt={product.name} 
            fill 
            className="object-cover"
            priority // Charge l'image en priorité
          />
      </div>
      <div className="flex flex-col md:flex-row gap-10 bg-amber-300">
        
        {/* BLOC IMAGE (Utilise tes classes de design system) */}
        <div className="w-full md:w-1/2 relative aspect-square rounded-xl shadow-card overflow-hidden border border-border">
          <Image 
            src={product.imageUrl} 
            alt={product.name} 
            fill 
            className="object-cover"
            priority // Charge l'image en priorité
          />
        </div>

        {/* BLOC INFOS */}
        <div className="w-full md:w-1/2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">{product.name}</h1>
            <div className="flex items-center gap-2 text-primary-dark">
              <Store size={20} />
              <span className="font-medium">{product.shop?.name}</span>
              {product.shop?.isVerified && <BadgeCheck size={18} className="text-blue-500" />}
            </div>
          </div>

          <div className="text-4xl font-bold text-primary-dark">
            {product.price.toLocaleString()} FCFA
          </div>

          <div className="border-t border-b border-border py-4">
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-text-secondary leading-relaxed">
              {product.description || "Aucune description fournie pour ce produit."}
            </p>
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


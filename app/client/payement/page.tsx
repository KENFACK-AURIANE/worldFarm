/* eslint-disable @typescript-eslint/no-explicit-any */
import PayementHeader from "@/components/layout/Header/PayementHeader";
import { queryGraphql } from "@/lib/api/apiGraphql";
import { GET_PRODUCT_BY_ID } from "@/lib/services/productService";

export default async function PaymentPage({ searchParams }: { searchParams: Promise<any> }) {
  // 1. IL FAUT ATTENDRE LES PARAMS
  const { productId, qty, color } = await searchParams;
 const data = await queryGraphql(GET_PRODUCT_BY_ID, { productId: productId });
    const product = data?.findProductById;

  return (
    <div className="">
        <PayementHeader />
      <h1 className="text-2xl font-bold mb-4">Paiement</h1>
      <div className="space-y-2">
        <p><strong>Produit :</strong> {product.name}</p>
        <p><strong>Quantité :</strong> {qty}</p>
        <p><strong>Couleur :</strong> {color}</p>
      </div>
    </div>
  );
}

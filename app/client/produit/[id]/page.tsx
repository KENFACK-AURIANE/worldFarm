/* eslint-disable @typescript-eslint/no-explicit-any */
import { queryGraphql } from "@/lib/api/apiGraphql";
import { GET_PRODUCT_BY_ID } from "@/lib/services/productService";
import { GET_CATEGORIES } from "@/lib/services/categoryService";
import Image from "next/image";
import { ChevronRight, ListChecks } from "lucide-react";
import ProduitClient from "../ProductClient"

import { 
  ChevronLeft, Share2, Heart, Shapes
  ,Star, Box, 
} from 'lucide-react';
import Productpage from "@/components/layout/Header/Productpage";

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
  // Récupérer l'ID de l'URL
  const { id } = await params; // On attend que les params soient disponibles

  // Appeler le serveur avec la fonction findProductById
  const data = await queryGraphql(GET_PRODUCT_BY_ID, { productId: id });
  const product = data?.findProductById;
  console.log("DATA REÇUE :", product?.categoryId);
 

  //  Récupérez d'abord TOUTES les catégories
  const allCatsData = await queryGraphql(GET_CATEGORIES);
  const allCategories = allCatsData?.getCategories || [];

  // 3. Lancer la recherche du nom
  const resultat = findHierarchy(allCategories, product?.categoryId);

  // LOG DE VÉRIFICATION
  console.log("RÉSULTAT TROUVÉ :", resultat.parentName, resultat.childName);
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
    

    <div className="max-w-md mx-auto  min-h-screen pb-24 font-sans text-slate-800  md:max-w-screen md:overflow-hidden md:m-0  md:min-w-md text-lg">
      {/* Header Navigation */}
      <div className="flex items-center gap-4  sticky top-0 bg-teal-600/10 backdrop-blur-md z-10 md: w-screen ">
        
        <Productpage productName={product.name} />
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
            <p className="text-lgtext-gray-500">Catégorie</p>
            <p className="font-semibold text-sm flex flex-row">{resultat.parentName} <ChevronRight /> {resultat.childName}</p>
          </div>
        </div>
        
        <div className="p-3 border-b border-gray-200 flex items-start gap-3 text-lg">
          <div className="p-2 bg-teal-50 text-teal-600 rounded-lg  text-lg"><Box size={20} /></div>
          <div>
            <p className=" text-gray-500  text-lg">Stock</p>
            <p className="font-semibold  text-lg">{product.stock} disponible(s)</p>
          </div>
        </div>

        <div className="p-3 border-b border-gray-200 flex items-start gap-3  text-lg">
          <div className="p-2 bg-teal-50 text-teal-600 rounded-lg"><div className="p-2 bg-teal-50 text-teal-600 rounded-lg"><ListChecks size={20} /></div></div>
          <div>
            <p className=" text-lg text-gray-500">Caractéristiques</p>
            <div className="flex flex-wrap gap-1 mt-1  text-lg">
              {product.characteristics && product.characteristics.length > 0 ? (
                product.characteristics.map((char: string, index: number) => (
                  <span 
                    key={index} 
                    className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded  text-lg font-medium"
                  >
                    {char}
                  </span>
                ))
              ) : (
                <p className="font-semibold  text-lg">Non spécifiées</p>
              )}
            </div>
          </div>
        </div>
      </div>

      
      <ProduitClient product={product}/>
  </div>
    
  );
}


/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { queryGraphql } from "@/lib/api/apiGraphql";
import FeaturedCarousel from "@/components/features/Caroussel/FeaturedCaroussel";
import Header from "@/components/layout/Header/Header";
import { GET_CATEGORIES } from "@/lib/services/categoryService";
import { GET_PRODUCTS } from "@/lib/services/productService";
import { useCallback, useEffect, useState } from "react";
import ProductGrid from "@/components/features/ProductGrid";
import CategoryFilter from "@/components/features/CategoryFilter";
import { apiClient } from "@/lib/api/client";
import { getToken } from "@/lib/utils/auth";

interface Category {
  id: string;
  name: string;
  subCategories?: Category[]; 
}

const Page = () => {

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<any[]>([]); 
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  

  // charger catégories
useEffect(() => {
  const loadCategories = async () => {
    const data = await queryGraphql(GET_CATEGORIES);

    //  l'opérateur ?. évite de lire dans null
    if (data?.getCategories) {
      setCategories(data.getCategories);
    } else {
      // Si data est null, on peut initialiser à un tableau vide pour éviter d'autres erreurs
      setCategories([]); 
      console.warn("Accès aux catégories refusé ou vide.");
    }
  };

  loadCategories();
}, []);

const loadProducts = useCallback(async (categoryId: string | null) => {
  setActiveCategory(categoryId);

  let allRelatedIds: (string | null)[];

  // 1. GESTION DU CAS "ALL"
  if (categoryId === null) {
    allRelatedIds = [null]; // On envoie juste null pour avoir tout
  } else {
    // 2. GESTION D'UNE CATÉGORIE PRÉCISE
    const selectedCat = categories.find((c) => c.id === categoryId);
    
    // On inclut le parent + ses enfants s'ils existent
    allRelatedIds = selectedCat?.subCategories && selectedCat.subCategories.length > 0
      ? [categoryId, ...selectedCat.subCategories.map(sub => sub.id)]
      : [categoryId];
  }

  // 3. APPEL API
  const promises = allRelatedIds.map(id => 
    queryGraphql(GET_PRODUCTS, { categoryId: id })
  );

  const results = await Promise.all(promises);
  
  // Fusion et nettoyage des doublons
  const allProducts = results.flatMap(res => res?.findAllProduct?.content || []);
  const uniqueProducts = Array.from(new Map(allProducts.map(p => [p.id, p])).values());

  setProducts(uniqueProducts);

}, [categories]); // Dépend de categories pour trouver les enfants





  // charger tous les produits au début
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadProducts(null);
  }, [loadProducts]);



  return (
    <div>
      <Header />
      <FeaturedCarousel />
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Nos Produits</h2>
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onSelect={loadProducts}
        />
        <ProductGrid products={products} />
      </div>
    </div>
  );
};

export default Page;

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { queryGraphql } from "@/lib/api/apiGraphql";
import FeaturedCarousel from "@/components/features/Caroussel/FeaturedCaroussel";
import Header from "@/components/layout/Header/Header";
import { GET_CATEGORIES } from "@/lib/services/categoryService";
import { GET_PRODUCTS } from "@/lib/services/productService";
import { useCallback, useEffect, useState } from "react";
import ProductGrid from "@/components/features/cart/ProductGrid";
import CategoryFilter from "@/components/features/cart/CategoryFilter";
import Link from "next/link"; 

import { ArrowRight, History, Store } from "lucide-react";
import { GET_TOP_SHOPS } from "@/lib/services/shopService";
import ShopGrid from "@/components/features/cart/ShopGrid";
import Footer from "@/components/layout/Footer/Footer";

interface Category {
  id: string;
  name: string;
  subCategories?: Category[]; 
}

const Page = () => {

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<any[]>([]); 
  const [shops, setShops] = useState<any[]>([]); 
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
    allRelatedIds = [null];
  } else {
    const selectedCat = categories.find((c) => c.id === categoryId);

    allRelatedIds =
      selectedCat?.subCategories && selectedCat.subCategories.length > 0
        ? [categoryId, ...selectedCat.subCategories.map(sub => sub.id)]
        : [categoryId];
  }

  try {
    // ⚠️ éviter d’envoyer null si ton backend ne supporte pas
    const promises = allRelatedIds.map(id =>
      id === null
        ? queryGraphql(GET_PRODUCTS) // sans filtre
        : queryGraphql(GET_PRODUCTS, { categoryId: id })
    );

    const results = await Promise.all(promises);

    console.log("RESULTS :", results); // 🔍 debug utile

    // ✅ correction importante ici (GraphQL → data)
    const allProducts = results.flatMap(
      res => res?.data?.findAllProduct?.content ?? []
    );

    // 5. SUPPRESSION DES DOUBLONS
    const uniqueProducts = Array.from(
      new Map(allProducts.map(p => [p.id, p])).values()
    );

    setProducts(uniqueProducts);
  } catch (err) {
    console.error("Erreur lors du chargement des produits:", err);
    setProducts([]);
  }
}, [categories]);





  // charger tous les produits au début
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadProducts(null);
  }, [loadProducts]);

  useEffect(() => {
    const loadShops = async () => {
      const data = await queryGraphql
      (GET_TOP_SHOPS);
      const actualData = data?.data;
      console.log("Contenu réel :", actualData?.topShops?.content);

      // on accède à .topShops.content
      if (data?.topShops?.content) {

        setShops(data.topShops.content); // On donne le tableau [Boutique]
      } else {
        setShops([]); 
        console.warn("Aucune boutique 'top' trouvée ou format incorrect.");
      }
    };

    loadShops();
  }, []);




  return (
    <div >
      <div className="sticky top-0 z-50 w-full shadow-md">
        <Header />
      </div>
      
      <FeaturedCarousel />
      {/* boutiques et status */}
      <div className="mb-10">
        {/* ligne d'entete pour les boutiques */}
        <div className="flex flex-row  gap-5 mb-4 px-2 items-center md:justify-between ">
          <Store size={24} className="text-primary-dark" />
          <h2>Top 5 boutiques</h2>
          <button type="button" className="flex flex-row gap-1 bg-primary-dark rounded-full text-text-disabled pb-1 pt-1 pr-3 pl-3 items-center"><History size={20} /> Status</button>
          <Link href="/client/boutiques" className="ml-auto flex items-center gap-1 text-primary-dark">
            <button type="button" className="flex flex-row gap-1 text-primary-dark items-center">
              Voir plus
              <ArrowRight size={20} /> 
            </button>
          </Link>
          
        </div>
        <div>
          <ShopGrid shops={shops} />
        </div>

      </div>

      {/* produits et categories */}
      <div>
        {/* ligne d'entete pour les produits */}
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onSelect={loadProducts}
        />
        {/* grille de produits */}
        <div className="container mx-auto px-4 py-8">
          <ProductGrid products={products} />
        </div>
      </div>
      
      <Footer />
    </div>
      
  );
};

export default Page;

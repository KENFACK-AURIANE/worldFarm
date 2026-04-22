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

import { ArrowRight, History, Plus, Store } from "lucide-react";
import { GET_TOP_SHOPS } from "@/lib/services/shopService";
import ShopGrid from "@/components/features/cart/ShopGrid";
import Footer from "@/components/layout/Footer/Footer";
import {useRouter} from "next/navigation";
import HeaderAcceuil from "@/components/layout/Header/HeaderAcceuil";
import SponsoredShop from "@/components/layout/SectionAndMenu/Acceuil/sponsoredShop";
import PopularShop from "@/components/layout/SectionAndMenu/Acceuil/popularShop";
import Reel from "@/components/layout/SectionAndMenu/Acceuil/reels";
import { Shop } from "@/lib/types/shop.types";

interface Category {
  id: string;
  name: string;
  subCategories?: Category[]; 
}

const Page = () => {

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<any[]>([]); 
  const [shops, setShops] = useState<Shop[]>([]); 
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const router = useRouter();
  const [sponsorisedShops, setSponsorisedShops] = useState<Shop[]>([]); 

  

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
    // éviter d’envoyer null si ton backend ne supporte pas
    const promises = allRelatedIds.map(id =>
      id === null
        ? queryGraphql(GET_PRODUCTS) // sans filtre
        : queryGraphql(GET_PRODUCTS, { categoryId: id })
    );

    const results = await Promise.all(promises);

    console.log("RESULTS :", results);
    const nomRecherche = "Global Shop"; // Le nom exact de la boutique


    //obtenir les produits
    const allProducts = results.flatMap(
      res => res?.findAllProduct?.content || []
    );


    const produitsBoutique = allProducts.filter((res) => {
      return res?.shop?.name === nomRecherche;
    });
    console.log("Produits de la boutique :", produitsBoutique);

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
      const data = await queryGraphql(GET_PRODUCTS); // Récupère les produits
      const allProducts = data?.findAllProduct?.content || [];
      console.log("produits",data?.findAllProduct?.content)

      const shopsMap: Record<string, any> = {};

      allProducts.forEach((product: any) => {
          const shopData = product.shop;
          if (shopData?.isVerified) {
          const sId = shopData.shopId;
          
          // Si la boutique n'est pas encore dans notre Map, on l'initialise
          if (!shopsMap[sId]) {
              shopsMap[sId] = {
              ...shopData,
              displayImages: [] // On crée ce champ pour stocker les images
              };
          }

          // On ajoute l'image du produit actuel à la boutique (max 2)
          if (shopsMap[sId].displayImages.length < 2) {
              const img = product.imageUrl;
              if (img) shopsMap[sId].displayImages.push(img);
          }
          }
      });
      const finalShops = Object.values(shopsMap);
      console.log("Nombre de boutiques trouvées :", finalShops.length)

      // On transforme l'objet en tableau pour ton .map()
      setShops(Object.values(shopsMap));
      console.log("taille sponsor",shops.length)
    
    };

    loadShops();
  }, []);



  

  useEffect(() => {
    const loadSponsorShops = async () => {
      const data = await queryGraphql(GET_PRODUCTS); // Récupère les produits
      const allProducts = data?.findAllProduct?.content || [];
      console.log("produits",data?.findAllProduct?.content)

      const shopsMap: Record<string, any> = {};

      allProducts.forEach((product: any) => {
          const shopData = product.shop;
          if (shopData?.isVerified) {
          const sId = shopData.shopId;
          
          // Si la boutique n'est pas encore dans notre Map, on l'initialise
          if (!shopsMap[sId]) {
              shopsMap[sId] = {
              ...shopData,
              displayImages: [] // On crée ce champ pour stocker les images
              };
          }

          // On ajoute l'image du produit actuel à la boutique (max 2)
          if (shopsMap[sId].displayImages.length < 2) {
              const img = product.imageUrl;
              if (img) shopsMap[sId].displayImages.push(img);
          }
          }
      });
      const finalShops = Object.values(shopsMap);
      console.log("Nombre de boutiques trouvées :", finalShops.length)

      // On transforme l'objet en tableau pour ton .map()
      setSponsorisedShops(Object.values(shopsMap));
      console.log("taille sponsor",sponsorisedShops.length)
    };

    loadSponsorShops();
  }, []);





  return (
    <div >
      <div className="sticky top-0 z-50 w-full shadow-md">
         <HeaderAcceuil />
       
      </div>

      <SponsoredShop sponsorisedShops={sponsorisedShops} />
      <PopularShop shops={shops} />

      {/* SECTION: BOUTON STATUTS */}
      <div className="flex items-center justify-between bg-primary-dark/8 p-3 rounded-2xl shadow-sm border border-gray-100 group cursor-pointer hover:bg-gray-50 transition-colors mt-6 mx-4">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500 p-2 rounded-full text-white">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">Découvrez les nouveautés des boutiques dans leurs statuts</p>
            
          </div>
        </div>
        <button className="bg-slate-800 text-white px-5 py-2 rounded-xl text-sm font-medium active:scale-95 transition-transform">
          Statuts
        </button>
      </div>

      <Reel />
      
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

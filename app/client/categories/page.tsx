/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import {apiClient} from "@/lib/api/client"; // Ton client API
import Image from "next/image";

import { useRouter } from "next/navigation"; 
import { ChevronLeft, ChevronRight, Shapes} from "lucide-react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);       // toutes les catégories racines
  const [subCategories, setSubCategories] = useState<any[]>([]); // sous-catégories à afficher    
  const router = useRouter();
  const [activeId, setActiveId] = useState<string | null>(null);





  
  // --- Charger les sous-catégories d'une catégorie ---
  const handleCategoryClick = async (catId: string) => {
    setActiveId(catId); // Marquer la catégorie comme active
    try {
      const { data: subs } = await apiClient.get("/category", { params: { parentId: catId } });
      setSubCategories(subs);

      if (subs.length === 0) {
        // pas de sous-catégories → charger produits
        router.push(`/client/categories/${catId}`); 
      } 
    } catch (err) {
      console.error(err);
      setSubCategories([]);
    }
  };

  // --- Charger les catégories racines au démarrage ---
  useEffect(() => {
    const loadRootCategories = async () => {
      try {
        const { data } = await apiClient.get("/category", { params: { parentId: null } });
        setCategories(data);

        // Si on a des catégories, on active la première automatiquement
      if (data && data.length > 0) {
        const firstCatId = data[0].id;
        setActiveId(firstCatId); // On met le fond gris
        handleCategoryClick(firstCatId); // On charge ses sous-catégories
      }
      } catch (err) {
        console.error(err);
        setCategories([]);
      }
    };
    loadRootCategories();
  }, []);

  
  const handleSubCategoryClick = async (subCatId: string) => {
  try {
    const { data: subSubs } = await apiClient.get("/category", { params: { parentId: subCatId } });
    
    if (subSubs.length === 0) {
      // Au lieu de charger ici, on envoie l'ID dans l'URL
      router.push(`/client/categories/${subCatId}`); 
    } else {
      setSubCategories(subSubs);
    }
  } catch (err) {
    console.error(err);
    setSubCategories([]);
  }
};

  

  return (
    <div className=" flex flex-col bg-primary-light/10 ">
      {/* header */}
      <div className="sticky top-0 z-50 w-full shadow-md bg-primary-light/99  text-white p-7 flex flex-row items-center justify-between h-30">
        <div className="flex flex-row items-center justify-between gap-2 w-75">
            <div className=" bg-primary-light/10 rounded-2xl flex flex-row items-center w-10 h-10">
            <button onClick={() => router.back()} className="pl-2">
              <ChevronLeft size={30} className="" />
            </button>
            </div>
            <div className="pl-2">
              <Shapes size={30} className="fill-white stroke-white" />
            </div>
            
            <h1 className="text-lg font-semibold ">Toutes les Categories</h1>
            
            
            
        </div>

        
      </div>

      {/* categories et sous-categories */}
      <div className="pr-3 flex flex-row gap-7 h-screen overflow-hidden md:gap-15   ">
        

        {/* Liste des catégories racines */}
        <div className="flex  flex-col overflow-y-auto [scrollbar-width:none] 
        [-ms-overflow-style:none]  
        [&::-webkit-scrollbar]:hidden ">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className={`py-4 flex flex-col gap-5 items-center justify-center  ${
              activeId === cat.id 
                ? "bg-primary-dark text-white"  // Style quand c'est actif (gris foncé)
                : "bg-white "           // Style par défaut
            }`}
            >
              {cat.logoUrl ? (
                <Image src={cat.logoUrl} alt={cat.name} width={30} height={30} className="inline-block mr-2" />
              ) : (
                <span className="inline-block w-6 h-6 bg-gray-300  mr-2">
                  {cat.name.charAt(0).toUpperCase()}
                </span>
              )}
              {cat.name}
            </button>
          ))}
        </div>

        {/* Liste des sous-catégories */}
        {subCategories.length > 0 && (
          <div className="flex gap-4 mb-6 flex-col text-xl overflow-y-auto md:overflow-y-auto [scrollbar-width:none] 
          [-ms-overflow-style:none]  
          [&::-webkit-scrollbar]:hidden  ">
            {subCategories.map(sub => (
              <button
                key={sub.id}
                onClick={() => handleSubCategoryClick(sub.id)}
                className="bg-white px-4 py-2  flex flex-row items-center gap-2 shadow-md rounded-lg"
              >
                <div className="relative h-20 w-20">
                  {sub.productNumber > 0 && (
                    <span className="absolute top-2 right-10 bg-primary-dark text-white text-xs px-2 py-1 rounded-full z-10 shadow-sm border border-white">
                      {sub.productNumber}
                    </span>
                  )}
                  {sub.logoUrl ? (
                  <Image src={sub.logoUrl} alt={sub.name} width={30} height={70} className="mr-2 h-full w-full" />
                  
                ) : (
                  <span className="inline-block w-20 h-20 items-center bg-gray-300  mr-2">
                    {sub.name.charAt(0).toUpperCase()}
                  </span>
                )}
                </div>
                
                {sub.name}
                <ChevronRight />
                
              </button>
            ))}
          </div>
        )}

       
      </div>
      
    </div>
  );
}
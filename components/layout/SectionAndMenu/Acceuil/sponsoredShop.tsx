/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { queryGraphql } from "@/lib/api/apiGraphql";
import { GET_PRODUCTS } from "@/lib/services/productService";
import { Shop } from "@/lib/types/shop.types";
import { CheckCircle2, ChevronLeft, ChevronRight, ShoppingBag, Star } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function SponsoredShop({sponsorisedShops}: {sponsorisedShops:Shop[]}) {

    
    


    const [currentIndex, setCurrentIndex] = useState(0);
    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % sponsorisedShops.length);
    };

    const prevSlide = () => {
    setCurrentIndex((prev) =>
        prev === 0 ? sponsorisedShops.length - 1 : prev - 1
    );
    };
    

    useEffect(() => {
        // Si le tableau est vide (chargement), on ne lance pas de timer
        if (sponsorisedShops.length === 0) return;

        const interval = setInterval(() => {
            // Ici, sponsorisedShops.length sera bien de 6 au moment de l'exécution
            setCurrentIndex((prev) => (prev + 1) % sponsorisedShops.length);
        }, 4000);

        return () => clearInterval(interval);
        // CRUCIAL : On ajoute sponsorisedShops.length dans les dépendances
    }, [sponsorisedShops.length]); 
  return (
    <div className="relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-sm">

        <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="bg-black p-1.5 rounded-lg">
                <Star  className="w-4 h-4 fill-white" />
              </div>
              <h2 className="font-bold text-lg">Boutiques Sponsorisées</h2>
            </div>
            <button className="text-gray-500 text-sm font-medium flex items-center gap-1">
              Voir tout <ChevronRight className="w-4 h-4" />
            </button>
        </div>

        {/* Slides */}
        <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
            {sponsorisedShops.map((shop, index) => (
                <div key={`shop-${index}`} className="min-w-full p-4">
                    
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden"> 

                            {shop?.logoUrl ? (
                                <Image 
                                    src={shop.logoUrl} 
                                    alt={shop.name} 
                                    fill 
                                    className="object-cover" 
                                />
                                ) : (
                                 <div className="w-full h-full flex items-center justify-center bg-gray-100 text-[#1e2a78] font-bold text-lg">
                                    {/* Affiche les 2 premières lettres du nom si pas de logo */}
                                    {shop?.name?.slice(0, 2).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div>
                            <div className="flex items-center gap-1">
                            <span className="font-bold">{shop.name}</span>
                            {shop.isVerified && <CheckCircle2 className="w-4 h-4 fill-blue-500 text-white" />}
                            
                            </div>

                            <div className="flex gap-2 mt-1">
                            <span className="text-[10px] bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full font-bold border border-orange-100 italic">
                                → Sponsorisé
                            </span>
                            </div>
                        </div>
                    </div>

                    {/* Produits */}
                    {/* Produits récupérés dynamiquement */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                    {/* On crée un tableau de 2 emplacements quoi qu'il arrive */}
                        {[0, 1].map((index) => {
                            const img = shop.displayImages && shop.displayImages[index];
                            
                            return (
                            <div 
                                key={index} 
                                className="aspect-4/3 rounded-2xl overflow-hidden relative border border-gray-100"
                            >
                                {img ? (
                                /* Affichage de l'image si elle existe */
                                <Image 
                                    src={img} 
                                    alt={`Produit ${index + 1}`} 
                                    fill 
                                    className="object-cover transition-transform hover:scale-105 duration-300" 
                                />
                                ) : (
                                /* Bloc gris si l'image est absente (vide) */
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                    <div className="bg-white/50 p-2 rounded-full">
                                    <ShoppingBag className="text-gray-300 w-5 h-5" />
                                    </div>
                                </div>
                                )}
                            </div>
                            );
                        })}
                    </div>


                    {/* Footer */}
                    <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-lg">Nouveautés de Dubaï </h3>
                        <p className="text-gray-400 text-xs">{shop.description}</p>
                    </div>
                    <button className="bg-[#E0F2F1] text-[#00897B] px-6 py-2.5 rounded-xl font-bold">
                        Acheter
                    </button>
                    </div>

                </div>
            ))}
        </div>

        {/* Boutons navigation */}
        <button 
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow"
        >
            <ChevronLeft />
        </button>

        <button 
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow"
        >
            <ChevronRight />
        </button>

        {/* Indicateurs */}
        <div className="flex justify-center gap-2 pb-3">
            {sponsorisedShops.map((_, i) => (
            <div
                key={i}
                className={`h-2 w-2 rounded-full ${
                i === currentIndex ? "bg-black" : "bg-gray-300"
                }`}
            />
            ))}
        </div>
    </div>
  );
}
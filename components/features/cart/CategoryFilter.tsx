/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"; // Permet l'interactivité (clics) côté navigateur
import { LayoutGrid } from "lucide-react";
import Image from "next/image";

export default function CategoryFilter({
  categories,     // Liste des catégories à afficher (tableau)
  activeCategory, // ID de la catégorie sélectionnée (ou null)
  onSelect        // Fonction appelée quand on clique sur un bouton
}: any) {

  return (
    // Conteneur flexible avec espacement et retour à la ligne automatique
    <div className="flex justify-between items-center gap-10 overflow-x-auto mb-0 flex-row bg-gray-100 [scrollbar-width:none] [&::-webkit-scrollbar]:display-none">

      {/* BOUTON "ALL" : Pour désactiver le filtre (envoie null) */}
      <button
        onClick={() => onSelect(null)} // Envoie un ID spécial pour "toutes les catégories"
        className={`h-12 flex gap-3 items-center flex-row ${
          // Si aucune catégorie n'est choisie, affiche en vert, sinon en gris
          activeCategory === null
            ? "text-primary-dark border-b-2 border-primary-dark"
            : "text-black"
        }`}
      >
        <LayoutGrid size={30} />
        All
      </button>

      {/* BOUCLE : On crée un bouton pour chaque catégorie reçue */}
      {categories.map((cat:any) => (

        <button
          key={cat.id} // Identifiant unique pour React
          onClick={() => onSelect(cat.id)} // Envoie l'ID au clic
          className={` ${
            // Si l'ID correspond à la catégorie active, affiche en vert
            activeCategory === cat.id
              ? "text-primary-dark border-b-2 border-primary-dark"
              : "text-black"
          }`}
        >
          <div className="flex items-center gap-2">
            {/* ✅ On vérifie si logoUrl existe ET n'est pas vide */}
            {cat.logoUrl && cat.logoUrl.trim() !== "" ? (
              <div className="relative w-8 h-12 ">
                <Image 
                  src={cat.logoUrl} 
                  alt={cat.name} 
                  fill 
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
  
                  className="object-contain" 
                />
              </div>
            ) : (
              /* 🎨 Placeholder : Cercle avec la première lettre si pas d'image */
              <div className="w-8 h-10 bg-primary-dark/10  flex items-center justify-center text-primary-dark font-bold border border-primary-dark/20">
                {cat.name.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-xs mt-1 text-center">{cat.name}</span>
          </div>
            
        </button>

      ))}

    </div>
  );
}

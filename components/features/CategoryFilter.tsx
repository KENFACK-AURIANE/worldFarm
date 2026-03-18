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
    <div className="flex w-10 gap-4 mb-6 flex-col">

      {/* BOUTON "ALL" : Pour désactiver le filtre (envoie null) */}
      <button
        onClick={() => onSelect(null)} // Envoie un ID spécial pour "toutes les catégories"
        className={`w-10 ${
          // Si aucune catégorie n'est choisie, affiche en vert, sinon en gris
          activeCategory === null
            ? "bg-green-600 text-white"
            : "bg-gray-200"
        }`}
      >
        <LayoutGrid size={20} />
        All
      </button>

      {/* BOUCLE : On crée un bouton pour chaque catégorie reçue */}
      {categories.map((cat:any) => (

        <button
          key={cat.id} // Identifiant unique pour React
          onClick={() => onSelect(cat.id)} // Envoie l'ID au clic
          className={`w-10 ${
            // Si l'ID correspond à la catégorie active, affiche en vert
            activeCategory === cat.id
              ? "bg-green-600 text-white"
              : "bg-gray-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <Image src={cat.logoUrl} alt={cat.name} width={50} height={50} />
            {cat.name} {/* Affiche le nom de la catégorie */}
          </div>
            
        </button>

      ))}

    </div>
  );
}

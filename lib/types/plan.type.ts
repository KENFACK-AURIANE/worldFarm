// 🔹 Définition du type Plan 
export interface Plan {
  souscriptionTypeId: string; // ID unique du plan
  name: string;               // Nom du plan (Premium, Standard…)
  description: string;        // Description du plan
  basePrice: number;          // Prix 
  icon: string;               // Icône 
  freePlan: boolean;          // true si plan gratuit
  perMonths: boolean;         // true si facturé mensuellement
  recommended: boolean;       // true si plan recommandé
  settings: {
    code: string;             // code interne (ex: unlimited_product)
    name: string;             // nom affiché (ex: Produits illimités)
  }[];
};
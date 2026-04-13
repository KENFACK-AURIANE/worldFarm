"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Plan } from "../types/plan.type";;

// Type du store global
type PlanStore = {
  selectedPlan: Plan | null;        // plan sélectionné
  setPlan: (plan: Plan) => void;    // fonction pour définir le plan
  clearPlan: () => void;            // fonction pour reset
};

// Création du store Zustand avec persist (localStorage)
export const usePlanStore = create<PlanStore>()(
  persist(
    (set) => ({
      selectedPlan: null, // valeur initiale

      // Met à jour le plan sélectionné
      setPlan: (plan) => set({ selectedPlan: plan }),

      // Supprime le plan (ex: après paiement)
      clearPlan: () => set({ selectedPlan: null }),
    }),
    {
      name: "plan-storage", // clé dans localStorage
    }
  )
);
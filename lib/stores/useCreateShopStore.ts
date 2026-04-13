/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";

// Store global pour gérer toutes les données du formulaire
export const useCreateShopStore = create((set) => ({
  
  // État global du formulaire
  form: {
    name: "",           // Nom de la boutique
    description: "",    // Description
    shopTypeId: "",    // Type de boutique
    promoCode: "",       // Code promo
    souscriptionTypeId: "", // Type de souscription
    address: {
      city: "",
      region: "",
      zipCode: "",
      country: "",
      countryIso: "",
      
    },  
  },

  // Fonction pour mettre à jour le formulaire (fusion des données)
  setForm: (data: any) =>
    set((state: { form: any; }) => ({
      form: { ...state.form, ...data },
    })),

  // Réinitialisation du formulaire (après création)
  reset: () =>
    set({
      form: {
        name: "",
        description: "",
        shopTypeId: "",
        country: "",
        city: "",
        promoCode: "",
        souscriptionTypeId: "",
        address: {
            city: "",
            region: "",
            zipCode: "",
            country: "",
            countryIso: "",
            
            },  
      },
    }),
}));
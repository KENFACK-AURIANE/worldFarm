import { z } from "zod";

// Validation du Step 1 (infos de base)
export const step1Schema = z.object({
  name: z.string().min(2, "Nom requis"),        // minimum 2 caractères
  description: z.string().min(5, "Description requise. Entrez au moins 5 caracteres"), // minimum 5 caractères
  shopTypeId: z.string().min(1, "Type requis"), // obligatoire
});

// Validation du Step 2 (localisation)
export const step2Schema = z.object({
  address: z.object({
    country: z.string().min(1, "Veuillez sélectionner un pays"),
    region: z.string().min(1, "Veuillez sélectionner une région"), // Ajouté
    city: z.string().min(1, "Veuillez sélectionner une ville"),
  }),
  promoCode: z.string().optional().or(z.literal("")),
});
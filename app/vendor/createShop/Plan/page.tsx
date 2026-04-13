/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/enpoints"; 
import { usePlanStore } from "@/lib/stores/UsePlanStore";
import { Plan } from "@/lib/types/plan.type";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/api/client";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Store} from "lucide-react";
import { useCreateShopStore } from "@/lib/stores/useCreateShopStore";




export default function PlansPage() {

   const { setForm } = useCreateShopStore() as  { form: {  souscriptionTypeId: string }; setForm: (updates: Partial<{ souscriptionTypeId: string}>) => void };
    

  // State local pour stocker les plans API
  const [plans, setPlans] = useState<Plan[]>([]);

  // Loading state (UX)
  const [loading, setLoading] = useState(true);

  // Zustand (global state)
  const { selectedPlan, setPlan } = usePlanStore();

  // Navigation Next.js
  const router = useRouter();

  const getPlanTheme = (planName: string) => {
    switch (planName) {
      case "GRATUIT": return { border: "border-2 border-purple-500", bg: "bg-purple-500", text: "text-gray-600" };
      case "STANDARD": return { border: "border-2 border-vendor-primary", bg: "bg-vendor-primary", text: "text-blue-600" };
      case "PREMIUM": return { border: "border-2 border-orange", bg: "bg-purple-800", text: "text-orange-600" };
      default: return { border: "border-2 border-purple-500", bg: "bg-purple-600", text: "text-purple-600" };
    }
  };


  // Charger les plans depuis l'API
  useEffect(() => {
    const fetchPlans = async () => {
      const token = getToken(); // On récupère le token via votre fonction
      try {
        console.log("Refresh token:", token); // Debug token
        const response = await apiClient.get(API_ENDPOINTS.VENDOR.CHOOSE_PLAN ); //endpoint API

        setPlans(response.data); // stocker les plans
         console.log("Liste des plans :", response.data);

        // Auto-sélection du plan recommandé
        if (!selectedPlan && response.data.length > 0) {
          const recommended = response.data.find((p: Plan) => p.recommended);
          setPlan(recommended || response.data[0]);
        }

      } catch (err) {
        console.error(err); // debug erreur
      } finally {
        setLoading(false); // stop loading
      }
    };

    fetchPlans();
  }, []);

  // Affichage pendant chargement
  if (loading) {
    return <div className="p-4">Chargement...</div>;
  }

  return (
    <div className="space-y-4 pb-28">

      {/* header */}
      <div className="sticky top-0 z-50 bg-vendor-primary/90 text-white p-4 flex flex-col items-center justify-center md:flex-row md:items-center gap-6 ">
        <div className="flex flex-row items-center gap-20 w-full">
          <div className="rounded-lg flex flex-row items-center   ">
            <button onClick={() => router.back()} className="pl-2">
              <ArrowLeft size={30} className="text-white"/>
            </button>
          </div>
          <h1 className="text-xl font-semibold ">Créer votre boutique</h1>
          
        </div>
        <div><Store size={80} className=""/></div>
        <div className="flex flex-col justify-center items-center gap-2">
          <h1 className="text-2xl font-bold">Choisissez votre plan</h1>
          <h3 className="text-lg font-semibold text-gray-300">Démarrez votre activité en quelques clics</h3>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-5">
        {/* Boucle sur tous les plans */}
        {plans.map((plan) => {

          //  Vérifie si ce plan est sélectionné
          const isSelected = selectedPlan?.souscriptionTypeId === plan.souscriptionTypeId;
          const theme = getPlanTheme(plan.name); // On récupère les couleurs du plan

          return (
            <div
              key={plan.souscriptionTypeId}

              // 🔥 Sélection du plan au clic
              onClick={() => setPlan(plan)}

              className={`relative p-5 rounded-2xl border cursor-pointer transition
                ${isSelected ? `${theme.border} shadow-lg bg-white` : "border-gray-200"}
              `}
            >

              {/*  Badge recommandé */}
              {plan.recommended && (
                <div className="absolute top-0 right-0 bg-purple-800 text-white text-xs px-3 py-1 rounded-bl-xl rounded-tr-2xl">
                  RECOMMANDÉ
                </div>
              )}
              {/*  Badge freeplan */}
              {plan.freePlan && (
                <div className="absolute top-0 right-0 bg-purple-500 text-white text-xs px-3 py-1 rounded-bl-xl rounded-tr-2xl">
                  FREE
                </div>
              )}


              {/* Header (nom + prix) */}
              <div className="flex justify-between items-center">

                {/*  Infos plan */}
                <div>
                  <h2
                    className={`text-lg font-bold ${
                      plan.freePlan ? "text-purple-600" : plan.recommended ? "text-orange" : plan.perMonths ? "text-vendor-primary" : ""
                    }`}
                  >
                    {plan.icon && <span className="mr-2">{plan.icon}</span>}
                    {plan.name}
                  </h2>

                  <p className="text-gray-500 text-sm ">
                    {plan.description}
                  </p>
                </div>

                {/*  Prix */}
                <div className={`text-right ${
                      plan.freePlan ? "text-purple-600" : plan.recommended ? "text-orange" : plan.perMonths ? "text-vendor-primary" : ""
                    }`}>
                  <p className="text-lg font-bold">
                    {plan.basePrice} FCFA
                  </p>

                  {/* Affichage /30 jours */}
                  {plan.perMonths && !plan.freePlan && (
                    <p className="text-sm text-gray-400">/30 jours</p>
                  )}
                  
                </div>
              </div>

              {/* Séparateur */}
              <div className="my-4 border-t text-gray-300"></div>

              {/* Liste des fonctionnalités */}
              <ul className="space-y-2">
                {plan.settings.map((s, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className=""><CheckCircle2 className={`text-lg font-bold stroke-white ${
                      plan.freePlan ? "fill-purple-600" : plan.recommended ? "fill-orange" : plan.perMonths ? "fill-vendor-primary" : ""
                    }`}/></span>
                    <span>{s.name}</span>
                  </li>
                ))}
              </ul>

              {/* Badge sélection */}
              {isSelected && (
                <div className={`mt-4 inline-block  px-4 py-2 rounded-xl text-sm ${
                  plan.freePlan ? "text-purple-600 bg-purple-200" : plan.recommended ? "text-orange bg-orange-200" : plan.perMonths ? "text-vendor-primary bg-vendor-primary/10" : ""
                }`}>
                  <Check className="inline mr-2" />
                  Sélectionné
                </div>
              )}
            </div>
          );
        })}

        {/* Bouton fixe en bas */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">

          <button
            disabled={!selectedPlan} // bloque si aucun plan

            // Navigation vers étape suivante
            onClick={() => {
              if (selectedPlan) {
                // On enregistre l'ID de souscription dans le formulaire global
                setForm({ souscriptionTypeId: selectedPlan.souscriptionTypeId });
                
                //  On change de page
                router.push("/vendor/createShop/CreateShopPage");
              }
            }}


            className={`w-full py-4 rounded-xl font-bold transition-all ${!selectedPlan ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
              : selectedPlan.freePlan
              ? "bg-purple-600 text-white shadow-lg"        
              : selectedPlan.recommended
              ? "bg-orange-500 text-white shadow-lg"      
              : "bg-vendor-primary text-white shadow-lg"        
            }`}
          >
            Continuer
            {selectedPlan?.freePlan &&  <span> Gratuitement </span>}
            <ArrowRight className="inline ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}
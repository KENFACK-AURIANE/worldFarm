/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { z } from "zod";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateShopStore } from "@/lib/stores/useCreateShopStore";
import { step1Schema, step2Schema } from "@/lib/validation/createShopSchema";
import { Stepper } from "@/components/ui/Tabs/Stepper";
import { Step1BasicInfo } from "../Step1BasicInfo/page";
import { Step2Location } from "../Step2Location/page";
import { Step3Confirm } from "../Step3Confirm/page";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { usePlanStore } from "@/lib/stores/UsePlanStore";

// Définir le mapping des couleurs (identique à la page précédente)
  const getPlanTheme = (planName: string) => {
    switch (planName) {
      case "GRATUIT": return { border: "border-2 border-purple-500", bg: "bg-purple-500", text: "text-gray-600" };
      case "STANDARD": return { border: "border-2 border-vendor-primary", bg: "bg-vendor-primary", text: "text-blue-600" };
      case "PREMIUM": return { border: "border-2 border-orange", bg: "bg-orange", text: "text-orange-600" };
      default: return { border: "border-2 border-purple-500", bg: "bg-purple-600", text: "text-purple-600" };
    }
  };

export default function CreateShopPage() {
  const router = useRouter();
  const { form } = useCreateShopStore() as { form: any };
  const { selectedPlan } = usePlanStore();
  const theme = getPlanTheme(selectedPlan?.name || "PREMIUM");

  // Step actuel
  const [step, setStep] = useState(0);

  // Données API (types de shop)
  const [shopTypes, setShopTypes] = useState([]);

  // Erreurs de validation
  const [errors, setErrors] = useState({});


const validate = () => {
  try {
    if (step === 0) step1Schema.parse(form);
    if (step === 1) step2Schema.parse(form);

    setErrors({});
    return true;
  } catch (err) {
    if (err instanceof z.ZodError) {
      const e: Record<string, string> = {};
      
      
      err.issues.forEach((x) => {
        // x.path est un tableau, on prend le premier élément pour la clé
        const fieldName = x.path.join("."); // pour gérer les champs imbriqués comme address.country
        e[fieldName] = x.message;
      });

      setErrors(e);
    } else {
      console.error("Erreur inattendue:", err);
    }
    return false;
  }
};




  
  //  STEP SUIVANT
  
  const next = () => {
    if (!validate()) return;
    setStep(step + 1);
  };



  
  return (
    <div className="space-y-6">
        {/* header */}
      <div className={`sticky top-0 z-50 text-white p-4 flex flex-col items-center justify-center md:flex-row md:items-center gap-10   ${theme.bg} bg-opacity-10`}>
            <div className="flex flex-row items-center gap-18 w-full">
                <div className="rounded-lg flex flex-row items-center   ">
                    <button onClick={() => router.back()} className="pl-2">
                    <ArrowLeft size={30} className="text-white"/>
                    </button>
                </div>
                <h1 className="text-2xl font-semibold ">Créer votre boutique</h1>
            
            </div>
            <div className="flex flex-row text-lg">
                Plan {selectedPlan?.name}   {selectedPlan?.basePrice} FCFA {selectedPlan?.perMonths && !selectedPlan?.freePlan && (
                    <p >/30 jours</p>
                  )}
            </div>
            {/* Stepper */}
            <Stepper step={step} />
      </div>

      

        <div className="p-4 space-y-6">
            {/* Steps */}
            {step === 0 && (
                <Step1BasicInfo shopTypes={shopTypes} errors={errors} />
            )}

            {step === 1 && (
                <Step2Location errors={errors} />
            )}

            
            {step === 2 && <Step3Confirm />}

            {/* Boutons */}
            <div className="flex gap-2">

                {/* Retour */}
                {step > 0 && (
                  <button onClick={() => setStep(step - 1)}  className={`w-full py-4 rounded-xl font-bold transition-all ${theme.bg} text-white px-4 pb-3 rounded-lg hover:opacity-90 mb-30`}>
                    <ArrowLeft className="inline mr-2" />
                    Retour
                  </button>
                )}

                {/* Continuer */}
            
                {step < 2 && (
                    <div  className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
                      <button onClick={next} className={`w-full py-4 rounded-xl font-bold transition-all ${theme.bg} text-white px-4 py-2 rounded-lg hover:opacity-90`}>
                        Continuer
                        <ArrowRight className="inline ml-2" />
                    </button>
                    </div> 
                  
                )}
               
            </div>
        </div>
    </div>
  );
}
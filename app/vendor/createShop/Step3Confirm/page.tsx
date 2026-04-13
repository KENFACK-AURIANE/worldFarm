/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { createShop } from "@/lib/services/shopService";
import { useCreateShopStore } from "@/lib/stores/useCreateShopStore";
import { usePlanStore } from "@/lib/stores/UsePlanStore";
import { Gem, Gift, MapPin, Store, Shapes, Check,AlertTriangle,Clock,  Info } from "lucide-react";
import { useShopTypes } from "@/lib/hooks/UseShopTypes";
import { useRouter } from "next/navigation";

  const getPlanTheme = (planName: string) => {
    switch (planName) {
      case "GRATUIT": return { border: "border-2 border-purple-500", bg: "bg-purple-500", text: "text-gray-600" };
      case "STANDARD": return { border: "border-2 border-vendor-primary", bg: "bg-vendor-primary", text: "text-blue-600" };
      case "PREMIUM": return { border: "border-2 border-orange", bg: "bg-orange", text: "text-orange-600" };
      default: return { border: "border-2 border-purple-500", bg: "bg-purple-600", text: "text-purple-600" };
    }
  };

export function Step3Confirm() {
  const { form } = useCreateShopStore() as {
    form: { name: string; description: string;  shopTypeId: string, city: string; country: string; address: { countryIso: string;country: string; city: string ; region: string }, promoCode: string ;souscriptionTypeId: string };
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const { selectedPlan } = usePlanStore();
  const { types } = useShopTypes();
  const selectedType = types?.find((t: any) => t.shopTypeId === form.shopTypeId);



  
  const theme = getPlanTheme(selectedPlan?.name || "PREMIUM");

  const handleCreateShop = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await createShop(form); // on envoie le formulaire directement
      setSuccess(`Boutique créée avec l'ID ${result.shopId}`);
    } catch (err: any) {
      setError(err.message || "Erreur lors de la création du shop");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 flex flex-col gap-10">
      <div className="pb-5">
        <h1 className="text-2xl font-bold text-black">Confirmation</h1>
        <h2 className="text-lg font-semibold text-gray-400">Vérifiez vos informations avant de finaliser</h2>
      
      </div>

      {/* resumé des informations */}
      <div className="border border-gray-400 shadow-md p-4 rounded-xl space-y-2">
        {/* nom boutique */}
        <div className="flex flex-row items-center gap-2 border-b py-3">
          <div>
            <Store size={30} className={`inline mr-2 ${theme.text}`}  />
          </div>
          <div className="flex flex-col gap-2">
            <p>Boutique</p>
            <p className="font-bold">{form.name}</p>
          </div>
        </div>

        <span className="bg-gray-600"></span>

        {/* Type de boutique */}
        <div className="flex flex-row items-center  border-b py-3 gap-2">
          <div>
            <Shapes size={30} className={`inline mr-2 ${theme.text}`} />
          </div>
          <div className="flex flex-col gap-2">
            <p>Type</p>
            <p className="font-bold">{selectedType?.name}</p>
          </div>
        </div>

        <span className="bg-gray-600"></span>

        {/* localisation */}
        <div className="flex flex-row items-center border-b py-3 gap-2">
          <div>
            <MapPin size={30} className={`inline mr-2 ${theme.text}`} />
          </div>
          <div className="flex flex-col gap-2">
            <p>Localisation</p>
            <p className="font-bold">{form.address.city}, {form.address.region},{form.address.country}</p>
          </div>
        </div>

       

        {/* plan*/}
        <div className="flex flex-row items-center border-b py-3 gap-2">
          <div>
            <Gem size={30} className={`inline mr-2 ${theme.text}`} />
          </div>
          <div className="flex flex-col gap-2">
            <p>plan</p>
            <p className="font-bold">{selectedPlan?.name }-{selectedPlan?.basePrice}FCFA {selectedPlan?.perMonths && !selectedPlan?.freePlan && (
              <span >/30 jours</span>
            )}</p>
          </div>
        </div>

        {/* Code promo*/}
        <div className="flex flex-row items-center gap-2">
          <div>
            <Gift size={30} className={`inline mr-2 ${theme.text}`} />
          </div>
          <div className="flex flex-col gap-2">
            <p>Code promo</p>
            <p className="font-bold">{form.promoCode || "Non renseigné"}</p>
          </div>
        </div>
       
      </div>

      {/* instructions */}
      <div className="flex gap-4 rounded-lg bg-[#FFF1E7] p-8 max-w-lg font-sans md:min-w-full">
        <Info className="w-8 h-8 text-[#E67E22] shrink-0" />
        
        <div className="flex flex-col gap-4">
          <h3 className="text-[#E67E22] text-xl font-bold">
            Après la création
          </h3>
          
          <div className="text-[#5A5A5A] text-lg leading-snug space-y-4">
            <p>
              Vous avez 24h pour compléter vos informations d&apos;identification 
              (carte d&apos;identité, documents légaux). Passé ce délai, votre 
              compte sera temporairement bloqué jusqu&apos;à validation.
            </p>
            <p>
              Pensez également à compléter vos paramètres (zones de livraison, 
              horaires, photos) pour une meilleure visibilité.
            </p>
          </div>
        </div>
      </div>
      
      {/* Bouton de confirmation */}
      <div  className="fixed bottom-0 left-0 right-0 p-4 pb-5 bg-white border-t">
        <button
        onClick={() => setIsModalOpen(true)}
        disabled={loading}
        className={`w-full py-4 rounded-xl font-bold transition-all ${theme.bg} text-white px-4 py-2 rounded-lg hover:opacity-90`}
        >
          
          {loading ? "Création en cours..." : "Créer la boutique"}
          <Check className="inline mr-2" />
        </button>
      </div>

      <div>
        {/* --- L'ALERTE BOX (MODALE) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px] animate-in fade-in duration-300 ">
          
          {/* Conteneur principal de la boîte */}
          <div className="bg-white rounded-[2.5rem] w-full max-w-95 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            
            <div className="p-7 flex flex-col items-center text-center">
              
              {/* Icône Alerte Triangle */}
              <div className="w-16 h-16 bg-[#fff8ed] rounded-full flex items-center justify-center mb-5">
                <AlertTriangle size={36} className="text-[#d97706]" strokeWidth={1.5} />
              </div>

              {/* Titre */}
              <h2 className="text-xl font-bold text-gray-900 mb-5">
                Paiement requis
              </h2>

              {/* Bloc d'information Jaune/Beige */}
              <div className="bg-[#fffbeb] rounded-lg p-5 text-left border border-[#fef3c7] mb-5 text-xl">
                <div className="flex items-start gap-3">
                  <Info size={27} className="text-orange shrink-0 mt-0.5" />
                  <div className="text-xl text-gray-800 leading-snug">
                    <p className="font-bold mb-3">
                      Vous avez sélectionné le plan {selectedPlan?.name }-{selectedPlan?.basePrice}FCFA {selectedPlan?.perMonths && !selectedPlan?.freePlan && (
                        <span >/30 jours</span>
                      )}.
                    </p>
                    <p className="text-gray-600 font-medium">
                      Après la création de votre boutique, vous devez vous rendre dans l&apos;onglet 
                      &quot;Abonnement&quot; des paramètres boutique pour finaliser le paiement de votre plan.
                    </p>
                  </div>
                </div>

                {/* Bloc d'urgence Rouge Imbriqué */}
                <div className="mt-4 bg-[#fef2f2] rounded-xl p-3 border border-red-50 flex items-start gap-2.5">
                  <Clock size={25} className="text-red-500 shrink-0 mt-0.5" />
                  <p className="text-xl text-red-600 font-bold leading-tight">
                    Sans paiement sous 48h, votre boutique sera suspendue ou passée en plan gratuit.
                  </p>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="w-full flex flex-col gap-2">
                <button 
                  onClick={async () => {
                    setError(null); // 1. Efface l'ancienne erreur
                    try {
                      await handleCreateShop();
                      router.push("/account/profile");
                    } catch (err: any) {
                      setError(err.message); // 2. Affiche la nouvelle
                    }
                  }}
                  className={`w-full py-4 rounded-xl font-bold transition-all ${theme.bg} text-white px-4 py-2 rounded-lg hover:opacity-90 text-lg`}

                >

                  {loading ? "Création en cours..." : " J'ai compris, créer ma boutique"}
                  
                </button>
                  
                
                
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="w-full text-gray-500 font-bold py-2 text-[15px] hover:text-gray-800 transition-colors text-xl"
                >
                  Annuler
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      </div>
      

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}
    </div>
  );
}
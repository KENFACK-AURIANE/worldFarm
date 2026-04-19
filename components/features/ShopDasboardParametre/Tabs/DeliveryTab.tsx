/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { 
  Truck, 
  MapPin, 
  Plus, 
  Lightbulb, 
  Globe, 
  Building2,
  Clock,
  X,
  CheckCircle2,
  Trash2,
  Pencil,
  MapPinPlus,
  Banknote,
  XCircle,
  PauseCircle,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Shop } from "@/lib/types/shop.types";
import { getCities, getRegions } from "@/lib/services/locationService";
import { apiClient } from "@/lib/api/client";
import { showToastSuccess } from "@/components/Toast/ToastSuccess";
import { showToastFailed } from "@/components/Toast/ToastFailed";
import { useRouter } from "next/navigation";


interface DeliveryZone {
  city: string;
  region: string;
  estimatedCost: string;
  estimatedDays: string;
  isAvailable: boolean;
}



export const DeliveryTab = (({ shop}: { shop: Shop }) => {
  const [isLocalOnly, setIsLocalOnly] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showRegionList, setShowRegionList] = useState(false);
  const [cities, setCities] = useState<any[]>([]);
  const [showCityList, setShowCityList] = useState(false);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [showCity, setShowCity] = useState(true);
  const [regions, setRegions] = useState<any[]>([]);
  const [zoneType, setZoneType] = useState<"region" | "city">("city");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);


  const handleEditClick = (zone: DeliveryZone, index: number) => {
    setEditingIndex(index); // On mémorise quelle ligne on modifie
    setForm({ ...zone });   // On remplit le formulaire avec les infos actuelles
    setZoneType(zone.city ? "city" : "region"); // On ajuste le type (Ville ou Région)
    setIsActive(zone.isAvailable);
    setIsDrawerOpen(true); // On ouvre le même Drawer que pour l'ajout
  };


  // ajouter et modifier une zone de livraison
  const handleSaveZone = async () => {
    const zoneData: DeliveryZone = {
      region: form.region,
      city: zoneType === "region" ? "" : form.city,
      estimatedCost: form.estimatedCost,
      estimatedDays: form.estimatedDays,
      isAvailable: isActive 
    };

    let updatedZones: DeliveryZone[];

    if (editingIndex !== null) {
      // MODE ÉDITION : On remplace la zone à l'index précis
      updatedZones = [...(shop?.deliveryZones || [])];
      updatedZones[editingIndex] = zoneData;
    } else {
      // MODE AJOUT : On ajoute à la suite
      updatedZones = [...(shop?.deliveryZones || []), zoneData];
    }

    try {
      // On envoie le tableau complet [{}, {}]
      const response = await apiClient.patch(`/delivery-zones/${shop.shopId}`, updatedZones);

      if (response.status === 200 || response.status === 204) {
        setIsDrawerOpen(false);
        setEditingIndex(null); // Reset de l'index
        showToastSuccess("Zones de livraison à jour");
        router.refresh();
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde :", error);
      showToastFailed("Erreur lors de la mise à jour des zones de livraison: " + error);
    }
  };

  

  // État pour ouvrir/fermer la modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  // État pour mémoriser quelle zone on veut supprimer
  const [zoneToDelete, setZoneToDelete] = useState<DeliveryZone | null>(null);

  // Étape 1 : On ouvre la modal et on mémorise la zone
  const openDeleteConfirm = (zone: DeliveryZone) => {
    setZoneToDelete(zone);
    setIsDeleteModalOpen(true);
  };

  // Étape 2 : L'appel API réel au clic sur "Supprimer" dans la modal
  const handleConfirmDelete = async () => {
    if (!zoneToDelete) return;
    // On crée le nouveau tableau en enlevant la zone sélectionnée
    const updatedZones = shop.deliveryZones.filter(z => 
      z.city !== zoneToDelete.city || z.region !== zoneToDelete.region
    );

    try {
      // ON UTILISE PATCH (comme pour l'ajout)
      const response = await apiClient.patch(`/delivery-zones/${shop.shopId}`, updatedZones);

      if (response.status === 200 || response.status === 204) {
        setIsDeleteModalOpen(false);
        setZoneToDelete(null);
        showToastSuccess("Zone de livraison supprimée");
        router.refresh();
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      showToastFailed("Impossible de supprimer la zone."+ error);
    }

    
  };


  // les zones à afficher en fonction du filtre
  const [form, setForm] = useState<DeliveryZone>({
    region: "",
    city: "",
    estimatedCost: "1000",
    estimatedDays: "2-3 jours",
    isAvailable: isActive
  });

  // afficher les livraisons locales
  const zonesToDisplay = isLocalOnly 
  ? shop?.deliveryZones?.filter((zone: DeliveryZone) => 
      // On compare la ville de la zone avec la ville de la boutique
      zone.city.toLowerCase() === shop?.address?.city?.toLowerCase()
    )
  : shop?.deliveryZones;

  // recuperer les regions au chargement 
  useEffect(() => {
    if (shop?.address?.countryIso) {
      getRegions(shop.address.countryIso).then(setRegions);
    }
  }, [shop?.address?.countryIso]);

  //  charger villes quand région change
  useEffect(() => {
    if (form.region) {
      getCities(form.region).then(setCities);
    }
  }, [form.region]);



  // Ajouter une zone
  // const handleAddZone = async () => {
  //   const newZone: DeliveryZone = {
  //     region: form.region,
  //     city: zoneType === "region" ? "" : form.city,
  //     estimatedCost: form.estimatedCost,
  //     estimatedDays: form.estimatedDays,
  //     // On utilise l'état isActive du composant au lieu de 'true' par défaut
  //     isAvailable: isActive 
  //   };

  //   const updatedZones = [...(shop?.deliveryZones || []), newZone];

  //   try {
  //     const response = await apiClient.patch(`/delivery-zones/${shop.shopId}`, updatedZones);

  //     if (response.status === 200 || response.status === 204) {
  //       setIsDrawerOpen(false);
  //       // On réinitialise aussi isActive pour la prochaine zone
  //       setIsActive(true); 
  //       setForm({
  //         region: "",
  //         city: "",
  //         estimatedCost: "1000",
  //         estimatedDays: "2-3 jours",
  //         isAvailable: true // Aligné avec le reset de isActive
  //       });
  //       showToastSuccess("Zones de livraison à jour");
  //     }
  //   } catch (error) {
  //     showToastFailed("Erreur lors de la mise à jour des zones de livraison: " + error);
  //     console.error("Erreur API:", error);
  //   }
  // };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      <div className="p-4 space-y-4">
        {/* Zones de livraison Card */}
        <section className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4">
          <div className="bg-[#E0E7FF] p-3 rounded-xl text-[#2D336B]">
            <Truck size={24} />
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-[#1E293B] text-lg">Zones de livraison</h2>
            <p className="text-gray-500 text-sm leading-tight">
              Configurez les régions et villes que vous desservez
            </p>
          </div>
        </section>

        {/* Local Delivery Toggle */}
        <section className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div className="flex items-start gap-4">
            <div className="text-[#2D336B] mt-1">
              <Building2 size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-[#1E293B]">Livraison locale uniquement</h3>
              <p className="text-gray-400 text-xs max-w-50">
                Restreindre les livraisons à votre ville uniquement
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsLocalOnly(!isLocalOnly)}
            className={`w-12 h-6 rounded-full transition-colors duration-200 relative ${isLocalOnly ? 'bg-[#5BBF7A]' : 'bg-gray-300'}`}
          >
            <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ${isLocalOnly ? 'translate-x-6' : ''}`} />
          </button>
        </section>

        {/* Empty State / Zones List */}
        <section className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-[#E0E7FF] p-1.5 rounded-md text-[#2D336B]">
              <MapPin size={16} />
            </div>
            <h3 className="font-semibold text-[#1E293B]">Mes zones ({shop?.deliveryZones?.length || 0})</h3>
          </div>
          {(shop?.deliveryZones.length === 0) ? (
            <div className="bg-[#FFFBF2] border border-[#FDE68A]/30 rounded-3xl p-8 flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="bg-[#FDE68A] p-4 rounded-full opacity-30 absolute inset-0 blur-xl"></div>
                <div className="relative bg-[#FEF3C7] p-4 rounded-full text-[#D97706]">
                  <MapPin size={40} fill="currentColor" fillOpacity={0.2} />
                </div>
              </div>
              <h4 className="font-bold text-[#1E293B] mb-2">Aucune zone configurée</h4>
              <p className="text-gray-400 text-sm mb-6 max-w-55">
                Ajoutez les régions ou villes que vous livrez pour permettre aux clients de commander
              </p>
              
              <button 
                onClick={() => setIsDrawerOpen(true)}
                className="w-full flex items-center justify-center gap-2 border-2 border-[#2D336B] text-[#2D336B] py-3 rounded-2xl font-bold"
              >
                <Plus size={20} />
                Ajouter une zone
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
            {zonesToDisplay.map((zone: DeliveryZone, index: number) => (
              <div key={index} className="border border-blue-200 rounded-2xl overflow-hidden">
                <div className="p-4 flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="relative">
                      <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center">
                        {zone.city !== "" ? (
                          <div className="relative">
                            <MapPin className="text-[#1e2b8f]" size={28} />
                            <span className="absolute -top-2 -left-1 bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-md font-bold">
                              Ville
                            </span>
                          </div>
                        ) : (
                          <div className="relative">
                            <Globe className="text-blue-400" size={28} />
                            <span className="absolute -top-2 -left-1 bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-md font-bold">
                              Région
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-800 text-lg">
                        {zone.city !== "" ? zone.city : <span className="text-slate-500">{zone.region} (Région)</span>}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="bg-blue-50 text-[#1e2b8f] font-bold px-3 py-1 rounded-full text-sm flex items-center gap-1">
                          <Banknote size={14} /> {zone.estimatedCost} FCFA
                        </span>
                        <span className="text-slate-400 text-sm flex items-center gap-1">
                          <Clock size={14} /> {zone.estimatedDays} jours
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <button onClick={() => handleEditClick(zone, index)} className="text-slate-400"><Pencil size={20} /></button>
                    <button onClick={() => openDeleteConfirm(zone)} className="text-red-400"><Trash2 size={20} /></button>
                  </div>
                </div>

                <div className="bg-emerald-50 py-2 flex items-center justify-center gap-2 border-t border-emerald-100">
                  
                  {zone.isAvailable ? (
                    <span className="text-emerald-600 text-sm font-medium flex flex-row justify-center items-center gap-4"><CheckCircle2 size={16} className="text-emerald-500" />Livraison Active</span>
                  ) : (
                    <span className="text-gray-600 text-sm font-medium flex flex-row justify-center items-center gap-4"><XCircle size={16} className="text-gray-500" />Livraison en pause</span>
                  )}
                </div>
              </div>
            ))}

          <button onClick={() => setIsDrawerOpen(true)} className="bg-white text-vendor-primary flex flex-row justify-center items-center gap-4 py-4 px-4 rounded-lg hover:bg-blue-600 transition-colors border border-vendor-primary"> 
           <MapPinPlus size={16} />
            Ajouter une zone
          </button>
        </div>
        )}

          
        </section>

        {/* Tip section */}
        <div className="flex items-start gap-3 p-4">
          <div className="bg-blue-100 p-2 rounded-full text-blue-500 mt-1">
            <Lightbulb size={18} />
          </div>
          <div className="space-y-1">
            <span className="font-bold text-[#1E293B]">Astuce</span>
            <ul className="text-gray-500 text-sm space-y-1">
              <li>• Vous pouvez ajouter une région entière ou des villes spécifiques</li>
              <li>• Définissez des tarifs différents par zone</li>
              <li>• Mettez 0 FCFA pour offrir la livraison gratuite</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Sheet Overlay */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-black/40 z-40"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-white z-50 rounded-t-4xl p-6 pb-10 shadow-2xl"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-[#E0E7FF] p-2 rounded-xl text-[#2D336B]">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#1E293B]">{editingIndex !== null ? "Modifier la zone" : "Nouvelle zone"}</h2>
                    <p className="text-gray-400 text-sm">Définissez votre zone de livraison</p>
                  </div>
                </div>
                <button onClick={() => setIsDrawerOpen(false)} className="bg-gray-100 p-2 rounded-full">
                  <X size={20} />
                </button>
              </div>

             
              <div className="space-y-6">
                {/* zone type */}
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-3">Type de zone</p>
                  <div className="grid grid-cols-2 gap-4">
                    <ZoneTypeCard 
                      icon={<Globe size={24} />}
                      label="Région entière"
                      sub="Toutes les villes"
                      selected={zoneType === "region"}
                      onClick={() =>{
                        setZoneType("region")
                        setShowCity(false)
                      }}
                    />
                    <ZoneTypeCard 
                      icon={<Building2 size={24} />}
                      label="Ville spécifique"
                      sub="Une seule ville"
                      selected={zoneType === "city"}
                      onClick={() => { 
                        setZoneType("city")
                        setShowCity(true)
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Région */}
                  <div className="mt-4">
                    <div className="space-y-2">
                      <label className="text-gray-700 font-medium text-sm">Région </label>
                      
                      <button
                        type="button"
                        // Désactivé si aucun pays n'est choisi
                        onClick={() => setShowRegionList(true)}
                        className={`w-full flex items-center justify-between p-4 bg-white border  border-black rounded-xl shadow-sm transition-all 
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {form.region ? (
                            <span className="text-gray-900 font-medium">
                              {/* On cherche le nom de la région correspondante à l'ID stocké */}
                              {regions.find(r => r.id === form.region)?.name || form.region}
                            </span>
                          ) : (
                            <span className="text-gray-400 flex items-center"><Globe size={18} />Sélectionner une région</span>
                          )}
                        </div>
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  

                    {showRegionList && (
                      <div className="fixed inset-0 top-52 bg-white border border-t-vendor-accent z-50 p-6 overflow-y-auto rounded-t-3xl shadow-lg">
                      

                        <div className="space-y-4">
                          

                          {/* Liste des régions */}
                          <div className="mt-4 divide-y divide-gray-100 border-t border-gray-100">
                            {regions.map((r) => {
                              const isSelected = form.region === r.id;
                              
                              return (
                                <div
                                  key={r.id}
                                  onClick={() => {
                                    setForm({ 
                                      ...form,
                                      region: r.id, // On stocke l'ID
                                      city: "", 
                                      
                                    });
                                    setCities([]);           // Vide la liste des villes précédente
                                    setShowRegionList(false); // Ferme la modale
                                  
                                  }}
                                  className="flex items-center justify-between py-5 px-2 cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors"
                                >
                                  <span className={`text-base font-semibold ${isSelected ? "text-gray-900" : "text-gray-600"}`}>
                                    {r.name}
                                  </span>

                                  {isSelected && (
                                    <div className="w-7 h-7 bg-teal-600 rounded-full flex items-center justify-center shadow-sm">
                                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                      </svg>
                                    </div>
                                  )}
                                </div>
                              );
                            })}

                            
                          </div>
                        </div>
                      </div>
                    )}
                  </div>


                  {/* Ville */}

                  {showCity && (
                     <div className="mt-4">
                    <div className="space-y-2">
                      <label className="text-gray-700 font-medium text-sm">Ville à desservir</label>
                      
                      <button
                        type="button"
                        disabled={!form.region} // Désactivé si aucune région n'est choisie
                        onClick={() => setShowCityList(true)}
                        className={`w-full flex items-center justify-between p-4 bg-white border  rounded-xl border-black shadow-sm transition-all ${
                          !form.region ? "opacity-50 cursor-not-allowed" : "hover:border-orange-500"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {form.city ? (
                            <span className="text-gray-900 font-medium">{form.city}</span>
                          ) : (
                            <span className="text-gray-400 flex items-center"><MapPin size={18} />Sélectionnez d&apos;abord une région</span>
                          )}
                        </div>
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>

                    {showCityList && (
                      <div className="fixed inset-0 top-52 bg-white border border-t-vendor-accent z-50 p-6 overflow-y-auto rounded-t-3xl shadow-lg">
                      

                        <div className="space-y-4">
                          

                          {/* Liste des villes filtrées */}
                          <div className="mt-4 divide-y divide-gray-100 border-t border-gray-100">
                            {cities.map((c) => {
                              const isSelected = form.city === c.name;
                              
                              return (
                                <div
                                  key={c.id}
                                  onClick={() => {
                                    setForm({ 
                                      ...form, 
                                        city: c.name 
                                    
                                    });
                                    setShowCityList(false);
                                  }}
                                  className="flex items-center justify-between py-5 px-2 cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors"
                                >
                                  <span className={`text-base font-semibold ${isSelected ? "text-gray-900" : "text-gray-600"}`}>
                                    {c.name}
                                  </span>

                                  {isSelected && (
                                    <div className="w-7 h-7 bg-teal-600 rounded-full flex items-center justify-center shadow-sm">
                                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                      </svg>
                                    </div>
                                  )}
                                </div>
                              );
                            })}

                            
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  )}

                </div>



                <div className="grid grid-cols-2 gap-4">

                  {/* frais livraison  */}
                  <div className="flex flex-col justify-center items-center">
                    <label className="text-gray-700 font-medium text-sm">Frais de livraison </label>
                    <div className="w-full h-15 border px-3 rounded-xl flex flex-row items-center">
                      <Banknote size={50} className="inline mr-2 fill-vendor-primary stroke-white" />
                      <input
                      value={form.estimatedCost}
                      onChange={(e) => setForm({ ...form, estimatedCost: e.target.value })}
                      placeholder="Frais de livraison estimés*"
                      className="w-full h-full border border-none outline-none p-3 rounded-xl"
                      />
                      <span className="text-gray-400">FCFA</span>
                    </div>
                  </div>

                  {/* delais de livraison  */}
                  <div className="flex flex-col justify-center items-center">
                    <label className="text-gray-700 font-medium text-sm">Délai de livraison </label>
                    <div className="w-full h-15 border px-3 rounded-xl flex flex-row items-center">
                      <Clock size={30} className="inline mr-2 fill-vendor-primary stroke-white" />
                      <input
                      value={form.estimatedDays}
                      onChange={(e) => setForm({ ...form, estimatedDays: e.target.value })}
                      placeholder="2-3jours"
                      className="w-full h-full border border-none outline-none p-3 rounded-xl"
                      />
                    </div>
                  </div>
                  
                </div>

                {/* Section Switch Dynamique */}
                <div className={`p-4 rounded-2xl border transition-all ${isActive ? 'bg-green-50 border-green-200' : 'bg-gray-100 border-gray-200'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {isActive ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <PauseCircle className="w-5 h-5 text-gray-400" />
                      )}
                      <div>
                        <p className={`text-sm font-bold ${isActive ? 'text-green-700' : 'text-gray-700'}`}>
                          {isActive ? "Zone active" : "Zone en pause"}
                        </p>
                        <p className="text-[10px] text-gray-500">
                          {isActive ? "Les clients peuvent commander" : "Livraisons temporairement suspendues"}
                        </p>
                      </div>
                    </div>

                    {/* Le Switch */}
                    <button
                      type="button"
                      onClick={() => setIsActive(!isActive)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isActive ? 'bg-indigo-600' : 'bg-gray-300'}`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isActive ? 'translate-x-6' : 'translate-x-1'}`}
                      />
                    </button>
                  </div>
                </div>

                {/* bouton annuler et supprimer */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <button onClick={() => setIsDrawerOpen(false)} className="py-4 text-gray-500 font-bold bg-gray-50 rounded-xl border border-gray-100">
                    Annuler
                  </button>
                  <button onClick={() => handleSaveZone()} className="py-4 bg-[#2D336B] text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-100">
                    <span><Check /></span> {isLoading ? 'Enregistrement...'  : (editingIndex !== null ? "Modifier" : "Ajouter ")}
                  </button>
                  
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>



      {/* modal de suppression */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            {/* Overlay sombre */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            
            {/* Boîte de dialogue */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white w-full max-w-sm rounded-4xl p-8 shadow-xl"
            >
              <div className="flex justify-center mb-6">
                <div className="bg-red-50 p-4 rounded-2xl">
                  <Trash2 className="text-red-500" size={30} />
                </div>
              </div>

              <h3 className="text-xl font-bold text-center text-slate-800 mb-2">Supprimer la zone</h3>
              <p className="text-gray-500 text-center text-sm mb-8">
                Voulez-vous vraiment supprimer la zone de livraison <span className="font-bold text-slate-700">{zoneToDelete?.city || zoneToDelete?.region}</span> ?
                <br /><br />
                Cette action est irréversible.
              </p>

              <div className="flex gap-4">
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 py-3 text-emerald-600 font-bold text-lg"
                >
                  Annuler
                </button>
                <button 
                  onClick={handleConfirmDelete}
                  className="flex-1 bg-[#E15241] text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2"
                >
                  <Trash2 size={18} />
                  Supprimer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
});

// --- Sous-composants utilitaires ---


const ZoneTypeCard = ({ icon, label, sub, selected, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`p-4 rounded-3xl border-2 flex flex-col items-center text-center gap-2 transition-all ${
      selected ? 'border-[#2D336B] bg-[#F1F3FF]' : 'border-gray-100 bg-white opacity-60'
    }`}
  >
    <div className={`${selected ? 'text-[#2D336B]' : 'text-gray-400'} bg-gray-100/50 p-3 rounded-full`}>
      {icon}
    </div>
    <div>
      <p className={`font-bold text-sm ${selected ? 'text-[#2D336B]' : 'text-gray-500'}`}>{label}</p>
      <p className="text-[10px] text-gray-400">{sub}</p>
    </div>
  </button>
);

export default DeliveryTab;
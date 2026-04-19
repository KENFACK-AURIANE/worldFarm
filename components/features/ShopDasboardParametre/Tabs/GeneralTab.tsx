/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from 'react';
import BottomNav from "@/components/features/ShopDashboardComponent/BottomNav"; 
import { 
  Store, Truck, ShoppingCart, Palette, 
  Info, FileText, CreditCard, AlertTriangle, Smartphone, 
  ShieldCheck, CheckCircle2, TrendingUp, Shield, 
  Star, MapPin, Clock, Pencil,ArrowUp,Shapes, Lock, Calendar, ArrowLeft, Save,Tag,
  Flag,
  Building2,
  MapIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiClient } from '@/lib/api/client';
import { Shop } from '@/lib/types/shop.types';
import { showToastSuccess } from '@/components/Toast/ToastSuccess';

// --- Composants réutilisables ---

const Card = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white rounded-3xl mb-4 p-5 shadow-sm border border-gray-100 ${className} md:w-full`}>
    {children}
  </div>
);

const SectionHeader = ({ icon: Icon, title }: { icon: any, title: string }) => (
  <div className="flex items-center gap-3 mb-5">
    <div className="p-2 bg-indigo-50 rounded-xl text-indigo-900">
      <Icon size={22} />
    </div>
    <h2 className="text-xl font-bold text-gray-800 flex-1">{title}</h2>
  </div>
);

const InputField = ({ label, value, icon: Icon, locked = false }: any) => (
  <div className="relative mb-4">
    <label className="text-xs text-gray-400 absolute left-14 top-2">{label}</label>
    <div className={`flex items-center gap-3 p-3 pt-6 bg-gray-50 rounded-2xl border border-gray-100 ${locked ? 'opacity-70' : ''}`}>
      <div className="text-gray-400 ml-1">
        <Icon size={20} />
      </div>
      <input 
        disabled={locked}
        className="bg-transparent w-full text-gray-700 font-medium focus:outline-none"
        defaultValue={value}
      />
      {locked && <Lock size={16} className="text-gray-300" />}
    </div>
  </div>
);

type DayKey = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

interface DayConfig {
  key: DayKey;
  label: string;
}

export const GeneralTab = (({ shop}: { shop: Shop }) => {
  const [activeTab, setActiveTab] = useState('general');
  
  
  const [weekHours, setWeekHours] = useState({
    monday: { start: "10:00", end: "22:00", closed: false },
    tuesday: { start: "10:00", end: "22:00", closed: false },
    wednesday: { start: "10:00", end: "22:00", closed: false },
    thursday: { start: "10:00", end: "22:00", closed: false },
    friday: { start: "10:00", end: "22:00", closed: false },
    saturday: { start: "10:00", end: "22:00", closed: false },
    sunday: { start: "10:00", end: "22:00", closed: false },
  });
  const days: DayConfig[] = [
    { key: "monday", label: "Lundi" },
    { key: "tuesday", label: "Mardi" },
    { key: "wednesday", label: "Mercredi" },
    { key: "thursday", label: "Jeudi" },
    { key: "friday", label: "Vendredi" },
    { key: "saturday", label: "Samedi" },
    { key: "sunday", label: "Dimanche" },
  ];
  const parseTimeInput = (input: string) => {
    const value = input.toLowerCase().trim();

    if (value.includes("fermé") || value.includes("off")) {
      return { closed: true, start: "", end: "" };
    }

    const match = value.match(/(\d{1,2})[:h]?(\d{0,2})?\s*[-to]+\s*(\d{1,2})[:h]?(\d{0,2})?/);

    if (!match) return null;

    const format = (h: string, m: string) => {
      const hour = h.padStart(2, "0");
      const min = m ? m.padStart(2, "0") : "00";
      return `${hour}:${min}`;
    };

    return {
      start: format(match[1], match[2] || ""),
      end: format(match[3], match[4] || ""),
      closed: false,
    };
  };

  const [timePicker, setTimePicker] = useState<{
    open: boolean;
    day: DayKey | null;
    type: "start" | "end" | null;
    mode: "clock" | "input";
    tempValue: string;
  }>({
    open: false,
    day: null,
    type: null,
    mode: "clock",
    tempValue: "",
  });

  // ouverture du time picker
  const openTimePicker = (day: string, type: "start" | "end") => {
  const currentValue = weekHours[day as keyof typeof weekHours][type];

  setTimePicker({
      open: true,
      day: day as DayKey,
      type,
      mode: "clock",
      tempValue: currentValue || "10:00",
    });
  };

  const saveHours = async () => {
  try {
   
   

    const response = await apiClient.patch(`/hourlies/${shop.shopId}`, weekHours);
    console.log("Réponse de la mise à jour des horaires :", response.data);

    if (response.status === 204) {
       showToastSuccess("Horaires mis à jour avec succès !");
    }
  } catch (error) {
    console.error("Erreur lors de la sauvegarde :", error);
    alert("Impossible de sauvegarder les horaires.");
  }
};


  return (
    <div className="min-h-screen bg-[#f8f9fe] pb-10 pt-6  ">
      <div className="p-4 max-w-md mx-auto md:w-full">

        <AnimatePresence mode="wait">
          {activeTab === 'general' && (
            <motion.div 
              initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
              className='md:w-full'
              
            >
              {/* Informations de base */}
              <Card>
                <SectionHeader icon={Info} title="Informations de base" />
                <InputField label="Nom de la boutique" value={shop?.name || ""} icon={Store} locked />
                <div className="relative border-2 border-gray-100 rounded-2xl p-4 bg-white mt-4">
                   <label className="text-xs text-gray-400 absolute -top-2 left-4 bg-white px-1">Description</label>
                   <div className="flex gap-3">
                      <FileText size={20} className="text-indigo-900 mt-1" />
                      <textarea className="w-full resize-none focus:outline-none text-gray-700 h-20" defaultValue={shop?.description || ""} />
                   </div>
                </div>
              </Card>

              {/* Numéro Marchand */}
              <Card>
                <SectionHeader icon={CreditCard} title="Numéro Marchand" />
                <div className="bg-amber-50 border border-red-100 rounded-2xl p-4 mb-3 flex  flex-col gap-3">
                  <div className="  p-4 mb-3 flex gap-3">
                    <div className="bg-red-100 p-2 rounded-lg text-red-500 self-start shadow-sm"><AlertTriangle size={18} /></div>
                    <div>
                      <p className="font-bold text-red-500 text-sm">Numéro non configuré</p>
                      <p className="text-xs text-gray-700">Requis pour recevoir vos paiements</p>
                    </div>
                  </div>

                  <div className="bg-rating/20 border border-orange-100 rounded-lg p-4 mb-4 flex gap-3">
                    <AlertTriangle size={18} className="text-orange-500 mt-1 shrink-0" />
                    <div>
                      <p className="font-bold text-orange-900 text-sm">Important</p>
                      <p className="text-xs text-orange-800 leading-relaxed">Le nom enregistré sur votre compte Mobile Money doit correspondre exactement au nom sur votre CNI/Passeport. Dans le cas contraire, votre demande de vérification d&apos;identité sera rejetée.</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 border border-orange-100 rounded-lg p-4 mb-4 flex gap-3">
                    <Info size={18} className="text-gray-500 mt-1 shrink-0" />
                    <div>
                      <p className="text-xs text-black leading-relaxed">Vous devez configurer un numéro mobile Money pour pouvoir recevoir les paiements de vos ventes et gérer vos transactions.</p>
                    </div>
                  </div>

                </div>
                

                

                <button className="w-full bg-vendor-primary text-white py-4 px-2 rounded-lg font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform text-sm">
                  <Smartphone size={20} />
                  Configurer mon numéro marchand
                </button>
              </Card>

              <div className="flex items-center justify-center  bg-gray-50 text-sm mb-4">
                {/* Conteneur Principal avec transition d'entrée */}
                <div className="w-full max-w-lg bg-white rounded-lg border border-gray-200 p-4 shadow-sm transition-all duration-300 hover:shadow-md animate-in fade-in zoom-in-95">
                  
                  {/* Header: Vérification d'identité */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex gap-2 text-sm">
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <ShieldCheck size={20} className=" text-gray-400" />
                      </div>
                      <div>
                        <h2 className=" text-gray-700">Vérification d&apos;identité</h2>
                        <p className="text-gray-400 ">Non disponible</p>
                      </div>
                    </div>
                    
                    {/* Badge Bloqué */}
                    <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl border border-gray-200">
                      <Lock className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600 font-bold">Bloqué</span>
                    </div>
                  </div>

                  {/* Alerte: Numéro marchand requis */}
                  <div className="bg-[#FFF8ED] border border-[#FDE6C1] rounded-3xl p-6 mb-8 transition-transform duration-300 hover:scale-[1.01]">
                    <div className="flex gap-4">
                      <Info className="w-6 h-6 text-[#E69138] shrink-0 mt-1" />
                      <div className="space-y-2">
                        <h3 className="text-sm font-bold text-[#1A1A1A]">Numéro marchand requis</h3>
                        <p className="text-gray-500 leading-relaxed text-sm">
                          Vous devez d&apos;abord définir votre numéro marchand avant de pouvoir effectuer la vérification de votre identité.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bouton/Lien d'action */}
                  <button className="w-full flex items-center justify-center gap-3 bg-[#E9ECEF] py-5 rounded-2xl text-gray-500 font-medium transition-all duration-200 hover:bg-gray-200 active:scale-[0.98] text-sm">
                    <ArrowUp className=""  size={20}/>
                    <span className="text-sm italic">Configurez votre numéro marchand ci-dessus</span>
                  </button>
                </div>
              </div>

              {/* Certification */}
              <Card>
                <SectionHeader icon={ShieldCheck} title="Certification de la Boutique" />
                <div className="bg-rating/20 rounded-2xl p-4 mb-4 border border-orange-100">
                   <div className="flex gap-3 items-center mb-4">
                      <div className="p-2 bg-orange-200 rounded-full text-orange-700"><AlertTriangle size={20} /></div>
                      <div>
                        <p className="font-bold text-orange-700">Boutique Non Certifiée</p>
                        <p className="text-xs text-black font-medium">Obtenez la certification officielle</p>
                      </div>
                   </div>
                   <div className="bg-white rounded-xl p-4 space-y-5">
                        {[
                          { icon: CheckCircle2, text: "Badge de certification visible sur votre boutique", color: "text-green-500", bg: "bg-green-100" },
                          { icon: TrendingUp, text: "Meilleur référencement dans les recherches", color: "text-green-500", bg: "bg-green-100" },
                          { icon: Shield, text: "Confiance accrue des clients", color: "text-orange-400", bg: "bg-orange-100" },
                          { icon: Star, text: "Accès à des fonctionnalités premium", color: "text-green-500", bg: "bg-green-100" },
                        ].map((item, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className={`p-1 rounded-full ${item.bg} ${item.color}`}><item.icon size={12} /></div>
                            <span className="text-xs text-gray-600 font-medium">{item.text}</span>
                          </div>
                        ))}
                   </div>
                </div>
                <button className="w-full bg-[#1a237e] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2">
                  <Save size={18} className="rotate-[-20deg]" />
                  Demander la Certification
                </button>
              </Card>

              {/* SECTION: TYPE DE BOUTIQUE */}
              <section className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 mb-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-900">
                    <Shapes size={22} fill="currentColor" fillOpacity={0.2} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Store /> Type de boutique
                  </h2>
                </div>

                <div className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="text-2xl"><Store /></div>
                    <div>
                      <p className="font-bold text-gray-700">{shop?.shopType?.name || "pas de type défini"}</p>
                      <p className="text-xs text-gray-400">Non modifiable après la création</p>
                    </div>
                  </div>
                  <Lock size={18} className="text-gray-300" />
                </div>
              </section>

              {/* SECTION: CATÉGORIES DE RÉFÉRENCEMENT */}
              <section className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-900">
                    <Tag size={22} className="rotate-90" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    🏷️ Catégories de référencement
                  </h2>
                </div>

                <p className="text-sm text-gray-500 leading-relaxed mb-6">
                  Ces catégories aident les clients à trouver votre boutique dans les recherches par catégorie.
                </p>

                <div className="bg-orange-50/50 border border-orange-100 rounded-2xl p-5 flex gap-4">
                  <div className="mt-1">
                    <div className="w-6 h-6 rounded-full border-2 border-orange-400 flex items-center justify-center">
                      <span className="text-orange-500 font-bold text-xs italic">i</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 leading-snug">
                    Aucune catégorie de référencement définie. Les catégories sont configurées lors de la création de la boutique.
                  </p>
                </div>
              </section>

              {/* SECTION: LOCALISATION */}
              <section className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-4 mt-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-50 rounded-xl text-blue-900">
                    <MapPin size={24} />
                  </div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    Localisation
                  </h2>
                </div>

                {/* Locked Inputs */}
                {[
                  {icon: <Flag className='text-slate-400' size={20} />, label: 'Pays', value: shop?.address?.country },
                  {icon: <MapIcon className='text-slate-400' size={20} />, label: 'Région', value: shop?.address?.region },
                  {icon: <Building2 className='text-slate-400' size={20} />, label: 'Ville', value: shop?.address?.city }
                ].map((field) => (
                  <div key={field.label} className="border border-slate-100 rounded-2xl p-4 flex justify-between items-center bg-slate-50/30">
                    
                    <div className='flex flex-row justify-center items-center gap-2'>
                      <div>
                        {field.icon}
                      </div>
                      
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">{field.label}</p>
                        <p className="font-semibold text-slate-700">{field.value}</p>
                      </div>
                      
                    </div>
                    <Lock size={18} className="text-slate-300" />
                  </div>
                ))}

                <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex items-center gap-3">
                  <Info className="text-blue-500 shrink-0" size={20} />
                  <p className="text-blue-700 italic text-xs">Pour modifier la localisation, contactez le support</p>
                </div>
              </section>


              {/* Horaires d'ouverture */}
              <Card>
                <SectionHeader icon={Clock} title="Horaires d'ouverture" />
                <div className="space-y-4">
                  {days.map((day) => {
                    const data = weekHours[day.key as keyof typeof weekHours];

                    return (
                      <div key={day.key} className="bg-white p-4 rounded-2xl shadow-sm space-y-3">
                        
                        {/* HEADER */}
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">{day.label}</span>

                          <button
                            onClick={() =>
                              setWeekHours((prev) => ({
                                ...prev,
                                [day.key]: {
                                  ...prev[day.key],
                                  closed: !prev[day.key].closed,
                                },
                              }))
                            }
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              data.closed
                                ? "bg-red-100 text-red-600"
                                : "bg-green-100 text-green-600"
                            }`}
                          >
                            {data.closed ? "Fermé" : "Ouvert"}
                          </button>
                        </div>

                        {/* CONTENU */}
                        {!data.closed && (
                          <>
                            {/* INPUT INTELLIGENT */}
                            <input
                              type="text"
                              placeholder="ex: 8h-20h ou fermé"
                              className="w-full border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  const parsed = parseTimeInput(e.currentTarget.value);
                                  if (!parsed) return;

                                  setWeekHours((prev) => ({
                                    ...prev,
                                    [day.key]: {
                                      ...prev[day.key],
                                      ...parsed,
                                    },
                                  }));
                                }
                              }}
                            />

                            {/* HEURES */}
                            <div className="flex items-center gap-2">
                              {/* START */}
                              <button
                                onClick={() => openTimePicker(day.key, "start")}
                                className="flex-1 bg-gray-50 p-2 rounded-xl border hover:border-indigo-300"
                              >
                                {data.start || "--:--"}
                              </button>

                              <span>-</span>

                              {/* END */}
                              <button
                                onClick={() => openTimePicker(day.key, "end")}
                                className="flex-1 bg-gray-50 p-2 rounded-xl border hover:border-indigo-300"
                              >
                                {data.end || "--:--"}
                              </button>
                            </div>
                          </>
                        )}

                      </div>
                    );
                  })}
                </div>
                <div>
                  <button onClick={saveHours} className="w-full bg-[#1a237e] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 mt-4">
                    <Save size={18} />
                    Enregistrer les Horaires
                  </button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>      

      {/* Modal TimePicker */}
      <AnimatePresence>
        {timePicker.open && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-end justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() =>
              setTimePicker((prev) => ({ ...prev, open: false }))
            }
          >
            <motion.div
              className="bg-white w-full max-w-md rounded-t-3xl p-6 space-y-4"
              initial={{ y: 300 }}
              animate={{ y: 0 }}
              exit={{ y: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* HEADER */}
              <div className="flex justify-between items-center">
                <h3 className="font-bold">Choisir l&apos;heure</h3>

                {/* SWITCH MODE */}
                <button
                  onClick={() =>
                    setTimePicker((prev) => ({
                      ...prev,
                      mode: prev.mode === "clock" ? "input" : "clock",
                    }))
                  }
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                >
                  ⌨️
                </button>
              </div>

              {/* CONTENU */}
              {timePicker.mode === "clock" ? (
                <input
                  type="time"
                  value={timePicker.tempValue}
                  onChange={(e) =>
                    setTimePicker((prev) => ({
                      ...prev,
                      tempValue: e.target.value,
                    }))
                  }
                  className="w-full text-center text-3xl font-bold py-4 border rounded-2xl"
                />
              ) : (
                <input
                  type="text"
                  placeholder="ex: 8h-20h ou 09:30"
                  value={timePicker.tempValue}
                  onChange={(e) =>
                    setTimePicker((prev) => ({
                      ...prev,
                      tempValue: e.target.value,
                    }))
                  }
                  className="w-full text-center text-2xl py-4 border rounded-2xl"
                />
              )}

              {/* ACTIONS */}
              <div className="flex justify-between mt-4">
                <button
                  onClick={() =>
                    setTimePicker((prev) => ({ ...prev, open: false }))
                  }
                  className="text-gray-500 font-bold"
                >
                  Annuler
                </button>

                <button
                  onClick={() => {
                    if (!timePicker.day || !timePicker.type) return;

                    let value = timePicker.tempValue;

                    // si mode input → parser
                    if (timePicker.mode === "input") {
                      const parsed = parseTimeInput(value);

                      if (parsed?.start) {
                        value = parsed.start;
                      }
                    }

                    setWeekHours((prev) => ({
                      ...prev,
                      [timePicker.day!]: {
                        ...prev[timePicker.day!],
                        [timePicker.type!]: value,
                      },
                    }));

                    setTimePicker((prev) => ({ ...prev, open: false }));
                  }}
                  className="text-indigo-600 font-bold"
                >
                  OK
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
});
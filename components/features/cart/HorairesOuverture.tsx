/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import {Calendar, Circle, LucideClock, LucideClock1} from "lucide-react";

// 1. DÉFINITION DES TYPES
// On utilise les clés anglaises car c'est ce que renvoie l'API GraphQL (monday, tuesday...)
type DayKey = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

// Structure d'un jour de type Interval
interface DaySchedule {
  closed: boolean; // État de fermeture 
  start: string;  // Heure d'ouverture "HH:mm"
  end: string;    // Heure de fermeture "HH:mm"
}

// Le planning complet est un objet où chaque clé est un jour de la semaine
type Schedule = Record<DayKey, DaySchedule>;

// Liste de correspondance pour l'affichage (Clé API <-> Libellé Interface)
const DAYS: { key: DayKey; label: string }[] = [
  { key: "monday",    label: "Lundi" },
  { key: "tuesday",   label: "Mardi" },
  { key: "wednesday", label: "Mercredi" },
  { key: "thursday",  label: "Jeudi" },
  { key: "friday",    label: "Vendredi" },
  { key: "saturday",  label: "Samedi" },
  { key: "sunday",    label: "Dimanche" },
];

export default function HorairesOuverture({ s }: { s: any }) {
  // État local pour stocker et modifier les horaires
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [showSheet, setShowSheet] = useState(false); //Contrôle l'affichage du tiroir (Bottom Sheet)
  const [editMode, setEditMode] = useState(false);   // Bascule entre affichage et modification
  const [mounted, setMounted] = useState(false);     // Évite les erreurs de rendu côté serveur (SSR)
  const today = new Date().toLocaleString("fr-FR", { weekday: "long" }).toLowerCase(); // Ex: "monday"

  // 2. SYNCHRONISATION API -> COMPOSANT
  useEffect(() => {
    if (s?.hourlies) {
      const apiData: any = {};
      DAYS.forEach(({ key }) => {
        const interval = s.hourlies[key];
        // On transforme les données GraphQL en état local gérable par le formulaire
        apiData[key] = {
          closed: interval?.closed ?? true, // Par défaut fermé si l'intervalle n'existe pas
          start: interval?.start || "08:00",
          end: interval?.end || "18:00",
        };
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSchedule(apiData);
    }
    setMounted(true);
  }, [s]); // Se relance si l'objet boutique 's' change

  if (!mounted || !schedule) return null;

  // 3. LOGIQUE TEMPS RÉEL (Ouvert / Fermé maintenant)
  const getCurrentDayKey = (): DayKey => {
    // getDay() renvoie 0 pour Dimanche, d'où l'ordre de ce tableau
    const days: DayKey[] = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    return days[new Date().getDay()];
  };

  const todayKey = getCurrentDayKey();
  const todaySchedule = schedule[todayKey];

  // Vérifie si l'heure actuelle est comprise entre start et end
  const isNowOpen = () => {
    if (todaySchedule.closed) return false;
    const now = new Date();
    const time = now.getHours() * 60 + now.getMinutes(); // Heure actuelle en minutes
    const [sh, sm] = todaySchedule.start.split(":").map(Number);
    const [eh, em] = todaySchedule.end.split(":").map(Number);
    return time >= (sh * 60 + sm) && time < (eh * 60 + em);
  };

  const openStatus = isNowOpen();

  // Fonction pour mettre à jour un champ spécifique d'un jour donné
  const updateDay = (key: DayKey, field: keyof DaySchedule, value: any) => {
    setSchedule(prev => prev ? ({
      ...prev,
      [key]: { ...prev[key], [field]: value }
    }) : null);
  };

  return (
    <div className=" h-75 w-full max-w-sm mx-auto border border-gray-400 rounded-2xl p-2 shadow-sm text-xl ">
      {/* --- CARTE RÉSUMÉ (Visible par défaut) --- */}
      <div className="bg-white overflow-hidden flex flex-col justify-between gap-5">
        <div className="p-4 flex flex-row gap-2 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-50 rounded-full text-teal-600 font-bold"><LucideClock1 /></div>
            <span className="font-bold text-gray-800">Horaires d&apos;ouverture</span>
          </div>
          {/* Badge dynamique */}
          <div className={`px-3 py-1 rounded-full text-xs font-bold ${openStatus ? 'bg-green-700 text-white' : 'bg-red-700 text-white'}`}>
            {openStatus ? 
            <div className="flex flex-row items-center justify-center gap-2"><Circle size={10} className="fill-white" />Ouvert</div> :
             <div className="flex flex-row items-center justify-center gap-2"><Circle size={10} className="fill-white" />Fermé</div>}
          </div>
        </div>

        <div className="px-4 py-4 bg-vendor-primary/10 rounded-xl">
          <div className="flex flex-row items-center justify-between gap-4">
            <span className="px-2 py-2 items-center justify-center bg-vendor-primary text-white rounded-lg">Aujourd&apos;hui</span>
            <span>{today}</span>
           
            <div className="flex flex-row items-center gap-2">
               <LucideClock1 />
                  <span className="text-xl font-bold text-gray-800">
                    {todaySchedule.closed ? "Fermé" : `${todaySchedule.start} - ${todaySchedule.end}`}
                  </span>
            </div>       
          </div>
        </div>

        <button 
          onClick={() => setShowSheet(true)}
          className=" px-4 py-4 bg-vendor-primary/10 rounded-xl w-full flex fmex-col items-center justify-center gap-2"
        >
          <Calendar className="text-vendor-primary" />
          Voir tous les horaires
        </button>
      </div>

      {/* --- BOTTOM SHEET (Tiroir de détails/édition) --- */}
      {showSheet && (
        <div className="fixed inset-0 z-50 bg-black/50 flex flex-col justify-end text-xl" onClick={() => setShowSheet(false)}>
          <div className="bg-white rounded-t-3xl p-6 w-full max-w-md mx-auto animate-in slide-in-from-bottom text-xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-800">Horaire de la semaine</h3>
              
            </div>

            <div className="space-y-4">
              {DAYS.map((d) => (
                <div key={d.key} className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${d.key === todayKey ? "font-bold text-teal-600" : "text-gray-600"}`}>
                      {d.label} {d.key === todayKey && "(Aujourd'hui)"}
                    </span>
                    
                    {/* MODE ÉDITION : Affichage des contrôles */}
                    {editMode ? (
                      <div className="flex items-center gap-3">
                         <span className="text-xs text-gray-400">{schedule[d.key].closed ? "Fermé" : "Ouvert"}</span>
                         <input 
                           type="checkbox" 
                           checked={!schedule[d.key].closed} // UI : coché = pas fermé
                           onChange={(e) => updateDay(d.key, "closed", !e.target.checked)}
                           className="w-4 h-4 accent-teal-600"
                         />
                      </div>
                    ) : (
                      /* MODE LECTURE : Simple texte */
                      <span className="text-sm font-medium">
                        {schedule[d.key].closed ? "Fermé" : `${schedule[d.key].start} - ${schedule[d.key].end}`}
                      </span>
                    )}
                  </div>

                  {/* Si on modifie et que le jour est ouvert, on affiche les sélecteurs d'heure */}
                  {editMode && !schedule[d.key].closed && (
                    <div className="flex gap-2 animate-in fade-in slide-in-from-top-1">
                      <input 
                        type="time" 
                        value={schedule[d.key].start} 
                        onChange={e => updateDay(d.key, "start", e.target.value)}
                        className="flex-1 border rounded-lg p-2 text-sm bg-gray-50 font-mono"
                      />
                      <input 
                        type="time" 
                        value={schedule[d.key].end} 
                        onChange={e => updateDay(d.key, "end", e.target.value)}
                        className="flex-1 border rounded-lg p-2 text-sm bg-gray-50 font-mono"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

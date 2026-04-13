/* eslint-disable @typescript-eslint/no-explicit-any */
// components/AddressModal.tsx
"use client";

import { useEffect, useState } from "react";
import { MapPinPlus, X } from "lucide-react";
import {
  getCountries,
  getRegions,
  getCities,
} from "@/lib/services/locationService";
import { createAddress } from "@/lib/services/addressesService";

export default function AddressModal({
  open,
  onClose,
  onSuccess,
  hasAddress,
}: any) {
  
  // listes dynamiques
  const [countries, setCountries] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  // formulaire
  const [form, setForm] = useState({
    street: "",
    quarter: "",
    city: "",
    region: "",
    zipCode: "",
    countryIso: "",
    country: "",
    countryIcon: "",
    isDefault: false,
    latitude: 0,
    longitude: 0,
  });

  // charger les pays quand le modal s’ouvre
  useEffect(() => {
    if (open) {
      getCountries().then(setCountries);
    }
  }, [open]);

  // charger régions quand pays change
  useEffect(() => {
    if (form.countryIso) {
      getRegions(form.countryIso).then(setRegions);
    }
  }, [form.countryIso]);

  //  charger villes quand région change
  useEffect(() => {
    if (form.region) {
      getCities(form.region).then(setCities);
    }
  }, [form.region]);

  // envoyer au backend
  const handleSubmit = async () => {
    try {
      const payload = {
        ...form,
        // 🔥 si aucune adresse → forcer default
        isDefault: hasAddress ? form.isDefault : true,
      };

      await createAddress(payload);

      onSuccess(); // refresh liste
      onClose();   // fermer modal
    } catch (err) {
      console.error(err);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end overflow-hidden ">

      {/* Bottom sheet */}
      <div className="flex flex-col bg-white w-full rounded-t-3xl p-4">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div
            className="right-6  bg-primary-light/20 text-primary-dark p-4 rounded-lg flex items-center justify-center"
          >
            <MapPinPlus size={20}/>
          </div>
          <h2>Nouvelle adresse de livraison</h2>
          <X onClick={onClose} />
        </div>

        <div className="flex flex-col justify-between gap-3">
          {/* Pays */}
          <select
            className="h-14 border border-gray-300 rounded-md px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-transparent"
            value={form.countryIso}
            onChange={(e) => {
              const selected = countries.find((c) => c.code === e.target.value);
              if (selected) {
                setForm({
                  ...form,
                  countryIso: selected.code,
                  country: selected.name,
                  countryIcon: selected.flag,
                  region: "", // Vide le nom de la région
                  city: "",   // Vide le nom de la ville
                });
                setRegions([]); //  Vide l'ID de région pour stopper l'appel API villes
                setRegions([]);  // Vide la liste visuelle des régions
                setCities([]);    // Vide la liste visuelle des villes
              }
            }}
          >
            
            <option>Pays</option>
            {countries.map((c) => (
              <option key={c.code} value={c.code} >
                {c.flagEmoji}
                {c.name}
              </option>
            ))}
          </select>

          {/* Région */}
          <select
            className="h-14 border border-gray-300 rounded-md px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-transparent"
            onChange={(e) =>
              setForm({ ...form, region: e.target.value })
            }
          >
            <option>Région</option>
            {regions.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>

          {/* Ville */}
          <select
            className="h-14 border border-gray-300 rounded-md px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-transparent"
            onChange={(e) =>
              setForm({ ...form, city: e.target.value })
            }
          >
            <option>Ville</option>
            {cities.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Quartier */}
          <input
            placeholder="Quartier"
            className="h-14 border border-gray-300 rounded-md px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-transparent"
            onChange={(e) =>
              setForm({ ...form, quarter: e.target.value })
            }
          />

          {/* Rue */}
          <input
            placeholder="Rue"
            className="h-14 border border-gray-300 rounded-md px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-transparent"
            onChange={(e) =>
              setForm({ ...form, street: e.target.value })
            }
          />

        </div>

        

       

        {/* Checkbox défaut
        <div className="flex gap-2 mt-3">
          <input
            type="checkbox"
            onChange={(e) =>
              setForm({ ...form, isDefault: e.target.checked })
            }
          />
          <label>Adresse par défaut</label>
        </div> */}

        {/* Bouton */}
        <button
          onClick={handleSubmit}
          className="w-full bg-teal-600 text-white py-3 mt-4 rounded-xl"
        >
          Enregistrer
        </button>
      </div>
    </div>
  );
}
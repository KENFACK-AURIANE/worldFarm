/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import {BadgeCheck, Star, MapPin, Users,ChevronRight, ArrowLeft} from "lucide-react";
import Image from "next/image";
import {  GET_FILTERED_SHOPS } from "@/lib/services/shopService";
import { queryGraphql } from "@/lib/api/apiGraphql";
import { getCities, getCountries, getRegions } from "@/lib/services/locationService";
import Link from "next/link"; 
import { useRouter } from "next/navigation";




export default function NosBoutiques() {
  const [countries, setCountries] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [shops, setShops] = useState<any[]>([]);

  const [selCountry, setSelCountry] = useState("");
  const [selRegion, setSelRegion] = useState("");
  const [selCity, setSelCity] = useState("");
  const router = useRouter();

  // ──────────────── CHARGEMENT DES BOUTIQUES ────────────────
 useEffect(() => {
  const loadShops = async () => {
    const filterInput: any = {};
  
  // N'ajoutez la clé QUE si elle a une vraie valeur
  if (selCountry && selCountry !== "") {
    filterInput.countryIso = selCountry; // Ex: "CI"
  }
  
  if (selRegion && selRegion !== "") {
    filterInput.region = selRegion;
  }
  
  if (selCity && selCity !== "") {
    filterInput.city = selCity;
  }
  console.log("Filtres appliqués:", filterInput);

    try {
      const response = await queryGraphql(GET_FILTERED_SHOPS, { 
        filter: {countryIso: "CI"} 
      });
      console.log("Données reçues:", response);
      console.log("Boutiques reçues:", response?.data?.findScoredShop?.content || response?.findScoredShop?.content);
      
      // Extraction directe du contenu
      const result = response?.data?.findScoredShop || response?.findScoredShop;
      setShops(result?.content || []);
      console.log("Boutiques chargées:", result?.content || []);

    } catch (error) {
      console.error("Erreur chargement boutiques:", error);
    }
  };

  loadShops();
}, [selCountry, selRegion, selCity]);

  // ──────────────── CHARGEMENT INITIAL DES PAYS ────────────────
  useEffect(() => {
    const loadCountries = async () => {
      const data = await getCountries();
      setCountries(data.sort((a: any, b: any) => a.name.localeCompare(b.name)));
    };
    loadCountries();
  }, []);

  // ──────────────── CHANGEMENT DE PAYS ────────────────
  const handleCountryChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const countryIso = e.target.value;
    setSelCountry(countryIso);
    setSelRegion("");
    setSelCity("");
    setRegions([]);
    setCities([]);

    if (countryIso) {
      const code = countries.find(c => c.code === countryIso)?.code;
      if (code) {
        const data = await getRegions(code);
        setRegions(data.sort((a: any, b: any) => a.name.localeCompare(b.name)));
      }
    }
  };

  // ──────────────── CHANGEMENT DE REGION ────────────────
  const handleRegionChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const regionName = e.target.value;
    setSelRegion(regionName);
    setSelCity("");
    setCities([]);

    if (regionName) {
      const regionId = regions.find(r => r.name === regionName)?.id;
      if (regionId) {
        const data = await getCities(regionId);
        setCities(data.sort((a: any, b: any) => a.name.localeCompare(b.name)));
      }
    }
  };

  // ──────────────── RENDER ────────────────
  return (
    <div className=" max-w-md space-y-4 bg-vendor-primary/10 rounded-xl h-screen lg:max-w-screen">

      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-6 pb-4 bg-gray-50">
        <button onClick={() => router.back()} className="pl-2">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Nos Boutiques</h1>
        <span className="bg-teal-700 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
          {shops.length} boutiques
        </span>
      </div>

      <div className="px-4">
        {/* SELECT PAYS */}
        <select className="w-full p-3 border rounded-xl " value={selCountry} onChange={handleCountryChange}>
          <option value="">Tous les pays</option>
          {countries.map(c => (
            <option key={c.code} value={c.code}>
              {c.flagEmoji} {c.name}
            </option>
          ))}
        </select>

        {/* SELECT REGION */}
        {selCountry && regions.length > 0 && (
          <select className="w-full p-3 border rounded-xl" value={selRegion} onChange={handleRegionChange}>
            <option value="">Toutes les régions</option>
            {regions.map(r => (
              <option key={r.id} value={r.name}>{r.name}</option>
            ))}
          </select>
        )}

        {/* SELECT VILLE */}
        {selRegion && cities.length > 0 && (
          <select className="w-full p-3 border rounded-xl" value={selCity} onChange={(e) => setSelCity(e.target.value)}>
            <option value="">Toutes les villes</option>
            {cities.map(v => (
              <option key={v.id} value={v.name}>{v.name}</option>
            ))}
          </select>
        )}

        {/* LISTE DES BOUTIQUES */}
        <div className="space-y-3 pt-4">
          {shops.length > 0 ? (
            shops.map(b => (
      
              <Link href={`/client/boutiques/${b.shopId}`} key={b.shopId} className="w-full flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-4 py-4 shadow-sm hover:shadow-md transition-shadow text-left">
                <div className="w-16 h-16 rounded-xl flex items-center justify-center shrink-0 overflow-hidden bg-gray-100 border border-primary-light">
                  {b.logoUrl ? (
                    <Image src={b.logoUrl} alt={b.name} width={64} height={64} className="w-full h-full object-cover rounded-2xl" />
                  ) : (
                    <span className="text-lg font-bold text-gray-400">
                      {b.name?.charAt(0)} {/* Affiche la première lettre si pas de logo */}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 text-xl">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="font-bold text-gray-900 text-xl truncate">{b.name}</span>
                    {b.isVerified && <BadgeCheck />}
                  </div>
                  
                  <div className="flex items-center gap-1 mb-2 text-sm">
                    <MapPin className="fill-gray-500 stroke-white"/>
                    <span className=" text-gray-500">{b.address?.city || "Ville non renseignée"}</span>
                    <span className=" text-gray-500">,{b.address?.country}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 bg-rating/20 rounded-full px-2 py-0.5">
                      <Star className="fill-rating stroke-rating"/>
                      <span className="text-xs font-semibold text-gray-700">
                        {b.data?.rating ? b.data.rating.toFixed(1) : "0.0"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="fill-gray-500 stroke-white"/>
                      <span className="text-xs text-gray-500">{b.data?.numberOfSubscribers || 0}</span>
                      <span className="text-sm ml-1">{b.address?.countryIcon}</span>
                      
                    </div>
                  </div>
                </div>

                <div>
                  <ChevronRight className="w-4 h-4 text-black shrink-0" />
                </div>

                
              </Link>
            ))
          ) : (
            <div className="text-center py-10 text-gray-400">Aucune boutique trouvée</div>
          )}
          
        </div>
      </div>


      
        
    </div>
  );
}



// export default function NosBoutiques() {
//   const [shops, setShops] = useState<any[]>([]); 
//   const [search, setSearch] = useState("");
//   const [paysDropdown, setPaysDropdown] = useState(false);
//   const [selectedPays, setSelectedPays] = useState("Tous les pays");

//   const [countries, setCountries] = useState<any[]>([]);
//   const [regions, setRegions] = useState<any[]>([]);
//   const [cities, setCities] = useState<any[]>([]);

// const [form, setForm] = useState({
    
//     country: "",
//     countryIcon: "",
//     countryIso: "",
    
//   });


//   // charger toutes les boutiques
//   useEffect(() => {
//     const loadShops = async () => {
//       const data = await queryGraphql
//       (GET_ALL_SHOPS);
//       const actualData = data?.data;
//       console.log("Contenu réel :", data?.allShops?.content);

//       // on accède à .allShops.content
//       if (data?.allShops?.content) {

//         setShops(data.allShops.content); // On donne le tableau [Boutique]
//       } else {
//         setShops([]); 
//         console.warn("Aucune boutique trouvée ou format incorrect.");
//       }
//     };

//     loadShops();
//   }, []);

//   // charger les pays quand le modal s’ouvre
//     useEffect(() => {
//         getCountries().then(setCountries);
//     }, []);

//   const filtered = (shops || []).filter((b) => {
//   // Recherche texte : toujours vrai si search est vide
//   const matchSearch = (b.name || "").toLowerCase().includes(search.toLowerCase());

//   // Filtre Pays : doit être vrai si rien n'est sélectionné
//   const matchPays =
//     selectedPays === "Tous les pays" || 
//     selectedPays === "Pays" || 
//     selectedPays === "" || 
//     (b.address?.country && b.address.country.toLowerCase() === selectedPays.toLowerCase());

//   return matchSearch && matchPays;
// });

//   return (
//     <div className="min-h-screen bg-gray-50 font-sans max-w-sm mx-auto">
      // {/* Top bar */}
      // <div className="flex items-center justify-between px-4 pt-6 pb-4 bg-gray-50">
      //   <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm border border-gray-200">
      //     <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-700" fill="none">
      //       <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      //     </svg>
      //   </button>
      //   <h1 className="text-xl font-bold text-gray-900">Nos Boutiques</h1>
      //   <span className="bg-teal-700 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
      //     {shops.length} boutiques
      //   </span>
      // </div>

//       <div className="px-4 space-y-3 pb-8">
//         {/* Search bar */}
//         <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
//           <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none">
//             <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
//             <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
//           </svg>
//           <input
//             type="text"
//             placeholder="Rechercher une boutique..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="flex-1 text-sm text-gray-600 placeholder-gray-400 bg-transparent focus:outline-none"
//           />
//         </div>

//         {/* Country filter */}
//         {/* Pays */}
//           <select
//           className="..."
//           // Utilise form.countryIso si tu veux stocker le code (FR, SN) 
//           // ou form.country si tu veux stocker le nom (France, Sénégal)
//           value={countries.find(c => c.name === selectedPays)?.code || "TOUS"} 
//           onChange={(e) => {
//             if (e.target.value === "TOUS") {
//               setSelectedPays("Tous les pays");
//               setForm({ ...form, country: "", countryIso: "" });
//               return;
//             }

//             const selected = countries.find((c) => c.code === e.target.value);
//             if (selected) {
//               // 1. On met à jour le formulaire
//               setForm({
//                 ...form,
//                 countryIso: selected.code,
//                 country: selected.name,
//                 countryIcon: selected.flagEmoji,
//               });
//               // 2. On met à jour la variable utilisée par le FILTRE
//               setSelectedPays(selected.name); 
              
//               setRegions([]);
//               setCities([]);
//             }
//           }}
//         >
//           <option value="TOUS">Tous les pays</option>
//           {countries.map((c) => (
//             <option key={c.code} value={c.code}>
//               {c.flagEmoji} {c.name}
//             </option>
//           ))}
//         </select>

//         {/* Boutique cards */}
//         <div className="space-y-3">
//           {filtered.map((b) => (
//             <button
//               key={b.shopId}
//               className="w-full flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-4 py-4 shadow-sm hover:shadow-md transition-shadow text-left"
//             >
//               {/* Logo */}
//               <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden bg-gray-100">
//                 {b.logoUrl ? (
//                   <Image src={b.logoUrl} alt={b.name} width={64} height={64} className="w-full h-full object-cover rounded-2xl" />
//                 ) : (
//                   <span className="text-lg font-bold text-gray-400">
//                     {b.name?.charAt(0)} {/* Affiche la première lettre si pas de logo */}
//                   </span>
//                 )}
//               </div>

              // {/* Info */}
              // <div className="flex-1 min-w-0">
              //   <div className="flex items-center gap-1 mb-1">
              //     <span className="font-bold text-gray-900 text-sm truncate">{b.name}</span>
              //     {b.isVerified && <CheckBadge />}
              //   </div>
                
              //   <div className="flex items-center gap-1 mb-2">
              //     <LocationIcon />
              //     <span className="text-xs text-gray-500">{b.address?.city || "Ville non renseignée"}</span>
              //   </div>

              //   <div className="flex items-center gap-3">
              //     <div className="flex items-center gap-1 bg-gray-100 rounded-full px-2 py-0.5">
              //       <StarIcon />
              //       <span className="text-xs font-semibold text-gray-700">
              //         {b.data?.rating ? b.data.rating.toFixed(1) : "0.0"}
              //       </span>
              //     </div>
              //     <div className="flex items-center gap-1">
              //       <PeopleIcon />
              //       <span className="text-xs text-gray-500">{b.data?.numberOfSubscribers || 0}</span>
              //       {/* ✅ CORRECTION ICI : On affiche le nom, pas l'objet */}
              //       <span className="text-sm ml-1">{b.address?.countryIcon}</span>
              //        <span className="text-xs text-gray-500">{b.address?.country}</span>
              //     </div>
              //   </div>
              // </div>

              // <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-400 shrink-0" fill="none">
              //   <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              // </svg>
//             </button>
//           ))}
//         </div>


//         {filtered.length === 0 && (
//           <div className="text-center py-12 text-gray-400 text-sm">
//             Aucune boutique trouvée.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

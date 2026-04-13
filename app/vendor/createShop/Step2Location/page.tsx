/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCreateShopStore } from "@/lib/stores/useCreateShopStore";
import { useEffect, useState } from "react";
import {
  getCountries,
  getRegions,
  getCities,
} from "@/lib/services/locationService";
import { X,File } from "lucide-react";

export function Step2Location({ errors }: { errors: Record<string, any> }) {
  const { form, setForm } = useCreateShopStore() as { form: { address: { countryIso: string;country: string; city: string ; region: string }, promoCode: string }; setForm: (updates: Partial<{ address: { countryIso: string;country: string; city: string ; region: string }, promoCode: string }>) => void };

  // listes dynamiques
  const [countries, setCountries] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [showCountryList, setShowCountryList] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [showRegionList, setShowRegionList] = useState(false);
  const [regionSearchQuery, setRegionSearchQuery] = useState("");
  const [showCityList, setShowCityList] = useState(false);
  const [citySearchQuery, setCitySearchQuery] = useState("");

  // Calcul des villes filtrées
  const filteredCities = citySearchQuery.trim() === "" ? cities : cities.filter((c) =>
    c.name.toLowerCase().includes(citySearchQuery.toLowerCase())
  );

  // Filtrage des régions à la volée
  const filteredRegions = regionSearchQuery.trim() === "" ? regions : regions.filter((r) =>
    r.name.toLowerCase().includes(regionSearchQuery.toLowerCase())
  );

  // On calcule la liste directement à chaque fois que searchQuery ou countries change.
  const filteredCountries = searchQuery.trim() === "" 
  ? countries 
  : countries.filter((c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // charger les pays quand le modal s’ouvre
  useEffect(() => {
    
    getCountries().then(setCountries);
    
  }, []);

  // charger régions quand pays change
  useEffect(() => {
    if (form.address.countryIso) {
      getRegions(form.address.countryIso).then(setRegions);
    }
  }, [form.address.countryIso]);

  //  charger villes quand région change
  useEffect(() => {
    if (form.address.region) {
      getCities(form.address.region).then(setCities);
    }
  }, [form.address.region]);




  return (
    <div className="space-y-4  pb-5">
      <div className="pb-5">
        <h1 className="text-2xl font-bold text-black">Localisation</h1>
        <h2 className="text-lg font-semibold text-gray-400">Aidez vos clients à vous trouver</h2>
      </div>
      <div>
        
        {/* Pays */}
        <div>
          <div className="space-y-2">
            <label className="text-gray-700 font-medium text-sm">Pays *</label>
            
            <button
              type="button"
              onClick={() => setShowCountryList(true)} // Ouvre votre liste personnalisée
              className="w-full flex items-center justify-between p-4 bg-white border border-black rounded-lg shadow-sm hover:border-orange-500 transition-all"
            >
              <div className="flex items-center gap-3">
                {form.address.countryIso ? (
                  <>
                    <span className="text-xl">
                      {countries.find(c => c.code === form.address.countryIso)?.flagEmoji}
                    </span>
                    <span className="text-gray-900 font-medium">
                      {form.address.country}
                    </span>
                  </>
                ) : (
                  <span className="text-gray-400">Sélectionnez un pays</span>
                )}
              </div>
              
              {/* Petite flèche vers le bas à droite */}
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {showCountryList && (
            <div className="fixed inset-0 top-52 bg-white border border-t-vendor-accent z-50 p-6 overflow-y-auto e rounded-t-3xl shadow-lg ">
              
              

              <div className="space-y-4">
                {/* Barre de recherche (Obligatoire) */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Rechercher un pays..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/20 transition-all"
                  />
                </div>

                {/*  Liste des pays (Design identique à l'image) */}
                <div className="mt-4 divide-y divide-gray-100 border-t border-gray-100">
                  {filteredCountries.map((c) => {
                    const isSelected = form.address.countryIso === c.code;
                    
                    return (
                      <div
                        key={c.code}
                        onClick={() => {
                          setForm({ 
                            address: {
                              ...form.address, 
                              countryIso: c.code,
                              country: c.name, 
                              region: "", 
                              city: "", 
                            } 
                          });
                          setRegions([]); 
                          setCities([]);
                          setShowCountryList(false);
                          setSearchQuery(""); // Optionnel : réinitialise la recherche
                        }}
                        className="flex items-center justify-between py-5 px-2 cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-2xl">{c.flagEmoji}</span>
                          <span className={`text-base font-semibold ${isSelected ? "text-gray-900" : "text-gray-600"}`}>
                            {c.name}
                          </span>
                        </div>

                        {/* ✅ Cercle de validation (comme sur l'image) */}
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

                  {/* Message si aucun résultat */}
                  {filteredCountries.length === 0 && (
                    <p className="p-8 text-center text-gray-400">Aucun pays trouvé</p>
                  )}
                </div>
              </div>

            </div>
          )}

        </div>
        {errors["address.country"] && (
          <p className="text-red-500 text-sm mt-1 ml-2">{errors["address.country"]}</p>
        )}
       
        {/* Région */}
        <div className="mt-4">
          <div className="space-y-2">
            <label className="text-gray-700 font-medium text-sm">Région *</label>
            
            <button
              type="button"
              disabled={!form.address.countryIso} // Désactivé si aucun pays n'est choisi
              onClick={() => setShowRegionList(true)}
              className={`w-full flex items-center justify-between p-4 bg-white border  border-black rounded-xl shadow-sm transition-all ${
                !form.address.countryIso ? "opacity-50 cursor-not-allowed" : "hover:border-orange-500"
              }`}
            >
              <div className="flex items-center gap-3">
                {form.address.region ? (
                  <span className="text-gray-900 font-medium">
                    {/* On cherche le nom de la région correspondante à l'ID stocké */}
                    {regions.find(r => r.id === form.address.region)?.name || form.address.region}
                  </span>
                ) : (
                  <span className="text-gray-400">Sélectionnez une région</span>
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
                {/* Barre de recherche Région */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Rechercher une région..." 
                    value={regionSearchQuery}
                    onChange={(e) => setRegionSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/20 transition-all"
                  />
                </div>

                {/* Liste des régions */}
                <div className="mt-4 divide-y divide-gray-100 border-t border-gray-100">
                  {filteredRegions.map((r) => {
                    const isSelected = form.address.region === r.id;
                    
                    return (
                      <div
                        key={r.id}
                        onClick={() => {
                          setForm({ 
                            address: {
                              ...form.address, 
                              region: r.id, // On stocke l'ID
                              city: "",     // On réinitialise la ville si la région change
                            } 
                          });
                          setCities([]);           // Vide la liste des villes précédente
                          setShowRegionList(false); // Ferme la modale
                          setRegionSearchQuery(""); // Reset recherche
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

                  {filteredRegions.length === 0 && (
                    <p className="p-8 text-center text-gray-400" onClick={() => setShowRegionList(false)}>
                      Aucune région trouvée
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        {errors["address.region"] && (
          <p className="text-red-500 text-sm mt-1 ml-2">{errors["address.region"]}</p>
        )}

        {/* Ville */}
        <div className="mt-4">
          <div className="space-y-2">
            <label className="text-gray-700 font-medium text-sm">Ville *</label>
            
            <button
              type="button"
              disabled={!form.address.region} // Désactivé si aucune région n'est choisie
              onClick={() => setShowCityList(true)}
              className={`w-full flex items-center justify-between p-4 bg-white border  rounded-xl border-black shadow-sm transition-all ${
                !form.address.region ? "opacity-50 cursor-not-allowed" : "hover:border-orange-500"
              }`}
            >
              <div className="flex items-center gap-3">
                {form.address.city ? (
                  <span className="text-gray-900 font-medium">{form.address.city}</span>
                ) : (
                  <span className="text-gray-400">Sélectionnez une ville</span>
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
                {/* Barre de recherche Ville */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Rechercher une ville..." 
                    value={citySearchQuery}
                    onChange={(e) => setCitySearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/20 transition-all"
                  />
                </div>

                {/* Liste des villes filtrées */}
                <div className="mt-4 divide-y divide-gray-100 border-t border-gray-100">
                  {filteredCities.map((c) => {
                    const isSelected = form.address.city === c.name;
                    
                    return (
                      <div
                        key={c.id}
                        onClick={() => {
                          setForm({ 
                            address: {
                              ...form.address, 
                              city: c.name 
                            } 
                          });
                          setShowCityList(false);
                          setCitySearchQuery("");
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

                  {filteredCities.length === 0 && (
                    <p className="p-8 text-center text-gray-400" onClick={() => setShowCityList(false)}>Aucune ville trouvée</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Erreur pour la Ville */}
        {errors["address.city"] && (
          <p className="text-red-500 text-sm mt-1 ml-2">{errors["address.city"]}</p>
        )}

      </div>

      {/* code promo */}
      <div className="pb-5">
        <h1 className="text-2xl font-bold text-black">Code Promo Nevo Market Partenaire</h1>
        <h2 className="text-lg font-semibold text-gray-400">Si vous avez un code promo, entrez-le ici pour bénéficier d&apos;avantages exclusifs</h2>
      </div>
      <div>
        <div className="w-full h-30 border px-3 rounded-xl flex flex-row items-center">
            <File size={30} className="inline mr-2" />
            <input
            value={form. promoCode}
            onChange={(e) => setForm({  promoCode: e.target.value })}
            placeholder=" promoCode de la boutique"
            className="w-full h-full border border-none outline-none p-3 rounded-xl"
            />

          </div>
        
          {/* Erreur  promoCode*/}
          {errors. promoCode && (
            <p className="text-red-500 text-sm">{errors. promoCode}</p>
          )}
      </div>

    </div> 
  );
}
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/addresses/page.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import AdresseHeader from "@/components/layout/Header/AdresseHeader";
import AddressModal from "@/components/features/Modal/AddessModal";
import { createAddress, deleteAddress, getAddresses } from "@/lib/services/addressesService";
import { MapPin,Plus, CheckCircle2, Trash2,PlusCircle, MapPinPlus, MapPinOff } from "lucide-react";
import { Address } from "@/lib/types/address.type";
import InstructionAddressCard from "@/components/features/cart/InstructionAddressCard";

export default function Page() {
  const [addresses, setAddresses] = useState([]);
  const [open, setOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Address | null>(null);

  const fetchData = useCallback(async () => {
    const data = await getAddresses();
    setAddresses(data);
  }, []);

  useEffect(() => {
  // On décale l'exécution à la prochaine "micro-tâche"
  // Cela permet au rendu initial de se terminer proprement
    Promise.resolve().then(() => {
      fetchData();
    });
  }, [fetchData]);
  // const handleDelete = async(addr: Address) =>{
  //   await deleteAddress(addr)
  // }
  const setAsDefault = async (addr: Address) => {
  if (addr.isDefault) return;
  

  // backend met les autres à false
  await createAddress({
    ...addr,
    isDefault: true,
  });

  // toi tu supprimes l’ancienne version
  await deleteAddress(addr);

  fetchData();
};


  return (
    <div className="bg-gray-100 min-h-screen w-full overflow-x-hidden">
      <AdresseHeader />
      <InstructionAddressCard />

      {/* EMPTY STATE */}
      {addresses.length === 0 ? (
        <div className="text-center flex flex-col items-center mx-4  mt-20">
           {/* Conteneur de l'icône avec cercle de fond */}
          <div className="flex items-center justify-center w-32 h-32 mb-8 bg-emerald-50 rounded-full">
            <MapPinOff 
              size={56} 
              className="text-emerald-700" 
              strokeWidth={1.5}
            />
          </div>

          {/* Titre principal */}
          <h2 className="mb-3 text-2xl font-bold text-gray-900 sm:text-3xl">
            Aucune adresse enregistrée
          </h2>

          {/* Texte de description */}
          <p className="max-w-xs mb-10 text-lg text-gray-500 leading-relaxed">
            Ajoutez votre première adresse pour faciliter vos prochaines commandes
          </p>


          <button
            onClick={() => setOpen(true)}
            className="mt-4 bg-teal-600 text-white px-6 py-3 rounded-xl"
          >
            <Plus size={18} className="inline-block mr-2" />
            Ajouter une adresse
          </button>
        </div>
      ) : (
       

        <div>
          {/* Adress List */}
          {addresses.map((addr: Address, index: number) => (
            <div 
              key={index} 
              className={`bg-white rounded-2xl pt-0 px-0  border-2 transition-all  mx-4 mt-5 ${
                addr.isDefault ? 'border-primary-dark shadow-md' : 'border-transparent shadow-sm '
              }`}
            >
            
              <div className="">
                
                <div className={`flex justify-between items-center mb-4 px-4 rounded-t-2xl h-20 ${
                addr.isDefault ? 'bg-primary-dark/20 shadow-md' : 'bg-gray-50 shadow-sm'}`}>
                  <div className="flex items-center gap-2 text-primary-dark font-medium ">
                    <MapPin size={18} />
                    <span>Adresse</span>
                  </div>
                  {addr.isDefault && (
                    <span className="bg-primary-dark text-white text-xs px-3 py-1 rounded-full font-medium">
                      Par défaut
                    </span>
                  )}
                </div>

                <div className="flex flex-col p-4 gap-3 mb-4">
                  <div className="flex flex-row flex-wrap items-center gap-2 mt-1">
                    <MapPin size={18} className="text-primary-dark" />
                    <p className="text-gray-800 font-medium">{addr.street},</p>
                    <p className="text-gray-800 font-medium">{addr.quarter},</p>
                    <p className="text-gray-800 font-medium">{addr.city},</p>
                    <p className="text-gray-800 font-medium">{addr.region}</p>
                  </div>
                  <div className="flex flex-row items-center gap-2 mt-1">
                    <span className="text-sm text-gray-500">{addr.countryIcon}</span>
                    <span className="text-lg">{addr.country}</span>
                  </div>
                </div>

                <hr className="my-4 mx-4 border-gray-400" />

                <div className="flex p-4 gap-3">
                  {!addr.isDefault && (
                    <button onClick={() => setAsDefault(addr)} className="flex-1 flex items-center justify-center gap-2 border border-teal-600 text-teal-600 py-3 rounded-xl font-semibold hover:bg-teal-50 transition">
                      <CheckCircle2 size={18} />
                      Par défaut
                    </button>
                  )}
                  <button onClick={() => setDeleteTarget(addr)} className={`flex-1 flex items-center justify-center gap-2 border border-red-600 text-red-600 py-3 rounded-xl font-semibold hover:bg-red-50 transition ${addr.isDefault ? 'w-full' : ''}`}>
                    <Trash2 size={18} /> Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* confirmer suppression */}
      <div>
        {deleteTarget && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg w-80 text-center">
              <p className="mb-4 font-semibold">Voulez-vous vraiment supprimer cette adresse ?</p>
              <div className="flex justify-between gap-4">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-xl hover:bg-gray-100"
                >
                  Annuler
                </button>
                <button
                  onClick={async () => {
                    if (!deleteTarget) return;
                    await deleteAddress(deleteTarget);
                    fetchData();
                    setDeleteTarget(null);
                  }}
                  className="flex-1 py-2 px-4 bg-red-600 text-white rounded-xl hover:bg-red-700"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Button */}
      {addresses.length > 0 &&
         <div className="m-4">
            <button onClick={() => setOpen(true)} className="w-full flex items-center justify-center gap-3 border-2 border-dashed border-teal-300 bg-white p-4 rounded-2xl text-teal-700 font-bold hover:border-teal-500 transition-colors ">
              <PlusCircle size={24} />
              Ajouter une nouvelle adresse
            </button>
          </div>
       }
     

        

      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 bg-teal-600 text-white p-4 rounded-full "
      >
        <MapPinPlus />
      </button>

      {/* Modal */}
      <AddressModal
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={fetchData}
        hasAddress={addresses.length > 0}
      />
    </div>
  );
}
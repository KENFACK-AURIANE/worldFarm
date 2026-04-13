/* eslint-disable @typescript-eslint/no-explicit-any */
import { useShopTypes } from "@/lib/hooks/UseShopTypes";
import { useCreateShopStore } from "@/lib/stores/useCreateShopStore";
import { ShopType } from "@/lib/types/ShopType.type";
import { File, Store } from "lucide-react";



export function Step1BasicInfo({ errors }: { shopTypes: any; errors: any }) {
  const { form, setForm } = useCreateShopStore() as  { form: {  name: string; description: string; shopTypeId: string }; setForm: (updates: Partial<{ name: string; description: string; shopTypeId: string }>) => void };
  

  const { types} = useShopTypes()
  return (
    <div className="space-y-4 pb-25">
      
      

      <div className="flex flex-col gap-2">
        {/* Nom */}
        
        <div className="flex flex-col gap-2">
          <div className="pb-5">
            <h1 className="text-2xl font-bold text-black">Informations de base</h1>
            <h2 className="text-lg font-semibold text-gray-400">Commencez par nous parler de votre boutique</h2>
          </div>
          <div className="w-full h-15 border px-3 rounded-xl flex flex-row items-center">
            <Store size={30} className="inline mr-2" />
            <input
            value={form.name}
            onChange={(e) => setForm({ name: e.target.value })}
            placeholder="Nom de la boutique*"
            className="w-full h-full border border-none outline-none p-3 rounded-xl"
            />
          </div>
          
          {/* Erreur name */}
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name}</p>
          )}

          <div className="w-full h-30 border px-3 rounded-xl flex flex-row items-center">
            <File size={30} className="inline mr-2" />
            <input
            value={form.description}
            onChange={(e) => setForm({ description: e.target.value })}
            placeholder="Description de la boutique*"
            className="w-full h-full border border-none outline-none p-3 rounded-xl"
            />

          </div>
        
          {/* Erreur description*/}
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description}</p>
          )}
        </div>

        {/* Type de boutique */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold pb-5">Type de boutique*</h3>
          {types?.map((t: ShopType) => (
            <div
              key={t.shopTypeId}
              onClick={() => setForm({ shopTypeId: t.shopTypeId })}
              className={`flex flex-row items-center justify-content gap-5 p-3 h-35 border rounded-xl cursor-pointer
                ${
                  form.shopTypeId === t.shopTypeId
                    ? "bg-vendor-primary/10 border-vendor-primary border-2 shadow-md"
                    : ""
                }`}
            >
              <div className="flex bg-vendor-primary/10 h-15 w-15 rounded-lg justify-center items-center text-2xl">{t.icon}</div>
              <div className=" w-75 truncate-2 text-xl">
                <p className="font-bold">{t.name}</p>
                <p className="text-lg text-gray-500">{t.description}</p>
              </div>
            </div>
          ))}

          {/* Erreur */}
          {errors.shopTypeId && (
            <p className="text-red-500 text-sm">
              {errors.shopTypeId}
            </p>
          )}
        </div>
      </div>

      
    </div>
  );
}
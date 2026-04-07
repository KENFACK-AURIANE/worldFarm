// components/Header.tsx
import { ArrowLeft, MapPin } from "lucide-react";
import { useRouter } from 'next/navigation';
export default function AdresseHeader() {
  const router = useRouter();
  return (
    <div className="sticky top-0 z-50 bg-teal-700 text-white p-4 flex items-center gap-3 w-full ">
      
      {/* Bouton retour */}
      <button onClick={() => router.back()} className="bg-white/20 p-2 rounded-full ">
        <ArrowLeft size={20} />
      </button>

      {/* Icône */}
      <div className="bg-white/20 p-2 rounded-full">
        <MapPin size={20} />
      </div>

      <h1 className="text-lg font-semibold">Mes adresses</h1>
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Calendar } from "lucide-react";

export default function DateInputInfo({ label, value, onClick }: any) {
  return (
    <div>
      <label className="text-sm text-gray-600">{label}</label>

      {/* On rend toute la div cliquable pour ouvrir le calendrier */}
      <div 
        onClick={onClick}
        className="flex items-center gap-2 bg-white border rounded-xl px-3 py-2 mt-1 cursor-pointer hover:border-teal-500 transition-colors"
      >
        <Calendar size={18} className="text-gray-400" />
        
        <input
          value={value}
          readOnly // Empêche l'erreur console et la saisie clavier
          placeholder="JJ/MM/AAAA"
          className="flex-1 outline-none bg-transparent cursor-pointer text-gray-800"
        />
        
        {/* Petit indicateur visuel */}
        <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-lg">
          MODIFIER
        </span>
      </div>
    </div>
  );
}

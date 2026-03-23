/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"; // CRUCIAL : autorise le useState et le onClick

import { useState } from 'react';
import { Check } from 'lucide-react';

export default function ColorSelectorClient({ colors }: { colors: any[] }) {
  // 1. On initialise le state avec la première couleur
  const [selectedId, setSelectedId] = useState(colors[0]?.id);

  return (
    <div className="grid grid-cols-2 gap-3 mt-4">
      {colors.map((color) => {
        const isSelected = selectedId === color.name;

        return (
          <button
            key={color.name}
            // 2. Le clic met à jour le state local
            onClick={() => setSelectedId(color.name)}
            className={`flex flex-row w-40 p-2 rounded-2xl border-2  items-center  gap-3 transition-all ${
              isSelected ? 'border-teal-600 bg-teal-50' : 'border-gray-200 bg-white'
            }`}
          >
            {/* Pastille de couleur */}
            <div 
              className="w-8 h-8 rounded-full border flex items-center justify-center"
              style={{ backgroundColor: isSelected ? color.hexCode : color.hexCode }}
            >
              {isSelected && <Check size={16} />}
            </div>

            {/* Texte */}
            <div className="text-left">
              <p className={`font-bold text-sm ${isSelected ? 'text-teal-800' : 'text-slate-800'}`}>
                {color.name}
              </p>
              {isSelected && <p className="text-[10px] text-teal-600">Sélectionné</p>}
            </div>
          </button>
        );
      })}
    </div>
  );
}
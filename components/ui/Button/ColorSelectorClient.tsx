/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Check } from 'lucide-react';

export default function ColorSelectorClient({
  colors,
  selectedId,
  onChange,
}: {
  colors: any[];
  selectedId: string;
  onChange: (id: string) => void;
}) {

  return (
    <div className="grid grid-cols-2 gap-3 mt-4 text-lg">
      {colors.map((color) => {
        const isSelected = selectedId === color.name;

        return (
          <button
            key={color.name}
            onClick={() => onChange(color.name)}
            className={`flex flex-row w-40 p-2 rounded-2xl border-2 items-center gap-3 transition-all text-lg${
              isSelected
                ? 'border-teal-600 bg-teal-50'
                : 'border-gray-200 bg-white'
            }`}
          >
            {/* ✅ Pastille AVEC hexCode */}
            <div 
              className="w-8 h-8 rounded-full border flex items-center justify-center"
              style={{ backgroundColor: color.hexCode }}
            >
              {isSelected && <Check size={16} />}
            </div>

            {/* Texte */}
            <div className="text-left">
              <p className={`font-bold text-lg ${
                isSelected ? 'text-teal-800' : 'text-slate-800'
              }`}>
                {color.name}
              </p>

              {isSelected && (
                <p className="text-[10px] text-teal-600">
                  Sélectionné
                </p>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
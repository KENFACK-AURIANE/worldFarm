/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"; // Obligatoire pour l'interactivité
import { useState } from "react";

export default function ProductTabs({ product }: { product: any }) {
  const [tab, setTab] = useState("desc");

  return (
    <div className="bg-white mt-2 text-lg">
      <div className="flex border-b">
        <button onClick={() => setTab("desc")} className={`flex-1 py-3 ${tab === 'desc' ? 'text-teal-700 font-bold border-b-2 border-teal-700' : 'text-gray-500'}`}>Description</button>
        <button onClick={() => setTab("rev")} className={`flex-1 py-3 ${tab === 'rev' ? 'text-teal-700 font-bold border-b-2 border-teal-700' : 'text-gray-500'}`}>Avis </button>
      </div>
      
      <div className="p-5  text-gray-600">
        {tab === "desc" ? (
          <p>{product.description}</p>
        ) : (
          <p>Chargement des avis...</p>
        )}
      </div>
    </div>
  );
}
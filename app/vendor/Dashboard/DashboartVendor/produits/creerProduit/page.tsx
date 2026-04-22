/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { useState } from 'react';
import { Plus, X, Upload, Check } from 'lucide-react';
// import { ProductForm, VariationRequest } from './types/product';

const AddProductForm = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<any>>({
    characteristics: [],
    variations: [],
    colors: [],
    minQuantity: 1,
    stock: 10
  });

  const [charInput, setCharInput] = useState("");

  // Gestion des caractéristiques (Tags verts dans ta vidéo)
  const addCharacteristic = () => {
    if (charInput.trim()) {
      setFormData(prev => ({
        ...prev,
        characteristics: [...(prev.characteristics || []), charInput]
      }));
      setCharInput("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    
    // Append des champs simples
    data.append('name', formData.name || '');
    data.append('price', String(formData.price));
    data.append('description', formData.description || '');
    data.append('categoryId', formData.categoryId || '');
    
    // Append des fichiers (Images)
    if (formData.mainImage) data.append('mainImage', formData.mainImage);
    
    // Append des tableaux complexes (Stringifié pour multipart si nécessaire par ton backend)
    data.append('characteristics', JSON.stringify(formData.characteristics));
    data.append('variations', JSON.stringify(formData.variations));

    try {
      const response = await fetch('/api/products', { // Remplace par ton URL
        method: 'POST',
        body: data,
      });
      if (response.ok) alert("Produit créé !");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-24">
      {/* --- Section Nom & Description --- */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-blue-50">
        <label className="text-sm font-bold text-blue-900 flex items-center gap-2 mb-3">
          Nom du produit
        </label>
        <input 
          type="text" 
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500"
          placeholder="Ex: iPhone 15 Pro Max"
          required
        />
      </div>

      {/* --- Section Caractéristiques (Le champ avec le bouton + vert) --- */}
      <div className="bg-white p-4 rounded-2xl shadow-sm">
        <label className="text-sm font-bold text-blue-900 mb-3 block">Caractéristiques</label>
        <div className="flex gap-2 mb-3">
          <input 
            value={charInput}
            onChange={(e) => setCharInput(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm"
            placeholder="Ex: Poids 500g, Bio..."
          />
          <button 
            type="button"
            onClick={addCharacteristic}
            className="bg-green-500 text-white p-3 rounded-xl active:scale-95 transition-transform"
          >
            <Plus size={24} />
          </button>
        </div>
        
        {/* Affichage des badges de caractéristiques */}
        <div className="flex flex-wrap gap-2">
          {formData.characteristics?.map((char:any, index:any) => (
            <div key={index} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <Check size={12} /> {char}
              <X size={12} className="ml-1 cursor-pointer" onClick={() => {
                setFormData(prev => ({
                  ...prev,
                  characteristics: prev.characteristics?.filter((_:any, i:any) => i !== index)
                }));
              }}/>
            </div>
          ))}
        </div>
      </div>

      {/* --- Section Média (Upload d'image) --- */}
      <div className="bg-white p-4 rounded-2xl shadow-sm">
        <h3 className="text-sm font-bold text-blue-900 mb-4 flex items-center gap-2">
          🖼️ Médias
        </h3>
        <div 
          className="w-32 h-32 border-2 border-dashed border-red-200 bg-red-50 rounded-2xl flex flex-col items-center justify-center text-center p-2 cursor-pointer relative overflow-hidden"
          onClick={() => document.getElementById('mainImageInput')?.click()}
        >
          {formData.mainImage ? (
            <img 
              src={URL.createObjectURL(formData.mainImage)} 
              className="absolute inset-0 w-full h-full object-cover" 
              alt="Preview"
            />
          ) : (
            <>
              <Upload className="text-slate-400 mb-1" size={24} />
              <span className="text-[10px] text-red-500 font-bold leading-tight">
                Ajouter l&apos;image principale (obligatoire)
              </span>
            </>
          )}
          <input 
            id="mainImageInput" 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={(e) => setFormData({...formData, mainImage: e.target.files?.[0] || null})}
          />
        </div>
      </div>

      {/* --- Section Prix & Stock --- */}
      <div className="bg-white p-4 rounded-2xl shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-blue-900 flex items-center gap-2">💰 Prix et Stock</h3>
        <div className="space-y-2">
          <div className="relative">
             <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-blue-600">FCFA</span>
             <input 
              type="number" 
              placeholder="Prix de vente"
              onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-16 pr-4 font-bold"
             />
          </div>
        </div>
      </div>

      {/* --- Bouton de soumission fixe --- */}
      <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-t z-50">
        
        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-green-200 active:scale-95 transition-all disabled:opacity-50"
        >
          {loading ? "Création en cours..." : <><Check size={20} /> Créer le Produit</>}
        </button>
      </div>
    </form>
  );
};

export default AddProductForm;
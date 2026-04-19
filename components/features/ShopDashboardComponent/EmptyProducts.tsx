import { Package, Plus } from "lucide-react";

export default function EmptyProducts() {
  return  <div className="bg-white rounded-3xl p-8 flex flex-col items-center justify-center shadow-sm border border-gray-100 mx-4 mt-6">
        <div className="relative mb-4">
          <Package size={48} className="text-gray-300" strokeWidth={1.5} />
        </div>
        <h3 className="text-gray-700 font-semibold text-lg text-center">Aucun produit</h3>
        <p className="text-gray-400 text-sm mb-6 text-center">Ajoutez des produits à votre boutique</p>
        
        <button className="flex items-center gap-2 bg-[#1e237e] hover:bg-[#151a61] text-white px-6 py-3 rounded-2xl transition-colors font-medium">
          <Plus size={20} />
          Ajouter un produit
        </button>
      </div>;
}

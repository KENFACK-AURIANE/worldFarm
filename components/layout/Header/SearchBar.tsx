import { Search } from "lucide-react";

export default function Searchbar() {
  return (
    /* 1. On remplace w-96 par flex-1 pour qu'elle s'adapte 
       2. On ajoute max-w-md pour qu'elle ne devienne pas géante sur PC
       3. On ajoute min-w-0 pour autoriser le rétrécissement sur mobile */
    <div className="flex flex-1 min-w-0 max-w-md border pl-3 gap-3 h-10 items-center border-white/30 rounded-full transition-all focus-within:border-white">
      <div className="shrink-0">
        <Search size={18} className="text-white opacity-70" />
      </div>
      <div className="flex-1">
        <input
          type="text"
          className="bg-transparent text-white outline-none w-full placeholder:text-white/50 text-sm"
          placeholder="Rechercher des produits..."
        />
      </div>
    </div>
  );
}

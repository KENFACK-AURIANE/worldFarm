/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Package, 
  LayoutGrid, 
  Zap, 
  Store, 
  MoreVertical,
  ShoppingCart,
  RotateCcw
} from 'lucide-react';
import Link from 'next/link';
import BottomNav from "@/components/features/ShopDashboardComponent/BottomNav"; 
import { motion, AnimatePresence } from 'framer-motion';
import { useCallback } from "react";
import { GET_PRODUCTS } from "@/lib/services/productService";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api/client";
import { queryGraphql } from "@/lib/api/apiGraphql";
import { FETCH_SHOP_BY_ID } from "@/lib/services/shopService";
import { useShopsData } from '@/lib/hooks/UseShopData';

// --- Types ---
type Category = 'Tous' | 'Vestes & Manteaux' | 'Sandales' | 'Costumes & Blazers' | 'En rupture';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  stock: number;
  isFlash?: boolean;
  discount?: number;
}

// --- Mock Data ---
const PRODUCTS: Product[] = [
  { id: '1', name: 'boubou', category: 'Costumes & Blazers', price: 1800, image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=400', stock: 10 },
  { id: '2', name: 'chaussures', category: 'Sandales', price: 6000, image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=400', stock: 10 },
  { id: '3', name: 'Gandoura', category: 'Vestes & Manteaux', price: 2000, image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=400', stock: 10 },
];

export default function ShopDashboard() {
  const { shopId } = useParams();
    const [shop, setShop] = useState<any>(null); // État pour stocker la boutique
  const [activeTab, setActiveTab] = useState(0);
  const [mapCategory, setMapCategory] = useState([])
  const [selectedCategory, setSelectedCategory] = useState<Category>('Tous');
  const [products, setProducts] = useState<any[]>([]); 
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!shopId) return;
    

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 1. Récupérer les infos de la boutique
        const response = await queryGraphql(FETCH_SHOP_BY_ID, { shopId });
        const shopData = response?.fetchShopById;
        console.log("Détails de la boutique chargés",shopData.data.numberOfProducts);
        
        if (shopData) {
          setShop(shopData);
          console.log("Détails de la boutique chargés");

          // 2. Récupérer les catégories
          // IMPORTANT : Utilise 'shopId' directement ici, pas 'shop.shopId'
          const categories = await apiClient.get(`/category/${shopId}`);
          console.log("Détails categories", categories.data.subCategories);
          setMapCategory(categories.data);
        }

      }  catch (error) {
        console.error("Erreur GraphQL:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [shopId]);


  // charger les boutiques
  const loadProducts = useCallback(async () => {
    
  
    
  
    
  
    try {
     setLoading(true);

        //  queryGraphql retourne une seule promesse,
        // sauf si tu as plusieurs requêtes différentes à lancer.
        const response = await queryGraphql(GET_PRODUCTS);
        
        console.log("RÉSULTATS PRODUITS :", response);

        // 2. Extraction sécurisée du contenu
        const allProducts = response?.findAllProduct?.content || [];

        // 3. Filtrage sécurisé (on vérifie que shop et shopData existent)
        const produitsBoutique = allProducts.filter((product: any) => {
          // On compare par ID (plus sûr) ou par nom, mais avec l'Optional Chaining ?.
          return product?.shop?.shopId === shopId; 
        });

        console.log("Produits de la boutique filtrés :", produitsBoutique);
        
        // Mettre à jour ton état local (ex: setProducts)
        // setProducts(produitsBoutique);
      } catch (err) {
        console.error("Erreur lors du chargement des produits:", err);
        setProducts([]);
      }
  }, []);

      
  // charger tous les produits au début
  useEffect(() => { 
      loadProducts();
  }, [loadProducts]);

  const tabs = [
    { id: 0, label: 'Tous mes produits', icon: LayoutGrid },
    { id: 1, label: 'Ventes Flash', icon: Zap, badge: 5 },
    { id: 2, label: 'Market', icon: Store },
  ];

  const categories: Category[] = ['Tous', 'Vestes & Manteaux', 'Sandales', 'Costumes & Blazers', 'En rupture'];

  const filteredProducts = PRODUCTS.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'Tous' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-md mx-auto bg-[#F8F9FE] min-h-screen pb-24 font-sans text-slate-900">
      {/* Header & Search */}
      <div className="p-4 bg-white sticky top-0 z-20">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-indigo-600 transition-colors" />
          <input 
            type="text"
            placeholder="Rechercher un produit..."
            className="w-full bg-slate-100 border-none rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Categories Chips */}
        <div className="flex gap-2 overflow-x-auto py-4 no-scrollbar">
          {mapCategory.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat 
                ? 'bg-[#1D1D47] text-white' 
                : 'bg-white border border-slate-200 text-slate-600'
              }`}
            >
              {cat === 'En rupture' && <AlertTriangle className="inline w-4 h-4 mr-1 mb-0.5 text-orange-500" />}
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3 px-4 mb-6">
        <StatCard count={shop?.data?.numberOfProducts || 0 } label="Actifs" icon={<CheckCircle2 className="text-emerald-500 w-5 h-5" />} bgColor="bg-emerald-50" />
        <StatCard count={0} label="Rupture" icon={<AlertTriangle className="text-rose-500 w-5 h-5" />} bgColor="bg-rose-50" />
        <StatCard count={shop?.reviewsCount || 0 } label="Valeur Stock" icon={<Package className="text-indigo-500 w-5 h-5" />} bgColor="bg-indigo-50" isCurrency />
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex border-b border-slate-200 px-4 sticky top-[132px] bg-[#F8F9FE] z-10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 py-4 px-2 relative transition-colors ${
              activeTab === tab.id ? 'text-indigo-600 font-semibold' : 'text-slate-500'
            }`}
          >
            <tab.icon size={18} />
            <span className="text-sm">{tab.label}</span>
            {tab.badge && (
              <span className="bg-rose-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                {tab.badge}
              </span>
            )}
            {activeTab === tab.id && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
            )}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + selectedCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 0 && (
              <div className="grid grid-cols-2 gap-4">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map(product => <ProductCard key={product.id} product={product} />)
                ) : (
                  <EmptyState message="Aucun produit trouvé" sub="Essayez de modifier vos filtres de recherche" />
                )}
              </div>
            )}

            {activeTab === 1 && (
              <div className="grid grid-cols-2 gap-4">
                <FlashCard name="Offre éclair" price={1000} oldPrice={1250} discount="-20%" time="01:18:17" color="bg-cyan-500" />
                <FlashCard name="Offre éclair" price={100} oldPrice={null} discount={null} time="01:18:17" color="bg-cyan-500" />
              </div>
            )}

            {activeTab === 2 && (
              <EmptyState 
                icon={<Store size={64} className="text-indigo-100" />}
                message="Aucune annonce Market" 
                sub="Créez des annonces pour promouvoir vos produits" 
                buttonText="Réinitialiser les filtres"
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floating Action Button */}
      <Link href={`/vendor/Dashboard/DashboartVendor/produits/creerProduit`} className="hover:text-blue-200 transition-colors" >
        <button className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#00D084] text-white p-4 rounded-full shadow-lg shadow-emerald-200 active:scale-95 transition-transform">
          <ShoppingCart fill="currentColor" />
        </button>
      </Link>
      

      <BottomNav />
    </div>
  );
}

// --- Sub-components ---

function StatCard({ count, label, icon, bgColor, isCurrency = false }: any) {
  return (
    <div className={`${bgColor} rounded-2xl p-3 flex flex-col items-center justify-center border border-white shadow-sm`}>
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="font-bold text-slate-800">{count}</span>
      </div>
      <span className="text-[10px] text-slate-500 uppercase tracking-wider font-medium text-center leading-tight">
        {label}
      </span>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
      <div className="relative aspect-square">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        <div className="absolute top-2 left-2 bg-orange-400/90 backdrop-blur-md text-white px-2 py-1 rounded-lg flex items-center gap-1 text-[10px] font-bold">
          <Package size={12} /> {product.stock}
        </div>
        <button className="absolute top-2 right-2 p-1 bg-white/80 backdrop-blur-md rounded-full shadow-sm text-slate-600">
          <MoreVertical size={18} />
        </button>
      </div>
      <div className="p-3">
        <h3 className="font-medium text-slate-800 text-sm mb-1">{product.name}</h3>
        <span className="inline-block bg-indigo-50 text-indigo-600 text-[10px] px-2 py-0.5 rounded-md mb-3 font-medium">
          {product.category}
        </span>
        <div className="font-bold text-slate-900">{product.price} FCFA</div>
      </div>
    </div>
  );
}

function FlashCard({ name, price, oldPrice, discount, time, color }: any) {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
      <div className="relative aspect-square bg-slate-50 p-2">
        <div className={`absolute top-2 left-2 ${color} text-white px-2 py-1 rounded-lg flex items-center gap-1 text-[10px] font-bold uppercase`}>
          <Zap size={12} fill="white" /> En cours
        </div>
        {discount && (
          <div className="absolute top-2 right-2 bg-rose-500 text-white px-2 py-1 rounded-lg text-[10px] font-bold">
            {discount}
          </div>
        )}
        <div className="h-full flex items-center justify-center">
          <div className="w-20 h-20 bg-slate-200 rounded-2xl" /> {/* Placeholder for image */}
        </div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-sm border border-slate-100">
          <Zap size={14} className="text-orange-500" fill="currentColor" />
          <span className="text-xs font-mono font-bold text-slate-700">{time}</span>
          <MoreVertical size={14} className="text-slate-400" />
        </div>
      </div>
      <div className="p-3">
        <h3 className="text-slate-500 text-xs mb-1">{name}</h3>
        <div className="flex items-center gap-2 mb-3">
          <span className="font-bold text-slate-900">{price} FCFA</span>
          {oldPrice && <span className="text-xs text-slate-300 line-through">{oldPrice} F</span>}
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-400">
          <span className="flex items-center gap-1"><ShoppingCart size={10} /> 0 vendus</span>
          <span>7 restants</span>
        </div>
      </div>
      <BottomNav/>
    </div>
  );
}

function EmptyState({ message, sub, icon, buttonText }: any) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-6 bg-white p-8 rounded-full shadow-xl shadow-slate-100">
        {icon || <Search size={64} className="text-indigo-100" />}
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-2">{message}</h3>
      <p className="text-slate-400 text-sm mb-8 px-10">{sub}</p>
      {buttonText && (
        <button className="flex items-center gap-2 bg-[#E0E7FF]/50 text-indigo-600 px-6 py-3 rounded-2xl font-semibold transition-transform active:scale-95">
          <RotateCcw size={18} />
          {buttonText}
        </button>
      )}
    </div>
  );
}
"use client";

import React, { useState, useRef, ChangeEvent } from 'react';
import { 
  Truck, 
  ShoppingBag, 
  Palette, 
  Gem, 
  Image as ImageIcon, 
  Plus, 
  Pencil, 
  Lightbulb, 
  CheckCircle2,
  Loader2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiClient } from '@/lib/api/client';
import { Shop } from '@/lib/types/shop.types';

// --- Types pour une meilleure clarté ---
type NavItem = {
  name: string;
  icon: React.ElementType;
};

export const AppearanceTab = ({ shop }: { shop: Shop }) => {
  const [activeTab, setActiveTab] = useState('Apparence');
  
  // États pour le Logo
  // Modifiez votre état initial ainsi :

    const [logoPreview, setLogoPreview] = useState<string | null>(shop?.logoUrl || null);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isLogoUploading, setIsLogoUploading] = useState(false);
  
  // États pour la Couverture
  const [coverPreview, setCoverPreview] = useState<string | null>(shop?.coverImageUrl || null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  // État pour la notification
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  // Références aux inputs de fichier masqués
  const logoInputRef = useRef<HTMLInputElement>(null!);
  const coverInputRef = useRef<HTMLInputElement>(null!);

  // --- Gestionnaires d'événements ---

  // Déclenche le clic sur l'input de fichier masqué
  const handleZoneClick = (ref: React.RefObject<HTMLInputElement>) => {
    ref.current?.click();
  };

  // Gère la sélection de fichier et crée l'aperçu
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>, setFile: React.Dispatch<React.SetStateAction<File | null>>, setPreview: React.Dispatch<React.SetStateAction<string | null>>, uploadType: string) => {
    const file = event.target.files?.[0];
    if (file) {
      // Vérification basique du type de fichier
      if (!file.type.startsWith('image/')) {
        showNotification(`Le fichier doit être une image.`, 'error');
        return;
      }

      setFile(file);

      // Création de l'aperçu avec FileReader
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        showNotification(`${uploadType} sélectionné avec succès. N'oubliez pas d'enregistrer.`, 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  // Supprime l'image sélectionnée
  const handleRemoveImage = (setFile: React.Dispatch<React.SetStateAction<File | null>>, setPreview: React.Dispatch<React.SetStateAction<string | null>>, inputRef: React.RefObject<HTMLInputElement>) => {
    setFile(null);
    setPreview(null);
    if (inputRef.current) {
        inputRef.current.value = ''; // Réinitialise l'input pour permettre de re-sélectionner le même fichier
    }
  };

  // Simule l'enregistrement (connexion backend ici)
 const handleSave = async () => {
  // 1. Vérification : si rien n'est sélectionné, on s'arrête
  if (!logoFile && !coverFile) {
    showNotification("Aucune nouvelle image à enregistrer.", "error");
    return;
  }

  setIsLogoUploading(true);
  showNotification("Enregistrement en cours...", "success");

  try {
    // --- GESTION DU LOGO ---
    if (logoFile) {
      const logoFormData = new FormData();
      logoFormData.append('file', logoFile);
      
      await apiClient.post(`/update-logo/${shop.shopId}`, logoFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setLogoFile(null); // On vide après succès
    }

    // --- GESTION DE LA COUVERTURE ---
    if (coverFile) {
      const coverFormData = new FormData();
      coverFormData.append('file', coverFile);
      
      await apiClient.post(`/update-cover-image/${shop.shopId}`, coverFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setCoverFile(null); // On vide après succès
    }

    showNotification("Mise à jour réussie !", "success");
    
    // Optionnel : rafraîchir les données du shop pour voir les nouvelles images
    // router.refresh();

  } catch (error) {
    console.error("Erreur lors de l'upload :", error);
    showNotification("Une erreur est survenue lors de l'enregistrement.", "error");
  } finally {
    setIsLogoUploading(false);
  }
};



  // Affiche une notification temporaire
  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // --- Données de navigation ---
  const navItems: NavItem[] = [
    { name: 'Livraison', icon: Truck },
    { name: 'Commandes', icon: ShoppingBag },
    { name: 'Apparence', icon: Palette },
    { name: 'Abonnement', icon: Gem },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-32 font-sans">
      {/* --- Inputs de fichier masqués --- */}
      <input 
        type="file" 
        ref={logoInputRef} 
        onChange={(e) => handleFileChange(e, setLogoFile, setLogoPreview, "Logo")} 
        accept="image/*" 
        className="hidden" 
      />
      <input 
        type="file" 
        ref={coverInputRef} 
        onChange={(e) => handleFileChange(e, setCoverFile, setCoverPreview, "Image de couverture")} 
        accept="image/*" 
        className="hidden" 
      />

      {/* --- Navigation supérieure (Responsive) --- */}
      <nav className="bg-[#1a237e] text-white p-4 shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo/Nom de l'app sur grand écran */}
          <div className="hidden md:block text-xl font-bold tracking-tight">
            Nevo<span className="text-green-400">Market</span> <span className="text-xs opacity-50">Admin</span>
          </div>

          {/* Éléments de navigation */}
          <div className="flex justify-between items-center gap-2 md:gap-6 flex-1 md:flex-none max-w-md md:max-w-none mx-auto md:mx-0">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`flex flex-col items-center gap-1.5 pb-2.5 px-3 transition-all relative group ${
                  activeTab === item.name ? 'opacity-100' : 'opacity-60 hover:opacity-100'
                }`}
              >
                <item.icon size={22} className="md:size-5" />
                <span className="text-[10px] md:text-sm font-medium tracking-wide">{item.name}</span>
                
                {/* Barre d'activation animée */}
                {activeTab === item.name ? (
                  <motion.div 
                    layoutId="underline" 
                    className="absolute bottom-0 h-1 w-full bg-green-400 rounded-t-full" 
                  />
                ) : (
                  <div className="absolute bottom-0 h-1 w-0 group-hover:w-full bg-green-400/50 rounded-t-full transition-all duration-300" />
                )}
              </button>
            ))}
          </div>

          {/* Zone utilisateur/Déconnexion sur grand écran (Optionnel) */}
          <div className="hidden md:block text-sm opacity-70 hover:opacity-100 cursor-pointer">
            Boutique de Jean
          </div>
        </div>
      </nav>

      {/* --- Contenu Principal (Grille Responsive) --- */}
      <main className="p-4 md:p-8 max-w-7xl mx-auto">
        <header className="mb-8 md:mb-12 border-b border-slate-200 pb-6">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-950 tracking-tighter">Personnaliser l&apos;apparence</h1>
            <p className="text-slate-600 mt-2 max-w-2xl">Configurez l&apos;identité visuelle de votre boutique pour attirer plus de clients. Ces éléments seront visibles sur votre profil et les résultats de recherche.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start">
          
          {/* Colonne Gauche: Formulaires (Logo & Couverture) */}
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            
            {/* --- Section Logo --- */}
            <section className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 transition-shadow hover:shadow-md">
              <div className="flex items-center gap-5 mb-6 md:mb-8 border-b border-slate-100 pb-5">
                <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 shadow-inner">
                  <ImageIcon size={28} />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2.5 tracking-tight">
                    <span role="img" aria-label="store">🖼️</span> Logo de la boutique
                  </h2>
                  <p className="text-sm md:text-base text-slate-500 mt-1">
                    Image carrée (800x800px recommandé, max 5Mo).
                  </p>
                </div>
              </div>

              {/* Zone de téléchargement/aperçu du Logo */}
              <div className="relative group">
                <div 
                  onClick={() => handleZoneClick(logoInputRef)}
                  className={`relative border-4 border-dashed rounded-3xl h-72 md:h-80 flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden ${
                    logoPreview 
                      ? 'border-indigo-100 bg-slate-50' 
                      : 'border-slate-200 bg-slate-50 hover:border-indigo-300 hover:bg-indigo-50/50'
                  }`}
                >
                  {isLogoUploading ? (
                    <div className="flex flex-col items-center text-center p-6">
                      <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
                      <p className="text-lg text-slate-700 font-semibold tracking-tight">Mise à jour...</p>
                      <p className="text-sm text-slate-500 mt-1">Nous envoyons votre magnifique logo.</p>
                    </div>
                  ) : logoPreview ? (
                    <>
                      <img src={logoPreview} alt="Aperçu du Logo" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      {/* Overlay d'action sur survol */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                        <button className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors">
                            <Pencil size={20} />
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-slate-100 p-5 rounded-full mb-4 shadow-inner text-slate-400 group-hover:text-indigo-500 transition-colors">
                        <Plus size={36} />
                      </div>
                      <p className="text-lg text-slate-700 font-bold tracking-tight">Ajouter votre logo</p>
                      <p className="text-sm text-slate-500 mt-1">Cliquez ou glissez-déposez</p>
                    </>
                  )}
                </div>

                {/* Bouton de suppression si image présente */}
                {logoPreview && !isLogoUploading && (
                    <button 
                        onClick={(e) => { e.stopPropagation(); handleRemoveImage(setLogoFile, setLogoPreview, logoInputRef); }}
                        className="absolute -top-3 -right-3 p-1.5 bg-white rounded-full shadow-lg border border-slate-100 text-slate-400 hover:text-red-500 hover:border-red-100 transition-all z-10"
                        title="Supprimer l'image"
                    >
                        <X size={18} />
                    </button>
                )}
              </div>
            </section>

            {/* --- Section Image de Couverture --- */}
            <section className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 transition-shadow hover:shadow-md">
              <div className="flex items-center gap-5 mb-6 md:mb-8 border-b border-slate-100 pb-5">
                <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 shadow-inner">
                  <ImageIcon size={28} />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2.5 tracking-tight">
                    <span role="img" aria-label="mountain">🌄</span> Image de couverture
                  </h2>
                   <p className="text-sm md:text-base text-slate-500 mt-1">
                    Bannière large (1920x1080px recommandé, max 10Mo).
                  </p>
                </div>
              </div>

              {/* Zone de téléchargement/aperçu de la Couverture */}
              <div className="relative group">
                <div 
                  onClick={() => handleZoneClick(coverInputRef)}
                  className={`relative border-4 border-dashed rounded-3xl h-56 md:h-64 flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden ${
                    coverPreview 
                      ? 'border-indigo-100 bg-slate-50' 
                      : 'border-slate-200 bg-slate-50 hover:border-indigo-300 hover:bg-indigo-50/50'
                  }`}
                >
                  {coverPreview ? (
                    <>
                      <img src={coverPreview} alt="Aperçu de la Couverture" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                       {/* Overlay d'action sur survol */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                        <button className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors">
                            <Pencil size={20} />
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-indigo-600 p-5 rounded-full shadow-lg shadow-indigo-200 mb-4 cursor-pointer group-hover:bg-indigo-700 transition-colors">
                        <Plus className="text-white" size={32} />
                      </div>
                      <p className="text-lg text-slate-900 font-extrabold tracking-tight">Ajouter une couverture</p>
                      <p className="text-sm text-slate-600 mt-1">Format paysage uniquement</p>
                    </>
                  )}
                </div>

                 {/* Bouton de suppression si image présente */}
                {coverPreview && (
                    <button 
                        onClick={(e) => { e.stopPropagation(); handleRemoveImage(setCoverFile, setCoverPreview, coverInputRef); }}
                        className="absolute -top-3 -right-3 p-1.5 bg-white rounded-full shadow-lg border border-slate-100 text-slate-400 hover:text-red-500 hover:border-red-100 transition-all z-10"
                        title="Supprimer l'image"
                    >
                        <X size={18} />
                    </button>
                )}
              </div>
            </section>

          </div>
          
          {/* Colonne Droite: Conseils & Actions (Sticky sur grand écran) */}
          <aside className="space-y-6 lg:sticky lg:top-28">
            
            {/* --- Section Conseils (Style Amélioré) --- */}
            <section className="bg-blue-50/50 rounded-3xl p-6 md:p-7 border border-blue-100 shadow-inner">
              <div className="flex items-start gap-4">
                <div className="p-1.5 bg-blue-100 rounded-lg text-blue-600 mt-1 shadow-sm">
                  <Lightbulb size={22} fill="currentColor" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-blue-950 mb-3 tracking-tight">Conseils pour de belles images</h4>
                  <ul className="text-sm text-blue-900/80 space-y-2 leading-relaxed list-disc list-outside pl-4">
                    <li><strong className="text-blue-950">Logo :</strong> Image carrée, fond transparent si possible. Reste lisible même en petit (ex: 32x32px).</li>
                    <li><strong className="text-blue-950">Couverture :</strong> Évitez le texte important sur les bords, il pourrait être coupé sur certains appareils. Privilégiez une ambiance générale.</li>
                    <li><strong className="text-blue-950">Qualité :</strong> Images nettes, bien éclairées, sans filigrane.</li>
                    <li><strong className="text-blue-950">Poids :</strong> Optimisez vos images pour le web pour un chargement rapide.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* --- Bouton d'action principal (Intégré dans le flux sur PC) --- */}
            <div className="hidden lg:block bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                <button 
                    onClick={handleSave}
                    disabled={isLogoUploading || (!logoFile && !coverFile)}
                    className="w-full flex items-center justify-center gap-3 bg-[#00c853] hover:bg-[#00b24a] disabled:bg-slate-300 text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98] shadow-md shadow-green-100 disabled:shadow-none text-lg tracking-tight"
                >
                    {isLogoUploading ? (
                        <><Loader2 className="animate-spin" size={20}/> Enregistrement...</>
                    ) : (
                        "Enregistrer les modifications"
                    )}
                </button>
                <p className="text-xs text-slate-400 text-center mt-3">Toutes les modifications sont réversibles avant l&apos;enregistrement final.</p>
            </div>

          </aside>
        </div>
      </main>

      {/* --- Bouton de validation fixe (Uniquement sur Mobile/Tablette) --- */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-lg border-t border-slate-100 z-30 shadow-[-10px_0_20px_rgba(0,0,0,0.05)]">
        <button 
            onClick={handleSave}
            disabled={isLogoUploading || (!logoFile && !coverFile)}
            className="w-full max-w-md mx-auto flex items-center justify-center gap-3 bg-[#00c853] hover:bg-[#00b24a] disabled:bg-slate-300 text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-green-100 disabled:shadow-none text-lg tracking-tight"
        >
          {isLogoUploading ? (
             <><Loader2 className="animate-spin" size={20}/> Enregistrement...</>
          ) : (
            "Enregistrer les modifications"
          )}
        </button>
      </div>

      {/* --- Notification (Toast Flottant) --- */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ y: 100, opacity: 0, scale: 0.9 }}
            animate={{ y: -100, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-0 left-0 right-0 flex justify-center z-50 pointer-events-none px-4"
          >
            <div className={`text-white px-6 py-3.5 rounded-full flex items-center gap-3 shadow-2xl backdrop-blur-sm ${
                notification.type === 'success' ? 'bg-[#00c853]/95' : 'bg-red-600/95'
            }`}>
              {notification.type === 'success' ? <CheckCircle2 size={22} /> : <X size={22} />}
              <span className="font-semibold tracking-tight">{notification.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


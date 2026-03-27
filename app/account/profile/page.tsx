"use client";

import ProfileHeader from "@/components/layout/Header/ProfileHeader";
import MenuItem from "@/components/layout/SectionAndMenu/MenuItem";
import MenuItemShop from "@/components/layout/SectionAndMenu/MenuItemsShop";
import Section from "@/components/layout/SectionAndMenu/Section";
import { Bell, Settings, User, MapPin, CreditCard, Heart, Clock, MessageSquare, HelpCircle, Headphones, Info, LogOut, Store, ChevronRight } from "lucide-react";
import Link from "next/link"

export default function ProfilePage() {
  return (
    <div className="bg-gray-100 min-h-screen pb-20">

      {/* HEADER */}
      <div className=" sticky top-0 z-50 w-full h-20 shadow-md bg-linear-to-r from-green-600 to-green-400   ">
        
        {/* Icons top right */}
        <div className="absolute right-4 top-4 flex gap-3 items-center text-white">
          <button className="bg-white/20 p-2 rounded-xl">
            <Bell size={20} />
          </button>
          <button className="bg-white/20 p-2 rounded-xl">
            <Settings size={20} />
          </button>
        </div>   
      </div>
      {/* Avatar + info */}
        <ProfileHeader />

      {/* CONTENT */}
      <div className="px-4 mt-20 space-y-6">

            {/* CREATE SHOP */}
            
            <MenuItemShop icon={<Store />} title="Créer votre boutique" subtitle="Vendez vos produits sur WorldFarm" icon2={<ChevronRight />} />

            {/* MON COMPTE */}
            <Section title="Mon Compte">

              <Link href="/account/personnalInfo">
                <MenuItem icon={<User />} title="Informations personnelles" subtitle="Nom, email, téléphone" />
              </Link>
              
              <MenuItem icon={<MapPin />} title="Adresses de livraison" subtitle="Aucune adresse" />
              <MenuItem icon={<CreditCard />} title="Moyens de paiement" subtitle="Mobile Money, cartes" />
            </Section>

            {/* ACTIVITÉ */}
            <Section title="Activité">
            <MenuItem icon={<Clock />} title="Historique des commandes" subtitle="Voir toutes vos commandes" />
            <MenuItem icon={<Heart />} title="Mes favoris" subtitle="Produits sauvegardés" />
            <MenuItem icon={<MessageSquare />} title="Mes avis" subtitle="Avis que vous avez publiés" />
            </Section>

            {/* PARAMÈTRES */}
            <Section title="Paramètres">
            <MenuItem icon={<Bell />} title="Notifications" subtitle="Push, email, SMS" />
            <MenuItem icon={<User />} title="Langue & Région" subtitle="Français - Cameroun" />
            <MenuItem icon={<Settings />} title="Confidentialité et sécurité" subtitle="Mot de passe, 2FA" />
            </Section>

            {/* SUPPORT */}
            <Section title="Support">
            <MenuItem icon={<HelpCircle />} title="Centre d'aide" subtitle="FAQ, guides" />
            <MenuItem icon={<Headphones />} title="Contacter le support" subtitle="Chat, email, téléphone" />
            <MenuItem icon={<Info />} title="À propos" subtitle="Version 1.0.0" />
            </Section>

            {/* LOGOUT */}
            <button className="w-full border border-red-500 text-red-500 py-3 rounded-xl flex items-center justify-center gap-2">
            <LogOut size={18} />
            Se déconnecter
            </button>

      </div>
    </div>
  );
}
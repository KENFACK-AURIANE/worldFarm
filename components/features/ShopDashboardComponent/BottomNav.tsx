"use client";

import { useRouter, usePathname, useParams } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  MessageSquare,
  Store,
} from "lucide-react";

// const navItems = [
//   { href: "/vendor/Dashboard/DashboartVendor/[shopId]", icon: LayoutDashboard },
//   { href: "/vendor/Dashboard/DashboartVendor/commandes", icon: ShoppingBag },
//   { href: "/vendor/Dashboard/DashboartVendor/produits", icon: Package },
//   { href: "/vendor/Dashboard/DashboartVendor/messages", icon: MessageSquare },
//   { href: "/vendor/Dashboard/DashboartVendor/client", icon: Store },
// ];

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  
  // On récupère le shopId (assurez-vous que le nom correspond à votre dossier [shopId])
  const shopId = params?.shopId;

  const navItems = [
    { href: `/vendor/Dashboard/DashboartVendor/${shopId}`, icon: LayoutDashboard },
    { href: `/vendor/Dashboard/DashboartVendor/Commandes/${shopId}`, icon: ShoppingBag },
    { href: `/vendor/Dashboard/DashboartVendor/produits/${shopId}`, icon: Package },
    { href: `/vendor/Dashboard/DashboartVendor/message/${shopId}`, icon: MessageSquare },
    { href: `/vendor/Dashboard/DashboartVendor/client`, icon: Store },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around pb-2 pt-2 max-w-md mx-auto">
      {navItems.map(({ href, icon: Icon }) => {
        const isActive = pathname === href;

        return (
          <button
            key={href}
            onClick={() => router.push(href)}
            className="flex flex-col items-center"
          >
            <Icon
              className={`${
                isActive ? "text-indigo-600" : "text-gray-400"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
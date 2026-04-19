import { useState, useEffect, useCallback } from 'react';
import { queryGraphql } from "@/lib/api/apiGraphql";
import { FETCH_SHOPS_QUERY } from "@/lib/services/shopService";
import { Shop } from "@/lib/types/shop.types";

export const useShopsData = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadShops = useCallback(async () => {
    try {
      setLoading(true);
      const response = await queryGraphql(FETCH_SHOPS_QUERY);
      
      const shopData = response?.data?.userShops || response?.userShops;
      const content = shopData?.content || [];

      const formattedShops = content.map((shop: Shop) => ({
            ...shop,
            data:{
                numberOfProducts: shop?.data?.numberOfProducts || 0,
                numberOfSales: shop?.data?.numberOfSales || 0,
                numberOfSubscribers: shop?.data?.numberOfSubscribers || 0,
                rating: shop?.data?.rating || 0
            },
            isActive : shop.isActive ? 'Active' : 'Inactive',
            rating: shop.rating?.toString() || "0",
            plan: shop.souscription?.shopSouscriptionType?.name || 'GRATUIT',
            isVerified: shop.isVerified
        }));

      setShops(formattedShops);
      setError(null);
    } catch (err) {
      setError("Erreur lors du chargement des boutiques");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadShops();
  }, [loadShops]);

  // On retourne aussi loadShops pour pouvoir "rafraîchir" manuellement (ex: après une création)
  return { shops, loading, error, refresh: loadShops };
};

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/enpoints"; 
import { ShopType } from "../types/ShopType.type";

export const useShopTypes = () => {
  const [types, setTypes] = useState<ShopType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await apiClient.get(API_ENDPOINTS.VENDOR.SHOP_TYPES);
        setTypes(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  return { types, loading };
};
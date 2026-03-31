/* eslint-disable @typescript-eslint/no-explicit-any */
// services/addressService.ts
import { apiClient } from "../api/client";
import { Address } from "../types/address.type";

// 👉 récupérer les adresses
export const getAddresses = async () => {
  const res = await apiClient.get("/user-settings/shipping-addresses");
  return res.data;
};

// 👉 créer une adresse
export const createAddress = async (data: Address) => {
  const res = await apiClient.post(
    "/user-settings/shipping-address",
    data
  );
  return res.data;
};

// 👉 supprimer une adresse
export const deleteAddress = async (address: Address) => {
  const res = await apiClient.delete(
    "/user-settings/shipping-address",
    {
      data:address
    }
    
  );
  return res.data;
};
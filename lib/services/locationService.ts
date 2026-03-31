// services/locationService.ts
import { apiClient } from "../api/client";

// récupérer les pays
export const getCountries = async () => {
  const res = await apiClient.get("/localisation/countries");
  return res.data;
};

// récupérer les régions d’un pays
export const getRegions = async (countryCode: string) => {
  const res = await apiClient.get(
    `/localisation/countries/${countryCode}/regions`
  );
  return res.data;
};

// récupérer les villes d’une région
export const getCities = async (regionId: string) => {
  const res = await apiClient.get(
    `/localisation/regions/${regionId}/cities`
  );
  return res.data;
};
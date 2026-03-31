import { apiClient } from './client'
import { API_ENDPOINTS } from './enpoints'

interface CountryData {
  code: string;
  name: string;
  flagEmoji: string;
  dialCode: string;
  currency:  string;
}

export const fetchCountries = async () : Promise<CountryData[]> => {
  try {
    const response = await apiClient.get<CountryData[]> (API_ENDPOINTS.LOCALISATION.LOCALISATIONS_COUNTRIES);
    return response.data;
    
  } catch (error) {
    console.error("Erreur API countries :", error);
    return [];
  }
};
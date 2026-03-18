import { apiClient } from "../api/client"
import { API_ENDPOINTS } from "../api/enpoints"

export const getFeaturedByZone = async (zone: string) => {

  const response = await apiClient.get(API_ENDPOINTS.CAROUSSEL.FEATURE_ZONE(zone))

  return response.data

}
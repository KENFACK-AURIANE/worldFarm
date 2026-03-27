import { apiClient } from "./client"; // adapte le chemin
import { API_ENDPOINTS } from "./enpoints";

export const getUserInfos = async () => {
  const response = await apiClient.get(API_ENDPOINTS.AUTH.USER_INFOS);
  return response.data;
};
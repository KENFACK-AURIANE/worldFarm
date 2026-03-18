import { apiClient } from './client'
import { API_ENDPOINTS } from './enpoints'
import { AuthResponse, LoginCredentials } from '../types/auth.types'

// cette fonction fait juste l'appel à l'api et renvoie la reponse
export const loginUser = async (data: LoginCredentials): Promise<AuthResponse> => {
    try {
        
        const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, data);
        
        // Extraction du token (vérifiez si c'est response.data.token ou .accessToken)
        const { token } = response.data; 

        if (token) {
            // SAUVEGARDE CRUCIALE ICI
            localStorage.setItem("token", token); 
        }

        return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.mesage || "erreur lors de l'authentification")
        } else {
            throw new Error('Erreur réseau')
        }
    }
}




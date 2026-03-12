import { apiClient } from './client'
import { API_ENDPOINTS } from './enpoints'
import { AuthResponse, LoginCredentials } from '../types/auth.types'

// cette fonction fait juste l'appel à l'api et renvoie la reponse
export const forgotPassword = async (data: LoginCredentials): Promise<AuthResponse> => {
    try {
        
        const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, data)
        return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.mesage || "erreur lors de l'authentification")
        } else {
            throw new Error('Erreur réseau')
        }
    }
}
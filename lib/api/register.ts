import { apiClient } from './client'
import { API_ENDPOINTS } from './enpoints'
import { RegisterCredentials,RegistResponse } from '../types/auth.types'

// cette fonction fait juste l'appel à l'api et renvoie la reponse
export const registerUser = async (data: RegisterCredentials): Promise<RegistResponse> => {
    try {
        
        const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, data)
        return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.mesage || "erreur lors de l'inscription")
        } else {
            throw new Error('Erreur réseau')
        }
    }
}

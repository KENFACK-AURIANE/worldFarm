import { User } from './user.types'

// ce qu'il faut pour se connecter
export interface LoginCredentials{
    email: string
    password: string
}

// ce qu'il faut pour s'inscrire
export interface RegisterCredentials{
    firstName: string
    lastName: string
    email: string
    rawPassword: string
    otp:string
}

// les données qu'on recevra après la connexion
export interface AuthResponse{
    token: string
    user: User
}

// les données qu'on recevra après l'inscription
export interface RegistResponse{
    token: string
    user: User
}


import { User } from './user.types'

// ce qu'il faut pour se connecter
export interface LoginCredentials{
    username: string
    password: string
    rememberMe: boolean;
}

// ce qu'il faut pour s'inscrire
export interface RegisterCredentials{
    firstName: string
    lastName: string
    email: string
    rawPassword: string
    otp:string
}

export interface forgotPassword{
    email: string
}
export interface RestPassword{
    newPassword: string
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


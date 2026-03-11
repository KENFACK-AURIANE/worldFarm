import { Shop } from "./shop.types"

export interface User{
    id: number
    username:string
    email:string
    image?:string
    
    // Rôles (non exclusifs)
    isClient:boolean  // Toujours true
    hasShop:boolean   // true si vendeur
    
    // Informations shop (si vendeur)
    Shop?: Shop
    planAbonnement?:string
    planExpiration?:string
    
    // Informations personnelles
    phone?:string
    address?:string
    city?:string
    
    // Dates
    createdAt:string
    updatedAt?:string    
}
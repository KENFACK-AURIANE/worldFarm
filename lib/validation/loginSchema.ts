import { z } from "zod";  
export const loginSchema = z.object({
    
    username: z.string().email("email invalide"),
    password: z.string().min(8,"au moin 8caractères").regex(/[A-Z]/, "au moins une majuscule").regex(/[a-z]/,"A u moins une minuscule").regex(/[0-9]/,"Au moins un chiffre"),
   rememberMe: z.boolean()
}) 


export type LoginInput = z.infer<typeof loginSchema>
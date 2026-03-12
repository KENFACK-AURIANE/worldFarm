import { z } from "zod";  
export const forgPasswordSchema = z.object({
    
   email: z.string().email("email invalide"),
    
}) 


export type ForgPasswordInput = z.infer<typeof forgPasswordSchema>
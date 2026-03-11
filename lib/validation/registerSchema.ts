import { z } from "zod";  
export const registerSchema = z.object({
    prenom: z.string().min(2, "le prénom doit au moins contenir 2 caractères"),
    name: z.string().min(2,"le nom doit au moins contenir 2 caractères"),
    email: z.string().email("email invalide"),
    password: z.string().min(8,"au moin 8caractères").regex(/[A-Z]/, "au moins une majuscule").regex(/[a-z]/,"A u moins une minuscule").regex(/[0-9]/,"Au moins un chiffre"),
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true,{
        message: "vous devez accepter les conditions"
    }),
}) 

// verifier que les deux mots de passes sont identiques en utilisant refine pour confirmer la validation

.refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path:["confirmPassword"],
});

export type RegisterInput = z.infer<typeof registerSchema>
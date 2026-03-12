import { z } from "zod";  
export const resetPasswordSchema = z.object({
    password: z.string().min(8,"au moin 8caractères").regex(/[A-Z]/, "au moins une majuscule").regex(/[a-z]/,"A u moins une minuscule").regex(/[0-9]/,"Au moins un chiffre"),
    confirmPassword: z.string(),
}) 

// verifier que les deux mots de passes sont identiques en utilisant refine pour confirmer la validation

.refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path:["confirmPassword"],
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
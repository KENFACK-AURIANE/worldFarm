'use client'
import { useState } from "react";
import Link from "next/link";

// Importation de React Hook Form pour gérer le formulaire
import { useForm } from "react-hook-form";

// Importation du resolver qui permet d'utiliser Zod avec React Hook Form
import { zodResolver } from "@hookform/resolvers/zod";

// Importation des icônes depuis lucide-react pour l'interface
import {
    ArrowLeft,
  LockKeyholeOpenIcon,
  Mail,       // icône email
} from "lucide-react";

// Importation du store Zustand qui contient la logique d'authentification
import { useAuthStore } from "@/lib/stores/authStore";

// Importation du schéma de validation Zod et du type TypeScript du formulaire
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/enpoints";
import {useRouter } from "next/navigation"
// Importation du schéma de validation Zod et du type TypeScript du formulaire
import { ForgPasswordInput, forgPasswordSchema } from "@/lib/validation/forgotPasswordSchema";


// Déclaration du composant principal de la page d'inscription
export default function ForgotPasswordPage() {

  const router = useRouter();


  // Etat pour gérer le chargement pendant l'inscription
  const [loading, setLoading] = useState(false);

  // Initialisation de React Hook Form
  const {
    register, // fonction pour connecter les inputs au formulaire
    handleSubmit, // fonction qui gère la soumission du formulaire
    formState: { errors }, // contient les erreurs de validation
  } = useForm<ForgPasswordInput>({
    resolver: zodResolver(forgPasswordSchema), // utilisation du schéma Zod pour valider
    mode: "onChange", // validation en temps réel lorsque l'utilisateur tape
  });

  // Fonction appelée lorsque le formulaire est soumis
  const onSubmit = async (data: ForgPasswordInput) => {

    // On active le mode chargement
    setLoading(true);

    try {

      await apiClient.post(API_ENDPOINTS.AUTH.SEND_OTP, null, {params: {email: data.email, otpType: 'PASSWORD_RESET'}})

      // stocker temporairement les infos du formulaire
      useAuthStore.getState().setTempForgotP(data);

      // Message si l'inscription est réussie
      alert("Un code a été envoyé à votre email !");
      // ✅ Correction : Utilisez le chemin absolu de la route
      router.push("/auth/verifyOtpForgotP"); 

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {

      // Message si une erreur survient
      alert(err.message);

    } finally {

      // On désactive le chargement
      setLoading(false);
    }
  };

  // Interface TSX de la page
  return (

    // Conteneur principal centré
    <div className="max-w-md mx-auto p-6">

      {/* Back button */}
      <div>
        <button onClick={() => router.back()} className="mb-10">
          <ArrowLeft size={24} />
        </button>
      </div>

      {/* Icon */}

      <div className="flex justify-center mb-6">
        <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
          <LockKeyholeOpenIcon className="text-green-700" size={40} />
        </div>
      </div>

      {/* Titre de la page */}
      <h1 className="text-3xl font-bold text-center text-primary-dark">
        Mot de passe oublié ?
      </h1>

      {/* Sous titre */}
      <p className="text-center text-text-secondary mb-6">
        Entrez votre adresse email et nous vous enverrons un code de vérification pour réinitialiser votre mot de passe
      </p>

      {/* Formulaire */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* Champ email */}
        <div className="relative">

          <Mail className="absolute left-3 top-3 text-gray-400" size={18} />

          <input
            {...register("email")}
            placeholder="Email"
            className="pl-10 w-full border rounded-lg p-3"
          />
        </div>
        {/* Affichage erreur si conditions non acceptées */}
          {errors.email && (
            <p className="text-error text-sm">
              {errors.email.message}
            </p>
          )}

        {/* Bouton inscription */}
        <button
          disabled={loading}
          className="w-full bg-primary-dark text-white py-3 rounded-lg"
        >
          {loading ? "Envoi en cours..." : "Envoyer le code"}
        </button>

        <div>
        <Link 
          href="/auth/login" 
          className="text-sm flex flex-row gap-5 justify-center font-medium text-primary hover:text-primary hover:underline transition"
        >
          <ArrowLeft size={24} />
          Retour à la connexion
        </Link>
        </div>

      </form>

    </div>
  );
}




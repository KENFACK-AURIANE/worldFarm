'use client'
import { useState } from "react";
import Cookies from 'js-cookie';

// Importation de React Hook Form pour gérer le formulaire
import { useForm } from "react-hook-form";

// Importation du resolver qui permet d'utiliser Zod avec React Hook Form
import { zodResolver } from "@hookform/resolvers/zod";

// Importation des icônes depuis lucide-react pour l'interface
import {          
  Lock,       // icône mot de passe
  Eye,        // icône voir mot de passe
  EyeOff,
  User,
} from "lucide-react";
import Link from "next/link";

// Importation du schéma de validation Zod et du type TypeScript du formulaire
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/enpoints";
import {useRouter } from "next/navigation"
import Image from "next/image"
import { LoginInput, loginSchema } from "@/lib/validation/loginSchema";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
// import { useGoogleLogin } from "@react-oauth/google";

export default function LoginPage() {

  const router = useRouter();


  // Etat pour afficher ou cacher le mot de passe
  const [showPassword, setShowPassword] = useState(false);

  // Etat pour gérer le chargement pendant l'inscription
  const [loading, setLoading] = useState(false);

  // Etat pour gérer la case "Se souvenir de moi"
  

  // Initialisation de React Hook Form
  const {
    register, // fonction pour connecter les inputs au formulaire
    handleSubmit, // fonction qui gère la soumission du formulaire
    formState: { errors },    //contient les erreurs de validation
  } = useForm<LoginInput>({
    
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false, // Force le type à boolean dès le premier rendu
    },
    mode: "onChange", // validation en temps réel lorsque l'utilisateur tape
  });

  




  const onSubmit = async (data: LoginInput) => {
  setLoading(true);
  try {
    // const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, null, {
    //   params: { username: data.username, password: data.password }
    // });
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, 
    // 1. LE BODY (JSON) - 2ème argument
    { 
      username: data.username, 
      password: data.password, 
      rememberMe: data.rememberMe || false 
    },
    // 2. LES PARAMS (URL) - 3ème argument
    { 
      params: { 
        username: data.username, 
        password: data.password 
      } 
    }
  );



    // On récupère les deux jetons renvoyés par ton serveur Java
    const { access_token, refresh_token } = response.data;

    if (access_token) {
      // Badge court (Cookie pour le Middleware)
      Cookies.set("token", access_token, { expires: 30, secure: true });
      // Badge long (LocalStorage car le Middleware n'en a pas besoin)
      localStorage.setItem("refresh_token", refresh_token);
      
      router.push("/client/acceuil");
      // router.push("/account/profile");
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    alert("Erreur de connexion: " + err.message);
  } finally {
    setLoading(false);
  }
};





  return (
    <div className="min-h-screen flex flex-col px-6 py-8 bg-white max-w-md  mx-auto p-6 ">

      {/* bouton fermer */}
      <div className="mb-8">
        <button className="text-2xl">✕</button>
      </div>

      {/* logo + texte */}
      <div className="flex flex-col items-center text-center mb-10">
        <Image
          src="/images/logo.jpg"
          alt="logo"
          width={300}
          height={300}
          className="w-30  mb-5"
        />

        <h1 className="text-3xl font-bold text-primary-dark">
          Bienvenue !
        </h1>

        <p className="text-text-secondary mt-2">
          Connectez-vous pour accéder à votre compte
        </p>
      </div>

      {/* formulaire */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">


        {/* Champ email */}
        <div className="relative">

          <User className="absolute left-3 top-3 text-text-primary" size={18} />

          <input
            {...register("username")}
            placeholder="Nom d'utilisateur"
            className="pl-10 w-full border rounded-lg p-3 "
          />
          {/* Affichage erreur si conditions non acceptées */}
          {errors.username && (
            <p className="text-red-500 text-sm">
              {errors.username.message}
            </p>
          )}
        </div>


        {/* Champ mot de passe */}
        <div className="relative border-surface">

          <Lock className="absolute left-3 top-3 text-text-primary" size={18} />

          {/* Input mot de passe */}
          <input
            type={showPassword ? "text" : "password"} // affichage dynamique
            {...register("password")}
            placeholder="Mot de passe"
            className="pl-10 w-full border rounded-lg p-3"
          />

          {/* Bouton afficher / cacher mot de passe */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-error text-sm">
            {errors.password.message}
          </p>
        )}

        {/* --- LIGNE : REMEMBER ME + MOT DE PASSE OUBLIÉ --- */}
      <div className="flex items-center justify-between mb-6 ">
        <div className="flex items-center">
          <input
            id="remember"
            type="checkbox"
            {...register("rememberMe")} 
            className="h-4 w-4 text-primary focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
          />
          <label htmlFor="remember" className="ml-2 block text-sm text-text-primary cursor-pointer select-none">
            Se souvenir de moi
          </label>
        </div>

        <Link 
          href="/auth/forgotPassword" 
          className="text-sm font-medium text-primary hover:text-primary hover:underline transition"
        >
          Mot de passe oublié ?
        </Link>
      </div>
    
        {/* Bouton inscription */}
        <button
          disabled={loading}
          className="w-full bg-primary-dark text-white py-3 rounded-lg"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>

      </form>

      {/* séparateur */}
      <div className="flex items-center gap-4 my-8">
        <div className="flex-1 h-px bg-gray-300"></div>
        <span className="text-gray-400">OU</span>
        <div className="flex-1 h-px bg-gray-300"></div>
      </div>

      {/* google */}
      <button 
        type="button"
        // onClick={() => loginWithGoogle()}
        disabled={loading}
        className="border rounded-xl py-4 flex items-center justify-center gap-3 mb-4 w-full hover:bg-gray-50"
      >
        <FcGoogle size={20} />
        Continuer avec Google
      </button>

      {/* apple */}
      <button className="bg-black text-white rounded-xl py-4 flex items-center justify-center gap-3">
        <FaApple size={20} />
        Continuer avec Apple
      </button>

      {/* register */}
      <p className="text-center text-gray-500 mt-8">
        Pas encore de compte ?
        <Link href="/auth/register">
          <span className="text-teal-700 ml-1 font-semibold">
            S&apos;inscrire
          </span>
        </Link>
      </p>

    </div>
  );
}
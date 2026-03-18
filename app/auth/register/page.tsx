// Importation du hook useState de React pour gérer des états locaux
'use client'
import { useState } from "react";
import Link from "next/link";

// Importation de React Hook Form pour gérer le formulaire
import { useForm } from "react-hook-form";

// Importation du resolver qui permet d'utiliser Zod avec React Hook Form
import { zodResolver } from "@hookform/resolvers/zod";

// Importation des icônes depuis lucide-react pour l'interface
import {
  User,       // icône utilisateur
  Mail,       // icône email
  Lock,       // icône mot de passe
  Eye,        // icône voir mot de passe
  EyeOff,     // icône cacher mot de passe
  CheckCircle // icône validation règle mot de passe
} from "lucide-react";

// Importation du store Zustand qui contient la logique d'authentification
import { useAuthStore } from "@/lib/stores/authStore";

// Importation du schéma de validation Zod et du type TypeScript du formulaire
import { RegisterInput, registerSchema } from "@/lib/validation/registerSchema";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/enpoints";
import {useRouter } from "next/navigation"
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";


// Déclaration du composant principal de la page d'inscription
export default function RegisterPage() {

  const router = useRouter();


  // Etat pour afficher ou cacher le mot de passe
  const [showPassword, setShowPassword] = useState(false);

  // Etat pour afficher ou cacher la confirmation du mot de passe
  const [showConfirm, setShowConfirm] = useState(false);

  // Etat pour gérer le chargement pendant l'inscription
  const [loading, setLoading] = useState(false);

  // Initialisation de React Hook Form
  const {
    register, // fonction pour connecter les inputs au formulaire
    handleSubmit, // fonction qui gère la soumission du formulaire
    watch, // permet d'observer les valeurs des champs
    formState: { errors }, // contient les erreurs de validation
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema), // utilisation du schéma Zod pour valider
    mode: "onChange", // validation en temps réel lorsque l'utilisateur tape
  });

  // On observe la valeur du champ password
  const password = watch("password", "");

  // Tableau contenant les règles du mot de passe
  const rules = [
    { label: "Au moins 8 caractères", valid: password.length >= 8 },
    { label: "Au moins une majuscule", valid: /[A-Z]/.test(password) },
    { label: "Au moins une minuscule", valid: /[a-z]/.test(password) },
    { label: "Au moins un chiffre", valid: /[0-9]/.test(password) },
  ];

  // Fonction appelée lorsque le formulaire est soumis
  const onSubmit = async (data: RegisterInput) => {

    // On active le mode chargement
    setLoading(true);

    try {

      await apiClient.post(API_ENDPOINTS.AUTH.SEND_OTP, null, {params: {email: data.email, otpType: 'REGISTER'}})

      // stocker temporairement les infos du formulaire
      useAuthStore.getState().setTempUser(data);

      // Message si l'inscription est réussie
      alert("Un code a été envoyé à votre email !");
      // ✅ Correction : Utilisez le chemin absolu de la route
      router.push("/auth/verifierOtp"); 

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

      {/* Titre de la page */}
      <h1 className="text-3xl font-bold text-center text-primary-dark">
        Créer un compte
      </h1>

      {/* Sous titre */}
      <p className="text-center text-text-secondary mb-6">
        Rejoignez WorldFarm dès maintenant
      </p>

      {/* Formulaire */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* Champ prénom */}
        <div className="relative">

          {/* Icône utilisateur */}
          <User className="absolute left-3 top-3 text-gray-400" size={18} />

          {/* Input prénom */}
          <input
            {...register("prenom")} // connexion du champ au formulaire
            placeholder="Prénom"
            className="pl-10 w-full border rounded-lg p-3"
          />
        </div>

        {/* Champ nom */}
        <div className="relative">

          <User className="absolute left-3 top-3 text-gray-400" size={18} />

          <input
            {...register("name")}
            placeholder="Nom"
            className="pl-10 w-full border rounded-lg p-3"
          />
        </div>

        {/* Champ email */}
        <div className="relative">

          <Mail className="absolute left-3 top-3 text-gray-400" size={18} />

          <input
            {...register("email")}
            placeholder="Email"
            className="pl-10 w-full border rounded-lg p-3"
          />
        </div>

        {/* Champ mot de passe */}
        <div className="relative">

          <Lock className="absolute left-3 top-3 text-gray-400" size={18} />

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

        {/* Bloc des règles du mot de passe */}
        <div className="bg-blue-100 rounded-lg p-4 text-sm">

          <p className="font-semibold mb-2">
            Le mot de passe doit contenir :
          </p>

          {/* Affichage dynamique des règles */}
          {rules.map((rule, i) => (

            <div key={i} className="flex items-center gap-2">

              {/* Icône qui devient verte si la règle est valide */}
              <CheckCircle
                size={16}
                className={rule.valid ? "text-green-500" : "text-gray-400"}
              />

              {/* Texte de la règle */}
              <span
                className={rule.valid ? "text-green-600" : "text-gray-500"}
              >
                {rule.label}
              </span>

            </div>
          ))}
        </div>

        {/* Champ confirmation mot de passe */}
        <div className="relative">

          <Lock className="absolute left-3 top-3 text-gray-400" size={18} />

          <input
            type={showConfirm ? "text" : "password"}
            {...register("confirmPassword")}
            placeholder="Confirmer le mot de passe"
            className="pl-10 w-full border rounded-lg p-3"
          />

          {/* Bouton afficher / cacher */}
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-3"
          >
            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Checkbox conditions */}
        <label className="flex items-center gap-2 text-sm">

          <input type="checkbox" {...register("terms")} />

          <span>
            J&apos;accepte les{" "}
            <span className="text-green-700 font-medium">
              conditions d&apos;utilisation
            </span>{" "}
            et la{" "}
            <span className="text-green-700 font-medium">
              politique de confidentialité
            </span>
          </span>

        </label>

        {/* Affichage erreur si conditions non acceptées */}
        {errors.terms && (
          <p className="text-red-500 text-sm">
            {errors.terms.message}
          </p>
        )}

        {/* Bouton inscription */}
        <button
          disabled={loading}
          className="w-full bg-primary-dark text-white py-3 rounded-lg"
        >
          {loading ? "Inscription..." : "S'inscrire"}
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
            <button className="border rounded-xl py-4 flex items-center justify-center gap-3 text-white bg-black mb-4 w-full hover:bg-gray-50">
              <FaApple size={20} />
              Continuer avec Apple
            </button>
      
            {/* register */}
            <p className="text-center text-gray-500 mt-8">
              Déjà un compte ?
              <Link href="/auth/login">
                <span className="text-teal-700 ml-1 font-semibold">
                  Se connecter
                </span>
              </Link>
            </p>

    </div>
  );
}




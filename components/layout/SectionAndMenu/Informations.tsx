"use client";
interface UserData {
  firstName: string;
  lastName: string;
  email?: string;
}

import { Calendar, Camera, Mail, Mars, User, Venus } from "lucide-react";
import { useEffect, useState } from "react";
import { getUserInfos } from "@/lib/api/getUserInfos";
import InputInfo from "@/components/ui/Inputs/InputInfo"
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/enpoints";
import { useRouter } from 'next/navigation';
import CustomDatePicker from "@/components/ui/Tabs/CustomDatePicker";
import { format } from "date-fns/format";
import DateInputInfo from "@/components/ui/Inputs/DateInputInfo";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Informations() {

  const [user, setUser] = useState<UserData | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [sex, setSex] = useState("");
  const [bornAt, setBornAt] = useState<Date | null>(new Date(1995, 0, 1));
  const [showPicker, setShowPicker] = useState(false);
  // const [date, setDate] = useState<Date | null>(null);
  const router = useRouter();
  useEffect(() => {
  getUserInfos()
    .then((data) => {
      setUser(data);
      setFirstName(data.firstName);
      setLastName(data.lastName);
    })
    .catch((err) => {
      console.error(err);
    });
  }, []);
  const handleSubmit = async () => {
    try {
      await apiClient.patch(API_ENDPOINTS.AUTH.UPDATE_PROFILE, {
        firstName,
        lastName,
        sex,
        bornAt
      });

      setUser((prevUser) => ({
      ...prevUser,
      firstName: firstName, // La variable de votre input
      lastName: lastName,
      sex: sex,
      bornAt: bornAt   // La variable de votre input
    }));

    console.log("Mise à jour locale effectuée !");

    // Rafraîchit les données du serveur (Header, etc.)
    router.refresh(); 
    
    alert("Profil mis à jour !");
    } catch (error) {
      console.error("Erreur :", error);
    }
  };
  if (!user) return <p>Chargement...</p>;
  const prenom = user.firstName
  const nom = user.lastName
  const initiales = ((prenom?.trim()[0] || "")+(nom?.trim()[0] || "")).toUpperCase()
  return (
    <div className="bg-gray-100 min-h-screen pb-24">

      {/* AVATAR */}
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-teal-700">
          { initiales}
          </div>

          <button className="absolute bottom-0 right-0 bg-gradient-to-r from-green-500 to-orange-500 p-2 rounded-full text-white">
            <Camera size={16} />
          </button>
        </div>
      </div>
      {/* NOM */}
      <InputInfo
        icon={<User size={18} />}
        label="Nom"
        value={firstName}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
      />
      {/* PRENOM */}
      <InputInfo
        icon={<User size={18} />}
        label="Prénom"
        value={lastName}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
      />
      

      {/* EMAIL */}
      <InputInfo
        icon={<Mail size={18} />}
        label="Email"
        value={user.email}
        disabled
      />

      {/* DATE */}
      <div className="relative space-y-4">
      
      {/* L'Input Spécial Date */}
      <DateInputInfo 
        label="Date de naissance"
        value={bornAt ? format(bornAt, 'dd/MM/yyyy') : ""}
        onClick={() => setShowPicker(!showPicker)}
      />

      {/* Affichage du Calendrier en Pop-up */}
      {showPicker && (
        <div className="absolute left-0 right-0 z-50 flex justify-center mt-2">
          <CustomDatePicker 
            onSelect={(date) => {
              setBornAt(date);
              setShowPicker(false);
            }} 
            onClose={() => setShowPicker(false)} 
          />
        </div>
      )}

    </div>
      {/* GENRE */}
      <div>
        <label className="text-sm text-gray-600">Genre</label>

        <div className="flex gap-3 mt-2">
          <button
            onClick={() => setSex("h")}
            className={`flex-1 p-3 rounded-xl border flex-row items-center ${
              sex === "h"
                ? "border-teal-700 bg-teal-100 text-teal-700"
                : "bg-white"
            }`}
          >
            <Mars size={24}/>
            <p>Homme</p>
            
          </button>

          <button
            onClick={() => setSex("f")}
            className={`flex-1 p-3 rounded-xl border flex-row items-center ${
              sex === "f"
                ? "border-teal-700 bg-teal-100 text-teal-700"
                : "bg-white"
            }`}
          >
            <Venus size={24} className="bg-primary"/>
            <p> Femme</p>
           
          </button>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-teal-700 text-white py-3 rounded-xl mt-4"
      >
        Enregistrer
      </button>
      
      
    </div>
  );
}
//  {/* CONTENT */}
//       <div className="p-4 space-y-4">

//         {/* AVATAR */}
//         <div className="flex flex-col items-center">
//           <div className="relative">
//             <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-teal-700">
//               CF
//             </div>

//             <button className="absolute bottom-0 right-0 bg-gradient-to-r from-green-500 to-orange-500 p-2 rounded-full text-white">
//               <Camera size={16} />
//             </button>
//           </div>
//         </div>

//         {/* NOM */}
//         <Input icon={<User size={18} />} label="Nom" value="Faith" />

//         {/* PRENOM */}
//         <Input icon={<User size={18} />} label="Prénom" value="Clara" />

//         {/* EMAIL */}
//         <Input
//           icon={<Mail size={18} />}
//           label="Email"
//           value="faithclara792@gmail.com"
//           disabled
//         />

//         {/* ALERT TELEPHONE */}
//         <div className="bg-orange-100 border border-orange-300 rounded-xl p-4 flex gap-3">
//           <div className="text-orange-500">⚠️</div>
//           <div>
//             <p className="text-orange-600 font-semibold">
//               Numéro de téléphone requis
//             </p>
//             <p className="text-sm text-gray-600">
//               Définissez votre numéro pour passer des commandes
//             </p>
//           </div>
//         </div>

//         {/* TELEPHONE */}
//         <div>
//           <label className="text-sm text-gray-600">Téléphone</label>

//           <div className="flex gap-2 mt-1">
//             <button
//               onClick={() => setShowCountryModal(true)}
//               className="flex items-center gap-2 bg-white border rounded-xl px-3 py-2"
//             >
//               <span>{country.flag}</span>
//               <span>{country.code}</span>
//             </button>

//             <input
//               type="text"
//               placeholder="Numéro de téléphone"
//               className="flex-1 border rounded-xl px-3 py-2 bg-white"
//             />
//           </div>

//           <button className="mt-3 w-full bg-teal-700 text-white py-3 rounded-xl">
//             Envoyer le code
//           </button>
//         </div>

//         {/* DATE */}
//         <Input
//           icon={<Calendar size={18} />}
//           label="Date de naissance"
//           placeholder="JJ/MM/AAAA"
//         />

//         {/* GENRE */}
//         <div>
//           <label className="text-sm text-gray-600">Genre</label>

//           <div className="flex gap-3 mt-2">
//             <button
//               onClick={() => setGender("homme")}
//               className={`flex-1 p-3 rounded-xl border ${
//                 gender === "homme"
//                   ? "border-teal-700 bg-teal-100 text-teal-700"
//                   : "bg-white"
//               }`}
//             >
//               ♂ Homme
//             </button>

//             <button
//               onClick={() => setGender("femme")}
//               className={`flex-1 p-3 rounded-xl border ${
//                 gender === "femme"
//                   ? "border-teal-700 bg-teal-100 text-teal-700"
//                   : "bg-white"
//               }`}
//             >
//               ♀ Femme
//             </button>
//           </div>
//         </div>

//         {/* SAVE */}
//         <button className="w-full bg-teal-700 text-white py-3 rounded-xl">
//           Enregistrer
//         </button>
//       </div>
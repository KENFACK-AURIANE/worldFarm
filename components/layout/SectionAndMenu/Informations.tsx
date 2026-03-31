"use client";
interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  sex: string;
  bornAt:  string;
  phone:string;
}
interface CountryData {
  code: string;
  name: string;
  flagEmoji: string;
  dialCode: string;
  currency:  string;
}

import { BadgeCheck, Camera, Mail, Mars, Phone, User, Venus } from "lucide-react";
import { useEffect, useState } from "react";
import { getUserInfos } from "@/lib/api/getUserInfos";
import InputInfo from "@/components/ui/Inputs/InputInfo"
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/enpoints";
import { useRouter } from 'next/navigation';
import CustomDatePicker from "@/components/ui/Tabs/CustomDatePicker";
import { format } from "date-fns/format";
import DateInputInfo from "@/components/ui/Inputs/DateInputInfo";

import { ChevronDown, Check } from "lucide-react";
import { fetchCountries } from "@/lib/api/fetchCountries";


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Informations() {

  const [user, setUser] = useState<UserData | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [sex, setSex] = useState("m");
  const [bornAt, setBornAt] = useState<string>("1995-01-01");
  const [showPicker, setShowPicker] = useState(false);
  
  const [showPhone, setShowPhone] = useState(false);
  const [showbuttonCode, setShowbuttonCode] = useState(true);
  const [numberVal, setNumberVal] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const [showModal, setShowModal] = useState(false);
  // const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [phone, setPhone] = useState("");
  // const [date, setDate] = useState<Date | null>(null);
  const router = useRouter();

  const [countries, setCountries] = useState<CountryData[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const fullPhone = `${selectedCountry?.dialCode}${phone}`

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchCountries();
      setCountries(data);
      console.log("Data reçue:", data)

      // pays par défaut
      if (data.length > 0) {
        setSelectedCountry(data[0]);
      }
    };

    loadData();
  }, []);
 
  
  useEffect(() => {
    getUserInfos()
      .then((data) => {
        setUser(data);
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setEmail(data.email);
        setSex(data.sex);
        setBornAt(data.bornAt);
        setPhone(data.phone);
      })
      .catch((err) => {
        console.error(err);
      });
  },[]);
  useEffect(() => {
  if (phone !== "") {
    setNumberVal(true);
  } else {
    setNumberVal(false);
  }
}, [phone]);
  const handleSubmit = async () => {
    try {
      await apiClient.patch(API_ENDPOINTS.AUTH.UPDATE_PROFILE, {
        firstName,
        lastName,
        sex,
        bornAt 
      });

      setUser(() => ({
        email: email,
        firstName: firstName, 
        lastName: lastName,
        sex: sex,
        bornAt: bornAt,
        phone: phone   
      }));

      console.log("Mise à jour locale effectuée !");

      // Rafraîchit les données du serveur (Header, etc.)
      router.refresh(); 
    
      alert("Profil mis à jour !");
    } catch (error) {
      console.error("Erreur :", error);
      
    }
  };

  const Sendtel = async () => {
  

    try {

      if (!selectedCountry?.dialCode || !phone) {
        alert("Veuillez sélectionner un pays et entrer un numéro.");
        return;
      }
      

      const params = {
        countryCode: selectedCountry.dialCode.trim(), 
        phone: fullPhone 
      };

      // 3. Appel POST avec params en 3ème argument (le 2ème est le body, ici null)
      await apiClient.post(API_ENDPOINTS.SETTING.PHONE_OTP, null, { params });

      setShowOTP(true)
      setShowbuttonCode(false)
      // Message si l'inscription est réussie
      alert("Un code a été envoyé à votre email !");
      

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {

      // Message si une erreur survient
      alert(err.message);

    } finally {

     
    }
  };
   const SendOTP = async () => {
  

    try {

      if (!otp) {
        alert("Veuillez sélectionner un pays et entrer un numéro.");
        return;
      }

      const params = {
        countryCode: selectedCountry?.dialCode.trim(), 
        phone: fullPhone, 
        otp: otp,
      };

      // 3. Appel POST avec params en 3ème argument (le 2ème est le body, ici null)
      await apiClient.post(API_ENDPOINTS.SETTING.PHONE_OTP, null, { params });

      setShowOTP(false)
      setNumberVal(true)
      setShowPhone(false)

      
      // Message si l'inscription est réussie
      alert("Un code a été envoyé à votre email !");
      

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {

      // Message si une erreur survient
      alert(err.message);

    } finally {

     
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
        value={email}
        disabled
      />

      {/* DATE */}
      <div className="relative space-y-4">
      
        {/* L'Input Spécial Date */}
        <DateInputInfo 
          label="Date de naissance"
          value={bornAt ? format(bornAt, 'yyyy/MM/dd') : ""}
          onClick={() => setShowPicker(!showPicker)}
        />

        {/* Affichage du Calendrier en Pop-up */}
        {showPicker && (
          <div className="absolute left-0 right-0 z-50 flex justify-center mt-2">
            <CustomDatePicker 
              // onSelect={(date: Date) => {
              //   // Conversion Date -> "yyyy-MM-dd"
              //   const dateString = date.toISOString().split('T')[0];
              //   setBornAt(dateString);
              //   setShowPicker(false);
              // }} 
              // onClose={() => setShowPicker(false)} 
              onSelect={(date: Date) => {
              // AU LIEU DE toISOString (qui décale d'un jour)
              // UTILISEZ LE FORMATAGE LOCAL :
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const day = String(date.getDate()).padStart(2, '0');
              
              const dateString = `${year}-${month}-${day}`; 
              setBornAt(dateString);
              setShowPicker(false);
            }} 
            onClose={() => setShowPicker(false)} 
            />
          </div>
        )}

      </div>

     {/* ALERT TELEPHONE */}
      <div className="bg-orange-100 border border-orange-300 rounded-xl p-4 flex gap-3">
        <div className="text-orange-500">⚠️</div>
        <div>
          <p className="text-orange-600 font-semibold">
            Numéro de téléphone requis
          </p>
          <p className="text-sm text-gray-600">
            Définissez votre numéro pour passer des commandes
          </p>
        </div>
      </div>
      {/* TELEPHONE */}
      <div>

        <div className="space-y-4">
          {/* HEADER */}
          {numberVal === false && showPhone === false &&
            <div>
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-700">Téléphone</h3>
                {!showPhone && (
                  <button
                    onClick={() => setShowPhone(true)}
                    className="text-green-600 font-medium"
                  >
                    Ajouter
                  </button>
                )}
              </div>
              {showPhone === false &&(
                <div className="flex items-center gap-2 bg-white border rounded-xl px-3 py-2 mt-1">
                  <Phone />
                  <input type="text" value="Non renseigné" readOnly />
                </div>
              )}

            </div>
          }
          

          {/* INPUT SECTION */}
          {showPhone && (
            <div>
              <div className="flex gap-3">
                {/* SELECT COUNTRY */}
                <button
                  onClick={() => setShowModal(true)}
                  className="flex items-center gap-2 px-3 py-3 border rounded-xl bg-gray-50"
                >
                  <span>{selectedCountry?.flagEmoji}</span>
                  <span>{selectedCountry?.dialCode}</span>
                  <ChevronDown size={16} />
                </button>

                {/* PHONE INPUT */}
                <input
                  type="text"
                  placeholder="Numéro de téléphone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="flex-1 px-4 py-3 border rounded-xl outline-none"
                />
              </div>

              {/* ACTIONS */}
              {showbuttonCode && 
                <div className="flex flex-row items-center gap-4">
                <button onClick={() => Sendtel()} className="flex-1 bg-green-700 text-white py-3 rounded-xl font-semibold">
                  Envoyer le code
                </button>

                <button
                  onClick={() => setShowPhone(false)}
                  className="text-green-600 font-medium"
                >
                  Annuler
                </button>
              </div>
              }
              
            </div>
          )}

          {/* MODAL */}
          {showModal && (
            <div className="fixed inset-0 bg-black/40 flex items-end z-50">
              <div className="bg-white w-full rounded-t-3xl p-5 animate-slideUp">
                <div className="w-10 h-1 bg-gray-300 mx-auto mb-4 rounded-full"></div>

                <h2 className="text-center font-semibold text-lg mb-4">
                  Sélectionner un pays
                </h2>

                <div className="space-y-4">
                  {countries.map((c) => (
                    <div
                      key={c.dialCode}
                      onClick={() => {
                        setSelectedCountry(c);
                        setShowModal(false);
                      }}
                      className="flex justify-between items-center cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{c.flagEmoji}</span>
                       
                        <div>
                          <p className="font-medium">{c.name}</p>
                          <p className="text-gray-500 text-sm">{c.dialCode}</p>
                        </div>
                      </div>

                      {selectedCountry?.dialCode === c.dialCode && (
                        <Check className="text-green-600" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* OTP */}
          {showOTP && (
            <div>
              <input className="flex items-center gap-2 bg-white border rounded-xl px-3 py-2 mt-1 w-full" type="text" value={otp} onChange={(e) => setOtp(e.target.value)} />
              <div className="flex flex-row items-center gap-4">
                <button onClick={() => SendOTP()} className="flex-1 bg-green-700 text-white py-3 rounded-xl font-semibold">Verifier</button>
                <button onClick={() => SendOTP()} className="flex-1  text-primary-dark py-3 rounded-xl font-semibold">renvoyer</button>
                <button
                  onClick={() => setShowOTP(false)}
                  className="text-red-600 font-medium"
                >
                  Annuler
                </button>
              </div>
            </div>
          )
          }
          {/* HEADER */}
          
          {numberVal === true &&(
            <div>
              <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-700">Téléphone</h3>
              
              <button
                onClick={() => setShowPhone(true)}
                className="text-green-600 font-medium"
              >
                Modifier
              </button>
              </div>
              <div className="flex justify-between items-center gap-2 bg-white border rounded-xl text-primary-dark px-3 py-2 mt-1">
                <Phone />
                <input className="text-primary-dark" type="text" value={phone} readOnly />
                <BadgeCheck />
              </div>
            </div>
            
          )}
        </div>
      </div>
      {/* GENRE */}
      <div>
        <label className="text-sm text-gray-600">Genre</label>

        <div className="flex gap-3 mt-2">
          <button
            onClick={() => setSex("m")}
            className={`flex-1 p-3 rounded-xl border flex-row items-center ${
              sex === "m"
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

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useRef, useEffect, useState } from "react";
import { apiClient } from "@/lib/api/client"; // ton axios/fetch config
import { API_ENDPOINTS } from "@/lib/api/enpoints";
import { ArrowLeft, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/authStore";
import toast from "react-hot-toast";

export default function VerifyOtpForgotP() {
  const router = useRouter();
  const [seconds, setSeconds] = useState(60);
  

  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputs = useRef<HTMLInputElement[]>([]);
  const tempUserForgotP = useAuthStore((state) => state.tempUserForgotP);

  useEffect(() => {
    if (seconds === 0) return;

    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  const resendOTP = async () => {
    if (!tempUserForgotP) {
      alert("Erreur: modification non trouvée");
      return;
    }

    try {
      await apiClient.post(API_ENDPOINTS.AUTH.SEND_OTP, null, {params: {email: tempUserForgotP.email, otpType: 'PASSWORD_RESET'}})

      setSeconds(60);
    } catch {
      alert("Erreur lors du renvoi du code");
    }
  };

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputs.current[index + 1]?.focus();
    }
  };

  const verifyOTP = async () => {
    if (!tempUserForgotP) {
      alert("Erreur: Utilisateur non trouvé");
      return;
    }

    try {
      const code = otp.join("");
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      console.log;
      // 1️⃣ Vérification OTP
      await apiClient.get(API_ENDPOINTS.AUTH.VERIFY_OTP, {
        params: { email: tempUserForgotP.email, otp: code },
      });

      // Recuperer l'otp reçu lors du processus de modification
      useAuthStore.getState().setTempUserOtpForgot(code);

      toast.success("Otp valide !",{
        duration: 4000,
        position: "top-center",
      });
      // alert("Otp valide !");
      router.push("/auth/modifierPassword"); // red
    } catch (err: any) {
      alert(err.response?.data?.message || "OTP invalide");
    }
  };

  return (
    <div className="max-w-md mx-auto ">
      {/* Back button */}
      <div>
        <button onClick={() => router.back()} className="mb-10">
          <ArrowLeft size={24} />
        </button>
      </div>

      {/* Icon */}

      <div className="flex justify-center mb-6">
        <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
          <Mail className="text-green-700" size={40} />
        </div>
      </div>

      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold text-green-700 text-center mb-3">
          Vérification
        </h1>

        {/* Description */}

        <p className="text-gray-500 text-center mb-8">
          Nous avons envoyé un code à 4 chiffres à <br />
          <span className="text-green-700 font-semibold">
            {tempUserForgotP?.email}
          </span>
        </p>
      </div>

      {/* OTP inputs */}

      <div className="flex justify-center gap-4 mb-10 ">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputs.current[index] = el!;
            }}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e.target.value, index)}
            className="w-16 h-16 border rounded-xl text-center text-xl outline-none focus:border-green-600"
          />
        ))}
      </div>

      {/* Verify button */}
      <button
        onClick={verifyOTP}
        className="bg-green-700 text-white py-4 rounded-xl font-semibold text-lg w-full"
      >
        Vérifier
      </button>

      {/* Resend */}
      <p
        onClick={seconds === 0 ? resendOTP : undefined}
        className={`text-center mt-6 ${
          seconds === 0 ? "text-green-700 cursor-pointer" : "text-gray-400"
        }`}
      >
        {seconds > 0
          ? `Renvoyer le code dans ${seconds}s`
          : "Renvoyer le code"}
      </p>
    </div>
  );
}

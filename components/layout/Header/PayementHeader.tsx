"use client"
import { ArrowLeft, Headset } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PaymentHeader() {

  const router = useRouter();
  return (
    <div className="bg-primary-dark text-white p-7 flex flex-row items-center justify-between">
      <div className="flex flex-row items-center justify-between w-35">
        <div className=" bg-primary-light/50 rounded-lg flex flex-row items-center w-10 h-10">
          <button onClick={() => router.back()} className="pl-2">
            <ArrowLeft size={20} />
          </button>
        </div>
        <h1 className="text-lg font-semibold">Paiement</h1>
        
      </div>

      <div  className=" bg-primary-light/50 rounded-lg flex flex-row items-center w-10 h-10">
         <button onClick={() => router.back()} className="pl-2">
          <Headset size={20} />
        </button>
      </div>
    </div>
  );
}
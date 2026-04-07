"use client";


import { User, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Informations from "@/components/layout/SectionAndMenu/Informations";

export default function PersonnalInfo() {
  

    const router = useRouter();
  return (
    <div className="bg-white min-h-screen pb-5">
      
      {/* HEADER */}
      <div className="bg-teal-700 text-white p-4 flex items-center gap-3">
       <div className=" bg-primary-light/50 rounded-2xl flex flex-row items-center w-10 h-10">
          <button onClick={() => router.back()} className="pl-2">
            <ChevronLeft size={20} />
          </button>
        </div>
        <div className=" bg-primary-light/50 rounded-lg flex flex-row items-center w-10 h-10">
          <button onClick={() => router.back()} className="pl-2">
            <User size={20} />
          </button>
        </div>
        <h1 className="text-lg font-semibold">Informations personnelles</h1>
      </div>

      <Informations />

     

     
    </div>
  );
}
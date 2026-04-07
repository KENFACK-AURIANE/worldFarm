"use client";


import { ArrowLeft, BadgeCheck, Headset} from "lucide-react";
import { useRouter } from "next/navigation";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProfileHeader({ s }: { s: any }) {

    const router = useRouter();
   

  return (
    
    <div className="sticky top-0 z-50 w-full shadow-md bg-vendor-primary text-white p-7 flex flex-row items-center justify-between">
        <div className="flex flex-row items-center justify-between gap-2 w-45">
            <div className=" bg-primary-light/50 rounded-2xl flex flex-row items-center w-10 h-10">
            <button onClick={() => router.back()} className="pl-2">
                <ArrowLeft size={20} />
            </button>
            </div>
            <h1 className="text-lg font-semibold">{s?.name}</h1>
            {s?.isVerified && <BadgeCheck size={18} className="text-blue-500" />}
            
        </div>

        <div  className=" bg-primary-light/50 rounded-lg flex flex-row items-center w-10 h-10">
            <button onClick={() => router.back()} className="pl-2">
            <Headset size={20} />
            </button>
        </div>
    </div>
  );
}
"use client";
interface UserData {
  firstName: string;
  lastName: string;
  email: string;
}

import { User } from "lucide-react";
import { useEffect, useState } from "react";
import { getUserInfos } from "@/lib/api/getUserInfos";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProfileHeader() {

    const [user, setUser] = useState<UserData | null>(null);
  useEffect(() => {
    getUserInfos()
      .then((data) => {
        setUser(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);
  if (!user) return <p>Chargement...</p>;

  return (
    <div className="fixed  bg-linear-to-r from-emerald-600 to-amber-200/50 text-white p-6 pb-16 relative">
      
      {/* Avatar + info */}
      <div className="flex flex-col items-center mt-6">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
          <User size={40} className="text-green-600" />
        </div>

         <h1>{user.firstName} {user.lastName}</h1>

        <p className="text-sm opacity-90">
          {user.email}
        </p>
      </div>
    </div>
  );
}
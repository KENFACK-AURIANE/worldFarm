import { create } from "zustand";
import { LoginCredentials, RegisterCredentials, RegistResponse } from "../types/auth.types";
import { Shop } from "../types/shop.types";
import { User } from "../types/user.types";
import { registerUser } from "../api/register";
import { RegisterInput } from "../validation/registerSchema";

// interface TempUser{
//   firstName:string;
//   lastName:string;
//   email:string;
//   rawPassword:string
// }

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  hasShop: boolean;
  currentShop: Shop | null;
  tempUser: RegisterInput | null
  
  // Actions
  // login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterCredentials) => Promise<void>;
  // logout: () => void;
  setTempUser: (data: RegisterInput) => void;
  // setUser: (user: User) => void;
  // switchToVendor: () => void;
  // switchToClient: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token:null,
  isAuthenticated: false,
  hasShop: false,
  currentShop:null,
  tempUser: null,

  register: async (data: RegisterCredentials) => {
    try{
      const result: RegistResponse = await registerUser(data);
      set({
        user: result.user,
        token: result.token,
        isAuthenticated: true,
        hasShop: false,
        currentShop: null,
      });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }catch(error: any){
      console.error(error);
      throw error;
    }
  },
  setTempUser: (data) =>set({ tempUser: data })


}));
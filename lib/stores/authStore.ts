import { create } from "zustand";
import { AuthResponse, LoginCredentials, RegisterCredentials, RegistResponse } from "../types/auth.types";
import { Shop } from "../types/shop.types";
import { User } from "../types/user.types";
import { registerUser } from "../api/register";
import { RegisterInput } from "../validation/registerSchema";
import { loginUser } from "../api/login";
import { LoginInput } from "../validation/loginSchema";
import { ForgPasswordInput } from "../validation/forgotPasswordSchema";
import { ResetPasswordInput } from "../validation/resetPasswordSchema";



interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  hasShop: boolean;
  currentShop: Shop | null;
  tempUser: RegisterInput | null
  tempUserL: LoginInput | null
  tempUserForgotP: ForgPasswordInput | null
  tempUserResetP: ResetPasswordInput | null
  tempUserOtpForgot: string | null
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterCredentials) => Promise<void>;
  // logout: () => void;
  setTempUser: (data: RegisterInput) => void;
  setTempUserL: (data: LoginInput) => void;
  setTempForgotP: (data:ForgPasswordInput) => void;
  setTempResetP: (data:ResetPasswordInput) => void;
  setTempUserOtpForgot: (data:string) => void;
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
  tempUserL: null,
  tempUserForgotP:null,
  tempUserResetP: null,
  tempUserOtpForgot: null,

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
  login: async (data: LoginCredentials) => {
    try{
      const result: AuthResponse = await loginUser(data);
      set({
        user: result.user,
        token: result.token,
        isAuthenticated: true,
      });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }catch(error: any){
      console.error(error);
      throw error;
    }
  },
  setTempUser: (data) =>set({ tempUser: data }),
  setTempUserL: (data) =>set({ tempUserL: data }),
  setTempForgotP: (data) =>set({ tempUserForgotP: data }),
  setTempResetP: (data) =>set({ tempUserResetP: data }),
  setTempUserOtpForgot: (data) =>set({ tempUserOtpForgot: data })

}));
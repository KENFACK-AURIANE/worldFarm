// utils/auth.ts
export const getToken = () => {
  if (typeof window !== "undefined") {
    // Vérifiez si c'est bien "token" ou un autre nom ici !
    return localStorage.getItem("token"); 
  }
  return null;
};

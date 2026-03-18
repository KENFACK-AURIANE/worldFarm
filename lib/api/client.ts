import axios from 'axios';
import Cookies from 'js-cookie';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// INTERCEPTEUR DE REQUÊTE : Ajoute le token à chaque envoi
apiClient.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// INTERCEPTEUR DE RÉPONSE : Gère le rafraîchissement automatique
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si erreur 401 (Expire) et que ce n'est pas déjà une tentative de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 1. Appeler l'API de rafraîchissement (vérifie l'URL avec ton backend)
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
          refreshToken: localStorage.getItem('refresh_token'),
        });

        const { access_token } = response.data;

        // 2. Sauvegarder le nouveau badge
        Cookies.set('token', access_token, { expires: 30, secure: true });
        localStorage.setItem('token', access_token);

        // 3. Rejouer la requête initiale avec le nouveau badge
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Si le refresh échoue aussi (ex: refresh token expiré), on déconnecte
        localStorage.clear();
        Cookies.remove('token');
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

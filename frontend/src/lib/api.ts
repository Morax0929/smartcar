import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Barcha murojaatlar uchun markaziy stansiya (Barcha post/get so'rovlar shu orqali o'tadi)
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// So'rov (Request) ketishidan oldin aralashuvchi Interceptor (Qorovul)
apiClient.interceptors.request.use(
  (config) => {
    // Xotiradan tokenni olamiz
    const token = Cookies.get('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Kelayotgan javob (Response) dagi xatolarni ushlash
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Agar 401 Unathorized bo'lsa (Token eskirgan yoki yo'q) tizimdan chiqarib tashlash
    if (error.response && error.response.status === 401) {
      Cookies.remove('access_token');
      Cookies.remove('user_role');
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

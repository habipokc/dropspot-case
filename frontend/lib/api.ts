// src/lib/api.ts
import axios from 'axios';


const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

const api = axios.create({
    baseURL: API_URL,
});

/*
  == Gelecek Adım Notu ==
  Kullanıcı giriş yaptığında, alacağımız JWT token'ını her isteğin header'ına
  otomatik olarak eklemek için buraya bir "interceptor" ekleyeceğiz.
  Bu sayede token yönetimini tek bir yerden yapmış olacağız.
  
  Örnek:
  api.interceptors.request.use(config => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
*/

export default api;
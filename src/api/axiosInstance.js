import axios from 'axios';

// إنشاء النسخة المخصصة
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000, // لو السيرفر مبردش خلال 10 ثواني، الطلب يتلغي
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// --- Interceptor للـ Request (قبل ما الطلب يخرج من عندك) ---
axiosInstance.interceptors.request.use(
    (config) => {
        // جلب التوكن من الـ LocalStorage (بفرض إنك بتخزنيه بعد اللوجن)
        const token = localStorage.getItem('admin_token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// --- Interceptor للـ Response (لما الرد يرجع من السيرفر) ---
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // لو السيرفر رد بـ 401 (يعني التوكن انتهت أو مش موجودة)
        if (error.response && error.response.status === 401) {
            console.error('Session expired. Redirecting to login...');
            localStorage.removeItem('admin_token');
            window.location.href = '/login'; 
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { THEME } from "@/utils/theme";
import { usePost } from "@/hooks/usePost";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string(),
});

export const LoginForm = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const { t } = useTranslation();
    const loginMutation = usePost(
        "/api/admin/auth/login", 
        null, 
        (data) => `${t('hello')} ${data.data?.user?.name || 'Admin'}, ${t('welcome_back')}`
    );

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = (data) => {
        loginMutation.mutate(data, {
            onSuccess: (response) => {
                const data = response.data || response;

                if (data.token) {
                    localStorage.setItem("admin_token", data.token);
                    localStorage.setItem("admin_info", JSON.stringify(data.user));
                    navigate("/dashboard");
                } else {
                    console.error("Credentials missing in response", response);
                }
            }
        });
    };

    return (
        <div className="w-full max-w-xl p-4 md:p-8">
            <div className="mb-8 text-center md:text-left">
                <h2 className="text-3xl font-bold text-slate-800">{t('welcome')}</h2>
                <p className="text-slate-500 mt-2">{t('system_name')}</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-2">{t('email')}</label>
                    <input
                        {...register("email")}
                        type="email"
                        className={`w-full p-3 border rounded-lg focus:ring-2 outline-none transition ${errors.email ? "border-red-500 ring-red-200" : "focus:ring-blue-500"
                            }`}
                        placeholder={t('email_placeholder')}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">{t('password')}</label>
                    <div className="relative">
                        <input
                            {...register("password")}
                            type={showPassword ? "text" : "password"}
                            className={`w-full p-3 pr-10 border rounded-lg focus:ring-2 outline-none transition ${errors.password ? "border-red-500 ring-red-200" : "focus:ring-blue-500"
                                }`}
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                </div>

                <button
                    type="submit"
                    disabled={loginMutation.isPending} // تعطيل الزرار وقت التحميل
                    className={`w-full ${THEME.colors.primary} text-white p-3 rounded-lg font-semibold hover:opacity-90 transition flex justify-center items-center shadow-lg shadow-blue-900/20`}
                >
                    {loginMutation.isPending ? (
                        <span className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            {t('signing_in')}
                        </span>
                    ) : (
                        t('login')
                    )}
                </button>
            </form>
        </div>
    );
};
// src/features/auth/components/LoginForm.jsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { THEME } from "@/utils/theme";
import { usePost } from "@/hooks/usePost";
import { useNavigate } from "react-router-dom";

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string(),
});

export const LoginForm = () => {
    const navigate = useNavigate();

    const loginMutation = usePost("/api/admin/auth/login");

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = (data) => {
        loginMutation.mutate(data, {
            onSuccess: (response) => {
                console.log("Login Response:", response);
                // Handle both flat and nested response structure
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
        <div className="w-full max-w-md p-8">
            <div className="mb-8 text-center md:text-left">
                <h2 className="text-3xl font-bold text-slate-800">Welcome Back</h2>
                <p className="text-slate-500 mt-2">Superjet Fleet Management System</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-2">Admin Email</label>
                    <input
                        {...register("email")}
                        type="email"
                        className={`w-full p-3 border rounded-lg focus:ring-2 outline-none transition ${errors.email ? "border-red-500 ring-red-200" : "focus:ring-blue-500"
                            }`}
                        placeholder="admin@superjet.com"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Password</label>
                    <input
                        {...register("password")}
                        type="password"
                        className={`w-full p-3 border rounded-lg focus:ring-2 outline-none transition ${errors.password ? "border-red-500 ring-red-200" : "focus:ring-blue-500"
                            }`}
                        placeholder="••••••••"
                    />
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
                            Signing In...
                        </span>
                    ) : (
                        "Sign In"
                    )}
                </button>
            </form>
        </div>
    );
};
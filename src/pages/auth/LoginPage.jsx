// src/pages/LoginPage.jsx
import { LoginForm } from "@/components/custom/auth/LoginForm";
import AuthIllustration from "@/components/custom/auth/AuthIllustration";
import { THEME } from "@/utils/theme";
import { useTranslation } from "react-i18next";

const LoginPage = () => {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen flex md:flex-row">
            <div className={`hidden md:flex md:w-1/2 ${THEME.colors.primary} items-center justify-center p-12`}>
                <div className="text-white text-center flex flex-col items-center">

                    <AuthIllustration />

                    <h1 className="text-5xl font-black mb-2 tracking-tighter uppercase">
                        Super<span className="text-[#FFCC00]">jet</span>
                    </h1>

                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-[2px] w-8 bg-yellow-400"></div>
                        <span className="text-xs uppercase tracking-[0.3em] font-bold text-yellow-400">{t('admin_panel')}</span>
                        <div className="h-[2px] w-8 bg-yellow-400"></div>
                    </div>

                    <p className="text-blue-100 max-w-sm text-lg font-light leading-relaxed opacity-80">
                        {t('login_description')}
                    </p>
                </div>
            </div>

            <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-6">
                <LoginForm />
            </div>
        </div>
    );
};

export default LoginPage;
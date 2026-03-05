// src/components/layout/Navbar.jsx
import { Bell, UserCircle, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { THEME } from "@/utils/theme";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

const Navbar = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    const toggleLanguage = () => {
        const newLang = i18n.language === "ar" ? "en" : "ar";
        i18n.changeLanguage(newLang);
    };
    const adminName = JSON.parse(localStorage.getItem("admin_info"))?.name || "Admin";

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return (
        <header className="h-16 bg-white border-b flex items-center justify-between px-4 md:px-8 shadow-sm shrink-0 sticky top-0 z-10 w-full">
            <div className="flex items-center gap-3">
                <SidebarTrigger className="-ml-2 md:-ml-4 text-slate-500 hover:text-slate-800 transition [&_svg]:w-6 [&_svg]:h-6" />
                <h2 className={`font-bold flex items-center gap-2 text-lg md:text-xl ${THEME.colors.accent}`}>
                    <UserCircle className="w-8 h-8 md:w-10 md:h-10 opacity-80" />
                    <span className="truncate max-w-[150px] sm:max-w-none">{adminName}</span>
                </h2>
            </div>

            <div className="flex items-center gap-3 md:gap-6">
                <button
                    onClick={toggleLanguage}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all font-bold text-sm"
                    title={i18n.language === "ar" ? "تغيير اللغة للعربية" : "Change language to English"}
                >
                    <Globe className="w-4 h-4 text-blue-500" />
                    <span>{i18n.language === "ar" ? "EN" : "AR"}</span>
                </button>

                <button title={t('notifications')} className={`text-slate-400 hover:${THEME.colors.accent} transition`}>
                    <Bell className="w-5 h-5 md:w-6 md:h-6" />
                </button>

                <div className="flex items-center gap-2 md:gap-3 border-l border-slate-200 font-bold">
                    <button onClick={handleLogout} title={t('logout')} className="text-red-400 hover:text-red-600 md:ml-2 p-1 md:p-2 transition">
                        <LogOut className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
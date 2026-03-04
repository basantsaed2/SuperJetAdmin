// src/components/layout/Navbar.jsx
import { Bell, UserCircle, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { THEME } from "@/utils/theme";

const Navbar = () => {
    const navigate = useNavigate();
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
                <button className={`text-slate-400 hover:${THEME.colors.accent} transition`}>
                    <Bell className="w-5 h-5 md:w-6 md:h-6" />
                </button>

                <div className="flex items-center gap-2 md:gap-3 border-l border-slate-200">
                    <button onClick={handleLogout} title="Logout" className="text-red-400 hover:text-red-600 md:ml-2 p-1 md:p-2 transition">
                        <LogOut className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
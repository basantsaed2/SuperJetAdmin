// src/components/layout/MainLayout.jsx
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "./AppSidebar"
import Navbar from "./Navbar"
import { Outlet } from "react-router-dom"
import { THEME } from "@/utils/theme"
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

export default function MainLayout() {
    const { i18n } = useTranslation();

    useEffect(() => {
        document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
        document.documentElement.lang = i18n.language;
    }, [i18n.language]);

    return (
        <SidebarProvider>
            <div className={`flex min-h-screen w-full bg-slate-50`}>
                <AppSidebar />
                <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                    <Navbar />
                    <div className="flex-1 overflow-auto p-4 md:p-6">
                        <Outlet />
                    </div>
                </main>
            </div>
        </SidebarProvider>
    )
}

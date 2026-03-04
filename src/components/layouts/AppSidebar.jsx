// src/components/layout/AppSidebar.jsx
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarHeader,
} from "@/components/ui/sidebar"
import { NAV_ITEMS } from "@/utils/navigation"
import { hasPermission } from "@/utils/permissions"
import { NavLink } from "react-router-dom"
import { THEME } from "@/utils/theme"
import { useTranslation } from "react-i18next";
import { t } from "i18next"

export function AppSidebar() {
    const { i18n } = useTranslation();
    const isRtl = i18n.language === "ar";
    const adminInfo = JSON.parse(localStorage.getItem("admin_info") || "{}");
    const permissions = adminInfo.permissions || [];

    return (
        <Sidebar 
            side={isRtl ? "right" : "left"}
            variant="sidebar" 
            collapsible="icon" 
            className={`border-r border-blue-900/50 ${THEME.colors.primary}`}
        >
            {/* Header: شعار سوبر جيت */}
            <SidebarHeader className={`p-0 h-16 border-b border-blue-900/50 ${THEME.colors.primary} flex justify-center`}>
                <div className="flex items-center gap-3 px-6 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center font-black text-xl text-white">
                    <div className={`${THEME.colors.secondary} ${THEME.colors.accent} p-1 rounded-md shrink-0 w-8 h-8 hidden group-data-[collapsible=icon]:flex items-center justify-center text-xs font-bold`}>
                        SJ
                    </div>
                    <span className="group-data-[collapsible=icon]:hidden tracking-tighter italic">
                        SUPER<span className="text-yellow-400">JET</span>
                    </span>
                </div>
            </SidebarHeader>

            <SidebarContent className={`${THEME.colors.primary} px-2 py-4 group-data-[collapsible=icon]:px-0`}>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-1.5">
                            {NAV_ITEMS.map((item) => (
                                hasPermission(permissions, item.permission) && (
                                    <SidebarMenuItem key={item.title}>
                                        <NavLink
                                            to={item.path}
                                            className={({ isActive }) => {
                                                const baseClasses = "flex items-center gap-3 px-2 md:px-4 py-3 rounded-lg transition-all duration-300 w-full group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center";
                                                const activeClasses = `${THEME.colors.secondary} ${THEME.colors.accent} font-bold shadow-lg shadow-yellow-400/20 scale-[1.02]`;
                                                const idleClasses = "text-white/60 hover:text-white hover:bg-white/10";

                                                return `${baseClasses} ${isActive ? activeClasses : idleClasses}`;
                                            }}
                                        >
                                            <span className="shrink-0">{item.icon}</span>
                                            <span className="group-data-[collapsible=icon]:hidden text-sm tracking-wide font-medium">
                                                {t(item.title.toLowerCase().replace(/\s+/g, '_'))}
                                            </span>
                                        </NavLink>
                                    </SidebarMenuItem>
                                )
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            {/* Footer: إصدار النظام */}
            <div className={`${THEME.colors.primary} p-4 border-t border-blue-900/50 group-data-[collapsible=icon]:hidden text-center`}>
                <p className="text-[10px] text-white/30 uppercase tracking-widest font-medium italic">
                    Fleet Management v1.0
                </p>
            </div>
        </Sidebar>
    )
}
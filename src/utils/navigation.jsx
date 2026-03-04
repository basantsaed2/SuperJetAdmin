import { LayoutDashboard, Bus, Settings, Users, ShieldCheck } from "lucide-react";

export const NAV_ITEMS = [
    {
        title: "Dashboard",
        path: "/dashboard",
        icon: <LayoutDashboard size={20} />,
        permission: null,
    },
    {
        title: "Bus Types",
        path: "/bus_types",
        icon: <Settings size={20} />,
        permission: null,
    },
    {
        title: "Buses Fleet",
        path: "/buses",
        icon: <Bus size={20} />,
        permission: null,
    },
    {
        title: "User Management",
        path: "/staff",
        icon: <Users size={20} />,
        permission: null,
    },
];
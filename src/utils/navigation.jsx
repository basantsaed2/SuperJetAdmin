import { LayoutDashboard, Bus, Settings, Users, ShieldCheck, Wrench ,MapPin, Navigation } from "lucide-react";

export const NAV_ITEMS = [
    {
        title: "dashboard",
        path: "/dashboard",
        icon: <LayoutDashboard size={20} />,
        permission: null,
    },
    {
        title: "bus_types",
        path: "/bus_types",
        icon: <Settings size={20} />,
        permission: null,
    },
    {
        title: "buses",
        path: "/buses",
        icon: <Bus size={20} />,
        permission: null,
    },
    {
        title: "maintenance_types",
        path: "/maintenance_types",
        icon: <Settings size={20} />,
        permission: null,
    },
    {
        title: "maintenances",
        path: "/maintenances",
        icon: <Wrench size={20} />,
        permission: null,
    },
    {
        title: "cities",
        path: "/cities",
        icon: <MapPin size={20} />,
        permission: null,
    },
    {
        title: "zones",
        path: "/zones",
        icon: <Navigation size={20} />,
        permission: null,
    },
];
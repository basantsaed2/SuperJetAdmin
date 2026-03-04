import { LayoutDashboard, Bus, Settings, Users, ShieldCheck, Wrench ,MapPin, Navigation, Warehouse, UserCircle } from "lucide-react";

export const NAV_ITEMS = [
    {
        title: "dashboard",
        path: "/dashboard",
        icon: <LayoutDashboard size={20} />,
        permission: null,
    },
    {
        title: "users",
        path: "/users",
        icon: <UserCircle size={20} />,
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
    {
        title: "garages",
        path: "/garages",
        icon: <Warehouse size={20} />,
        permission: null,
    },
    {
        title: "roles",
        path: "/roles",
        icon: <ShieldCheck size={20} />,
        permission: null,
    },
    {
        title: "admins",
        path: "/admins",
        icon: <Users size={20} />,
        permission: null,
    },
];
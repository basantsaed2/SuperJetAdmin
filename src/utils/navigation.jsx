import { LayoutDashboard, Bus, Settings, Users, ShieldCheck, Wrench, MapPin, Navigation, Warehouse, UserCircle, FileText } from "lucide-react";

export const NAV_ITEMS = [
    {
        title: "dashboard",
        path: "/dashboard",
        icon: <LayoutDashboard size={20} />,
        permission: null,
    },
    // User & Access Management
    {
        title: "admins",
        path: "/admins",
        icon: <Users size={20} />,
        permission: "admins",
    },
    {
        title: "users",
        path: "/users",
        icon: <UserCircle size={20} />,
        permission: "admins",
    },
    {
        title: "roles",
        path: "/roles",
        icon: <ShieldCheck size={20} />,
        permission: "roles",
    },
    // Fleet Management
    {
        title: "buses",
        path: "/buses",
        icon: <Bus size={20} />,
        permission: "buses",
    },
    {
        title: "bus_types",
        path: "/bus_types",
        icon: <Settings size={20} />,
        permission: "bus_types",
    },
    // Maintenance
    {
        title: "maintenances",
        path: "/maintenances",
        icon: <Wrench size={20} />,
        permission: "maintenances",
    },
    {
        title: "maintenance_types",
        path: "/maintenance_types",
        icon: <Settings size={20} />,
        permission: "maintenance_types",
    },
    // Infrastructure & Locations
    {
        title: "garages",
        path: "/garages",
        icon: <Warehouse size={20} />,
        permission: "pickup_points",
    },
    {
        title: "cities",
        path: "/cities",
        icon: <MapPin size={20} />,
        permission: "City",
    },
    {
        title: "zones",
        path: "/zones",
        icon: <Navigation size={20} />,
        permission: "Zone",
    },
    // Reports
    {
        title: "reports",
        path: "/reports/maintenance",
        icon: <FileText size={20} />,
        permission: "maintenances",
    },
];
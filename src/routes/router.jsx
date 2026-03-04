import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "@/App";
import LoginPage from "@/pages/auth/LoginPage";
import ProtectedRoute from "@/routes/ProtectedRoute";
import MainLayout from "@/components/layouts/MainLayout";
import BusTypesPage from "@/pages/BusTypes/BusTypesPage";
import BusTypeFormPage from "@/pages/BusTypes/BusTypeFormPage";
import BusesPage from "@/pages/Buses/BusesPage";
import BusesFormPage from "@/pages/Buses/BusesFormPage";
import MaintenanceTypesPage from "@/pages/MaintenanceTypes/MaintenanceTypesPage";
import MaintenanceTypesFormPage from "@/pages/MaintenanceTypes/MaintenanceTypesFormPage";
import MaintenancesPage from "@/pages/Maintenances/MaintenancesPage";
import MaintenancesFormPage from "@/pages/Maintenances/MaintenancesFormPage";
import CitiesPage from "@/pages/Cities/CitiesPage";
import CityFormPage from "@/pages/Cities/CityFormPage";
import ZonesPage from "@/pages/Zones/ZonesPage";
import ZoneFormPage from "@/pages/Zones/ZoneFormPage";

const Dashboard = () => <div className="p-8">Dashboard Home</div>;

export const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <App />,
            children: [
                // 1. Public Routes 
                {
                    path: "login",
                    element: <LoginPage />,
                },

                // 2. Protected Routes
                {
                    path: "",
                    element: <ProtectedRoute />,
                    children: [
                        {
                            element: <MainLayout />,
                            children: [
                                { index: true, element: <Navigate to="/dashboard" replace /> },
                                { path: "dashboard", element: <Dashboard /> },
                                                                { 
                                    path: "bus_types", 
                                    children: [
                                        { index: true, element: <BusTypesPage /> }, 
                                        { path: "add", element: <BusTypeFormPage /> }, 
                                        { path: "edit/:id", element: <BusTypeFormPage /> }, 
                                    ]
                                },
                                { 
                                    path: "buses", 
                                    children: [
                                        { index: true, element: <BusesPage /> }, 
                                        { path: "add", element: <BusesFormPage /> }, 
                                        { path: "edit/:id", element: <BusesFormPage /> }, 
                                    ]
                                },
                                { 
                                    path: "maintenance_types", 
                                    children: [
                                        { index: true, element: <MaintenanceTypesPage /> }, 
                                        { path: "add", element: <MaintenanceTypesFormPage /> }, 
                                        { path: "edit/:id", element: <MaintenanceTypesFormPage /> }, 
                                    ]
                                },
                                { 
                                    path: "maintenances", 
                                    children: [
                                        { index: true, element: <MaintenancesPage /> }, 
                                        { path: "add", element: <MaintenancesFormPage /> }, 
                                        { path: "edit/:id", element: <MaintenancesFormPage /> }, 
                                    ]
                                },
                                { 
                                    path: "cities", 
                                    children: [
                                        { index: true, element: <CitiesPage /> }, 
                                        { path: "add", element: <CityFormPage /> }, 
                                        { path: "edit/:id", element: <CityFormPage /> }, 
                                    ]
                                },
                                { 
                                    path: "zones", 
                                    children: [
                                        { index: true, element: <ZonesPage /> }, 
                                        { path: "add", element: <ZoneFormPage /> }, 
                                        { path: "edit/:id", element: <ZoneFormPage /> }, 
                                    ]
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ]
);
import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "@/App";
import LoginPage from "@/pages/auth/LoginPage";
import ProtectedRoute from "@/routes/ProtectedRoute";
import MainLayout from "@/components/layouts/MainLayout";
import BusTypesPage from "@/pages/BusTypes/BusTypesPage";

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
                            // هنا المشكلة كانت: الـ MainLayout لازم يكون هو الـ element للأب
                            element: <MainLayout />,
                            children: [
                                { index: true, element: <Navigate to="/dashboard" replace /> },
                                { path: "dashboard", element: <Dashboard /> },
                                { path: "bus_types", element: <BusTypesPage /> },
                                { path: "buses", element: <div className="p-8">Buses</div> },
                            ],
                        },
                    ],
                },
            ],
        },
    ]
);
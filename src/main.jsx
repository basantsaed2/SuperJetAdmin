// src/main.jsx
import { RouterProvider } from "react-router-dom";
import "./i18n";
import { router } from "./routes/router";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { QueryClient } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import './index.css'

const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
    <Toaster position="top-right" richColors />
  </QueryClientProvider>
);
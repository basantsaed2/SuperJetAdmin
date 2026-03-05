// src/main.jsx
import { RouterProvider } from "react-router-dom";
import "./i18n";
import { router } from "./routes/router";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { QueryClient } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // staleTime: 1000 * 60 * 5,       // Data stays fresh for 5 minutes
      // gcTime: 1000 * 60 * 10,         // Cache kept for 10 minutes
      refetchOnWindowFocus: false,    // Don't refetch when tab gets focus
      // refetchOnReconnect: true,       // Refetch on reconnect is fine
      retry: 1,                       // retry once on failure
    },
  },
});
ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
    <Toaster position="top-right" richColors />
  </QueryClientProvider>
);
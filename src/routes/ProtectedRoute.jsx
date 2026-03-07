import { Navigate, Outlet, useLocation } from "react-router-dom";
import { usePermissions } from "@/hooks/usePermissions";
import Unauthorized from "@/pages/Error/Unauthorized";

const ProtectedRoute = ({ moduleName }) => {
    const token = localStorage.getItem("admin_token");
    const { checkPermission } = usePermissions();
    const location = useLocation();

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (moduleName) {
        let requiredAction = "View";

        // Infer the required action from the URL path
        if (location.pathname.includes("/add")) {
            requiredAction = "Add";
        } else if (location.pathname.includes("/edit")) {
            requiredAction = "Edit";
        }

        const hasAccess = checkPermission(moduleName, requiredAction);
        if (!hasAccess) {
            return <Unauthorized />;
        }
    }

    return <Outlet />;
};

export default ProtectedRoute;
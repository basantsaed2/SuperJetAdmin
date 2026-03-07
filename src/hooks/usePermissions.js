import { useMemo } from 'react';
import { hasPermission, hasAction } from '@/utils/permissions';

export const usePermissions = () => {
    const adminInfo = useMemo(() => {
        try {
            return JSON.parse(localStorage.getItem("admin_info") || "{}");
        } catch {
            return {};
        }
    }, []);

    const userType = adminInfo.type;
    const userPermissions = adminInfo.permissions || [];

    const checkPermission = (module, action = "View") => {
        return hasPermission(userType, userPermissions, module, action);
    };

    const canView = (module) => checkPermission(module, "View");
    const canAdd = (module) => checkPermission(module, "Add");
    const canEdit = (module) => checkPermission(module, "Edit");
    const canDelete = (module) => checkPermission(module, "Delete");
    const canChangeStatus = (module) => checkPermission(module, "Status");

    return {
        userType,
        userPermissions,
        checkPermission,
        canView,
        canAdd,
        canEdit,
        canDelete,
        canChangeStatus
    };
};

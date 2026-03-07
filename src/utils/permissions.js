export const hasPermission = (userType, userPermissions, requiredModule, requiredAction = "View") => {
    if (userType === "superadmin") return true;
    if (!requiredModule) return true;

    if (!userPermissions || !Array.isArray(userPermissions)) return false;

    // Check if the module exists and has the required action
    return userPermissions.some(p =>
        p.module === requiredModule &&
        p.actions?.some(a => a.action === requiredAction)
    );
};

export const hasAction = (userType, userPermissions, moduleName, actionName) => {
    return hasPermission(userType, userPermissions, moduleName, actionName);
};
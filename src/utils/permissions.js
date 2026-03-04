export const hasPermission = (userPermissions, requiredPermission) => {
    if (!requiredPermission) return true;

    if (!userPermissions) return false;

    return userPermissions.includes(requiredPermission);
};
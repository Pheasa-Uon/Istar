export const environment = {
    production: false,
    apiBase: 'http://localhost:8080/api/coregateways',
    apiEndpoints: {
        authentication: '/authentication',
        permission: '/permissions',
        usersManagement: {
            users: '/Users',
            roles: '/roles',
            rolePermissions: '/RolePermissions',
            userRoles: '/userroles',
        },
        system: {
            converterName: '/converter-name',
            globalSystemParameter: '/System/global-System-parameter',
            currency: '/System/Currency',
            country: '/System/Country',
            systemParameter: '/system/system-parameter',
        }
    }
};

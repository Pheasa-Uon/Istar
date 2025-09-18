export const environment = {
    production: false,
    apiBase: 'http://localhost:8080/api/coregateways',
    apiEndpoints: {
        authentication: '/authentication',
        permission: '/permissions',
        usersManagement: {
            users: '/users',
            roles: '/roles',
            rolePermissions: '/rolepermissions',
            userRoles: '/userroles',
        },
        system: {
            converterName: '/converter-name',
            globalSystemParameter: '/system/global-system-parameter',
            currency: '/system/currency',
            country: '/system/country',
        }
    }
};

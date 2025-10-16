export const environment = {
    production: false,
    apiBase: 'http://localhost:8080/api/coregateways',
    apiEndpoints: {
        authentication: '/authentication',
        systemDate:'/system-date',
        permission: '/permissions',
        usersManagement: {
            users: '/users',
            roles: '/roles',
            rolePermissions: '/role-permissions',
            userRoles: '/user-roles',
            userBranch: '/user-branches',
        },
        system: {
            converterName: '/converter-name',
            globalSystemParameter: '/system/global-system-parameter',
            currency: '/system/currency',
            country: '/system/country',
            systemParameter: '/system/system-parameter',
            globalPolicy: '/system/global-policy',
        },
        systemAdmin: {
            branch: '/system-admin/branch',
            department: '/system-admin/department',
            exchangeRate: '/system-admin/exchange-rate',
            workingDay: '/system-admin/working-day',
            holiday: '/system-admin/holiday',
        }

    }
};

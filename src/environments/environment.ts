export const environment = {
    production: false,
    apiBase: 'http://localhost:8080/api/coregateways',
    apiEndpoints: {
        authentication: '/authentication',
        systemDate:'/system-date',
        permission: '/permissions',
        usersManagement: {
            users: '/user-management/users',
            roles: '/user-management/roles',
            rolePermissions: '/user-management/role-permissions',
            userRoles: '/user-management/user-roles',
            userBranch: '/user-management/user-branches',
            staff: '/user-management/staff'
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

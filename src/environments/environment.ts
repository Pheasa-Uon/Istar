export const environment = {
    production: false,
    apiBase: 'http://localhost:8080/api/coregateways',
    apiEndpoints: {
        auth: '/authentication',
        permission: '/permissions',
        users: {
            usersprofile: '/users',
            userstatuses: '/users/status',
        },
        roles: {
            rolesprofile: '/roles',
            rolesstatus: '/roles/status',
        },
        rolepermissions: '/rolepermissions',
        userroles: '/userroles',
        system: {
            convertername: '/converter-name',
            globalSystemParameter: '/system/global-system-parameter'
        }
    }
};

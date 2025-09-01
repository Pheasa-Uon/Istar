export const environment = {
    production: false,
    apiBase: 'http://localhost:8080/api/coregateways',
    apiEndpoints: {
        auth: '/authentication',
        users: {
            usersprofile: '/users',
            userstatuses: '/users/status',
        },
        roles: {
            rolesprofile: '/roles',
            rolesstatus: '/roles/status',
        },
        permissions: '/permissions',
        userroles: '/userroles',



    }
};

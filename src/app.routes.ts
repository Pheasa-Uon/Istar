import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Login } from './app/pages/auth/login';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { Users } from './app/pages/users/user';
import { AddUser } from './app/pages/users/adduser';
import { EditUser } from './app/pages/users/edituser';
import { RolePermissions } from './app/pages/rolepermission/role.permission';
import { AddRolePermission } from './app/pages/rolepermission/add.role.permission';
import { EditRolePermission } from './app/pages/rolepermission/edit.role.permission';
import { SetRolePermission } from './app/pages/rolepermission/set.role.permission';
import { AuthGuard} from './app/pages/auth/AuthGuard';

export const appRoutes: Routes = [

    // Redirect empty path to login
    { path: '', redirectTo: 'login', pathMatch: 'full' },


    // Login page (outside AppLayout so no main layout)
    { path: 'login', component: Login },

    // Landing page (public)
    { path: 'landing', component: Landing },

    // Routes with main app layout
    {
        path: '',
        component: AppLayout,
        children: [
            // Default route goes to dashboard
            { path: 'dashboard', component: Dashboard , canActivate: [AuthGuard] },

            { path: 'documentation', component: Documentation },

            // User routes
            { path: 'user', component: Users },
            { path: 'adduser', component: AddUser },
            { path: 'edituser', component: EditUser },

            // Role permissions routes
            { path: 'rolepermission', component: RolePermissions },
            { path: 'addrolepermission', component: AddRolePermission },
            { path: 'editrolepermission', component: EditRolePermission },
            { path: 'setrolepermission', component: SetRolePermission },

            // Lazy loaded modules - make sure these modules exist and export NgModule classes
            { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') }
        ]
    },

    // Auth module lazy loaded (optional, depends on your setup)
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },

    // Not found page
    { path: 'notfound', component: Notfound },

    // Catch-all route redirects to notfound
    { path: '**', redirectTo: '/notfound' }
];
